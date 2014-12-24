royweb
======

Restless Oyster Web is an online monitoring tool. It provides a graphical user interface which can be accessed by any WebSocket-capable web browser. Although it's designed for the KM3NeT neutrino detector, it provides a simple interface to let you monitor other kinds of parameters.
The current status is beta and is already used by many people. Thanks for you feedback so far!

.. image:: http://tamasgal.com/km3net/ROyWeb_Screenshot.png
    :alt: Restless Oyster online monitoring tool
    :width: 700
    :align: center


Future Plans
============

The main goal is to create a tool which runs a web interface and monitors several types of parameters sent via UDP packets. The visualisation of the data is done by the d3.js framework and the parameters are sent as JSON objects.
Monitoring a specific parameter should be as easy as sending a JSON object through UDP to the webserver. Any connected client should then receive the packet and the user will be able to create live graphs or histograms with the desired parameters.

Feel free to contribute or join; any kind of feedback is welcome!


Documentation
-------------

Read the docs at http://royweb.readthedocs.org

Live Demo
---------

A very basic demonstration can be seen at http://royweb.km3net.de
Please note that the server is not always running the latest build.

Installation
------------

I highly recommend using `virtualenv <http://virtualenv.readthedocs.org>`_ for any Python related experiments.

After you set up a seperate virtual environment, use ``pip`` to install the latest release::

    pip install royweb
    
This will automatically install all dependencies and scripts. Of course, you can also download the source and discover the code on your own.

Simple usage
------------
If you installed ``royweb`` via ``pip``, you can use the ``royweb`` script to start the web server with the default configuration. Otherwise, simply take the ``royweb.py`` in the ``royweb`` package.
The server will listen to incoming client connections on port **8080** and start a UDP-listener on port **9999** for parameter monitoring::

    # royweb 
    Starting ROyWeb with PID 25674
    Running on 127.0.0.1:8080
    Listening for UDP data on port 9999


Send test data
--------------
To send some live test data to the web server, run ``royweb_tester`` (if installed via ``pip``) or the ``send_udp.py`` script. This will generate some random parameters and distributes them via UDP to the default port **9999** on localhost::

    # royweb_tester
    UDP target IP: 127.0.0.1
    UDP target port: 9999

Open your browser and navigate to http://127.0.0.1:8080 to see the live parameter logging.

Integrate ROyWeb into your project
----------------------------------
There is a class ``PacketHandler``, which can be used to create and send JSON UDP packets with the required format. If you want to monitor some values in your projects, initialise a ``PacketHandler`` and use its ``send()`` method to transfer the values.
Here is an example::

    from royweb import PacketHandler
    ph = PacketHandler("127.0.0.1", 9999)
    ph.send('foo', 23, 'This is a description')

That's it ;-)
