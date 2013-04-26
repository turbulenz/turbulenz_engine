.. index::
    single: Sound

.. highlight:: javascript

.. _sound:

----------------
The Sound Object
----------------

A Sound object contains sound samples ready for playback from a Source.

Constructor
===========

A Sound object can be constructed with :ref:`SoundDevice.createSound <sounddevice_createsound>`.


Methods
=======


.. index::
    pair: Sound; destroy

`destroy`
---------

**Summary**

Releases the Sound resources; the object will be invalid after the method is called.

**Syntax** ::

    sound.destroy();


Properties
==========

.. index::
    pair: Sound; name

`name`
------

**Summary**

The name of the sound.
Must be specified on creation of the sound, unless a ``src`` is specified in which case the name will be the ``src`` e.g. "sounds/duck.ogg".
Sounds loaded from a sound archive will take the filename path specified in the archive directory listing.

**Syntax** ::

    var name = sound.name;

    OR

    sound.name = "Sound1";


.. index::
    pair: Sound; frequency

`frequency`
-----------

**Summary**

The number of samples per second.

**Syntax** ::

    var frequency = sound.frequency;

.. note:: Read Only


.. index::
    pair: Sound; channels

`channels`
----------

**Summary**

The number of channels, 1 means mono, 2 stereo, etc.

**Syntax** ::

    var numChannels = sound.channels;

.. note:: Read Only


.. index::
    pair: Sound; bitrate

`bitrate`
---------

**Summary**

The number of bits per second. This number is the result of calculating:
samples per second * bits per sample * number of channels.

**Syntax** ::

    var bitrate = sound.bitrate;

.. note:: Read Only


.. index::
    pair: Sound; length

`length`
--------

**Summary**

The duration of the sound in seconds.

**Syntax** ::

    var length = sound.length;

.. note:: Read Only


.. index::
    pair: Sound; compressed

`compressed`
------------

**Summary**

True if the sampling data is in a compressed form, false otherwise.
Playback of compressed sounds increases CPU usage but the storage of the sampling data requires far less memory.

**Syntax** ::

    var compressed = sound.compressed;

.. note:: Read Only
