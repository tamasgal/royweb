#!/usr/bin/env python
# coding=utf-8
# Filename: __main__.py
# pylint: disable=E0611,W0611
from __future__ import print_function, absolute_import

"""
The ROyWeb tornado webserver startup script.

"""
__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'

import tornado.ioloop
import tornado.web
from tornado.options import define, options

import os
import threading

from time import sleep
from random import random
import math

from royweb.networking import PacketHandler, WebSocketBroadcaster
from royweb.webhandler import MainHandler, EchoWebSocket, UnitTests, SpecTests

define("ip", default="127.0.0.1", type=str,
       help="The WAN IP of this machine. You can use 127 for local tests.")
define("port", default="8080", type=int,
       help="The ROyWeb server will be available on this port.")
define("udp_port", default="9999", type=int,
       help="The port where the ROyCruncher sends data to.")

define("config_file", help="Location of the configuration file.")
define("pid_file", help="Location of the PID file.")
define("log_file", help="Location of the log file for stdout and stderr.")


def main():
    root = os.path.dirname(__file__)
    cwd = os.getcwd()

    options.parse_command_line()

    if options.config_file:
        if not options.config_file[0] == "/":
            config_file = os.path.join(cwd, options.config_file)
        else:
            config_file = options.config_file
        print("Reading configuration from: {0}".format(config_file))
        try:
            options.parse_config_file(config_file)
        except IOError:
            print("Configuration file cannot be accessed. "
                  "Proceeding with defaults...")

    royweb_ip = options.ip
    royweb_port = int(options.port)
    udp_port = int(options.udp_port)
    pid = os.getpid()

    if options.pid_file:
        f = open(options.pid_file, "w")
        f.write(str(pid))
        f.close()

    print("Starting ROyWeb with PID {0}".format(pid))
    print("Running on {0}:{1}".format(royweb_ip, royweb_port))
    print("Listening for UDP data on port {0}".format(udp_port))

    settings = {'debug': True,
                'static_path': os.path.join(root, 'static'),
                'template_path': os.path.join(root, 'static/templates'),
                }

    clients = []

    application = tornado.web.Application([
                                              (r"/", MainHandler, dict(royweb_ip=royweb_ip, royweb_port=royweb_port)),
                                              (r"/websocket", EchoWebSocket, {'clients': clients}),
                                              (r"/unit_tests", UnitTests),
                                              (r"/spec_tests", SpecTests),
                                          ], **settings)

    ws_broadcaster = WebSocketBroadcaster(royweb_ip, udp_port, clients)
    t = threading.Thread(target=ws_broadcaster.run)
    t.daemon = True
    t.start()

    # # demonise
    # import daemon
    # if not options.log_file:
    # log_file = "tornado.{0}.log".format(royweb_port)
    # else:
    #     log_file = options.log_file
    # log = open(log_file, 'a+')
    # ctx = daemon.DaemonContext(stdout=log, stderr=log,  working_directory='.')
    # ctx.open()

    try:
        application.listen(royweb_port)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print("Stopping tornado...")
        ws_broadcaster.stop()
        tornado.ioloop.IOLoop.instance().stop()


def send_test_parameter():
    udp_ip = "127.0.0.1"
    udp_port = 9999

    ph = PacketHandler(udp_ip, udp_port)

    print("UDP target IP: {0}".format(udp_ip))
    print("UDP target port: {0}".format(udp_port))

    i = 100
    while True:
        bias = i % 10
        ph.send('foo', random()*1.5+bias, 'MHz', 'The foo parameter description.',)
        sleep(random()*1.5+0.1)

        bias = math.sin(i)*2
        ph.send('narf', random()*1.5+bias, 'ms', 'The narf parameter description.',)
        sleep(random()*1.5+0.1)

        i += 1


if __name__ == "__main__":
    main()

