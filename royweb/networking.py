# coding=utf-8
# Filename: networking.py
# pylint: disable=E0611,W0611
"""
Networking stuff for UDP and WebSocket communication.

"""
__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('WebSocketBroadcaster', 'Clients')

import sys
import socket

from tools import Singleton

class WebSocketBroadcaster(object):
    """Receives data from UDP and redistributes them via WebSockets."""
    def __init__(self, server, port, clients):
        """Bind to UDP port."""
        self.is_running = True
        UDP_IP = server
        UDP_PORT = port 
        self.clients = clients
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((UDP_IP, UDP_PORT))

    def run(self):
        """Listen for UDP packets and immediately send them to the clients."""
        while self.is_running == True:
            data, addr = self.sock.recvfrom(65535)
            #print("Received {0} bytes of data.".format(sys.getsizeof(data)))
            for client in self.clients:
                client.write_message(data)

    def stop(self):
        """Stop the port listener."""
        self.is_running = False


@Singleton
class Clients(list):
    pass

