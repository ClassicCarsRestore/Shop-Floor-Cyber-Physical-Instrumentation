from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
import requests
from datetime import date, datetime

from queryInfluxDb import getInfluxBeaconData,getInfluxLastActtivityOfDayLocation, checkSensorBoxData

app = Flask(__name__)

CORS(app)

#Colocar o COMPLETE PATH para o ficheiro da BASE DE DADOS
databasePath='rb_database.db'#'/tmp/WebAppBackend/rb_database.db'

@app.route("/")
def hello():
    return "<h1>Welcome to our Web App database API!</h1>"


fixedToken='test123'



def getLastAlarmId():
    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        res = cur.execute("SELECT * FROM alarms")
        ids=res.fetchall()

        if ids!=[]:
            if len(ids)==3:
                cur.execute("DELETE FROM alarms WHERE shortID = (SELECT MIN(shortID) FROM alarms)")
                db.commit()
            res1=cur.execute("SELECT MAX(shortID) FROM alarms")
            nextId= res1.fetchone()[0]+1
        else:
            nextId=0
        return nextId
    except sqlite3.Error as err:
        error= 'Could not get alarms table: {}'.format(err)
        print(error)
        



@app.route('/alarms/shellys', methods=['POST'])
def shellyAllarm():
    try:
        idPlug_newState = request.args.get('plugId')
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        print("idPlug_newState",idPlug_newState)
        idPlug=idPlug_newState.split('_')[0]
        newState=int(idPlug_newState.split('_')[1])


        res = cur.execute("SELECT isActive FROM plugs WHERE shortID = (?)",(idPlug,))
        plugState=res.fetchall()[0][0]
        print("plugState",plugState)
        print("newState",newState)
        if newState!=plugState:
            if newState==0:
                cur.execute("UPDATE plugs SET isActive = (?) WHERE shortID = (?)",(0,idPlug))
                today = date.today()
                now = datetime.now()
                current_time = now.strftime("%H:%M:%S")
                data=[
                    (getLastAlarmId(),"Energy Meter:"+ idPlug+" not connected.", idPlug, "Energy Meter", today,current_time, "Check if Energy Meter is plugged or connected to Wifi."),
                ]
                cur.executemany("INSERT OR REPLACE INTO alarms VALUES(?, ?, ?, ?, ?, ?, ?)", data)
            else:
                cur.execute("UPDATE plugs SET isActive = (?) WHERE shortID = (?)",(1,idPlug))        
            db.commit()
            return jsonify("Alarm sended.")
        else:
            return jsonify("State not changed.")
    except sqlite3.Error as err:
        error= 'Could not add shellys alarm: {}'.format(err)
        print(error)
        return error

@app.route('/alarms/vibration', methods=['POST'])
def boxVibrationSensorAlarm():

    try:
        idBox = request.args.get('boxId')

        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        today = date.today()
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        data=[
            (getLastAlarmId(),"Vibration Sensor of box: "+ idBox+" not detected.", idBox, "Sensor Box", today,current_time, "Check vibration sensor connection to the Sensor Box."),
        ]

        cur.executemany("INSERT OR REPLACE INTO alarms VALUES(?, ?, ?, ?, ?, ?, ?)", data)
        db.commit()

        return jsonify("Alarm sended.")
    except sqlite3.Error as err:
        error= 'Could not add vibration alarm: {}'.format(err)
        print(error)
        return error

@app.route('/alarms/boxconnection', methods=['POST'])
def boxConnectionAlarm():

    try:
        idBox = request.args.get('boxId')

        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        today = date.today()
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        data=[
            (getLastAlarmId(),"Sensor Box: "+ idBox+" not detected.", idBox, "Sensor Box", today,current_time, "Check Sensor Box state and connection to the Wifi."),
        ]

        cur.executemany("INSERT OR REPLACE INTO alarms VALUES(?, ?, ?, ?, ?, ?, ?)", data)
        db.commit()

        return jsonify("Alarm sended.")
    except sqlite3.Error as err:
        error= 'Could not add box connection alarm: {}'.format(err)
        print(error)
        return error



