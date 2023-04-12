import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()

# colocar no script de Process Identification Algorithm
def convert_into_binary(file_path):
  with open(file_path, 'rb') as file:
    binary = file.read()
  return binary
# ------------------------------


def insert_into_database(file_path_name, file_blob): 
  try:
    conn = sqlite3.connect('rb_database.db')
    print("[INFO] : Successful connection!")
    cur = conn.cursor()
    sql_insert_file_query = '''INSERT INTO inferences(filename, file_blob, BoxName)
      VALUES(?, ?, ?)'''
    cur = conn.cursor()
    cur.execute(sql_insert_file_query, (file_path_name, file_blob,"SensorBox_07"))
    conn.commit()
    print("[INFO] : The blob for", file_path_name, "added in the database.") 
    last_updated_entry = cur.lastrowid
    return last_updated_entry
  except Error as e:
    print(e)
  finally:
    if conn:
      conn.close()
    else:
      error = "Oh shucks, something is wrong here."

#cur.execute("DROP TABLE inferences")
#con.commit()

#cur.execute("CREATE TABLE IF NOT EXISTS inferences(filename TEXT PRIMARY KEY NOT NULL, file_blob TEXT NOT NULL, BoxName TEXT NOT NULL)")

#con.commit()

file_path_name= "SensorBox_07-OutputFile_2023-02-09_23_00_55.json"
file_blob = convert_into_binary(file_path_name)

print("[INFO] : the first 100 characters of blob = ", file_blob[:100]) 

last_updated_entry = insert_into_database(file_path_name, file_blob)


con.commit()

res = cur.execute("SELECT * FROM inferences")
print(res.fetchall())

