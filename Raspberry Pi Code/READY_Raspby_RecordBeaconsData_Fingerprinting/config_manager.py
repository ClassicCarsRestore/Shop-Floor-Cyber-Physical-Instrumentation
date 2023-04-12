import json
from filelock import Timeout, FileLock

def read_config():
    with FileLock('config.json.lock', timeout=1):
        with open('config.json', 'r') as f:
            config = json.load(f)
    return config
    

def write_config(updated_config):
    with FileLock('config.json.lock', timeout=1):
        with open('config.json', 'w') as f:
            json.dump(updated_config, f)
