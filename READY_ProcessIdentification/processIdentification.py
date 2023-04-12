from time import sleep
import datetime
from queryInflux import *
import time


#Gerar tempo com o formato aceite no influxDb
#2022-12-19T16:43:00.000Z
def generateTimeWithZFormat(timeStamp):
  timeWithT=timeStamp.isoformat("T")
  timeWithZ=timeWithT.split("+")[0]+"Z"
  return timeWithZ

#get the zone of a box in the last minute that was obtained more than 2/3 of the total
#para termos mais confianca, e para garantirmos que a caixa esta imovel
def getConfidenceZone(boxZones):
  zonesCounterDict={}
  total=0
  for zone in boxZones:
    if zone not in zonesCounterDict.keys():
      zonesCounterDict[zone]=1
    else:
      zonesCounterDict[zone]+=1
    total+=1
  
  for zoneInfo in zonesCounterDict.items(): 
    zone=zoneInfo[0]
    number=zoneInfo[1]
    if number >= (2/3)*total:
      return zone
  
  return "Warning: No confidence zone obtained!"


#obter a localizacao que aparece mais vezes
#Como o fingerpriting n e tao exato como a proximidade, podem surgir variacoes
# mesmo com a caixa imovel. Por isso nao usamos os 2/3.
def getMajorityLocation(boxLocations):
  locsCounterDict={}
  for location in boxLocations:
    if location not in locsCounterDict.keys():
      locsCounterDict[location]=1
    else:
      locsCounterDict[location]+=1
  maxNumber=0
  maxLoc=""

  for locInfo in locsCounterDict.items():
    loc=locInfo[0]
    number=locInfo[1]
    if number>=maxNumber:
      maxNumber=number
      maxLoc=loc
  return maxLoc,maxNumber




def processIdentification(lastLocs,tInitial,tActual):
  if lastLocs!=[]:
    print("Warning: No location information detected at this moment.")
  else:
    boxName=lastLocs[0]
    print("_______________"+boxName+"___________________")
    carAssigned=lastLocs[1]["CarAssigned"]
    zones=lastLocs[1]["Zones"]
    locations=lastLocs[1]["Locations"]

    zone=getConfidenceZone(zones)

    if zone =="Mineral Blast Booth":
      print("Box: "+ boxName +" in zone: "+ zone)
      location=zone
      print("......Starting check Mineral Blast Activity.........")
      minBlastActivity=checkMineralBlastActivity(tInitial,tActual)

      if minBlastActivity:
        print("-> Success 1/2: Mineral Blast Activity Detected")
        success=sendActivityToInflux("Mineral Blast",tInitial,tActual,carAssigned,boxName,location,zone)
        if success:
          print("-> Success 2/2: Mineral Blast Activity Detected and Saved on Influx.")
      else:
        print("No Activity Detected!")

    
    elif zone=="Sanding Zone":
      print("Box: "+ boxName +" in zone: "+ zone)
      location=zone

      print("......Starting check Box Vibrations.........")
      vibrationsActivity=checkBoxVibrations(boxName,tInitial,tActual)
      if vibrationsActivity:
        print("-> Success 1/3: Vibrations Detected")
        print("......Starting check Sanding Machines Activity.........")
        sandingActivity=checkSandingActivity(tInitial,tActual)
        if sandingActivity:
          print("-> Success 2/3: Sanding Activity Detected")
          success=sendActivityToInflux("Sanding",tInitial,tActual,carAssigned,boxName,location,zone)
          if success:
            print("-> Success 3/3: Sanding Activity Detected and Saved on Influx.")
      else:
        print("No Vibration Activity Detected!")


    elif zone=="Painting Booth 1":
      print("Box: "+ boxName +" in zone: "+ zone)
      location=zone

      print("......Starting check Activity on Left/(1) Paint Booth.........")
      paintActivity=checkPaitingActivity(tInitial,tActual,"shelly3EMPintEsq")
      if paintActivity:
        print("-> Success 1/2: "+paintActivity+" Activity Detected")
        success=sendActivityToInflux(paintActivity,tInitial,tActual,carAssigned,boxName,location,zone)
        if success:
          print("-> Success 2/2: "+ paintActivity + "Activity on Left/(1) Paint Booth Detected and Saved on Influx.")

    elif zone=="Painting Booth 2":
      print("Box: "+ boxName +" in zone: "+ zone)
      location=zone

      print("......Starting check Activity on Right/(2) Paint Booth.........")
      paintActivity=checkPaitingActivity(tInitial,tActual,"shelly3EMPintDireita")
      if paintActivity:
        print("-> Success 1/2: "+paintActivity+" Activity Detected")
        success=sendActivityToInflux(paintActivity,tInitial,tActual,carAssigned,boxName,location,zone)
        if success:
          print("-> Success 2/2: "+ paintActivity + "Activity on Left/(1) Paint Booth Detected and Saved on Influx.")
    
    elif zone=="Bodywork Zone 1" or zone=="Bodywork Zone 2":
      print("Box: "+ boxName +" in zone: "+ zone)
      location,numberOfTimes=getMajorityLocation(locations)
      print("Location Majotity | Number of Times:",location,numberOfTimes)
      success=sendActivityToInflux("Bodywork Activity",tInitial,tActual,carAssigned,boxName,location,zone)
      if success:
        print("-> Success 1/1: Bodywork Activity Detected and Saved on Influx.")

    


#-------------------------- Beggining of the Program ----------------------------
while True:

  #Obtem se sempre as ultimas localizacaos do intervalo passado a query do influx,
  # que sera de 1 minuto.
  #As previsoes de localizacao sao geradas de 7 em 7 segundos
  #58 segundos para tras por causa do ILM no sanding. Para que apenas uma ferramenta seja identificada.
  #Com mais de 58 segundos, duas ferramentas sao identificadas, sendo que a segunda vai usar apenas 2 segundos de dados
  timestamp = int(time.time())
  timeWorld=datetime.datetime.utcfromtimestamp(timestamp).replace(tzinfo=datetime.timezone.utc)

  tInitial= timeWorld - datetime.timedelta(seconds=58)
  tInitial=generateTimeWithZFormat(tInitial)
  timeWorld=generateTimeWithZFormat(timeWorld)
  print("Ti",str(tInitial))
  print("Tf",str(timeWorld))

  lastLocations=getLastMinuteLocations(tInitial,timeWorld)
  

  if not lastLocations:
    print("No locations detected")
  else:
    for boxLocations in lastLocations.items():
      print(boxLocations)
      processIdentification(boxLocations,tInitial,timeWorld)
  print("Programa chegou ao fim........................")
  
  sleep(10)















