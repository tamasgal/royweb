#!/usr/bin/env python
from time import sleep
from random import random
import math

from royweb.networking import PacketHandler

udp_ip = "127.0.0.1"
udp_port = 9999

ph = PacketHandler(udp_ip, udp_port)

print("UDP target IP: {0}".format(udp_ip))
print("UDP target port: {0}".format(udp_port))


i = 100
while True:
    bias = i % 10
    ph.send('foo', random()*1.5+bias, 'The foo parameter description.',)
    sleep(random()*0.3+0.1)

    bias = math.sin(i)*2
    ph.send('narf', random()*1.5+bias, 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    bias = (math.sin(i) + 100)*2
    ph.send('bar.baz', random()*1.5+bias, 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    i += 1
