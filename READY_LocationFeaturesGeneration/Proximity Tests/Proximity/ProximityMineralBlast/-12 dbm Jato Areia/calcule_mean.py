import sys
import json
import time
import numpy as np


import csv
import glob
import os

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
    read_csv('Estimotes_ForaDivisao5_-12dbm_3.csv')
    #print('p6Estimotes_2.csv')
    #read_csv('p5Estimotes_1.csv')
    print(len(mean()))
    #create_CSV("location_0.csv")
    
