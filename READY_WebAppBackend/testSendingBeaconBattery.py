import requests
import json

url = "http://127.0.0.1:9000/alarms/beaconsbattery"

beaconsDict={'917cd714e1103994': {'box': 'SensorBox_07', 'battery': 63}}


payload = json.dumps(beaconsDict)
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload, timeout=3)

print(response.text)