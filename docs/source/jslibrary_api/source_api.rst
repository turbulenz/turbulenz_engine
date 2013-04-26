.. index::
    single: Source

.. highlight:: javascript

.. _source:

-----------------
The Source Object
-----------------

A Source object represents a 3D sound emitter.

Constructor
===========

A Source object can be constructed with :ref:`SoundDevice.createSource <sounddevice_createsource>`.

Methods
=======

.. index::
    pair: Source; play

`play`
------

**Summary**

Play the given sound on the source.

**Syntax** ::

    source.play(sound, position);

``sound``
    The Sound object with the sampling data to be played.

``position`` (Optional)
    The position in seconds where to start playing.


.. index::
    pair: Source; stop

`stop`
------

**Summary**

Stop the sound playback.
If you pause a source you have to resume it before stopping.

**Syntax** ::

    source.stop();

Returns true if the source was playing a sound, false otherwise.


.. index::
    pair: Source; pause

`pause`
-------

**Summary**

Pause the sound playback.

**Syntax** ::

    source.pause();

Returns true if the source was playing a sound, false otherwise.


.. index::
    pair: Source; resume

`resume`
--------

**Summary**

Resume the sound playback.

**Syntax** ::

    source.resume(position);

``position`` (Optional)
    The position in seconds where to resume playing.

Returns true if the source was paused, false otherwise.

.. index::
    pair: Source; rewind

`rewind`
--------

**Summary**

Rewind the playback position to the start of the sampling data.

**Syntax** ::

    source.rewind();

Returns true if the playback position was not already at the start of the sampling data, false otherwise.


.. index::
    pair: Source; clear

`clear`
-------

**Summary**

Stop playback and reset the source to be ready to be released.

**Syntax** ::

    source.clear();

.. index::
    pair: Source; setAuxiliarySendFilter

.. _setAuxiliarySendFilter:

`setAuxiliarySendFilter`
------------------------

**Summary**

Sets the SoundEffectSlot and SoundFilter on the Source object for a specified Auxiliary Send index.
If the Source object doesn't have an Auxiliary Send at the index specified the function will return false.
When setting a SoundEffectSlot or SoundFilter on a valid Auxiliary Send index, the previous SoundEffectSlot or SoundFilter is replaced.

**Syntax** ::

    // Enable effectSlot on Auxiliary Send index using filter
    source.setAuxiliarySendFilter(index, effectSlot, filter);

    or

    // Disable Auxiliary Send index
    source.setAuxiliarySendFilter(index, null, null);

    or

    // Enable effectSlot on Auxiliary Send index (without a filter)
    source.setAuxiliarySendFilter(index, effectSlot, null);

``index``
    The index of the Auxiliary Send to output via the SoundFilter to the SoundEffectSlot.
    Property *soundDevice.alcMaxAuxiliarySends* specifies the maximum number of Auxiliary Send outputs per Source.
    i.e. if alcMaxAuxiliarySends is 2, then index can be 0 or 1.

``effectSlot``
    The SoundEffectSlot object that contains the effect to apply to the source.
    Use 'null' to disable.

``filter``
    The SoundFilter object that the source output should pass through before being processed by the SoundEffectSlot.
    Use 'null' to disable.

Returns true if the operation completed successfully and returns false if an error occurred.

.. WARNING::

    You must set the output of all accessed Auxiliary Send and Direct outputs to 'null', before attempting to call the TurbulenzEngine.flush() function.
    Failing to do so can cause errors in the destruction of the sound objects.

.. index::
    pair: Source; setDirectFilter

.. _setDirectFilter:

`setDirectFilter`
-----------------

**Summary**

Sets the SoundFilter on the Source object for the direct filter output.
When setting a SoundFilter on a direct filter, the previous SoundFilter is replaced.
SoundEffectSlot Objects cannot be set on the direct filter.

**Syntax** ::

    // Enable SoundFilter
    source.setDirectFilter(filter);

    or

    // Disable SoundFilter
    source.setDirectFilter(null);

``filter``
    The SoundFilter object that the source output should pass through before being processed by the mixer.
    Use 'null' to disable.

Returns true if the operation completed successfully and returns false if an error occurred.

.. WARNING::

    You must set the output of all accessed Auxiliary Send and Direct outputs to 'null', before attempting to call the TurbulenzEngine.flush() function.
    Failing to do so can cause errors in the destruction of the sound objects.


