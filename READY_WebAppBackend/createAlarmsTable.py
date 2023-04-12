import sqlite3
from sqlite3 import Error
from datetime import date, datetime
from datetime import timedelta

con = sqlite3.connect("rb_database.db")
cur = con.cursor()

#Toooooooooools- --------------------------------------------------
#cur.execute("DROP TABLE alarms")
#cur.execute("CREATE TABLE IF NOT EXISTS alarms(shortID PRIMARY KEY, alarmDescription, deviceId, deviceType, date, time, fixTip)")

today = date.today()
print("Today's date:", today)
now = datetime.now()
current_time = now.strftime("%H:%M:%S")
print("Current Time =", current_time)

# data=[
#     (1,"Low Battery Level: 33%", "b4c8c0b52049e4de", "beacon", today,current_time, "Change beacon battery"),
#     (2,"Low Battery Level: 33%", "b4c8c0b52049e4de", "beacon", today,current_time, "Change beacon battery"),
# ]
# yesterday =  date.today() - timedelta(days=1)
# print("Yesterday =", yesterday)
data=[
    (119,'Beacon "0d5c5b6ed855dbbc" has low Battery Level: 41%', "0d5c5b6ed855dbbc", "Beacon", today,current_time,  "Change its battery. Check Beacons Map tab in the web application to see its location."),
]

# data=[
#     (92,"Energy Meter:plug3 not connected.", "plug3", "Energy Meter", today,current_time, "Check if Energy Meter is plugged or connected to Wifi."),
# ]


# data=[
#     (91,"Sensor Box: SensorBox_03 not detected.", "SensorBox_03", "Sensor Box", today,current_time, "Check Sensor Box state and connection to the Wifi."),
# ]

cur.executemany("INSERT INTO alarms VALUES(?, ?, ?, ?, ?, ?, ?)", data)
#cur.execute("DELETE FROM alarms WHERE shortID = 94")
con.commit()
#res1=cur.execute("SELECT MAX(shortID) FROM alarms")
#print(res1.fetchone()[0]+1)
res = cur.execute("SELECT * FROM alarms")
all=res.fetchall()
print(len(all))
print(all)



