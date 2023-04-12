from time import sleep
import datetime as dtime
from queryInfluxInferences import *
import time
from datetime import date, datetime
import json
import requests

#Obter atividades ja realizadas e registadas no Charter of Turin Monitor platform
#do carro CarName
def getActivitiesOfCarPedro(carName):
  url = "http://194.210.120.34:5000/api/Connector/"+carName

  payload={}
  headers = {
    'Authorization': '3265f86ff927ce11479779a0152e7b12'
  }
  response = requests.request("GET", url, headers=headers, data=payload, timeout=3)
  #print(response.status_code)
  return response.status_code, response.json()

#Verifica se o carro carName existe na plataforma Charter of Turin Monitor 
#Se existe, verifica se a atividade atual (sendo Mineral Blast ou Sanding)
# ja foi registada na plataforma
def verifyAddInPedro(activity,carName):
  status,listOfActivities=getActivitiesOfCarPedro(carName)
  result=True
  if status==200:
    if activity=="Mineral Blast":
      for actDone in listOfActivities:
        if "stripper" in actDone:
          result=False
    if activity=="Sanding": 
      for actDone in listOfActivities:
        if "sanding" in actDone:
          result=False
  return result


  
# print(verifyAddInPedro("Mineral Blast","Lancia_Flaminia_4"))

#gera o tempo no formato aceite pelo InfluxDB
# 2022-12-19T16:43:00.000Z
def generateTimeWithZFormat(timeStamp):
  timeWithT=timeStamp.isoformat("T")
  timeWithZ=timeWithT.split("+")[0]+"Z"
  return timeWithZ

#Cria nova entrada no ficheiro de output de inferencias
def createMsg(boxName,car,location,zone,activity,ti,tf):
  msg = {}
  msg['BoxName'] = boxName
  msg['Car'] = car
  msg['Location'] = location
  msg['Zone'] = zone
  msg['Activity'] = activity
  msg['StartTimestamp'] = ti
  msg['EndTimestamp'] = tf
  return msg

sequenceNumbersCars={}
processed_data = []

#sequencia dos processos:
#1 Mineral Blast -> 2 Paiting -> 3 Curing -> Outras coisas (Sanding - 4), 2 -> 3  
#bodywork = 5

#Processamento de todas as inferencias geradas no ultimo dia
def processDataForFile(boxInferencesDict,boxName):
  counterNotAddedPedro=0
  counterNotAdded=0
  
  for entry in boxInferencesDict.items():
    car=entry[1]["CarAssigned"]
    tInitial=entry[1]["ti"]
    tFinal=generateTimeWithZFormat(entry[1]["_time"])
    activity=entry[1]["Activity"]
    location= entry[1]["Location"]
    zone= entry[1]["Zone"]
    processCode= entry[1]["ProcessCode"]

    #verifica se a inferencia atual do carro car ja foi registada na plataforma
    # Charter of Turin Monitor
    canAddProcessbyPedro=verifyAddInPedro("Mineral Blast",car)
    
    canAddProcess=False
   
    #verifica ordem normal relativamente as inferencias do dia de hoje guardadas
    #no dicionario local - sequenceNumberCars - relativamente ao carro em causa 
    if car not in sequenceNumbersCars.keys():
      sequenceNumbersCars[car]=processCode
      canAddProcess=True
    else:
      if processCode == 5:
        canAddProcess=True
        sequenceNumbersCars[car]=processCode
      if sequenceNumbersCars[car]==3 and processCode==2:
        canAddProcess=False
      else:
        canAddProcess=True
        sequenceNumbersCars[car]=processCode

    #se estiver de acordo com a ordem correta passa para o ultiumo check
    #No ultimo check e verificado se a ultima entry do ficheiro e de outro carro
    #ou de outra atividade. Se alguma for diferente uma nova entry e criada.
    #Caso contrario apenas o End Timestamp da ultima entry e atualizado para
    #o end timestamp da inference atual.
    if canAddProcessbyPedro and canAddProcess: 
      msg=createMsg(boxName,car,location,zone,activity,tInitial,tFinal)

      if len(processed_data) == 0 or processed_data[-1]['Car'] !=car or processed_data[-1]['Activity'] != activity:
        processed_data.append(msg)
      else:
        processed_data[-1]['EndTimestamp'] = tFinal
    else:
      if canAddProcessbyPedro ==False:
        counterNotAddedPedro+=1
      if canAddProcess ==False:
        counterNotAdded+=1
    
  print("counterNotAdded",counterNotAdded)
  print("counterNotAddedPedro",counterNotAddedPedro)
      
  return processed_data













timestamp = int(time.time())
timeWorld=dtime.datetime.utcfromtimestamp(timestamp).replace(tzinfo=dtime.timezone.utc)

timeWorld=generateTimeWithZFormat(timeWorld)


tInitial="2023-02-09T09:00:00.000Z"
locTimestamp="2023-02-09T22:00:00.000Z"

lastInferencesBoxNames=getLastDayInferencesBoxNames(tInitial,timeWorld)

if not lastInferencesBoxNames:
  print("No boxes with inferences")
else:
   for box in lastInferencesBoxNames:
    print("BoxName", box)
    boxInferencesDict=getLastDayInferencesByBox(box,tInitial,locTimestamp)
    processDataForFile(boxInferencesDict,box)
    if processed_data:
      print(processed_data)
      today = date.today()
      now = datetime.now()
      current_time = now.strftime("%H_%M_%S")
      jsonString = json.dumps(processed_data)
      jsonName=box+"-OutputFile_"+str(today)+"_"+str(current_time)
      jsonFile = open(jsonName+".json", "w")
      jsonFile.write(jsonString)
      jsonFile.close()



print("Programa chegou ao fim........................")
  