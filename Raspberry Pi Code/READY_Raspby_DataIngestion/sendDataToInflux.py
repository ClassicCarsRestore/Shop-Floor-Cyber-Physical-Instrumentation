import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime
import system_logger

org = "InfluxDbIndustry"
token = "blC6hRcRVe9xdiQd5F3ZZzjf3HSYcJ6QMzUOcovHou176VGcpjKJko6cNRPz3crlcLYKxQW7ybGJq97fag7ZHw=="
# "
# Store the URL of your InfluxDB instance
url="http://194.210.120.104:8086/"

client = influxdb_client.InfluxDBClient(
  url=url,
  token=token,
  org=org
)

init_logger = system_logger.get_logger('sendDataToInflux')

#uery_api = client.query_api()

bucket_api = client.buckets_api()

write_api = client.write_api(write_options=SYNCHRONOUS)



def sendToInfluxSensorData(sensorBoxName,carAssigned,maxFreq,timeT):
    bucketName="SensorBoxesData"
    try:
        p = influxdb_client.Point("frequencyMeasures").tag("boxName",sensorBoxName).tag("carAssigned",carAssigned).field("MaxFreq",float(maxFreq)).time(timeT)
        write_api.write(bucket=bucketName, org=org, record=p)
        init_logger.info("Send to Influx-> "+"boxName: "+str(sensorBoxName)+ " carAssigned: "+str(carAssigned)+" Freq: "+str(maxFreq) )
    except Exception as err:
      error= 'InfluxDB Error on sendToInfluxSensorData: {}'.format(err)
      print(error)
      init_logger.warning('Exception in sendDataToInflux: ', error)
      


def sendToInfluxBeaconsData(sensorBoxName,car_assigned,beacons,timeT):
    bucketName="SensorBoxesData" 
    #print("Beacons to Influx",beacons)
    try:
        for bId,value in beacons.items():
          rssi=value["rssi"]
          battery=value["battery"]
          temp=value["temperature"]
          p = influxdb_client.Point("beaconMeasures").tag("boxName",sensorBoxName).tag("carAssigned",car_assigned).tag("beaconId",bId).field("rssi", float(rssi)).field("battery",float(battery)).time(timeT)
          write_api.write(bucket=bucketName, org=org, record=p)
        init_logger.info("Send to Influx-> Beacons data")
    except Exception as err:
      error= 'InfluxDB Error on sendToInfluxBeaconsData: {}'.format(err)
      print(error)
      init_logger.warning('Exception in sendDataToInflux: ', error)
    
