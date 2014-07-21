# coding=utf-8
# Filename: networking.py
# pylint: disable=E0611,W0611
"""
Networking stuff for UDP and WebSocket communication.

"""
from __future__ import print_function

__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('WebSocketBroadcaster', )

import sys
import socket


class WebSocketBroadcaster(object):
    """Receives data from UDP and redistributes them via WebSockets."""
    def __init__(self, server, port, clients):
        """Bind to UDP port."""
        self.is_running = True
        udp_ip = server
        udp_port = port
        self.clients = clients
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((udp_ip, udp_port))

    def run(self):
        """Listen for UDP packets and immediately send them to the clients."""
        while self.is_running == True:
            #print("Waiting for UDP packets")
            data, addr = self.sock.recvfrom(65535)
            size = sys.getsizeof(data)
            print("Received {0} bytes of data from {1}.".format(size, addr))
            for client in self.clients:
                client.write_message(data)

    def stop(self):
        """Stop the port listener."""
        self.is_running = False
