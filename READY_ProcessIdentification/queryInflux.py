import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
from calculateFeaturesTools import getFeatures2
import joblib

org = "InfluxDbIndustry"
token = "blC6hRcRVe9xdiQd5F3ZZzjf3HSYcJ6QMzUOcovHou176VGcpjKJko6cNRPz3crlcLYKxQW7ybGJq97fag7ZHw=="
# Store the URL of your InfluxDB instance
url="http://194.210.120.104:8086/"

#Mineral Blast CODE=1
#Paint CODE=2
#Lixagem CODE=3

def getActivityCode(activityName):
  if activityName=="Mineral Blast":
    return 1
  if activityName=="Painting":
    return 2
  if activityName=="Curing":
    return 3
  if activityName=="Sanding":
    return 4
  if activityName=="Bodywork Activity":
    return 5


def sendActivityToInflux(activity,initialTime,timestamp,carAssigned, boxName, location,zone):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    processCode=getActivityCode(activity)
    write_api = client.write_api(write_options=SYNCHRONOUS)
    bucketName="Predictions"
    p = influxdb_client.Point("Processes Identified Locations").tag("boxName",boxName).tag("carAssigned",carAssigned).\
    field("activity",activity).field("location",location).field("zone",zone).field("ProcessCode",processCode).time(timestamp).tag("ti",initialTime)
    write_api.write(bucket=bucketName, org=org, record=p)
    return True

  except Exception as err:
      error= 'InfluxDB Error on sendActivityToInflux: {}'.format(err)
      print(error)
      return False


#59 segundos para contar sempre com 58 medidas, pois o treino foi feito com 60 de cada vez
def checkSandingActivity(tInitial,t_final):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(tInitial)+", stop:"+ str(t_final)

    query = 'from(bucket: "Smart Plugs")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] != "shelly3EMPintEsq" and r["_measurement"] != "shelly3EMPintDireita" and r["_measurement"] != "shelly3EMJatoAreia")\
      |> filter(fn: (r) => r["_field"] == "power")'

    result = query_api.query(org=org, query=query)
    counter=0
    valuesByPlug={}

    for table in result:
      for record in table:
        if counter==0:
          valuesByPlug[record.get_measurement()]=[]
          counter+=1
        if counter!=0 and record.get_measurement() not in valuesByPlug.keys() :
          valuesByPlug[record.get_measurement()]=[]
        
        valuesByPlug[record.get_measurement()].append((record.get_value(), record.get_time()))

    featuresByPlug={}
    for item in valuesByPlug.items():
      plug=item[0]
      values=item[1]
      features=getFeatures2(values)
      featuresByPlug[plug]=features

    ml_algorithm = joblib.load('C:/Users/Manuel Gomes/Desktop/Dissertação Code/ProcessIdentification/model_tools_workshop.pkl')

    sanderActivity=False
    for item in featuresByPlug.items():
      plug=item[0]
      features=item[1]
      print("item",item)
      if features!=[]:
        features=features[0] #pois no caso de virem 2as features, a ultima tera só um valor. N devera acontecer porque pedimos so 58 segundos de dados.
        tool = ml_algorithm.predict([features[0]]) #features[0] pois no [1]e[2] temos o tempo inicial e final da features
        print("Tool Predicted",tool)
        if tool =="Sander":
          sanderActivity=True
    return sanderActivity

  except Exception as err:
      error= 'InfluxDB Error on checkSandingActivity: {}'.format(err)
      print(error)
      return False


#checkSandingActivity("2022-12-19T16:43:00.000Z",	"2022-12-19T16:44:00.000Z")




def checkBoxVibrations(boxName,tInitial,t_final):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(tInitial)+", stop:"+ str(t_final)

    #|> range('+queryTime+')\
    #queryTime= "start: 	2023-01-05T13:59:07.000Z, stop: 	2023-01-05T13:59:15.000Z"

    query = 'from(bucket: "SensorBoxesData")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] == "frequencyMeasures")\
      |> filter(fn: (r) => r["boxName"] =="'+ boxName+'")'

    result = query_api.query(org=org, query=query)

    counterVibrations=0
    vibrationActivity=False
    total=0

    for table in result:
      for record in table:
        total+=1
        if record.get_value()>0:
          counterVibrations+=1
    
    print("Number of high frequencies",counterVibrations)
    
    #Em 60 segundos chegam cerca de 8/9 frequencias. Preciso mais de metade para n apanhar
    #outliers e para apanhar pequenas paragens no trabalho da ferramenta.
    majority=(1/2)*total
    if counterVibrations > majority:
      vibrationActivity=True
      
    return vibrationActivity

  except Exception as err:
      error= 'InfluxDB Error on checkBoxVibrations: {}'.format(err)
      print(error)
      return False

