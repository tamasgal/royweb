# coding=utf-8
# Filename: webhandler.py
# pylint: disable=E0611,W0611
"""
Tornado WebHandler.

"""
from __future__ import print_function

__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('MainHandler', 'EchoWebSocket', 'NoCacheStaticFileHandler',
           'UnitTests', 'SpecTests')

import tornado.web
import tornado.websocket

import json


class MainHandler(tornado.web.RequestHandler):
    """The main request handler for ROyWeb"""
    def initialize(self, royweb_ip, royweb_port):
        self.royweb_ip = royweb_ip
        self.royweb_port = royweb_port

    def get(self):
        self.render("index.html",
                    royweb_ip=self.royweb_ip, royweb_port=self.royweb_port)


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    """An echo handler for client/server messaging and debugging"""
    def __init__(self, *args, **kwargs):
        self.clients = kwargs.pop('clients')
        super(EchoWebSocket, self).__init__(*args, **kwargs)

    def open(self, *args):
        print("WebSocket opened")
        self.send_json_message(u"WebSocket opened")
        self.clients.append(self)

    def on_message(self, message):
        self.send_json_message(u"Client said '{0}'".format(message))

    def on_close(self):
        print("WebSocket closed")
        self.clients.remove(self)

    def send_json_message(self, text):
        """Convert message to json and send it to the clients"""
        message = json.dumps({'kind': 'message', 'text': text})
        self.write_message(message)


class NoCacheStaticFileHandler(tornado.web.StaticFileHandler):
    """A static file handler without caching."""
    def set_extra_headers(self, path):
        self.set_header('Cache-Control',
                        'no-store, no-cache, must-revalidate, max-age=0')

class UnitTests(tornado.web.RequestHandler):
    """The unit test page"""
    def get(self):
        self.render("../templates/UnitTestsRunner.html")


class SpecTests(tornado.web.RequestHandler):
    """The specs page"""
    def get(self):
        self.render("../templates/SpecRunner.html")
