royweb
======

Restless Oyster Web is an online monitoring tool. It provides a graphical user interface which can be accessed by any WebSocket-capable web browser. Although it's designed for the KM3NeT neutrino detector, it provides a simple interface to let you monitor other kinds of parameters.

Documentation
-------------

Read the docs at http://royweb.readthedocs.org


Installation
------------

I highly recommend using `virtualenv <http://virtualenv.readthedocs.org>`_ for any Python related experiments.

After you set up a seperate virtual environment, use ``pip`` to install the latest release::

    pip install royweb
    
This will automatically install all dependencies and scripts. Of course, you can also download the source and discover the code on your own.

Simple usage
------------
If you installed ``royweb`` via ``pip``, you can use the ``royweb`` script to start the web server with the default configuration. Otherwise, simply take the ``run_royweb.py``.
The server will listen to incoming client connections on port **8080** and start a UDP-listener on port **9999** for parameter monitoring::

    # royweb 
    Starting ROyWeb with PID 25674
    Running on 127.0.0.1:8080
    Listening for UDP data on port 9999


Send test data
--------------
To send some live test data to the web server, run ``royweb_test`` (if installed via ``pip``) or the ``send_udp.py`` script. This will generate some random parameters and distributes them via UDP to the default port **9999** on localhost::

    # royweb_test
    UDP target IP: 127.0.0.1
    UDP target port: 9999

Open your browser and navigate to http://127.0.0.1:8080 to see the live parameter logging.
