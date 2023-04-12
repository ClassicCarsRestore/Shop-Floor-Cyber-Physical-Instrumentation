import time
import logging
import pathlib

sensor_box_name="SensorBox_07"

# Configuring logging
def get_logger(name):
        
    # create logs folder with inner cloud folder
    cloud_logs_dir = '/home/pi/Desktop/SensorBoxCloud/code/logs/cloud/'
    pathlib.Path(cloud_logs_dir).mkdir(parents=True, exist_ok=True)
    
    logs_dir = '/home/pi/Desktop/SensorBoxCloud/code/logs/'
    
    log_format = '%(asctime)s:%(name)s:%(levelname)s:%(message)s'
    log_file_name = '_'.join((f'log_{sensor_box_name}', time.strftime('%d_%m_%Y')))
    log_file = ''.join((logs_dir, log_file_name + '.log'))

    logging.basicConfig(filename=log_file,
                        level=logging.NOTSET,
                        format=log_format)
    console = logging.StreamHandler()
    console.setLevel(logging.NOTSET)
    console.setFormatter(logging.Formatter(log_format))
    logging.getLogger(name).addHandler(console)
    # Suppressing boto3 and botocore logging
    logging.getLogger('filelock').setLevel(logging.CRITICAL) 
    #logging.getLogger('s3transfer').setLevel(logging.CRITICAL)
    return logging.getLogger(name)