import os
import sys
import glob
import enum
import time

def manage_logs(sensor_box_name):
    try:
        cloud_logs_dir = '/home/pi/Desktop/SensorBoxCloud/code/logs/cloud/'
        logs_dir_ext = '/home/pi/Desktop/SensorBoxCloud/code/logs/*.log'
        cloud_logs_dir_ext = '/home/pi/Desktop/SensorBoxCloud/code/logs/cloud/*.log'

        print('glob.glob(logs_dir_ext): {}'.format(glob.glob(logs_dir_ext)))
        files = glob.glob(logs_dir_ext)

        for log_file_path in glob.glob(logs_dir_ext):
            #print(log_file_path)
            log_file_name = str(log_file_path).split('/')[-1]
            # send log file to s3 bucket
        
            # move file to cloud/ folder
            
            print('Successful log file upload.')
            new_file_path = os.path.join(cloud_logs_dir, log_file_name)
            os.replace(log_file_path, new_file_path)
          
        for log_file_path in glob.glob(cloud_logs_dir_ext):
            log_file_name = str(log_file_path).split('/')[-1]
            file_modification_timestamp = int(os.path.getmtime(log_file_path))
            # 2592000 = 30 days in seconds
            last_month_timestamp = int(time.time()) - 2592000
                    
            # delete any log file with over 30 days (local or in cloud)
            if file_modification_timestamp < last_month_timestamp:
                print('Deleting local log file {}.'.format(log_file_name))
                log_file_name = str(log_file_path).split('/')[-1]
                path_to_file = pathlib.Path(log_file_path)
                path_to_file.unlink()
                    
    except Exception as e:
        print(f'Error managing logs: {e.args[0]}')
    
    
    
if __name__ == "__main__":
    manage_logs(sys.argv[1])
