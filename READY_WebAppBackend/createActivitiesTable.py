import sqlite3
from sqlite3 import Error
from datetime import date, datetime
from datetime import timedelta

con = sqlite3.connect("rb_database.db")
cur = con.cursor()


#cur.execute("DROP TABLE activities")
#cur.execute("CREATE TABLE IF NOT EXISTS activities(BoxName PRIMARY KEY, Location, Activity, CarAssigned , Date, Time)")

today = date.today()
print("Today's date:", today)
now = datetime.now()
current_time = now.strftime("%H:%M:%S")
print("Current Time =", current_time)
yesterday =  date.today() - timedelta(days=1)
print("Yesterday =", yesterday)

data=[
    # ("SensorBox_test2", "M25", "Pintura", today, current_time),
    # ("SensorBox_07", "M26", "Pintura", today, current_time)
    # ("1", "Painting Booth 1", "Pintura", today, current_time),
    # ("2", "Painting Booth 2", "Pintura", today, current_time),
    # ("3", "Sanding Zone", "Pintura", today, current_time),
    # ("4", "Mineral Blast Booth", "Pintura", today, current_time),
    # ("5", "M5", "Pintura", today, current_time),
    # ("7", "M6", "Pintura", today, current_time),
    # ("8", "M7", "Pintura", today, current_time),
    # ("9", "M8", "Pintura", today, current_time),
    # ("10", "M10", "Pintura", today, current_time),
    # ("11", "M11", "Pintura", today, current_time),
    # ("12", "M12", "Pintura", today, current_time),
    # ("13", "M19", "Pintura", today, current_time),
    # ("14", "M17", "Pintura", today, current_time),
    # ("15", "M22", "Pintura", today, current_time),
    # ("16", "M27", "Pintura", today, current_time),
    # ("17", "M24", "Pintura", today, current_time),
    # ("18", "M29", "Pintura", today, current_time),
    # ("19", "M15", "Pintura", today, current_time),
    # ("20", "M20", "Pintura", today, current_time),
    # ("21", "M25", "Pintura", today, current_time),
    # ("22", "M30", "Pintura", today, current_time),
    # ("23", "M16", "Pintura", today, current_time),
    # ("24", "M26", "Pintura", today, current_time),
    # ("25", "M31", "Pintura", today, current_time),
    # ("26", "M32", "Pintura", today, current_time)
]

data=[
    ('SensorBox_07', 'P7', 'Bodywork Activity', 'Ferrari Dino', '07/03/2023', '16:15:49')
    #("SensorBox02", "Painting Booth 2", "Curing", "Jaguar E-Type", today, current_time),
]

cur.executemany("INSERT INTO activities VALUES(?, ?, ?, ?, ?,?)", data)

#cur.execute("DELETE FROM activities WHERE BoxName = 'SensorBox_07'")
con.commit()

res = cur.execute("SELECT * FROM activities")
print(res.fetchall())



