from time import sleep
import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from getLocationPrediction import predictLocation



org = "InfluxDbIndustry"
token = "blC6hRcRVe9xdiQd5F3ZZzjf3HSYcJ6QMzUOcovHou176VGcpjKJko6cNRPz3crlcLYKxQW7ybGJq97fag7ZHw=="
# Store the URL of your InfluxDB instance
url="http://194.210.120.104:8086/"

#while(True):

client = influxdb_client.InfluxDBClient(
  url=url,
  token=token,
  org=org
)

query_api = client.query_api()



queryTime= "start: 2022-12-05T13:00:06.000Z , stop:  2022-12-05T13:00:22.000Z"
#|> range('+queryTime+')\

while True:
  query = 'from(bucket: "SensorBoxesData")\
    |> range(start:-30s)\
    |> filter(fn: (r) => r["_measurement"] == "beaconMeasures")\
    |> filter(fn: (r) => r["_field"] == "rssi")'

  result = query_api.query(org=org, query=query)
  print(result)
  beaconsDict={}

  counter=0
  newBeacon=0
  recordTime=None
  car_assigned= None
  sensor_box=None

  for table in result:
    for record in table:
        recordTime= record.get_time()            
        timeWithZ=record.get_time().isoformat("T")
        timeWithZ=timeWithZ.split("+")[0]+"Z"
        
        beaconsDict[record.values.get("beaconId")]={}
        car_assigned = record.values.get("carAssigned")
        sensor_box = record.values.get("boxName")
        beaconsDict[record.values.get("beaconId")]=record.get_value()
        
  print('beaconsDict',beaconsDict)
  print('car_assigned',car_assigned)
  print('sensor_box',sensor_box)

  if beaconsDict == {}:
    print("No Beacons detected")
  else:
    location,zone= predictLocation(beaconsDict)
    write_api = client.write_api(write_options=SYNCHRONOUS)
    bucketName="Predictions" 
    #p = influxdb_client.Point("Location Predictions").tag("boxName",sensor_box).tag("carAssigned",car_assigned).time(recordTime).field("Zone", zone).field("Location", location)
    #write_api.write(bucket=bucketName, org=org, record=p)
    #print("Writed data line in Bucket",bucketName)
  print("------------------------------------------------------")  
  sleep(7)





