#!/usr/bin/env python
"""
Send random data to ROyWeb via UDP.

Usage:
  send_udp.py [--ip=127.0.0.1] [--port=9999]
  send_udp.py -h | --help
  send_udp.py --version

Options:
  -h --help      Show this screen.
  --version      Show version.
  --ip=<ip>      The address of the ROyWeb server. [default: 127.0.0.1]
  --port=<port>  Port to send data to. [default: 9999]
"""

from time import sleep
from random import random
import math

from royweb import PacketHandler

from docopt import docopt

arguments = docopt(__doc__)

udp_ip = arguments["--ip"]
udp_port = int(arguments["--port"])

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

    value = 25 - random()*50
    ph.send('negative', value, 'Euro', 'The narf parameter description.',)
    sleep(random()*0.2+0.1)

    i += 1
