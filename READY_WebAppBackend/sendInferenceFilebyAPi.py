import os
import http.client
import json
import requests

# def convert_into_binary(file_path):
#   with open(file_path, 'rb') as file:
#     binary = file.read()
#   return binary

# file_path_name= "processed_SensorBox_07_data_22_11_2022_23.json"

# file_blob = convert_into_binary(file_path_name)

# #print(file_blob)

# url = "http://127.0.0.1:5000/inferences?fileName="+file_path_name+"&boxId=SensorBox_test0"

# payload=file_blob
# headers = {
#   'Content-Type': 'application/json'
# }
# #Pode ser necessário colocar aqui um try catch. Testar correr o script
# # de ProcessIdentification com a API apagadae ver se o programa continua ou falha
# response = requests.request("POST", url, headers=headers, data=payload, timeout=3)
# print(response.text)



url = "http://192.168.1.4:5000/sensorboxes/car?boxId=SensorBox_07"


response = requests.request("GET", url, timeout=3)

print(response.json()[0])






