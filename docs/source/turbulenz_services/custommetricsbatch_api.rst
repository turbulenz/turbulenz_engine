.. index::
    single: CustomMetricEventBatch

.. _custommetriceventbatch:

.. highlight:: javascript

---------------------------------
The CustomMetricEventBatch Object
---------------------------------

The CustomMetricEventBatch object provides a way to batch up groups of custom metric events allowing an application
to reduce the number of required api calls to submit it's custom metrics events.

**Required scripts**

The ``CustomMetricEventBatch`` object requires::

    /*{{ javascript("jslib/services/turbulenzservices.js") }}*/

Methods
=======

.. index::
    pair: CustomMetricEventBatch; create

.. _custommetriceventbatch_create:

`create`
-------------

**Summary**

Creates a new custom metric event batch

**Syntax** ::

    var customMetricEventBatch = CustomMetricEventBatch.create();

Each custom metric event batch can hold a number of custom metric events and can be sent to the servers using
:ref:`TurbulenzServices.sendCustomMetricEventBatch <turbulenzservices_sendcustommetriceventbatch>`

.. index::
    pair: CustomMetricEventBatch; push

.. _custommetriceventbatch_push:

`push`
-------------

**Summary**

Push a new custom metric event into a batch

**Syntax** ::

    customMetricEventBatch.push(eventKey, eventValue);

``eventKey``
    A JavaScript string.
    The event key you want to track this event occurrence against, e.g. 'levelOneCompleted'.

``eventValue``
    An JavaScript number or array of numbers.
    The event value you want to associate with this event occurrence, e.g. the time taken to complete the level.

The push method allows you to store an additional metric in the custom metric event batch to be sent to servers at
a later time.

.. index::
    pair: CustomMetricEventBatch; length

.. _custommetriceventbatch_length:

`length`
-------------

**Summary**

Get the number of custom metrics in the current batch

**Syntax** ::

    if (customMetricEventBatch.length() > maxMetricsToBatch)
    {
        TurbulenzServices.sendCustomMetricEventBatch(customMetricEventBatch, ...);
    }

The length method allows you to track how many metrics have been pushed into a batch to determine when you wish to
flush it to the servers.


.. index::
    pair: CustomMetricEventBatch; clear

.. _custommetriceventbatch_clear:

`clear`
-------------

**Summary**

Clear any stored metrics from the batch

**Syntax** ::

    customMetricEventBatch.clear();

After sending a batch of custom metric events to the servers with the
:ref:`TurbulenzServices.sendCustomMetricEventBatch <turbulenzservices_sendcustommetriceventbatch>` method the
CustomMetricEventBatch object can be reused.
Calling clear will empty the batch and reset its length to 0 allowing it to be reused, this reuse can help memory
performance avoid extra object creation.
If you wish to ignore metrics already pushed onto the batch but not sent this method can also be used to discard them.