@app.route('/alarms/beaconsbattery', methods=['POST'])
def beaconsbatteryAllarm():
    data = request.data
    beaconsDict = json.loads(data)
    print(beaconsDict)
    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        today = date.today()
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        for idBeacon in beaconsDict:
            print("idBeacon",idBeacon)
            battery=beaconsDict[idBeacon]['battery']
            print("battery",battery)
            data=[
                (getLastAlarmId(),"Beacon: "+ str(idBeacon)+" has low battery level: "+ str(battery), idBeacon, "Beacon", today,current_time, "Change its battery. Check Beacons Map tab in the web application to see its location."),
            ]
            cur.executemany("INSERT OR REPLACE INTO alarms VALUES(?, ?, ?, ?, ?, ?, ?)", data)
            db.commit()
        return jsonify("Alarm sended.")
    except sqlite3.Error as err:
            error= 'Could not add beacons low battery alarm: {}'.format(err)
            print(error)
            return error




#Token --------------------------------------------------------
@app.route('/login/newpassword', methods=['PUT'])
def changePassword():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)
        email=json_object["email"]
        newPassword=json_object["password"]  
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            cur.execute("REPLACE INTO users VALUES(?,?)",(email,newPassword))
            db.commit()
            db.close()
            return "Password updated."
        except sqlite3.Error as err:
            error= 'Could not change password: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/login', methods=['POST'])
def postlogin():
    data = request.data
    json_object = json.loads(data)
    email=json_object["email"]
    password=json_object["pass"]
    print(email)

    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        res = cur.execute("SELECT password FROM users WHERE email = (?)",(email,))
        toolsList=res.fetchone()
        db.commit()
        db.close()
        userPass=toolsList[0]
        if userPass==password:
            return jsonify({"token": 'test123'})
        else:
            print("Password incorrect")
    except sqlite3.Error as err:
        error= 'Could not get user information: {}'.format(err)
        print(error)
        return error
    
    

#Activities --------------------------------------------------------


def updateActivities():
    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        activitiesDict=getInfluxLastActtivityOfDayLocation()
        
        for idBox in activitiesDict.keys(): 
            activity=activitiesDict[idBox]
            cur.execute("INSERT OR REPLACE INTO activities VALUES(?, ?, ?, ?, ?,?)",(idBox,activity["Location"],activity["Activity"],activity["CarAssigned"],activity["Date"],activity["Time"]))
        db.commit()
        db.close()
    except sqlite3.Error as err:
        error= 'Could not change activities from table: {}'.format(err)
        print(error)
        return error


@app.route('/activities', methods=['GET'])
def getActivities():
    if fixedToken==request.headers['Authorization']:
        try:
            updateActivities()
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM activities")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple={}
                newTuple["BoxName"]=tuple[0]
                newTuple["Location"]=tuple[1]
                newTuple["Activity"]=tuple[2]
                newTuple["CarAssigned"]=tuple[3]
                newTuple["Date"]=tuple[4]
                newTuple["Time"]=tuple[5]
                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get activities table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")



#Plugs ---------------------------------------------------

@app.route('/plugs', methods=['GET'])
def getAllPlugs():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM plugs")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple={}
                newTuple["shortID"]=tuple[0]
                if tuple[1]==0:
                    newTuple["isActive"]=False
                else:
                    newTuple["isActive"]=True
                newTuple["isActive"]=tuple[1]
                newTuple["position"]=tuple[2]

                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get plugs table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/plugs/replacement', methods=['PUT'])
def updatePlugPosition():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        idPlug=json_object["plugId"]
        newPosition=json_object["newPosition"]

        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
        
            cur.execute("UPDATE plugs SET position = (?) WHERE shortID = (?)",(newPosition,idPlug))
            db.commit()
            return "Plug " + idPlug + " replaced successfully."
        except sqlite3.Error as err:
            error= 'Could not change plug position from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/plugs/state', methods=['PUT'])
