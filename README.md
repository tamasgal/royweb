royweb
======

Restless Oyster online monitor.

## Getting the latest version
The original git-repository is on [GitHub](http://github.com): <http://github.com/tamasgal/royweb>.

## Installing dependencies
ROyWeb is based on Python and needs two additional libraries: [Tornado](http://www.tornadoweb.org) and daemon.

### Setting up an independent python environment
The easiest way to set up a working environment is to install [virtualenv](http://virtualenv.readthedocs.org/en/latest/virtualenv.html#installation) first (if not already installed). Grab the latest version via:

    > curl -O https://pypi.python.org/packages/source/v/virtualenv/virtualenv-X.X.tar.gz
    > tar xvfz virtualenv-X.X.tar.gz
    > cd virtualenv-X.X
    > python virtualenv.py royweb

This will install a freshly new configured python in its own directory within the virtualenv folder.
From now on, you can simply activate the virtual environment via

    > cd royweb
    > source bin/activate

and mess around with it.
Btw. I recommend having a look at [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/), which is a great addition to the already awesome virtualenv tool.

### Installing tornado and daemon
This is easy as pip is:

    > pip install tornado
    > pip install daemon

or simply use the `requirements.txt` file to install all dependencies automatically:

    > pip install -r requirements.txt

### Done

From now on, every time you want to start a ROyWeb server, activate the virtual environment and you're ready to go.


## Simple usage
To start the web server with the default configuration, use the `run_royweb.py` script.
The server will listen to incoming client connections on port `8080` and start a UDP-listener on port 9999 for parameter monitoring.

    > ./run_royweb.py 
    Starting ROyWeb with PID 25674
    Running on 127.0.0.1:8080
    Listening for UDP data on port 9999

## Send test data
To send some live test data to the web server, run the `send_udp.py` script. This will generate some random parameters and distributes them via UDP to the default port `9999` on localhost.

    > ./send_udp.py 
    UDP target IP: 127.0.0.1
    UDP target port: 9999

