import sys
import json
import time
import boto3
import threading
from subprocess import Popen, PIPE

import csv
import glob
import os

sys.path.append('..') # needed for relative import of config, logger and shadow_v2
import system_logger
import config_manager

# Initialize logger
estimote_logger = system_logger.get_logger(__name__)



box_beacons_dict = {}
cloud_beacons_dict = {}
low_battery_beacons_dict = {}



    
def getLastCsvFileNameIndex():
   #C:/Users/Manuel Gomes/Desktop/Dissertação Code/WorkshopData/
   list_of_files = glob.glob('*.csv') # * means all if need specific format then *.csv
   file_index=-1
   #print( len(list_of_files))
   if len(list_of_files)!= 0:
      latest_file = max(list_of_files, key=os.path.getctime)
      splited=latest_file.split('/')
      file_index=splited[len(splited)-1].split('.')[0].split('_')[2]
      
   #print("Last file index",file_index)
   return file_index

def getNewFileName():
   last_index=getLastCsvFileNameIndex()
   new_file_name="Estimotes_P16_"+str(int(last_index)+1) +".csv"
   print(new_file_name)
   return new_file_name

def create_CSV(row,filename):
   header = ['idEstimote', 'Battery', 'Rssi']

   with open(filename, 'w', encoding='UTF8', newline='') as f:
      writer = csv.writer(f)
      # write the header
      writer.writerow(header)
      # write multiple rows
      writer.writerow(row)

def append_to_csv(row,filename):
   with open(filename,'a',newline='') as f:
      writer = csv.writer(f)
      writer.writerow(row)

def start_scanning():
    #estimote_logger.info('Starting Estimote Beacons scan.')
    #beacons_data = get_beacons_data()
    error_counter = 0
    config = config_manager.read_config()
    #box_name = config['shadow_reported_data']['sensor_box_name']
    max_error_count = 5#config['shadow_desired_data']['max_error_count']
    #sensor_box_name = config['shadow_reported_data']['sensor_box_name']
    msg = f"Estimote Reading Failure. Box sensor_box_name. "
    
    estimotes_data = {}
    estimotes = Popen(['sudo', 'node', 'original-estimote-telemetry.js'], stdout=PIPE)
    buffer = b''
    counter = 0
    csvName="vazio"
    beaconsDict={}
    stop=False
    while stop==False:
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
                zone= 1 #beacons_data[short_id][1]
                data = {'timestamp' : timestamp,
                        'battery' : battery, 'rssi' : rssi, 'temperature' : temperature, 'zone':zone}
                dataCsv=[short_id,rssi,battery]
                print("short_id",short_id)
                print('rssi',rssi)
                print('battery',battery)
                if short_id not in beaconsDict:
                    beaconsDict[short_id]=[rssi]
                else:
                    beaconsDict[short_id].append(rssi)
                print('beaconsDict',beaconsDict)
                
                
                for key in beaconsDict.keys():
                    if len(beaconsDict[key])==20:
                        print("Entries Number",counter)
                        stop=True;
                counter+=1
                if counter==1:
                    csvName=getNewFileName()
                    create_CSV(dataCsv,csvName)
                else:
                    append_to_csv(dataCsv,csvName)                    
                    
                buffer = b''
            else:
                buffer += out
            #time.sleep(2.0)        
        except Exception as error:
            print("Error")
            estimote_logger.error('Error on reading estimote beacons data: {}.'.format(error.args[0]))
            error_counter += 1
            if error_counter == max_error_count:
                msg = msg + error.args[0]
#                 shadow_v2.update_reported_error(error_code=config['error_codes']['estimote_error_code'], message=msg)
                estimote_logger.error('Updating reported error of estimote scanner script: {}.'.format(error.args[0]))
                
            #time.sleep(2.0)
            continue






if __name__ == "__main__":
    start_scanning()
    
