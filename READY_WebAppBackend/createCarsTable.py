import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()


#cur.execute("CREATE TABLE IF NOT EXISTS cars (CarsName PRIMARY KEY)")

#cur.execute("DELETE FROM cars WHERE CarsName=(?)",("Audi A1",)  )
            
#cur.execute("INSERT INTO cars VALUES(?)",  ("Alfa Romeo 2000 GT 1973 - JVY 993L",))
#cur.execute("INSERT INTO cars VALUES(?)",  ("Lancia Flaminia 1960 - GOI XVE",))
cur.execute("INSERT INTO cars VALUES(?)",  ("Audi A1",))
con.commit()

res = cur.execute("SELECT * FROM cars")
print(res.fetchall())