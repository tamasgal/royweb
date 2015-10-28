# coding=utf-8
# Filename: networking.py
# pylint: disable=E0611,W0611
"""
Networking stuff for UDP and WebSocket communication.

"""
from __future__ import print_function

__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('PacketHandler', 'UDPDispatcher')

import sys
import socket
import json
import time


class PacketHandler(object):
    """A reusable packet handler, which can send parameters via UDP."""
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port

    def send(self, parameter_type, value, unit, description):
        """Send a parameter with value and description to a ROyWeb"""
        message = self.json_message(parameter_type, value, unit, description)
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(message, (self.ip, self.port))

    def json_message(self, parameter_type, value, unit, description):
        """Create a json dump."""
        message = json.dumps({'kind': 'parameter',
                              'type': parameter_type,
                              'unit': unit,
                              'description': description,
                              'value': value})
        if sys.version_info >= (3, 0):
            message = bytes(message, 'UTF-8')
        return message


class UDPDispatcher(object):
    """Receives data from UDP and redistributes them via WebSockets."""
    def __init__(self, server, port, clients, db_manager):
        """Bind to UDP port."""
        self.is_running = True
        udp_ip = server
        udp_port = port
        self.clients = clients
        self.db_manager = db_manager
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((udp_ip, udp_port))

    def run(self):
        """Listen for UDP packets and immediately send them to the clients."""
        while self.is_running:
            #print("Waiting for UDP packets")
            data, addr = self.sock.recvfrom(65535)
            size = sys.getsizeof(data)
            print("Received {0} bytes of data from {1}.".format(size, addr))
            try:
                client_message = self.with_timestamp(data)
            except ValueError:
                print("Invalid JSON message received: '{0}'".format(data))
            except WebSocketClosedError:
                print("WebSocket was closed due to an error, while sending "
                      "the following JSON message: '{0}'".format(data))
            else:
                self._broadcast_data(data)
                self._insert_into_db(json.loads(self.with_timestamp(data).decode('utf-8')))

    def _insert_into_db(self, data):
        self.db_manager.store(data)

    def _broadcast_data(self, data):
        for client in self.clients:
            client.write_message(self.with_timestamp(data))

    def with_timestamp(self, json_obj):
        """Returns a copy of a json obj with an additional time property."""
        timestamp = time.time() * 1000
        decoded_data = json.loads(json_obj.decode('utf-8'))
        decoded_data['time'] = timestamp
        return json.dumps(decoded_data)

    def stop(self):
        """Stop the port listener."""
        self.is_running = False
