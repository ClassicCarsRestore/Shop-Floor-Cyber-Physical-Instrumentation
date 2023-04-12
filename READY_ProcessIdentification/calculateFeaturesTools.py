

max_power=0
min_power=10000
mean_power=-1
n_low=0 #n samples <= 30 W
n_medium=0 #n samples 30< W <=400
n_high=0 #n samples 400< W <=1000
n_ultra=0 #n samples >1000W
n_transiction_high=0 #n transition higher than 1000 W
n_transiction_low=0 #n transition between 10 and 100 W 
last_power=0
counter=0
total_power=0
positives=0




def reset():
   global max_power
   global min_power
   global mean_power
   global n_zeros
   global n_low
   global n_medium
   global n_high
   global n_ultra
   global n_transiction_high
   global n_transiction_low
   global counter
   global total_power
   global positives
   global last_power
   max_power=0
   min_power=10000
   mean_power=-1
   n_zeros=0
   n_low=0 #n samples <= 30 W
   n_medium=0 #n samples 30< W <=400
   n_high=0 #n samples 400< W <=1000
   n_ultra=0 #n samples >1000W
   n_transiction_high=0 #n transition higher than 1000 W
   n_transiction_low=0 #n transition between 10 and 100 W
   last_power=0
   counter=0
   total_power=0
   positives=0

# Dado um conjunto de valores de electric power obtidos durante determinado tempo
# vai ser gerado um vetor ou mais de features consoante o nr de dados eletricos 
# (neste caso sao tratados 60 de cada vez)
def getFeatures2(data):
   global max_power
   global min_power
   global mean_power
   global n_zeros
   global n_low
   global n_medium
   global n_high
   global n_ultra
   global n_transiction_high
   global n_transiction_low
   global counter
   global total_power
   global positives
   global last_power
   i=0
   reset()
   rows=[]
   #print("Received Data Entries from InfluxDB",len(data))
   comecou=0
   t0=0
   t1=0
   for entry in data: # read row line by line
      power=entry[0]
      if comecou==0:
         t0=entry[1]
      if (power>5 and comecou==0) or comecou!=0 :
         i+=1
         comecou=1
         counter=counter+1
         if counter >= 60:
            if total_power!=0:
               mean_power=round(total_power/positives,3)
            t1=entry[1]
            row_f=([max_power,min_power,mean_power,n_low,n_medium,n_high,n_ultra,n_transiction_low,n_transiction_high],t0,t1)
            rows.append(row_f)
            #print("More than 60 data evaluated -> More than one features vector will be created")
            t0=0
            t1=0
            reset()
            comecou=0
      if comecou==0:
         t0=entry[1]
      if (power>5 and comecou==0) or comecou!=0:
         comecou=1
         transiction=abs(power-last_power)
         if transiction > 1000:
            n_transiction_high+=1
         if transiction >=10 and transiction <=100:
            n_transiction_low+=1
         if power>5:
            positives+=1
            total_power+=power
            if power>max_power:
                  max_power=power
            if power< min_power:
                  min_power=power
            if power <= 30:
                  n_low+=1
            if power >30 and power <=400:
                  n_medium+=1
            if power >400 and power <=1000:
                  n_high+=1
            if power >1000:
                  n_ultra+=1
         last_power=power
         mean_power=0
   if counter < 60 and comecou!=0:
      #print("Less than 60 data evaluated")
      if total_power!=0:
         mean_power=round(total_power/positives,3)
      t1=entry[1]
      row_f=([max_power,min_power,mean_power,n_low,n_medium,n_high,n_ultra,n_transiction_low,n_transiction_high],t0,t1)
      rows.append(row_f)   
 
   return rows

