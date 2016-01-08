#!/usr/bin/env python
from time import sleep
from random import random
import math

from royweb import PacketHandler

udp_ip = "127.0.0.1"
udp_port = 9999

ph = PacketHandler(udp_ip, udp_port)

print("UDP target IP: {0}".format(udp_ip))
print("UDP target port: {0}".format(udp_port))


i = 100
while True:
    value = 100000 - 1000 + random()*2000
    ph.send('arr', (10, 15, 12), 'MHz', 'The foo parameter description.',)
    sleep(random()*0.2+0.1)

    i += 1
