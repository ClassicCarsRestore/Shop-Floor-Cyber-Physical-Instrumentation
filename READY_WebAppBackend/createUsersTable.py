import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()


cur.execute("CREATE TABLE IF NOT EXISTS users (email PRIMARY KEY, password)")


#cur.execute("INSERT INTO users VALUES(?,?)",  ("rjbranco.aws@gmail.com","admin"))
cur.execute("INSERT INTO users VALUES(?,?)",  ("admin","admin"))
con.commit()

res = cur.execute("SELECT * FROM users")
print(res.fetchall())