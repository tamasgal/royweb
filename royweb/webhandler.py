# coding=utf-8
# Filename: webhandler.py
# pylint: disable=locally-disabled,too-many-public-methods,attribute-defined-outside-init
"""
Tornado WebHandler.

"""
from __future__ import print_function

__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('MainHandler', 'EchoWebSocket', 'NoCacheStaticFileHandler',
           'UnitTests', 'SpecTests')

import os
import glob
from os.path import basename

import royweb

import tornado.web
import tornado.websocket

import json


class MainHandler(tornado.web.RequestHandler):
    """The main request handler for ROyWeb"""
    #pylint: disable=arguments-differ
    def initialize(self, royweb_ip, royweb_port):
        self.royweb_ip = royweb_ip
        self.royweb_port = royweb_port

    def get(self):
        self.render("index.html",
                    royweb_ip=self.royweb_ip,
                    royweb_port=self.royweb_port,
                    version=royweb.__version__)


class V2Handler(tornado.web.RequestHandler):
    """The main request handler for ROyWeb"""
    #pylint: disable=arguments-differ
    def initialize(self, royweb_ip, royweb_port):
        self.royweb_ip = royweb_ip
        self.royweb_port = royweb_port

    def get(self):
        self.render("v2.html",
                    royweb_ip=self.royweb_ip,
                    royweb_port=self.royweb_port,
                    version=royweb.__version__)


class EchoWebSocket(tornado.websocket.WebSocketHandler):
    """An echo handler for client/server messaging and debugging"""
    def __init__(self, *args, **kwargs):
        self.clients = kwargs.pop('clients')
        super(EchoWebSocket, self).__init__(*args, **kwargs)

    def check_origin(self, origin):
        return True

    def open(self):
        welcome = u"WebSocket opened. Welcome to ROyWeb {0}!".format(royweb.version)
        print(welcome)
        self.send_json_message(welcome)
        self.clients.append(self)

    def on_message(self, message):
        try:
            json_message = json.loads(message)
            if json_message['kind'] == 'session_save':
                print(u"Client wants to save a session with name '{0}'"
                      .format(json_message['session_name']))
                self.send_json_message(u"Saving session '{0}'..."
                                       .format(json_message['session_name']))
                json_message['kind'] = 'session_load'
                session_directory = "sessions"
                if not os.path.exists(session_directory):
                    os.makedirs(session_directory)
                with open(os.path.join(session_directory, json_message['session_name']) + '.json', 'w') as outfile:
                    outfile.write(json.dumps(json_message))
                # TODO: Refactor this! Sends the updated session list to all clients
                session_names = [os.path.splitext(basename(filename))[0] for filename in glob.glob("sessions/*.json")]
                json_session_list = json.dumps({'kind':'session_list', 'sessions': session_names})
                self.write_message(json_session_list)
            elif json_message['kind'] == 'session_load':
                print(u"Client wants to load a session with name '{0}'"
                      .format(json_message['session_name']))
                self.send_json_message(u"Loading session '{0}'."
                                       .format(json_message['session_name']))
                session_directory = "sessions"
                with open(os.path.join(session_directory, json_message['session_name']) + '.json', 'r') as infile:
                    self.write_message(json.load(infile))
            elif json_message['kind'] == 'session_list':
                session_names = [os.path.splitext(basename(filename))[0] for filename in glob.glob("sessions/*.json")]
                json_session_list = json.dumps({'kind':'session_list', 'sessions': session_names})
                self.write_message(json_session_list)
            else:
                print(u"Badly formatted JSON package received from client: {0}"
                      .format(message))

        except ValueError:
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
