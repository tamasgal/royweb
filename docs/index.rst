.. ROyWeb documentation master file, created by
   sphinx-quickstart on Mon Jul 21 22:30:20 2014.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.


.. toctree::
   :maxdepth: 3

   install
   api



Welcome to ROyWeb's documentation!
==================================

Restless Oyster Web is an online monitoring tool for the KM3NeT neutrino detector. It provides a graphical user interface which can be accessed by any WebSocket-capable web browser.


Simple usage
------------
To start the web server with the default configuration, use the ``run_royweb.py`` script.
The server will listen to incoming client connections on port **8080** and start a UDP-listener on port **9999** for parameter monitoring::

    # ./run_royweb.py 
    Starting ROyWeb with PID 25674
    Running on 127.0.0.1:8080
    Listening for UDP data on port 9999

Send test data
--------------
To send some live test data to the web server, run the ``send_udp.py`` script. This will generate some random parameters and distributes them via UDP to the default port **9999** on localhost::

    # ./send_udp.py 
    UDP target IP: 127.0.0.1
    UDP target port: 9999



Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

