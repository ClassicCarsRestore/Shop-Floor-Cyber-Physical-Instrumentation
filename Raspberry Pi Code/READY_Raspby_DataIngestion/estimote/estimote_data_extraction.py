import sys
import json
import time
import threading
from subprocess import Popen, PIPE
import requests

sys.path.append('..') # needed for relative import of config, logger and shadow_v2
import system_logger

# Initialize logger
estimote_logger = system_logger.get_logger(__name__)

box_beacons_dict = {}
cloud_beacons_dict = {}
low_battery_beacons_dict = {}

class locked_beacons_data:
    def __init__(self):
        self.lock = threading.Lock()
        self.cloud_beacons_dict = cloud_beacons_dict
        self.box_beacons_dict = box_beacons_dict
        self.low_battery_beacons_dict = low_battery_beacons_dict

locked_data_beacons = locked_beacons_data()


def get_beacons_data():
    try:
        url =  "http://194.210.120.104:8080/beacons/tobox"
        response = requests.request("GET", url, timeout=3)
        response=response.json()
        
        beaconsDict=response
        with locked_data_beacons.lock:
            for beacon in beaconsDict:
                locked_data_beacons.cloud_beacons_dict[beacon['shortID']] = int(beacon['batteryLevel'])
                    
        return locked_data_beacons.cloud_beacons_dict
    
    except requests.exceptions.RequestException as error:  # This is the correct syntax
        error= 'Could not get beacons data: {}'.format(error)
        estimote_logger.warning(error)
        print(error)
        return ""
    


'''
def update_dynamo_thread_wrapper(short_id, battery_level):
    t = threading.Thread(target=update_beacons_table, args=[short_id, battery_level])
    t.start()
'''

def start_scanning_thread_wrapper():
    beacons_data = get_beacons_data()
    t = threading.Thread(target=start_scanning)
    t.start()

def start_scanning():
    #estimote_logger.info('Starting Estimote Beacons scan.')
    error_counter = 0
    max_error_count = 2
    sensor_box_name= "SensorBox_07"
    msg = f"Estimote Reading Failure. Box {sensor_box_name}. "
    
    estimotes_data = {}
    estimotes = Popen(['sudo', 'node', 'estimote/original-estimote-telemetry.js'], stdout=PIPE)
    buffer = b''
    i = 0
    while True:
        try: 
            # read data from estimotes, char by char
            out = estimotes.stdout.read(1)
            
            if out == b'\n':
                # load buffer 
                estimotes_data = json.loads(buffer)
                
                # get data
                short_id = estimotes_data['shortIdentifier']
                battery = estimotes_data['batteryLevel']
                rssi = estimotes_data['RSSI']
                temperature = estimotes_data['temperature']
                timestamp = int(time.time()) # in epoch
                data = {'timestamp' : timestamp, 'battery' : battery, 'rssi' : rssi, 'temperature' : temperature}
                #print("rssi)
                # save data
                with locked_data_beacons.lock:
                    if short_id in locked_data_beacons.cloud_beacons_dict:
                        # beacon data for location
                        locked_data_beacons.box_beacons_dict[short_id] = data
                    if data['battery']< 30:
                        value = {'box': sensor_box_name, 'battery': data['battery']}
                        #estimote_logger.info('Found bluetooth beacon with low battery. Beacon short id: {}.'.format(short_id))
                        locked_data_beacons.low_battery_beacons_dict[short_id] = value
                    else:
                        # beacon had low battery but the battery was switched so remove from array
                        if short_id in locked_data_beacons.low_battery_beacons_dict.keys():
                            locked_data_beacons.low_battery_beacons_dict.pop(short_id)
                # reset buffer
                buffer = b''
            else:
                buffer += out
                
        except Exception as error:
            estimote_logger.error('Error on reading estimote beacons data: {}.'.format(error.args[0]))
            error_counter += 1
            if error_counter == max_error_count:
                msg = msg + error.args[0]
                estimote_logger.error('Updating reported error of estimote scanner script: {}.'.format(error.args[0]))
                #return [None]
            time.sleep(2.0)
            continue

def get_latest_beacons():
    locked_data_beacons.cloud_beacons_dict={}
    get_beacons_data()
    latest_beacons = {}
    cuttoff_timestamp = int(time.time()) - 20 # previous - 300 # timestamp of 5 minutes ago
    
    with locked_data_beacons.lock:
        for k,v in locked_data_beacons.box_beacons_dict.items():
            if v['timestamp'] > cuttoff_timestamp:
                latest_beacons[k] = v
    
    return latest_beacons

def get_low_battery_beacons():
    with locked_data_beacons.lock:
        return locked_data_beacons.low_battery_beacons_dict


if __name__ == "__main__":
    start_scanning()
