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

from royweb.networking import PacketHandler, UDPDispatcher
from royweb.database import DBManager
from royweb.webhandler import (V2Handler, MainHandler, EchoWebSocket,
                               UnitTests, SpecTests)

define("ip", default="127.0.0.1", type=str,
       help="The WAN IP of this machine. You can use 127 for local tests.")
define("port", default="8080", type=int,
       help="The ROyWeb server will be available on this port.")
define("udp_port", default="9999", type=int,
       help="The port where the ROyCruncher sends data to.")

define("config_file", help="Location of the configuration file.")
define("db_file", default="roy.db", help="Location of the database file.")
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
    print("Database for offline storage: {0}".format(options.db_file))

    settings = {'debug': True,
                'static_path': os.path.join(root, 'static'),
                'template_path': os.path.join(root, 'static/templates'),
                }

    clients = []

    application = tornado.web.Application([
        (r"/", MainHandler, dict(royweb_ip=royweb_ip, royweb_port=royweb_port)),
        (r"/v2", V2Handler, dict(royweb_ip=royweb_ip, royweb_port=royweb_port)),
        (r"/websocket", EchoWebSocket, {'clients': clients}),
        (r"/unit_tests", UnitTests),
        (r"/spec_tests", SpecTests),
    ], **settings)

    db_manager = DBManager(options.db_file)
    udp_dispatcher = UDPDispatcher(royweb_ip, udp_port, clients, db_manager)
    t = threading.Thread(target=udp_dispatcher.run)
    t.daemon = True
    t.start()

    try:
        application.listen(royweb_port)
        tornado.ioloop.IOLoop.instance().start()
    except KeyboardInterrupt:
        print("Stopping tornado...")
        udp_dispatcher.stop()
        db_manager.disconnect()
        tornado.ioloop.IOLoop.instance().stop()


if __name__ == "__main__":
    main()