.. index::
    pair: Source; destroy

`destroy`
---------

**Summary**

Releases the Source resources; the object will be invalid after the method is called.

**Syntax** ::

    source.destroy();


Properties
==========

.. index::
    pair: Source; position

`position`
----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the current location of the source.

**Syntax** ::

    // Get the current position
    var position = source.position;

    // Move it to the origin
    source.position = mathDevice.v3(0, 0, 0);

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the Source's internal storage, and querieng the property generates a new vector and copies the values
    from the Source's internal storage. ::

        // THIS WILL NOT WORK!!!
        source.position[1] = 4;

        // THIS WILL NOT WORK!!!
        VMath.v3Copy(newPos, source.position);


.. index::
    pair: Source; velocity

`velocity`
----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the velocity of the source.

**Syntax** ::

    // Get the current velocity
    var velocity = source.velocity;

    // Double it
    source.velocity = mathDevice.v3Add(velocity, velocity);

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the Source's internal storage, and querieng the property generates a new vector and copies the values
    from the Source's internal storage. ::

        // THIS WILL NOT WORK!!!
        source.velocity[1] = 4;

        // THIS WILL NOT WORK!!!
        VMath.v3Copy(newPos, source.velocity);


.. index::
    pair: Source; direction

`direction`
-----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the direction the source is emitting the sound to.

**Syntax** ::

    // Get the current direction
    var direction = source.direction;

    // Change it
    source.direction = mathDevice.v3Build(0, 1, 0);

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the Source's internal storage, and querieng the property generates a new vector and copies the values
    from the Source's internal storage. ::

        // THIS WILL NOT WORK!!!
        source.direction[1] = 4;

        // THIS WILL NOT WORK!!!
        VMath.v3Copy(newPos, source.direction);



.. index::
    pair: Source; gain

`gain`
------

**Summary**

The scalar gain (volume amplification) applied to the sound.

**Syntax** ::

    // Get the current gain
    var gain = source.gain;

    // Half the volume
    source.gain = 0.5;


.. index::
    pair: Source; minDistance

`minDistance`
-------------

**Summary**

The minimum distance to the listener from which the linear volume attenuation will start to take effect.

**Syntax** ::

    // Get the current value
    var minDistance = source.minDistance;

    // Double it
    source.minDistance = (2.0 * minDistance);


.. index::
    pair: Source; maxDistance

`maxDistance`
-------------

**Summary**

The maximum distance to the listener after which the linear attenuation will set the volume to zero.

**Syntax** ::

    // Get the current value
    var maxDistance = source.maxDistance;

    // Double it
    source.maxDistance = (2.0 * maxDistance);


.. index::
    pair: Source; rollOff

`rollOff`
---------

**Summary**

The amount that the sound will drop off as by the inverse square law of the distance to the listener.

**Syntax** ::

    // Get the current value
    var rollOff = source.rollOff;

    // Double it
    source.rollOff = (2.0 * rollOff);


.. index::
    pair: Source; relative

`relative`
----------

**Summary**

True if the properties `position`, `velocity` and `direction` are expressed as relative to the listener,
false if they are absolute values.

**Syntax** ::

    // Get the current value
    var relative = source.relative;

    // Set to relative
    source.relative = true;


.. index::
    pair: Source; looping

`looping`
---------

**Summary**

True if the sound should start playing again from the start when reaching the end of the sampling data,
false if the sound should stop when reaching the end.

**Syntax** ::

    // Get the current value
    var looping = source.looping;

    // Set to loop
    source.looping = true;


.. index::
    pair: Source; pitch

`pitch`
-------

**Summary**

The pitch to be applied to the sound when mixing.

**Syntax** ::

    // Get the current value
    var pitch = source.pitch;

    // Change it
    source.pitch = 2.0;


.. index::
    pair: Source; playing

`playing`
---------

**Summary**

True if the source is playing the sound right now, false otherwise.

**Syntax** ::

    if (source.playing)
    {
    }

.. note:: Read Only


.. index::
    pair: Source; paused

`paused`
--------

**Summary**

True if the source has been paused, false otherwise.

**Syntax** ::

    if (source.paused)
    {
    }

.. note:: Read Only


.. index::
    pair: Source; tell

`tell`
------

**Summary**

The current playback position in seconds, zero if playback has not started.

**Syntax** ::

    var currentPlaybackPosition = source.tell;

.. note:: Read Only