def updatePlugState():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        idPlug=json_object["plugId"]

        desiredState=json_object['desiredState']
        print("desiredState",desiredState)
        resultState=0
        if desiredState==True:
            resultState=1
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            if resultState==1:
                cur.execute("UPDATE plugs SET  isActive = (?) WHERE shortID = (?)",(resultState,idPlug))
            else:
                cur.execute("UPDATE plugs SET  isActive = (?), position = (?) WHERE shortID = (?)",(resultState,0,idPlug))
            db.commit()
            return "Plug " + idPlug + " state updated successfully."
        except sqlite3.Error as err:
            error= 'Could not change beacon state from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/plugs/positions', methods=['GET'])
def getAvailablePlugsPositions():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT position FROM plugs WHERE isActive = 1")
            toolsList=res.fetchall()
            
            activePoints=[]
            result=[]
            for a in toolsList:
                if a[0]!=0:
                    activePoints.append(a[0])
            for a in range(1,7):
                if a not in activePoints:
                    result.append(a)

            return jsonify(result)
        except sqlite3.Error as err:
            error= 'There are no plugs inactive: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")


#Alarms ---------------------------------------------------
@app.route('/alarms', methods=['GET'])
def getAllAlarms():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM alarms")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple={}
                newTuple["Message"]=tuple[1]
                newTuple["DeviceId"]=tuple[2]
                newTuple["DeviceType"]=tuple[3]
                newTuple["Date"]=tuple[4]
                newTuple["Time"]=tuple[5]
                newTuple["FixTip"]=tuple[6]

                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get alarms table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/alarms/device', methods=['GET'])
def getDeviceAlarms():
    if fixedToken==request.headers['Authorization']:
        try:
            idBeacon = request.args.get('deviceId')

            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM alarms WHERE deviceId = (?)",(idBeacon,))
            toolsList=res.fetchall()
            result=[]
            print("idBeacon",idBeacon)
            for tuple in toolsList:
                newTuple={}
                newTuple["Message"]=tuple[1]
                newTuple["DeviceId"]=tuple[2]
                newTuple["DeviceType"]=tuple[3]
                newTuple["Date"]=tuple[4]
                newTuple["Time"]=tuple[5]
                newTuple["FixTip"]=tuple[6]

                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get device alarm table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

#Beacons ---------------------------------------------------

@app.route('/beacons/tobox', methods=['GET'])
def getAllBeaconsToBox():
    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        res = cur.execute("SELECT * FROM beacons")
        toolsList=res.fetchall()
        result=[]
        for tuple in toolsList:
            newTuple={}
            newTuple["shortID"]=tuple[0]
            if tuple[1]!=0:
                newTuple["batteryLevel"]=tuple[3]
                result.append(newTuple)
        print("Result",result)
        return jsonify(result)
    except sqlite3.Error as err:
        error= 'Could not get beacons table: {}'.format(err)
        print(error)
        return error






def updateBeaconsBattery():
    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        batteryDict=getInfluxBeaconData()
        print("batteryDict",batteryDict)
        for idBeacon in batteryDict.keys(): 
            cur.execute("UPDATE beacons SET batteryLevel = (?) WHERE shortID = (?)",(batteryDict[idBeacon],idBeacon))
        db.commit()
        db.close()
    except sqlite3.Error as err:
        error= 'Could not change beacons battery from table: {}'.format(err)
        print(error)
        return error

@app.route('/beacons', methods=['GET'])
def getAllBeacons():
    if fixedToken==request.headers['Authorization']:
        try:
            updateBeaconsBattery()
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM beacons")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple={}
                newTuple["shortID"]=tuple[0]
                if tuple[1]==0:
                    newTuple["isActive"]=False
                else:
                    newTuple["isActive"]=True
                newTuple["zone"]=tuple[2]
                newTuple["batteryLevel"]=tuple[3]
                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get beacons table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/beacons/positions', methods=['GET'])
