import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()

#Toooooooooools- --------------------------------------------------

#cur.execute("CREATE TABLE IF NOT EXISTS beacons(shortID PRIMARY KEY, isActive, zone, batteryLevel)")



# data=[
#     ("0d5c5b6ed855dbbc", 1,1, 70),
#     ("dbde4e323567f381", 1,2, 70),
#     ("917cd714e1103994", 1, 3, 70),
#     ("8ce4d6e271cbcdec", 1, 4, 70),
    
#     ("7eb3bed60a67f44d", 1, 5, 70),
#     ("9a97a9cd9ac398de", 1, 6, 70),
#     ("fc337481622c4dc8", 1, 7, 70),
#     ("4b528a07c6810670", 1, 8, 70),
#     ("de81d543721249f6", 1, 9, 12),
#     ("9fcccaab3f956f66", 1, 10, 70),
#     ("a58db253434c6759", 1, 11, 70),
#     ("b4c8c0b52049e4de", 1, 12, 70),
#     ("e2d0d77756858a3c", 1, 13, 70),
#     ("359da2e3798189c9", 1, 14, 70),
#     ("4af6994df3a900b9", 1, 15, 70),

#     ("58a45c9d5037a520", 0, 0, 70),
# ]

data=[
     ('b4c8c0b52049e4de', 1, 11, 23.0),
]
cur.executemany("INSERT INTO beacons VALUES(?, ?, ?,?)", data)

# cur.execute("DROP TABLE beacons")

#cur.execute("DELETE FROM beacons WHERE shortID = 'b4c8c0b52049e4de'")

con.commit()

res = cur.execute("SELECT * FROM beacons")
print(res.fetchall())