# coding=utf-8
# Filename: test_networking.py
# pylint: disable=locally-disabled,too-many-public-methods,attribute-defined-outside-init
"""
Test for the royweb tools.

"""
from __future__ import print_function

__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('send',)

import unittest
from royweb.networking import PacketHandler


class TestPacketHandler(unittest.TestCase):

    def test_json_message(self):
        ph = PacketHandler(ip='127.0.0.1', port=1)
        message = ph.json_message("foo", 1, "desc")
        expected = ('{"kind": "parameter", '
                    '"type": "foo", "description": "desc", "value": 1}')
        assert(expected == message)

