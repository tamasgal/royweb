#!/usr/bin/env python
import socket
import time
from time import sleep
from random import random
import json
import math

udp_ip  = "127.0.0.1"
udp_port = 9999

print("UDP target IP: {0}".format(udp_ip))
print("UDP target port: {0}".format(udp_port))
 
i = 100
while True:
    bias = i % 10
    current_time = int(time.time())
    message = json.dumps(
        {'kind': 'parameter',
         'type': 'foo',
         'description': 'This is the foo parameters description.',
	 'value': random()*1.5+bias,
        })
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(message, (udp_ip, udp_port))
    sleep(random()*1.5+0.1)


    bias = math.sin(i)*2
    current_time = int(time.time())
    message = json.dumps(
        {'kind': 'parameter',
         'type': 'narf',
         'description': 'This is the narf parameters description.',
	 'value': random()*1.5+bias,
        })
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.sendto(message, (udp_ip, udp_port))
    sleep(random()*1.5+0.1)

    i += 1
    
