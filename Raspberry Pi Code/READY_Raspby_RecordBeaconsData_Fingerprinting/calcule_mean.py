import sys
import json
import time
import numpy as np


import csv
import glob
import os




def create_CSV(row,filename):
   header = ['idEstimote','Timestamp', 'Battery', 'Rssi','Temperature','zone']

   with open(filename, 'w', encoding='UTF8', newline='') as f:
      writer = csv.writer(f)
      # write the header
      writer.writerow(header)
      # write multiple rows
      writer.writerow(row)

def read_csv(row,filename):
   with open(filename,'a',newline='') as f:
      writer = csv.writer(f)
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
    for key,soma in dictBeacons.items():
        sumvalue=np.sum(soma)
        mean=sumvalue/len(soma)
        distance=10**((-8 -62 - mean)/20)
        dictMeans[key]=(mean,distance)
        print(key)
        print('dictMeans[key]',dictMeans[key])


if __name__ == "__main__":
    read_csv('Estimotes_ForaEspaco5-4_16.csv')
    mean()
    
