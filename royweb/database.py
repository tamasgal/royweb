# coding=utf-8
# Filename: database.py
# pylint: disable=E0611,W0611
"""
Database helper.

"""
from __future__ import print_function

__author__ = 'Tamas Gal'
__email__ = 'tamas.gal@physik.uni-erlangen.de'
__all__ = ('DBManager')

import sqlite3 as lite


class DBManager(object):
    def __init__(self, db_file):
        self.connection = lite.connect(db_file, check_same_thread=False)
        with self.connection:
            cursor = self.connection.cursor()
            cursor.execute("CREATE TABLE IF NOT EXISTS "
                           "Parameters(Id INTEGER PRIMARY KEY,"
                                      "Type TEXT, Value REAL, Timestamp BLOB)")

    def store(self, data):
        print(data)
        with self.connection:
            cursor = self.connection.cursor()
            cursor.execute("INSERT INTO Parameters(Type, Value, Timestamp)"
                                        "VALUES('{0}', '{1}', '{2}');"
                           .format(data['type'], data['value'], data['time']))

    def disconnect(self):
        self.connection.close()
