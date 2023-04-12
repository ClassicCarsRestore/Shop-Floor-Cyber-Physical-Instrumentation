import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()



#cur.execute("CREATE TABLE IF NOT EXISTS sensorBoxes(BoxName PRIMARY KEY, Status, CarAssigned, Coordinator)")


#cur.execute("INSERT INTO sensorBoxes VALUES(?, ?, ?, ?)",  ("SensorBox_test",1,"Citroen","Antonio Reis"))
cur.execute("INSERT INTO sensorBoxes VALUES(?, ?, ?, ?)",  ("SensorBox_03",1,"Audi A1",""))

#cur.execute('DELETE FROM sensorBoxes WHERE BoxName = "SensorBox_test2"')
con.commit()
#con.commit()

res = cur.execute("SELECT * FROM sensorBoxes")
print(res.fetchall())