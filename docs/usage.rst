.. _usage:

Using ROyWeb
=================

Integrate ROyWeb into your project
----------------------------------
There is a class ``PacketHandler``, which can be used to create and send JSON UDP packets with the required format. If you want to monitor some values in your projects, initialise a ``PacketHandler`` and use its ``send()`` method to transfer the values.
Here is an example::

    from royweb.networking import PacketHandler
    ph = PacketHandler("127.0.0.1", 9999)
    ph.send('foo', 23, 'This is a description')

That's it ;-)

