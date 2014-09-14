.. _install:

Installing ROyWeb
=================

Getting the latest version
--------------------------
The original git-repository is on `GitHub <http://github.com>`_:
https://github.com/tamasgal/royweb

Installing dependencies
-----------------------
ROyWeb is based on Python and needs two additional libraries: `Tornado <http://www.tornadoweb.org>`_ and daemon.

Setting up an independent Python environment via virtualenv
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
The easiest way to set up a working environment is to install `virtualenv <http://virtualenv.readthedocs.org/en/latest/virtualenv.html#installation>`_ first (if not already installed). Grab the latest version via::

    curl -O https://pypi.python.org/packages/source/v/virtualenv/virtualenv-X.X.tar.gz
    tar xvfz virtualenv-X.X.tar.gz
    cd virtualenv-X.X
    python virtualenv.py royweb

This will install a freshly new configured python in its own directory within the virtualenv folder.
From now on, you can simply activate the virtual environment via::

    cd royweb
    source bin/activate

and mess around with it.
Btw. I recommend having a look at `virtualenvwrapper <http://virtualenvwrapper.readthedocs.org/en/latest/>`_, which is a great addition to the already awesome virtualenv tool.


Easier sandboxing via virtualenvwrapper
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
As I already wrote, I recommend ``virtualenvwrapper`` to manage your Python environments, which of course you can install via ``pip``::

    pip install virtualenvwrapper

And then follow the instructions to setup your virtualenvwrapper environment. It is very simple, you only have to put a line into your shell startup script (``.bashrc`` or whatever) and define a working directory and another directory to store your virtual envorionments.
After that, the workflow to create an independent Python environment is::

    mkproject royweb
    pip install royweb

To exit the environment simply type::

    deactivate

And to switch back anytime, use the ``workon`` command::

    workon royweb

This way you can create a bunch of virtual envrionemnts which are completely clean and independent from each other.


Installing the dependencies when using the source
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
If you want to work on the develeopment version, you'll need to install Tornado and daemon.
This is easy as pip is::

    pip install tornado
    pip install daemon

You can also use the ``requirements.txt`` file to install all dependencies automatically::

    pip install -r requirements.txt

From now on, every time you want to start a ROyWeb server, activate the virtual environment and you're ready to go.

