# Sensor scripts
import ADXL345_highestFreq
# Estimote beacon script
from estimote import estimote_data_extraction as estimote

# Logging script
import system_logger

from webAppCommunication import *
from sendDataToInflux import *

# General purpose imports
import datetime as dtime
import time
import subprocess
from datetime import datetime
import requests
import copy
from time import sleep

# Variable to hold beacons with low battery
low_battery_beacons = {}


sensor_box_name= "SensorBox_07"

# Initialize logger
init_logger = system_logger.get_logger('init_v2')


def get_data_and_analyze(car_assigned): 
    # getting beacons in range of the sensor box
    beacons = estimote.get_latest_beacons()
    #beacons= {"359da2e3798189c9": {"timestamp": 1667824110, "battery": 50, "rssi": -58, "temperature": 19}}
    init_logger.info("Beacons detected size: "+str(len(beacons)))
    
    maxFreq = ADXL345_highestFreq.get_FFT_results(3200, 4)
    init_logger.info("MaxFreq to influx: " +str(maxFreq))
    
    timestamp = int(time.time()) # in epoch
    ttl_timestamp = timestamp + 2678400 # timestamp of a month from now
    
    #maxFreq==-1 means error on sensor
    timeWorld=dtime.datetime.utcfromtimestamp(timestamp).replace(tzinfo=dtime.timezone.utc)
    print("Timestamp to AWS",str(timeWorld))
    sendToInfluxSensorData(sensor_box_name,car_assigned,maxFreq,timeWorld)
    sendToInfluxBeaconsData(sensor_box_name,car_assigned,beacons,timeWorld)
    print("--------------------------")
    
    
    
def new_beacons_battery_alarms(low_battery_beacons):
    '''
    This function compares the new beacons with low battery with the local variable,
    returning the most recent set of low battery beacons, if the set is different.
    
    :param low_battery_beacons: The set of low battery beacons.
    :return: The new set of low battery beacons or empty set depending if new low battery beacons
    set is different.from the previous known.
    '''
    
    new_low_battery_beacons = estimote.get_low_battery_beacons()
    if set(low_battery_beacons.keys()) != set(new_low_battery_beacons.keys()):
        low_battery_beacons = copy.deepcopy(new_low_battery_beacons)
        return low_battery_beacons
    else:
        # still the same beacons with low battery or empty,
        # either way cloud should not be updated
        return {}
        
        
if __name__ == "__main__":
    '''
    Runs this script, accesses the shadow script and the sensors scripts.
    '''
    init_logger.info('Box script initiated.')
    # call thread wrapper for scanning function in estimote/estimote_data_extraction.py
    estimote.start_scanning_thread_wrapper()
    # allow the estimote script to consolidate the beacons signals received by the sensor box
    time.sleep(1)
    
    while True:
        try:
            carAssigned,actualState=getSensorBoxData(sensor_box_name)
            #carAssigned="Mercedes"
            #actualState=True
            if carAssigned:
                if actualState:
                    print("SensorBox "+ sensor_box_name+" is On.| Car Assigned: "+carAssigned+".")
                    init_logger.info("SensorBox "+ sensor_box_name+" is On.| Car Assigned: "+carAssigned+".")
                    topic_and_packet = get_data_and_analyze(carAssigned)
                    
                    newLowBatteryBeacons= new_beacons_battery_alarms(low_battery_beacons)
                    if newLowBatteryBeacons!={}:
                        low_battery_beacons = newLowBatteryBeacons
                        print("Low battery Beacons",newLowBatteryBeacons)
                        sendLowBatteryBeaconsAlarms(newLowBatteryBeacons)
                else:
                    init_logger.info("SensorBox "+ sensor_box_name+" is Off.")
                    print("SensorBox "+ sensor_box_name+" is Off.")
                    timestamp = int(time.time()) # in epoch
                    timeWorld=dtime.datetime.utcfromtimestamp(timestamp).replace(tzinfo=dtime.timezone.utc)
                    sendToInfluxSensorData(sensor_box_name,carAssigned,-2,timeWorld)
                    sleep(5)
        except Exception as e:
            init_logger.warning('Exception in init_v2: ', str(e.args[0]))
            msg = "Exception in main file: " + str(e.args[0])
            continue
    