import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()


cur.execute("CREATE TABLE IF NOT EXISTS workers (Coordinator PRIMARY KEY)")


cur.execute("INSERT INTO workers VALUES(?)",  ("Antonio Reis",))
cur.execute("INSERT INTO workers VALUES(?)",  ("João Pedro",))
con.commit()

res = cur.execute("SELECT * FROM workers")
print(res.fetchall())