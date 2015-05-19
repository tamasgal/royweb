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
    ph.send('foo2', value, 'MHz', 'The foo parameter description.',)
    sleep(random()*0.2+0.1)

    value = 50000 - 10 + random()*20
    ph.send('bar2', value, 'kHz', 'The bar parameter description.',)
    sleep(random()*0.2+0.1)

    value = 1000 - 500 + random()*500
    ph.send('narf2', value, 'kHz', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 100 - 50 + random()*50
    ph.send('bar.baz2', value, 'm', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 1000 - 100 + random()*50
    ph.send('fjord2', value, 'kHz', 'The bar parameter description.',)
    sleep(random()*0.2+0.1)

    value = 1000 - 200 + random()*30
    ph.send('puppa2', value, 'kHz', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 100 - 30 + random()*50
    ph.send('sarh2', value, 'm', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    value = 25 - random()*50
    ph.send('negative2', value, 'Euro', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    i += 1
