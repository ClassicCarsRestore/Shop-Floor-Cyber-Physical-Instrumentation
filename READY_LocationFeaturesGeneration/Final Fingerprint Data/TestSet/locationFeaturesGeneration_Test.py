import numpy as np
import csv
import glob


#define a coordenada do ponto relativo ao ficheiro de RAWDATA em causa
def getPostitionCoordinates(position):
    coord=position
    return coord

#headers para o ficheiro csv de features que vai ser gerado
header = ['position', 'e2d0d77756858a3c','58a45c9d5037a520','359da2e3798189c9','b4c8c0b52049e4de','a58db253434c6759','9fcccaab3f956f66',
'4b528a07c6810670','fc337481622c4dc8','9a97a9cd9ac398de','7eb3bed60a67f44d']


#cria um csv para guardar as location features
def create_CSV(filename):
   with open(filename, 'w', encoding='UTF8', newline='') as f:
      writer = csv.writer(f)
      # write the header
      writer.writerow(header)



#Le ficheiro csv com o RAW DATA dos dados dos beacons recebidos na SensorBox
#guarda no no dictBeacons os RSSI de cada beacon
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

#Guarda para cada beacon a media dos seus valores de RSSI
#no dictMeans
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


#Adiciona no ficheiro de features uma linha com os dados do ultimo ponto de fingerpriting
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
                    row.append(100) #usado quando n foram recebidos sinais do beacon, usase o 100 pois corresponde ao RSSI mais distante
        writer.writerow(row)


#Obtem o nome de todos os ficheiros com RAWDATA de cada ponto de fingeprinting
def getCsvFileNames():
    list_of_files = glob.glob('C:/Users/Manuel Gomes/Desktop/Dissertação Code/TratamentoLocationDataComplete/Fingerprint 18 Jan/TestSet/*.csv') # * means all if need specific format then *.csv
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
    rssiOutputFile="rssiValuesTest.csv"
    create_CSV(rssiOutputFile)
    for file in datafiles:
        position=file.split("_")[1]
        all_rssi=read_csv(file)
        rssi_means=calculeMeans(all_rssi)
        print(rssi_means)
        append_to_csv(rssi_means,rssiOutputFile,position)

    
    