def getAvailableBeaconsPositions():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT zone FROM beacons WHERE isActive = 1")
            toolsList=res.fetchall()
            
            activePoints=[]
            result=[]
            for a in toolsList:
                if a[0]!=0:
                    activePoints.append(a[0])
            for a in range(1,17):
                if a not in activePoints:
                    result.append(a)

            return jsonify(result)
        except sqlite3.Error as err:
            error= 'There are no beacons inactive: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")


@app.route('/beacons/state', methods=['PUT'])
def updateBeaconState():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        idBeacon=json_object["beaconId"]

        desiredState=json_object['desiredState']
        print("desiredState",desiredState)
        resultState=0
        if desiredState==True:
            resultState=1
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            if resultState==1:
                cur.execute("UPDATE beacons SET  isActive = (?) WHERE shortID = (?)",(resultState,idBeacon))
            else:
                cur.execute("UPDATE beacons SET  isActive = (?), zone = (?) WHERE shortID = (?)",(resultState,0,idBeacon))
            db.commit()
            return "Beacon " + idBeacon + " state updated successfully."
        except sqlite3.Error as err:
            error= 'Could not change beacon state from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")



@app.route('/beacons/battery/change', methods=['PUT'])
def changeBeaconBatteryTest():
    data = request.data
    json_object = json.loads(data)

    idBeacon=json_object["beaconId"]

    desiredBattery=int(json_object['desiredBattery'])
    print("desiredState",desiredBattery)
    try:
        db = sqlite3.connect(databasePath)
        cur = db.cursor()
        cur.execute("UPDATE beacons SET  batteryLevel = (?) WHERE shortID = (?)",(desiredBattery,idBeacon))
        db.commit()
        return "Beacon " + idBeacon + " battery level changed."
    except sqlite3.Error as err:
        error= 'Could not change beacon battery level from table: {}'.format(err)
        print(error)
        return error

@app.route('/beacons/replacement', methods=['PUT'])
def updateBeaconPosition():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        idBeacon=json_object["beaconId"]
        newPosition=json_object["newPosition"]

        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
        
            cur.execute("UPDATE beacons SET isActive = (?), zone = (?) WHERE shortID = (?)",(1,newPosition,idBeacon))
            db.commit()
            return "Beacon " + idBeacon + " replaced successfully."
        except sqlite3.Error as err:
            error= 'Could not change beacon position from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")



# SensorBoxes -------------------------------------------------------------------

@app.route('/sensorboxes', methods=['GET'])
def getRegisteredSensorBoxes():
    if fixedToken==request.headers['Authorization']:
        try:
            print(request.headers['Authorization'])
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM sensorBoxes")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple={}
                newTuple["thingName"]=tuple[0]
                if tuple[1]==0:
                    newTuple["IsOn"]=False
                else:
                    newTuple["IsOn"]=True
                newTuple["CarAssigned"]=tuple[2]
                newTuple["Coordinator"]=tuple[3]
                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get sensor boxes table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")


@app.route('/sensorboxes/reachable', methods=['GET'])
def getSensorBoxisRechable():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT BoxName FROM sensorBoxes")
            boxIdsList=res.fetchall()
            result=[]
            for idBox in boxIdsList:
                idBox=idBox[0]
                isReachable,isVibrationError=checkSensorBoxData(idBox)
                newTuple={}
                newTuple["thingName"]=idBox
                if isReachable==0:
                    newTuple["isReachable"]=False
                else:
                    newTuple["isReachable"]=True

                if isVibrationError==0:
                    newTuple["vibError"]=False
                else:
                    newTuple["vibError"]=True
                
                result.append(newTuple)
                print("Result",result)
            return jsonify(result)
        except sqlite3.Error as err:
            error= 'Could not get sensor boxes table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")


