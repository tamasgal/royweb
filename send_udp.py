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
    value = 100000 - 1000 + random()*2000
    ph.send('foo', value, 'MHz', 'The foo parameter description.',)
    sleep(random()*0.2+0.1)

    value = 50000 - 10 + random()*20
    ph.send('bar', value, 'kHz', 'The bar parameter description.',)
    sleep(random()*0.2+0.1)

    value = 1000 - 500 + random()*500
    ph.send('narf', value, 'kHz', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 100 - 50 + random()*50
    ph.send('bar.baz', value, 'm', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 1000 - 100 + random()*50
    ph.send('fjord', value, 'kHz', 'The bar parameter description.',)
    sleep(random()*0.2+0.1)

    value = 1000 - 200 + random()*30
    ph.send('puppa', value, 'kHz', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 100 - 30 + random()*50
    ph.send('sarh', value, 'm', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    i += 1
