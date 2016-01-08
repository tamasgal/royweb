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


while True:
    value = 100000 - 1000 + random()*2000
    ph.send('int', int(value), 'The foo parameter description.',)
    ph.send('str', str(value), 'The foo parameter description.',)
    sleep(1)