@app.route('/sensorboxes/car', methods=['GET'])
def getSensorBoxCar():
    if fixedToken==request.headers['Authorization']:
        try:
            idBox = request.args.get('boxId')
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT CarAssigned FROM sensorBoxes WHERE BoxName=(?)", (idBox,))
            toolsList=res.fetchall()
            if len(toolsList)==0:
                print("There is no sensorBox with than name." )
                return jsonify([])
            else:
                print("Result",toolsList[0])
                return jsonify(toolsList[0])
        except sqlite3.Error as err:
            error= 'Could not get sensor boxes table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/sensorboxes/data', methods=['GET'])
def getSensorBoxData():
        try:
            idBox = request.args.get('boxId')
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT Status, CarAssigned FROM sensorBoxes WHERE BoxName=(?)", (idBox,))
            boxData=res.fetchall()
            if len(boxData)==0:
                print("There is no sensorBox with than name." )
                return jsonify([]) 
            else:
                boxData=boxData[0]
                result=[]
                newTuple={}
                if boxData[0]==0:
                    newTuple["isActive"]=False
                else:
                    newTuple["isActive"]=True
                newTuple["car"]=boxData[1]
                result.append(newTuple)
                print("Result",result)
                return jsonify(result)

        except sqlite3.Error as err:
            error= 'Could not get sensor box data: {}'.format(err)
            print(error)
            return error


@app.route('/sensorboxes', methods=['DELETE'])
def deleteSensorBox():
    idBox = request.args.get('thingname')
    if fixedToken==request.headers['Authorization']:  
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            cur.execute("DELETE FROM sensorBoxes where BoxName= (?)", (idBox,))
            db.commit()
            return "Sensor Box " + str(idBox) + " deleted successfully."
        except sqlite3.Error as err:
            error= 'Could not delete sensor box from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/sensorboxes/', methods=['PUT'])
def updateSensorBox():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        idBox=json_object["sensorBoxId"]
        car=json_object["newCarAssigned"]
        coordinator=json_object["newCoordinator"]
        #sleepTime=json_object["newSleepTime"]
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            cur.execute("UPDATE sensorBoxes SET CarAssigned = (?), Coordinator = (?) WHERE BoxName = (?)",(car,coordinator,idBox))
            db.commit()
            return "Box " + idBox + " updated successfully."
        except sqlite3.Error as err:
            error= 'Could not update box from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/sensorboxes/state', methods=['PUT'])
def updateSensorBoxState():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        idBox=json_object["sensorBoxId"]

        desiredState=json_object['desiredState']
        print("desiredState",desiredState)
        resultState=0
        if desiredState==True:
            resultState=1
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            cur.execute("UPDATE sensorBoxes SET  Status = (?) WHERE BoxName = (?)",(resultState,idBox))
            db.commit()
            return "Box " + idBox + " state updated successfully."
        except sqlite3.Error as err:
            error= 'Could not change box state from table: {}'.format(err)
            print(error)
            return error
    else:
        print("Wrong Token")




# Cars -------------------------------------------------------------------

@app.route('/cars', methods=['GET'])
def getCars():
    if fixedToken==request.headers['Authorization']:
        try:
            url = "http://194.210.120.34:5000/api/Connector/"

            payload={}
            headers = {
            'Authorization': '3265f86ff927ce11479779a0152e7b12',
            }

            response = requests.request("GET", url, headers=headers, data=payload, timeout=3)
            
            cars=[]
            for carDict in response.json():
                car=carDict["make"]
                model=carDict["model"]
                plate= carDict["licencePlate"]
                carName=car+ " "+ model +": "+plate 
                cars.append(carName)

            print("Result",cars)
            return jsonify(cars)

        except requests.exceptions.RequestException as error:  # This is the correct syntax
            error= 'Could not get cars: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/cars/database', methods=['GET'])
