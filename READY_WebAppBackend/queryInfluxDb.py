import influxdb_client
import numpy as np


org = "InfluxDbIndustry"
token = "blC6hRcRVe9xdiQd5F3ZZzjf3HSYcJ6QMzUOcovHou176VGcpjKJko6cNRPz3crlcLYKxQW7ybGJq97fag7ZHw=="
# Store the URL of your InfluxDB instance
url="http://194.210.120.104:8086/"

client = influxdb_client.InfluxDBClient(
  url=url,
  token=token,
  org=org
)


def getInfluxLastActtivityOfDayLocation():
  try:
    query_api = client.query_api()

    #queryTime= "start: 2022-12-13T10:00:37.000Z , stop: 2022-12-20:00:37.000Z"

    query = 'from(bucket: "Predictions")\
    |> range(start: -12h)\
    |> filter(fn: (r) => r._measurement == "Processes Identified Electric")\
    |> last()'

    tables = query_api.query(query=query,org=org)

    activitiesDict={}
    counter=0
    for table in tables:
        for record in table.records:
          print(record)
          if counter==0:
            activitiesDict[record.values.get("boxName")]={}
            counter=1
          if record.get_field()=="location":
            activitiesDict[record.values.get("boxName")]["Location"]=record.get_value()
          if record.get_field()=="activity":
            activitiesDict[record.values.get("boxName")]["Activity"]=record.get_value()

          activitiesDict[record.values.get("boxName")]["Date"]=record.values.get("_time").strftime("%d/%m/%Y") 
          activitiesDict[record.values.get("boxName")]["Time"]=record.values.get("_time").strftime("%H:%M:%S") 
          activitiesDict[record.values.get("boxName")]["CarAssigned"]=record.values.get("carAssigned")

    return activitiesDict
  except Exception as err:
        error= 'InfluxDB Error: {}'.format(err)
        print(error)
        return []




def getInfluxBeaconData():
  try:
    query_api = client.query_api()
    queryTime= "start: 2022-12-13T10:00:37.000Z , stop: 2022-12-20:00:37.000Z"

    query = ' from(bucket: "SensorBoxesData")\
    |> range(start: -10d)\
    |> filter(fn: (r) => r._measurement == "beaconMeasures")\
    |> filter(fn: (r) => r._field == "battery")\
    |> aggregateWindow(every: 20d, fn: last, createEmpty: false)\
    |> yield(name: "last")'

    tables = query_api.query(query=query,org=org)

    beaconsDict={}

    for table in tables:
        for record in table.records:
            beaconsDict[record.values.get("beaconId")]={}
            beaconsDict[record.values.get("beaconId")]=record.get_value()
    print(beaconsDict)
    return beaconsDict
  except Exception as err:
        error= 'InfluxDB Error: {}'.format(err)
        print(error)
        return []
  
getInfluxBeaconData()

def checkSensorBoxData(idBox):
  try:
    query_api = client.query_api()

    query = ' from(bucket: "SensorBoxesData")\
    |> range(start: -30s)\
    |> filter(fn: (r) => r._measurement == "frequencyMeasures")\
    |> filter(fn: (r) => r["boxName"] == "'+idBox +'")'

    tables = query_api.query(query=query,org=org)

    counter=0
    counterVibrationsError=0
    for table in tables:
        for record in table.records:
            if record.get_value() == -1:
              counterVibrationsError+=1
            counter+=1
    
    return counter,counterVibrationsError
  except Exception as err:
        error= 'InfluxDB Error: {}'.format(err)
        print(error)
        return 0,0


  







