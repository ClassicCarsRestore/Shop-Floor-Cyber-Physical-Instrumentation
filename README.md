# Shop-Floor-Cyber-Physical-Instrumentation

InfluxDBLocation folder - has the content relate to the Live Monitoring of the Sensor Boxes location. Getting from InfluxDB the beacons data and infering the boxes positions. Sending it to InfluxDB. It runs in the server.

LocationFeaturesGeneration folder - has the content relative to the Fingerprint recorded data and the Features files generated. Is also have proximity tests data captured. The Fingerprinting features file is used in the ML model creation in ML Models Creation folder. 

ML Models Creation folder - has the content relative to the creation of pickle files containing the ML models trained of the Tools(ILM) prediction and Fingerprinting prediction. These models saved in the pickle files are used in InfluxDBLocation folder. 

ProcessIdentification folder - has the content relative to the Live Monitoring of the restoration processes done to the cars where a sensor box is attached. It identifies Painting, Curing, Sanding, Mineral Blasting. It runs in the server.

ProcessIdentification/ProcessIdentificationComOutputFile folder - has the content relative to the compilation of the last day processes identified in a json file that will be sent to the WEB APPLICATION. It verifies the sequence of the processes identified. It runs in the server.

WebAppBackend folder - contains the content relative to the web application backend. It has the SQLITE3 Database, and the FLASK API. It runs in the server.

thesis-web-app folder - has the content relative to the REACT Web Application Frontend.

Raspberry Pi Code/Raspby_DataIngestion folder - has the content relative to the sensor boxes data ingestion. Code running on each raspberry pi.

Raspberry Pi Code/RecordBeaconsData_Fingerprinting folder - has the code used to get the Estimote Beacons data for post build of the fingepriting.

Link to Web Application walkthrough Video - https://youtu.be/KQo-7tG-i2E
