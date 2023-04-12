import sys
import json
import time
import numpy as np
import math

import csv
import glob
import os


# LatA = 0.39
# LonA = 4.6
# DistA = 9.82
# LatB = 0.4
# LonB = 0.4
# DistB = 9.84
# LatC = 15.85
# LonC = 4.6
# DistC = 6.30

def calculePolarCoord():
    #assuming elevation = 0
    LatA = 16 #D
    LonA = 0.4 #D
    DistA = 13.34 #D---
    LatB = 34 #E
    LonB = 0.4 #E
    DistB = 6.30 #E---
    LatC = 34 #F
    LonC = 11 #F
    DistC = 9.44 #F---

    #using authalic sphere
    #if using an ellipsoid this step is slightly different
    #Convert geodetic Lat/Long to ECEF xyz
    #   1. Convert Lat/Long to radians
    #   2. Convert Lat/Long(radians) to ECEF
    xA = LatA
    yA = LonA

    xB = LatB
    yB = LonB

    xC = LatC
    yC = LonC

    P1 = np.array([xA, yA])
    P2 = np.array([xB, yB])
    P3 = np.array([xC, yC])

    #from wikipedia
    #transform to get circle 1 at origin
    #transform to get circle 2 on x axis
    ex = (P2 - P1)/(np.linalg.norm(P2 - P1))
    i = np.dot(ex, P3 - P1)
    ey = (P3 - P1 - i*ex)/(np.linalg.norm(P3 - P1 - i*ex))
    ez = np.cross(ex,ey)
    d = np.linalg.norm(P2 - P1)
    j = np.dot(ey, P3 - P1)

    #from wikipedia
    #plug and chug using above values
    x = (pow(DistA,2) - pow(DistB,2) + pow(d,2))/(2*d)
    y = ((pow(DistA,2) - pow(DistC,2) + pow(i,2) + pow(j,2))/(2*j)) - ((i/j)*x)

 

    #triPt is an array with ECEF x,y,z of trilateration point
    triPt = P1 + x*ex + y*ey

    print("lat",triPt[0])
    print("lon",triPt[1])


        


if __name__ == "__main__":
    calculePolarCoord()
    



#P1
# LatA = 0.39
# LonA = 4.6
# DistA = 6.3
# LatB = 0.3
# LonB = 0.4
# DistB = 6.42
# LatC = 15.85
# LonC = 4.6
# DistC = 9.8

# X=6.29
# y=2.55