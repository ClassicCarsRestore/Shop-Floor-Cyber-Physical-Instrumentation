import joblib


def checkBeaconNone(idB,dictionary):
    #value=dictionary[idB]
    if idB in dictionary:
        return dictionary[idB]
    else :
        return 100   # <<--------------- Caso escolha outro valor para quando o Beacon NAO e detetado - mudar aqui


#--------------------------------------------Perceber qual é a zona para escolher beacons de input
def getZone(beacons_dict):
  zone=0
  closestBeacon=max(beacons_dict.items(), key=lambda x: x[1]) 
  print("closestBeacon",closestBeacon)
  if closestBeacon[0] in zone1:
    zone ="Bodywork Zone 1"
  elif closestBeacon[0] in zone2:
    zone= "Bodywork Zone 2"
  elif closestBeacon[0] in cabinePintura1:
    zone= "Painting Booth 1"
  elif closestBeacon[0] in cabinePintura2:
    zone= "Painting Booth 2"
  elif closestBeacon[0] in zoneMineralBlast:
    zone= "Mineral Blast Booth"
  elif closestBeacon[0] in zoneSanding:
    zone= "Sanding Zone"
  else:
    zone=None
    print("ClosestBeacon in no known Zone.")
  return zone


#------------------------------------------------
zone1=[	 'e2d0d77756858a3c','58a45c9d5037a520','359da2e3798189c9','b4c8c0b52049e4de','a58db253434c6759','9fcccaab3f956f66',
'4b528a07c6810670','fc337481622c4dc8','9a97a9cd9ac398de','7eb3bed60a67f44d']
zone2=["4af6994df3a900b9"] #divisoes
cabinePintura1=['0d5c5b6ed855dbbc']
cabinePintura2=['dbde4e323567f381']
zoneSanding=["917cd714e1103994","de81d543721249f6"]
zoneMineralBlast=['8ce4d6e271cbcdec']



def predictLocation(beaconsDict):
  
  zone=getZone(beaconsDict)
  location=None
  print("Zone",zone)
  if zone == "Bodywork Zone 1":
    model= joblib.load("model_location_full_zone1.pkl")
    print ('ML Model loaded')
    inputZ1=[checkBeaconNone("e2d0d77756858a3c",beaconsDict),checkBeaconNone("58a45c9d5037a520",beaconsDict),checkBeaconNone("359da2e3798189c9",beaconsDict),
    checkBeaconNone("b4c8c0b52049e4de",beaconsDict),checkBeaconNone("a58db253434c6759",beaconsDict),checkBeaconNone("9fcccaab3f956f66",beaconsDict),
    checkBeaconNone("4b528a07c6810670",beaconsDict),checkBeaconNone("fc337481622c4dc8",beaconsDict),checkBeaconNone("9a97a9cd9ac398de",beaconsDict),
    checkBeaconNone("7eb3bed60a67f44d",beaconsDict)]
    location=model.predict([inputZ1])

  if zone == "Bodywork Zone 2": #2 equivale a divisoes
    print ('Bodywork Zone 2')
    location=['P32']
  
  if zone == "Painting Booth 1": #pintura
    print ('Painting Zone 1')
    location=['Painting Booth 1']
  
  if zone == "Painting Booth 2": #pintura
    print ('Painting Zone 2')
    location=['Painting Booth 2']
  
  if zone == "Mineral Blast Booth": #Jato Areia
    location=['Mineral Blast Booth']
  
  if zone == "Sanding Zone": #Sanding
    print ('Sanding Zone')
    location=['Sanding Zone']

  if location == None:
    location="Location Error"
    zone="Location Error"
    print("Location predicted ->",location)
  else:
    print("Location predicted ->",location[0])
    location = location[0]
    
    #sleep(1)
  return location,zone





