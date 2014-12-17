# coding=utf-8
# Filename: __init__.py
"""
The Restless Oyster online monitoring utility.

"""
from __future__ import absolute_import

from royweb.__version__ import version, version_info

__author__ = "Tamas Gal"
__copyright__ = ("Copyright 2014, Tamas Gal and the KM3NeT collaboration "
                 "(http://km3net.org)")
__credits__ = []
__license__ = "MIT"
__version__ = version
__maintainer__ = "Tamas Gal"
__email__ = "tgal@km3net.de"
__status__ = "Development"

from royweb.networking import PacketHandler
