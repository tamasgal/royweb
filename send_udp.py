#!/usr/bin/env python
import socket
import time
from time import sleep
from random import random
import json

#UDP_IP = "131.188.167.62"
UDP_IP = "127.0.0.1"
UDP_PORT = 9999

print("UDP target IP: {0}".format(UDP_IP))
print("UDP target port: {0}".format(UDP_PORT))
 

event = 100
while True:
    current_time = int(time.time())
    MESSAGE = json.dumps(
        {'kind': 'parameter',
         'type': 'muon_energy_min',
         'description': 'this is the reconstructed energy of the primary muon.',
	     'value': random()*1.5+0.1,
         'time': current_time,
         'event_number': event})


    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))
    sleep(random()*1.5+0.1)
    event += 1
    
