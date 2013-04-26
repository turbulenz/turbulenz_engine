.. index::
    single: SoundFilter

.. highlight:: javascript

.. _soundfilter:

----------------------
The SoundFilter Object
----------------------

A SoundFilter object represents a filter created with a set of parameters that can be applied to the output of a source.

Constructor
===========

A SoundFilter object can be constructed with :ref:`SoundDevice.createFilter <sounddevice_createfilter>`.

Properties
==========

.. index::
    pair: SoundFilter; name

`name`
------

**Summary**

The name that identifies the filter object.

**Syntax** ::

    // Get
    var name = filter.name;

    // Set
    filter.name = "LowPass01";

.. index::
    pair: SoundFilter; type

`type`
------

**Summary**

The type of the filter, as a string.

**Syntax** ::

    // Get
    var type = filter.type;

.. note:: Read Only

.. _sound_filter_lowpass_properties:

LowPass Properties
==================

A LowPass filter is used to remove high frequency content from a signal.

`gain`
------

**Summary**

The gain applied to the LowPass filter.

**Syntax** ::

    // Get
    var gain = filter.gain;

    // Set
    filter.gain = 0.4;

``Range``

    0.0 to 1.0

``Default``

    1.0

`gainHF`
--------

**Summary**

The gain applied to the LowPass filter acting on high frequencies.

**Syntax** ::

    // Get
    var gainHF = filter.gainHF;

    // Set
    filter.gain = 0.9;

``Range``

    0.0 to 1.0

``Default``

    1.0
