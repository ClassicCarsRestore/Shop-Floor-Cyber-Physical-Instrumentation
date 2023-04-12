import requests
# Logging script
import system_logger
import json

init_logger = system_logger.get_logger('webAppCommunication')

def getSensorBoxData(boxId):
    try:
        url =  "http://194.210.120.104:8080/sensorboxes/data?boxId="+boxId
        response = requests.request("GET", url, timeout=3)
        response=response.json()
        if len(response)==0:
            print("No sensorBox with this name.")
            return None,None
        else:
            response= response[0]
            car= response["car"]
            state= response["isActive"]
            return car,state
    except requests.exceptions.RequestException as error:  # This is the correct syntax
        error= 'Could not get sensorBoxData: {}'.format(error)
        init_logger.warning(error)
        print(error)
        return None,None
    
def sendLowBatteryBeaconsAlarms(newLowBatteryBeacons):
    try:
        url =  "http://194.210.120.104:8080/alarms/beaconsbattery"
        payload = json.dumps(newLowBatteryBeacons)
        headers = {
          'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload, timeout=3)
        if "sended" in response.text:
            init_logger.info('Sending beacon alarm message. Content: {}'.format(newLowBatteryBeacons))
        else:
            error= 'Could not send low battery beacon alarm: {}'.format(response.status_code)
            init_logger.warning(error)
    except requests.exceptions.HTTPError as error:  # This is the correct syntax
        error= 'Could not send low battery beacon alarm: {}'.format(error)
        init_logger.warning(error)
        print(error)
    
    