def getCarsDatabase():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM cars")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple=tuple[0]
                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as error:
            error= 'Could not get cars table: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/cars', methods=['POST'])
def addNewCar():
    if fixedToken==request.headers['Authorization']:
        data = request.data
        json_object = json.loads(data)

        newCarName=json_object["newCarAssigned"]
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            
            cur.execute("INSERT OR REPLACE INTO cars VALUES(?)", (newCarName,))
            db.commit()
            db.close()
            return "Car " + newCarName + " added successfully."
        except sqlite3.Error as error:
            error= 'Could not add car to table: {}'.format(error)
            print(error)
            return error
            
    else:
        print("Wrong Token")

# Workers --------------------Reg-----------------------------------------------

@app.route('/workers', methods=['GET'])
def getWorkers():
    if fixedToken==request.headers['Authorization']:
        try:
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT * FROM workers")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                newTuple={}
                newTuple["WorkerName"]=tuple[0]
                result.append(newTuple)
            print("Result",result)
            return jsonify(result)
        except sqlite3.Error as error:
            error= 'Could not get workers table: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")

# Inference Files -------------------------------------------------------------------

@app.route('/inferences', methods=['GET'])
def getInferenceFilesNames():
    if fixedToken==request.headers['Authorization']:
        try:

            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT filename FROM inferences")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                result.append(tuple[0])
            print("Result",result)
            cur.close()
            return jsonify(result)
        except sqlite3.Error as error:
            error= 'Could not get inferences table names: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/inferences/blob', methods=['GET'])
def getInferenceFiles():
    if fixedToken==request.headers['Authorization']:
        try:
            filename = request.args.get('filename')
            print("filename",filename)
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT file_blob FROM inferences WHERE filename= (?) ", (filename,))
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                result.append(tuple[0])
            return result[0]
        except sqlite3.Error as error:
            error= 'Could not get file blob from table: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")


@app.route('/inferences', methods=['POST'])
def postInferenceFile():
    if fixedToken==request.headers['Authorization']:
        try:
            file_data = request.data
            filename = request.args.get('fileName')
            boxId = request.args.get('boxId')
            
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            sql_insert_file_query = '''INSERT INTO inferences(filename, file_blob, BoxName)
            VALUES(?, ?, ?)'''
            cur.execute(sql_insert_file_query, (filename, file_data, boxId))
            db.commit()
            print("[INFO] : The blob for", filename, "added in the database.")

            return "The blob for "+ filename + " added in the database. With first characters: " + str(file_data[:20])

        except sqlite3.Error as error:
            error= 'Could not post file in inferences table: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")


# Log Files -------------------------------------------------------------------

@app.route('/logs', methods=['GET'])
def getLogsFilesNames():
    if fixedToken==request.headers['Authorization']:
        try:
            

            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT filename FROM logs")
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                result.append(tuple[0])
            print("Result",result)
            cur.close()
            return jsonify(result)
        except sqlite3.Error as error:
            error= 'Could not get logs table names: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")

@app.route('/logs/blob', methods=['GET'])
def getLogFiles():
    if fixedToken==request.headers['Authorization']:
        try:
            filename = request.args.get('filename')
            print("filename",filename)
            db = sqlite3.connect(databasePath)
            cur = db.cursor()
            res = cur.execute("SELECT file_blob FROM logs WHERE filename= (?) ", (filename,))
            toolsList=res.fetchall()
            result=[]
            for tuple in toolsList:
                result.append(tuple[0])

            print("Result",result)
            return result[0]
        except sqlite3.Error as error:
            error= 'Could not get file blob from table: {}'.format(error)
            print(error)
            return error
    else:
        print("Wrong Token")










#Definir no porto com port forwarding
if __name__ == '__main__': # If you don't provide any port then the port will be set to 12345
    print ('API started')
    app.run(host='0.0.0.0', port=8080, debug=True, threaded=False)