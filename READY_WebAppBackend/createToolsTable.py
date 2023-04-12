import sqlite3
import os
from sqlite3 import Error

con = sqlite3.connect("rb_database.db")
cur = con.cursor()

#Toooooooooools- --------------------------------------------------

cur.execute("CREATE TABLE IF NOT EXISTS tools(ToolModelKey PRIMARY KEY, isActive, MaximumFrequency,MinimumFrequency,ToolBrand,ToolDescription,ToolName)")



data=[
    ("OWDA2942KDAW",1,305,205,"Parkside","ToolDescription","Electric Sander"),
    ("235689BSKA002",1,170,160,"Festol","Versatil","Electric Sander"),
    #("AKIA231WER212MA",1,125,115,"Parkside","The best polisher","Electric Sander")
]

#cur.executemany("INSERT INTO tools VALUES(?, ?, ?, ?,?,?,?)", data)

con.commit()

res = cur.execute("SELECT * FROM tools")
print(res.fetchall())

#[{"isActive":true,"ToolBrand":"Parkside","ToolDescription":"Tool Description","MaximumFrequency":305,"MinimumFrequency":205,"ToolModelKey":"OWDA2942KDAW","ToolName":"Electric Sander"},
# {"isActive":true,"ToolBrand":"Einhell","ToolDescription":"Manual Sanding Paper","MaximumFrequency":15,"MinimumFrequency":1,"ToolModelKey":"sand-paper","ToolName":"Sandind Paper"},
# {"isActive":true,"ToolBrand":"Festol","ToolDescription":"Versatile, highly adjustable polisher.","MinimumFrequency":160,"MaximumFrequency":170,"ToolModelKey":"235689BSKA002","ToolName":"Electric Sander"},
# {"isActive":true,"ToolBrand":"Parkside","ToolDescription":"Triangular tip vibrating sander","MaximumFrequency":450,"MinimumFrequency":200,"ToolModelKey":"JAWD2942MFO013","ToolName":"Electric Sander"},
# {"isActive":true,"ToolBrand":"Einhell","ToolDescription":"Strong polisher used on newer cars, highly adjustable.","MaximumFrequency":450,"MinimumFrequency":230,"ToolModelKey":"OPE2342NNAD","ToolName":"Polisher"},
# {"isActive":true,"ToolBrand":"Decker","ToolDescription":"new polisher added from the cloud","MaximumFrequency":10,"MinimumFrequency":5,"ToolModelKey":"AKIA231NS12MA","ToolName":"Polisher"},
# {"isActive":true,"ToolBrand":"Parkside","ToolDescription":"The best electric sander in the market.","MaximumFrequency":125,"MinimumFrequency":115,"ToolModelKey":"AKIA231WER212MA","ToolName":"Electric Sander"},
# {"isActive":true,"ToolBrand":"Shine Mate","ToolDescription":"Versatile, highly adjustable polisher.","MaximumFrequency":375,"MinimumFrequency":100,"ToolModelKey":"213259ASKA002","ToolName":"Polisher"},
# {"isActive":true,"ToolBrand":"Black & Decker","ToolDescription":"Polisher used on cars that require more care than usual, highly adjustable.","MaximumFrequency":320,"MinimumFrequency":75,"ToolModelKey":"A3D3F2D221","ToolName":"Polisher"}]
