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

JSON message format
-------------------
The UDP packet which contains the data to plot later on should only include a stringified JSON dump in its UDP data field. The required JSON structure  is::

    {
        'kind': 'parameter',
        'type': 'parameter_short_name',
 	'unit': 'desired_unit',
        'description': 'This is longer description of the parameter.',
	'value': 'the_value'
    }

The ``kind`` field is required and should always be ``"parameter"``. The value can be of any type, but it will will determine which types of graphs you can plot. For ``TimePlots`` and ``Histograms``, simply use a ``string`` and it will be converted to float on the fly.

