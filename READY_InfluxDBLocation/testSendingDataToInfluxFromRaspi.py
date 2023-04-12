import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime
import time

org = "InfluxDbIndustry"
token = "blC6hRcRVe9xdiQd5F3ZZzjf3HSYcJ6QMzUOcovHou176VGcpjKJko6cNRPz3crlcLYKxQW7ybGJq97fag7ZHw=="
# Store the URL of your InfluxDB instance
url="http://194.210.120.104:8086/"

client = influxdb_client.InfluxDBClient(
  url=url,
  token=token,
  org=org
)

write_api = client.write_api(write_options=SYNCHRONOUS)

timestamp = int(time.time()) # in epoch

timeWorld=datetime.datetime.utcfromtimestamp(timestamp).replace(tzinfo=datetime.timezone.utc)

beacons={"dbde4e323567f381": {"timestamp": timestamp, "battery": 59, "rssi": -30, "temperature": 25.375}, "8ce4d6e271cbcdec": {"timestamp": timestamp, "battery": 47, "rssi": -40, "temperature": 25.0625}}


print("t",str(timeWorld))
car_assigned = "Mercedes"#shadow_v2.get_car_assigned_to_sensor_box()
sensor_box_name= "SensorBox02"

print(beacons)
bucketName="SensorBoxesData" 
print("Beacons to Influx",beacons)
for bId,value in beacons.items():
    rssi=value["rssi"]
    battery=value["battery"]
    temp=value["temperature"]
    p = influxdb_client.Point("beaconMeasures").tag("boxName",sensor_box_name).tag("carAssigned",car_assigned).tag("beaconId",bId).field("rssi", float(rssi)).field("battery",float(battery)).time(timeWorld)
    write_api.write(bucket=bucketName, org=org, record=p)