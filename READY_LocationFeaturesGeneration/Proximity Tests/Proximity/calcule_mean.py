import sys
import json
import time
import numpy as np


import csv
import glob
import os

#header = ['position','58a45c9d5037a520','dbde4e323567f381','4b528a07c6810670','b4c8c0b52049e4de','9fcccaab3f956f66','a58db253434c6759','313676d7e340a51a','0d5c5b6ed855dbbc',              'fc337481622c4dc8','7eb3bed60a67f44d','de81d543721249f6','4af6994df3a900b9','917cd714e1103994','8ce4d6e271cbcdec','d5c87a75d12c7cbd']

#1 row=[(5.5,2.30),-68.18,-83,-200,-200,-200,-85,-79.25,-83]
#2 row=[(9.95,2.56),-88,-91,-92,-93,-95,-96,-200,-200]
#3 row=[(14.73,2.53),-89.5,-94,-200,-200,-200,-95.5,-94,-200]
# row=[(18.42,2.36),                -0,-85.7,-86.83,-92.66,-89.857,-87.0,-81.92,-91.44,-84.89,-87.0,-87.73,-0,-0,-0,-0] #4
# writer.writerow(row)
# row=[(22.10,2.59),              -95.5,-81.0,-84.67,-90.17,-84.75,-84.15,-74.63,-85.66,-83.14,-88.0,-81.91,-88.33,-89.25,-92.0,-0] #5
# writer.writerow(row)
# row=[(22.10,2.59),              -80.0,-75.5,-76.67,-85.2,-76.0,-75.86,-67.2,-80.38,-79.0,-79.4, -67.07,-77.4, -86.0, -94.0,-80.5] #5
# writer.writerow(row)
# row=[(28.84,3.37),            -0,-67.0,-68.19,-75.4,-70.78,-74.14,-67.13,-66.9,-65.33, -74.66, -72.14,-75.0,-82.0,-80.0,-77.66]  #6
# writer.writerow(row)
# row=[(28.84,3.37),            -0,-75.11,-69.8,-81.0,-73.0,-72.5,-67.6,-75.38, -67.0,-76.0,-77.14,-77.5,-80.67,-84.33,-0]  #6

def create_CSV(filename):
   header = ['position','58a45c9d5037a520','dbde4e323567f381','4b528a07c6810670','b4c8c0b52049e4de','9fcccaab3f956f66','a58db253434c6759','313676d7e340a51a','0d5c5b6ed855dbbc']
   with open(filename, 'w', encoding='UTF8', newline='') as f:
      writer = csv.writer(f)
      # write the header
      writer.writerow(header)
      # write multiple rows
      row=[(5.5,2.30),-68.18,-83,-0,-0,-0,-85,-79.25,-83]
      writer.writerow(row)
      row=[(9.95,2.56),-88,-91,-92,-93,-95,-96,-0,-0]
      writer.writerow(row)
      row=[(14.73,2.53),-89.5,-94,-0,-0,-0,-95.5,-94,-0]
      writer.writerow(row)

dictBeacons={}

def read_csv(filename):
   reader = csv.reader(open(filename))
   next(reader)
   for row in reader:
       key= row[0]
       if key in dictBeacons:
           dictBeacons[key].append(int(row[1]))
           pass
       else:
           dictBeacons[key]= [int(row[1])]

dictMeans={}
def mean():
    counter=20
    for key,soma in dictBeacons.items():
        sumvalue=np.sum(soma)
        mean=sumvalue/len(soma)
        distance=10**((-8 -62 - mean)/20)
        dictMeans[key]=mean
        a =sorted(dictMeans.items(), key=lambda x: x[1], reverse=True)
    a =sorted(dictMeans.items(), key=lambda x: x[1], reverse=True)
    for i in a:
        print(i)
    return a

        


if __name__ == "__main__":
    read_csv('Lixamento_Cima_Esquerda3.csv')
    #print('p6Estimotes_2.csv')
    #read_csv('p5Estimotes_1.csv')
    print(len(mean()))
    #create_CSV("location_0.csv")
    