#checkBoxVibrations("SensorBox_07", "2022-12-19T16:50:21.000Z",	"2022-12-19T16:50:51.000Z")



def checkMineralBlastActivity(ti_timestamp,tf_timestamp):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(ti_timestamp)+", stop:"+ str(tf_timestamp)

    #|> range('+queryTime+')\
    #queryTime= "start: 	2023-01-05T13:59:07.000Z, stop: 	2023-01-05T13:59:15.000Z"

    query = 'from(bucket: "Smart Plugs")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] == "shelly3EMJatoAreia")\
      |> filter(fn: (r) => r["_field"] == "power")'

    result = query_api.query(org=org, query=query)

    counterBlast=0
    total=0
    mineralBlastActivity=False
    for table in result:
      for record in table:
        total+=1
        if abs(record.get_value())>1000:
          counterBlast+=1
    
    #acima de 2/3 de vezes do treshold para evitar outliers (nunca vistos)
    majority=(2/3)*total
    if counterBlast > majority:
      mineralBlastActivity=True

    return mineralBlastActivity

  except Exception as err:
      error= 'InfluxDB Error on checkMineralBlastActivity: {}'.format(err)
      print(error)
      return False


# tInitial="2023-01-13T15:19:00.000Z"
# locTimestamp="2023-01-13T15:20:00.000Z"
# print(checkMineralBlastActivity(tInitial,locTimestamp))      


def checkPaitingActivity(ti_timestamp,tf_timestamp,booth_name):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(ti_timestamp)+", stop:"+ str(tf_timestamp)

    query = 'from(bucket: "Smart Plugs")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] == "'+booth_name+'")\
      |> filter(fn: (r) => r["_field"] == "power")'

    result = query_api.query(org=org, query=query)

    counterPaint=0
    counterCure=0
    total=0
    for table in result:
      for record in table:
        energyValue=abs(record.get_value())
        total+=1
        if energyValue>3000:
          counterPaint+=1
        elif energyValue>150 and energyValue < 600:
          counterCure+=1

    majority=(2/3)*total
    if counterPaint > majority:
      return "Painting"
    elif counterCure > majority:
      return "Curing"
    else:
      return ""

  except Exception as err:
      error= 'InfluxDB Error on checkPaitingActivity: {}'.format(err)
      print(error)
      return ""


# tInitial="2023-01-19T11:49:00.000Z"
# locTimestamp="2023-01-19T11:50:00.000Z"
# print(checkPaitingActivity(tInitial,locTimestamp,"shelly3EMPintDireita"))



#Obtem se sempre a ultima localizacao do intervalo passado a query do influx
#As previsoes de localizacao sao geradas de 7 em 7 segundos
def getLastMinuteLocations(ti_timestamp,tf_timestamp):
  try:
    client = influxdb_client.InfluxDBClient(
      url=url,
      token=token,
      org=org
    )
    query_api = client.query_api()

    queryTime= "start:"+str(ti_timestamp)+", stop:"+ str(tf_timestamp)

    #|> range(start: -60s)

    query = 'from(bucket: "Predictions")\
      |> range('+queryTime+')\
      |> filter(fn: (r) => r["_measurement"] == "Location Predictions")'

    result = query_api.query(org=org, query=query)

    locationDict={}
    counter=0 
    
    for table in result:
      for record in table:
        if counter==0:
          locationDict[record.values.get("boxName")]={}
          locationDict[record.values.get("boxName")]["Zones"]=[]
          locationDict[record.values.get("boxName")]["Locations"]=[]
          counter+=1
        if counter!=0 and record.values.get("boxName") not in locationDict.keys():
            locationDict[record.values.get("boxName")]={}
            locationDict[record.values.get("boxName")]["Zones"]=[]
            locationDict[record.values.get("boxName")]["Locations"]=[]

        locationDict[record.values.get("boxName")]["CarAssigned"]=record.values.get("carAssigned")
        locationDict[record.values.get("boxName")]["Timestamp"]=record.get_time()

        if record.get_field()=="Zone":
          locationDict[record.values.get("boxName")]["Zones"].append(record.get_value())
        
        if record.get_field()=="Location":
          locationDict[record.values.get("boxName")]["Locations"].append(record.get_value())

    return locationDict

  except Exception as err:
      error= 'InfluxDB Error on getLastLocationUpdate: {}'.format(err)
      print(error)
      return []


# tInitial="2022-12-19T17:04:17.000Z"
# locTimestamp="2022-12-19T17:05:17.000Z"

# getLastLocationUpdate(tInitial,locTimestamp)







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


#print(getLastDayInferencesBoxNames(tInitial,locTimestamp))

