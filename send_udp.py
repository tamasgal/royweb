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
         'type': 'foo',
         'description': 'This is the foo parameters description.',
	 'value': random()*1.5+100.1,
        })
    if sys.version_info >= (3, 0):
        message = bytes(message, 'UTF-8')
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(bytes(message, 'UTF-8'), (udp_ip, udp_port))
    sleep(random()*1.5+0.1)

    current_time = int(time.time())
    if sys.version_info >= (3, 0):
        message = bytes(message, 'UTF-8')
    message = json.dumps(
        {'kind': 'parameter',
         'type': 'narf',
         'description': 'This is the narf parameters description.',
	 'value': random()*1.5+9.1,
        })
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(bytes(message, 'UTF-8'), (udp_ip, udp_port))
    sleep(random()*1.5+0.1)

    event += 1
    
