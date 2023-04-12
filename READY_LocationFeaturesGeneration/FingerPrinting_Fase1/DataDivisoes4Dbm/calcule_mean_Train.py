import numpy as np
import csv
import glob


def getPostitionCoordinates(position):
    coord=-1
    if position=="M3":
        coord=(19.55,3.5)
    if position=="M4":
        coord=(23.15,3.5)
    if position=="M5":
        coord=(26.85,3.5)
    if position=="M6":
        coord=(30.85,3.5)
    #--------
    if position=="M7":
        coord=(19.23,7)
    if position=="M8":
        coord=(21.75,7)
    if position=="M9":
        coord=(25.95,7)
    if position=="M10":
        coord=(30.85,7)
    #---------------------Divisoes Test Positions
    if position=="M11":
        coord=(23.15,3.5)
    if position=="M12":
        coord=(23.15,3.5)
    if position=="M13":
        coord=(23.15,3.5)
    if position=="M14":
        coord=(23.15,3.5)
    #---------------Divisoes-------------------------------------------
    if position=="M20":
        coord=(2.82,6.2)
    if position=="M21":
        coord=(3.6,10)
    if position=="M22":
        coord=(3.6,13.5)
    if position=="M23":
        coord=(3.6,17)
    #---------------Divisoes Test Positions
    if position=="M24":
        coord=(3.6,13.5)
    if position=="M25":
        coord=(3.6,10)

    return coord


header = ['position','4af6994df3a900b9','9a97a9cd9ac398de','b4c8c0b52049e4de']

def create_CSV(filename):
   with open(filename, 'w', encoding='UTF8', newline='') as f:
      writer = csv.writer(f)
      # write the header
      writer.writerow(header)




def read_csv(filename):
    dictBeacons={}
    reader = csv.reader(open(filename))
    next(reader)
    for row in reader:
        key= row[0]
        if key in dictBeacons:
            dictBeacons[key].append(int(row[1]))
            pass
        else:
            dictBeacons[key]= [int(row[1])]
    return dictBeacons


def calculeMeans(rssiDict):
    dictMeans={}
    for key,values in rssiDict.items():
        sumvalue=np.sum(values)
        mean=sumvalue/len(values)
        dictMeans[key]=round(mean,2)
        #a =sorted(dictMeans.items(), key=lambda x: x[1], reverse=True)
    #a =sorted(dictMeans.items(), key=lambda x: x[1], reverse=True)
    #for i in a:
        #print(i)
    return dictMeans



def append_to_csv(rssi_dict,filename,position):
    with open(filename,'a', newline='') as f:
        writer = csv.writer(f)
        coordinates=getPostitionCoordinates(position)
        row=[coordinates]
        for id in header:
            if id !="position":
                if id in rssi_dict:
                    row.append(rssi_dict[id])
                else:
                    row.append(100)
        writer.writerow(row)

def getCsvFileNames():
    list_of_files = glob.glob('C:/Users/Manuel Gomes/Desktop/Dissertação Code/ProductionLocationWorkshopShopData/DataDivisoes4Dbm/*.csv') # * means all if need specific format then *.csv
    names=[]
    for file in list_of_files:
        splited=file.split('\\')
        file_name=splited[len(splited)-1]
        if "Estimotes" in file_name:
            names.append(file_name)
    print("names",names)
    return names
    
if __name__ == "__main__":
    datafiles=getCsvFileNames()
    rssiOutputFile="rssiValuesTrain.csv"
    create_CSV(rssiOutputFile)
    for file in datafiles:
        position=file.split("_")[1]
        all_rssi=read_csv(file)
        rssi_means=calculeMeans(all_rssi)
        print(rssi_means)
        append_to_csv(rssi_means,rssiOutputFile,position)

    
    
