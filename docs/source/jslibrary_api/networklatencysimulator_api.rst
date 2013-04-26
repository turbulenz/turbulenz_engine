.. _networklatencysimulator:

.. highlight:: javascript

.. index::
    single: NetworkLatencySimulator

----------------------------------
The NetworkLatencySimulator Object
----------------------------------

Provides the ability to locally simulate network latency without the need for third party network weather simulators.
This allows different clients running on the same host machine to be configured to have different latencies to test various scenarios,
e.g. one large latency client connected other lower latency clients.

While this is a useful developer tool it should complement,
and not replace, testing remotely on https://hub.turbulenz.com, and testing with multiple independent client machines.

**Required scripts** ::

    /*{{ javascript("jslib/networklatencysimulator.js") }}*/

Constructor
===========

.. index::
    pair: NetworkLatencySimulator; create

`create`
--------

**Summary**

Creates and returns a NetworkLatencySimulator object.

This modifies Utilities.ajax() to delay its messages.

Individual MultiPlayerSession objects can be added using 'addMultiplayerSession'.

**Syntax** ::

	var behavior = NetworkLatencyBehavior.create({latency : 50,
                                                    delayPeriod : 1000,
                                                    delayDuration : 100});

	var simulator = NetworkLatencySimulator.create(behavior);

``behavior``
    An object that implements the :ref:`NetworkLatencyBehavior <networklatencybehavior>` interface.

Methods
=======

.. index::
    pair: NetworkLatencySimulator; addMultiplayerSession

.. _networklatencysimulator_addmultiplayersession:

`addMultiplayerSession`
-----------------------

**Summary**

Modifies the :ref:`MultiplayerSession <multiplayersession>` object to delay its messages.

**Syntax** ::

    simulator.addMultiplayerSession(multiplayerSession);
