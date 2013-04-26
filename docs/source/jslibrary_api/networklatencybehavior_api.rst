.. _networklatencybehavior:

.. highlight:: javascript

.. index::
    single: NetworkLatencyBehavior

---------------------------------
The NetworkLatencyBehavior Object
---------------------------------

An object used by :ref:`NetworkLatencySimulator <networklatencysimulator>` to provide the latency scheduling.

It models the average latency to the server and has a delay period to simulate the spikes often seen with TCP connections due to dropped packets. It randomizes the time periods to provide more variation.

Users can implement their own behavior object if they want to simulate specific conditions.


Constructor
===========

.. index::
    pair: NetworkLatencyBehavior; create

`create`
--------

**Summary**

Creates an object to pass to the NetworkLatencySimulator.create().

**Syntax** ::

	var behavior = NetworkLatencyBehavior.create({latency : 50,
                                                    delayPeriod : 1000,
                                                    delayDuration : 100});

	var simulator = NetworkLatencySimulator.create(behavior);

``latency``
    This is the simulated latency to the server in ms. The total latencies will be:

    	Total latency (to server) = (simulated latency + actual latency to/from server) x 2

    	Total latency (to other client) = (simulated latency + actual latency to/from server) x 2 + (other client's simulated latency + other client's actual latency to/from server) x 2

    For a local server the actual latency is typically <30ms where as a remote server will depend on location and connection.

``delayPeriod``
 	This is the average time period between spikes in latency in ms.

``delayDuration``
 	This is the average length of the spike in ms.

Methods
=======

.. index::
    pair: NetworkLatencyBehavior; nextMessageDelay

.. networklatencybehavior_nextmessagedelay:

`nextMessageDelay`
-----------------------

**Summary**

Returns an integer number of ms the next message should be delayed by. Used only by NetworkLatencySimulator.

**Syntax** ::

    behavior.nextMessageDelay();
