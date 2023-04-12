import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import joblib

org = "InfluxDbIndustry"
token = "blC6hRcRVe9xdiQd5F3ZZzjf3HSYcJ6QMzUOcovHou176VGcpjKJko6cNRPz3crlcLYKxQW7ybGJq97fag7ZHw=="
# Store the URL of your InfluxDB instance
url="http://194.210.120.104:8086/"

def getLastDayInferencesByBox(boxName,ti_timestamp,tf_timestamp):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(ti_timestamp)+", stop:"+ str(tf_timestamp)

   

    query = 'from(bucket: "Predictions")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] == "Processes Identified test")\
      |> filter(fn: (r) => r["carAssigned"] == "carro test")\
      |> filter(fn: (r) => r["boxName"] == "'+boxName+'")'

    result = query_api.query(org=org, query=query)

    boxProcessesDict={}

    counter=0 
    procId=0
    for table in result:
      for record in table:
        #print(record)

        if counter!=0 and record.values.get("ti") != boxProcessesDict[procId]["ti"]:
          counter=0
          procId+=1

        
        if counter==0:
          boxProcessesDict[procId]={}
          boxProcessesDict[procId]["CarAssigned"]=record.values.get("carAssigned")
          boxProcessesDict[procId]["ti"]=record.values.get("ti")
          boxProcessesDict[procId]["_time"]=record.values.get("_time")
        
        if counter<4:
          if record.get_field()=="zone":
            boxProcessesDict[procId]["Zone"]=record.get_value()
          if record.get_field()=="location":
            boxProcessesDict[procId]["Location"]=record.get_value()
          if record.get_field()=="activity":
            boxProcessesDict[procId]["Activity"]=record.get_value()
          if record.get_field()=="ProcessCode":
            boxProcessesDict[procId]["ProcessCode"]=record.get_value()
          counter+=1
        else:
          counter=0
          procId+=1

    return boxProcessesDict  


  except Exception as err:
    error= 'InfluxDB Error on getLastDayInferencesByBox: {}'.format(err)
    print(error)
    return []

  

#tInitial="2023-02-09T08:00:00.000Z"
#locTimestamp="2023-02-09T23:00:00.000Z"
#print(getLastDayInferencesByBox("SensorBox_07",tInitial,locTimestamp))


def getLastDayInferencesBoxNames(ti_timestamp,tf_timestamp):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(ti_timestamp)+", stop:"+ str(tf_timestamp)

   

    query = 'from(bucket: "Predictions")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] == "Processes Identified test")\
      |> filter(fn: (r) => r["carAssigned"] == "carro test")'

    result = query_api.query(org=org, query=query)

    boxNames=[]

    for table in result:
      for record in table:
        #print(record)
        if record.values.get("boxName") not in boxNames:
          boxNames.append(record.values.get("boxName"))
    
    return boxNames

  except Exception as err:
      error= 'InfluxDB Error on getLastDayInferencesBoxNames: {}'.format(err)
      print(error)
      return []
  