#!/usr/bin/env python
"""
Send random scatter plot data to ROyWeb via UDP.

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
    value = [(random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10)]
    ph.send('scatter', value, '', '',)
    sleep(random()*1.0+1.0)
    
    value = [(random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10)]
    ph.send('scatter2', value, '', '',)
    sleep(random()*1.0+1.0)

    value = [(random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10)]
    ph.send('scatter3', value, '', '',)
    sleep(random()*1.0+1.0)

    value = [(random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10),
             (random()*10, random()*10), (random()*10, random()*10)]
    ph.send('scatter4', value, '', '',)
    sleep(random()*1.0+1.0)


    i += 1
