#!/usr/bin/env python
import socket
import time
from time import sleep
from random import random
import json

udp_ip  = "127.0.0.1"
udp_port = 9999

print("UDP target IP: {0}".format(udp_ip))
print("UDP target port: {0}".format(udp_port))
 
event = 100
while True:
    current_time = int(time.time())
    message = json.dumps(
        {'kind': 'parameter',
         'type': 'muon_energy_min',
         'description': 'this is the reconstructed energy of the primary muon.',
	     'value': random()*1.5+0.1,
         'time': current_time,
         'event_number': event})
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(message, (udp_ip, udp_port))
    sleep(random()*1.5+0.1)
    event += 1
    
