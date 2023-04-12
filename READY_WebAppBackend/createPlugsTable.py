import sqlite3
from sqlite3 import Error
from datetime import date, datetime
from datetime import timedelta

con = sqlite3.connect("rb_database.db")
cur = con.cursor()

#Toooooooooools- --------------------------------------------------
cur.execute("DROP TABLE plugs")
cur.execute("CREATE TABLE IF NOT EXISTS plugs(shortID PRIMARY KEY, isActive, position)")



data=[
    ("plug1",1,2),

    ("plug2",1,4),
    ("plug3",1,3),

    ("plug4",1,5),
    ("plug5",1,6),
    ("plug6",0,0),

    ("3EMPinturaEsq",1,20),
    ("3EMPinturaDir",1,21),
    ("3EMJatoAreia",1,22),
]


cur.executemany("INSERT INTO plugs VALUES(?, ?, ?)", data)


con.commit()

res = cur.execute("SELECT * FROM plugs")
print(res.fetchall())



