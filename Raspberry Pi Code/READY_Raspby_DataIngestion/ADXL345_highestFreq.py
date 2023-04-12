import os
import time
import signal
import numpy as np
from numpy.fft import fft
from collections import Counter
# Logging script
import system_logger
#########biblioteca https://github.com/nagimov/adxl345spi
adxl345_logger=system_logger.get_logger(__name__)

def check_parameters(frequency, duration):
    return isinstance(frequency, int) and isinstance(duration, int) \
       and frequency > 0 and frequency <= 3200 and duration > 0 and duration < 20

def signal_handler(signal, frame):
    # SIGCONT caught while stopping script
    sys.exit(0)
    
signal.signal(signal.SIGCONT, signal_handler)

def get_FFT_results(sensing_frequency, vibration_sensing_duration):

    errorCounter = 0
    #config = config_manager.read_config()
    max_error_count = 2
    msg = "ADXL345 (accelerometer sensor) failure while reading sensor value. "
    output = []
    while len(output) == 0:
        try:
            if not check_parameters(sensing_frequency, vibration_sensing_duration):
                sensing_frequency = 3200
                vibration_sensing_duration = 10

            # run script to save accelerometer data to file
            #adxl345_logger.info('Starting ADXL345 (accelerometer) sensor analysis.')
            os.system(f'sudo adxl345spi -t {vibration_sensing_duration} -f {sensing_frequency} -s out.csv')
            #adxl345_logger.info('Ended ADXL345 (accelerometer) sensor analysis.')

            N = sensing_frequency * vibration_sensing_duration # number of samples

            # get data from file and perform fft analysis (Hz) 
            acc_data = np.genfromtxt('out.csv', delimiter=',', names=True)
            #acc_data = np.genfromtxt('fft/data/acc_data_1.csv', delimiter=',', names=True)
            
            
            if all(item == 0 for item in acc_data['x']) and\
                    all(item == 0 for item in acc_data['y'])and\
                        all(item == 0 for item in acc_data['z']):
                adxl345_logger.info("Error on reading ADXL345 (accelerometer) sensor data.")
                return -1
                

            # FFT 
            # x - axis for the fft plot
            freq = np.fft.fftfreq(N)
            # obtain only the positive values - no mirror effect
            mask = freq > 0

            # acceleration data calibration
            calibrated_x = (((acc_data['x'] - (-1.0143110609374228)) * 2) / 2.0105793406249592) + (-1)
            calibrated_y = (((acc_data['y'] - (-0.9911384778125467)) * 2) / 2.0247819628125763) + (-1)
            calibrated_z = (((acc_data['z'] - (-0.952975451562479)) * 2) / 1.949025233124975) + (-1)

            # FFT calculation
            fft_x = fft(calibrated_x)
            fft_y = fft(calibrated_y)
            fft_z = fft(calibrated_z)

            # y axis - magnitude axis
            x_mag = 2 * np.abs(fft_x / N) 
            y_mag = 2 * np.abs(fft_y / N) 
            z_mag = 2 * np.abs(fft_z / N) 

            # create a np array containing the 3 axis arrays
            test_array = np.array([x_mag[mask], y_mag[mask], z_mag[mask]])

            # sum the 3 mag arrays into one
            # array_mag_sum[0] = x_mag[mask][0] + y_mag[mask][0] + z_mag[mask][0]
            array_mag_sum = np.sum(test_array, axis=0) 
            max_magnitude_recorded = max(array_mag_sum)

            freq_array = freq[mask] * sensing_frequency
            adxl345_logger.info("Max_magnitude_recorded: "+ str(max_magnitude_recorded))
            
            if max_magnitude_recorded > 0.025:
                return max_magnitude_recorded
                print("Acima do valor")
            else:
                return 0
                

        except Exception as error:
            # Errors happen fairly often, just keep going
            #adxl345_logger.error('Error on reading ADXL345 (accelerometer) sensor data: {}.'.format(error.args[0]))
            print("Errrroooooo",error)
            errorCounter += 1
            if errorCounter == max_error_count:
                msg = msg + str(error.args[0])
                #shadow_v2.update_reported_error(error_code=config['error_codes']['accelerometer_sensor_error_code'], message=msg)
                #adxl345_logger.error('Updating reported error of ADXL345 (accelerometer) sensor: {}.'.format(error.args[0]))
                # The ADXL sensor is the only one to only update to ERROR status this way
                # because returning '0' is not considered an error, for temp and hum sensors it is
                return -1
            time.sleep(2.0)
            continue


if __name__ == "__main__":
    get_FFT_results(3200, 4)