.. _sounddevice:

.. highlight:: javascript

.. index::
    single: SoundDevice

----------------------
The SoundDevice Object
----------------------

Provides 3D sound support using OpenAL.

Constructor
===========

A SoundDevice object can be constructed with :ref:`TurbulenzEngine.createSoundDevice <tz_createsounddevice>`.

Methods
=======

.. index::
    pair: SoundDevice; createSource

.. _sounddevice_createsource:

`createSource`
--------------

**Summary**

Creates a sound source.

**Syntax** ::

    var source = soundDevice.createSource({
        position : mathDevice.v3Build(0, 0, 0),
        direction : mathDevice.v3Build(1, 0, 0),
        velocity : mathDevice.v3Build(0, 0, 0),
        gain: 1.0,
        minDistance: 1.0,
        maxDistance: 100.0,
        rollOff: 1.0,
        relative: false,
        looping: false,
        pitch: 1.0
    });

Returns a :ref:`Source <source>` object.

.. index::
    pair: SoundDevice; createSound

.. _sounddevice_createsound:

`createSound`
-------------

**Summary**

Creates or loads a :ref:`Sound <sound>`.
Returns immediately.

The parameter ``name`` must be specified e.g. "Duck01", unless a ``src`` is specified in
which case the name will be the ``src`` e.g. "sounds/duck.ogg" if ``name`` is not explicitly specified.

**Syntax** ::

    var soundLoaded = function soundLoadedFn(loadedSound, status)
    {
        if (loadedSound)
        {
            log("Sound loaded:");
            log("Name: " + loadedSound.name);
            log("Channels: " + loadedSound.channels);
            log("Frequency: " + loadedSound.frequency);
            log("Bitrate: " + loadedSound.bitrate);
            log("Length: " + loadedSound.length);
            log("Compressed: " + loadedSound.compressed);

            source.play(loadedSound);
        }
    };

    soundDevice.createSound({
        src : "sounds/bomb.ogg",
        uncompress: false,
        onload : soundLoaded
    });

    // For a procedural sound (without a src parameter)
    soundDevice.createSound({
        name : "Beep1",
        data   : SoundManager.prototype.beep(4000, 400, 1),
        channels : 1,
        frequency : 4000,
        onload : function (proceduralSound)
        {
            defaultSound = proceduralSound;
        }
    });

``src``
    A JavaScript string.
    The URL of the sound to load.

``uncompress``
    A boolean.
    This tells the creation function whether or not to uncompressed the file on load.
    This will only be used if the file can be uncompressed.
    Once a file has been loaded, test the *compressed* flag to see if the file has been successfully uncompressed.

``onload``
    A JavaScript function.
    Called once the sound has loaded.
    This function is always called asynchronously.

``loadedSound``
    A :ref:`Sound <sound>` object or ``null``.

``status``
    A JavaScript number.
    The HTTP response status code.
    For example, status ``200`` is ``OK``.
    See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10 for more information.

Returns a :ref:`Sound <sound>` object or ``null`` if parameters are missing or incorrect.
For more information on the parameters see the :ref:`Sound <sound>` object.

.. note::
    You should manage the response status codes correctly.
    See the :ref:`RequestHandler <requesthandler>` for handling connection and service busy issues.
    Alternatively, use the :ref:`SoundManager <soundmanager>` to load sounds.

.. _sounddevice_loadsoundsarchive:

`loadSoundsArchive`
-------------------

**Summary**

Loads :ref:`Sounds <sound>` from an archive if the sound files are supported by the Turbulenz Engine.
Returns immediately.

Supported parameters:
    * The ``src`` is the path to the archive to load sounds from.
    * The ``onsoundload`` function is called for each successfully loaded sound from the archive.
    * The ``onload`` function is called when the whole archive has been successfully read.
    * If ``uncompress`` is specified as ``true``, each compressed sound in the archive will be uncompressed on load,
      otherwise they will be left in the state they were added to the archive.

The sound will take the name given to it as part of the archive directory structure, e.g. "bomb.ogg" or "sound/duck.wav".

**Syntax** ::

    var sounds = [];
    var soundArchiveParams =
    {
        src : "sounds.tar",
        uncompress : true,
        onsoundload : function (sound)
        {
            if (sound)
            {
                sounds[sounds.length] = sound;
            }
        },
        onload : function (success, status)
        {
            if (!success)
            {
                alert("sounds.tar was not successfully loaded");
            }
        }
    };

    soundDevice.loadSoundsArchive(soundArchiveParams);

``src``
    A JavaScript string.
    The URL of texture archive to load.
    The source must be a TAR file.

``onsoundload``
    A JavaScript function.
    Called for each :ref:`Sound <sound>` object in the archive.
    This function is always called asynchronously.

``sound``
    A :ref:`Sound <sound>` object.

``onload``
    A JavaScript function.
    Called once the entire archive has been loaded.
    This function is always called asynchronously.

``success``
    A JavaScript boolean.

``status``
    A JavaScript number.
    The HTTP response status code.
    For example, status ``200`` is ``OK``.
    See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10 for more information.

Returns ``true`` if the parameters are valid and reading of the archive has started.

.. note::
    You should manage the response status codes correctly.
    See the :ref:`RequestHandler <requesthandler>` for handling connection and service busy issues.
    Alternatively, use the :ref:`SoundManager <soundmanager>` to load sounds.

.. index::
    pair: SoundDevice; createEffect

.. _sounddevice_createeffect:

`createEffect`
--------------

**Summary**

Creates a SoundEffect object from the parameters specified.
If an effect property is not passed as a parameter, the effect will take the default property value.

**Syntax** ::

    var effect = soundDevice.createEffect({
        name : "HallwayReverb01",
        type : "Reverb",
        delay : 0.15
    });

**Common Parameters**

``name``
    The name of the effect to be created.

``type``
    The type of the effect to create.
    If the type is unsupported, the createEffect function will fail to create the effect.

When an effect has been created, it takes on the properties of the type specified as an argument.
A list of the properties for the available effects can be found in the :ref:`SoundEffect <soundeffect>` object documentation.

:ref:`Reverb Parameters <sound_effect_reverb_properties>`

:ref:`Echo Parameters <sound_effect_echo_properties>`

Returns a :ref:`SoundEffect <soundeffect>` object if the parameters are correct.
Returns ``null`` if the type is not supported or if any of the parameters are incorrect.

.. index::
    pair: SoundDevice; createEffectSlot

`createEffectSlot`
------------------

**Summary**

Creates a SoundEffectSlot from the parameters specified.
A SoundEffectSlot allows a single effect to be applied to the output of multiple sound sources.
Once a SoundEffectSlot is created, it can be attached to the output of a source using the :ref:`setAuxiliarySendFilter <setAuxiliarySendFilter>` function on the Source object.

**Syntax** ::

    var effectSlot = soundDevice.createEffectSlot({
        effect : effect,
        gain : 0.8
    });

**Parameters**

``effect``
    The name of the effect to be used with the SoundEffectSlot.
    This value can only be set on SoundEffectSlot creation.

``gain``
    The gain applied to the output of the SoundEffectSlot.
    0.0 is muted.

Returns a :ref:`SoundEffectSlot <soundeffectslot>` object if the parameters are correct.
Returns ``null`` if the effect is not a SoundEffect object or if any of the parameters are incorrect.

.. index::
    pair: SoundDevice; createFilter

.. _sounddevice_createfilter:

`createFilter`
--------------

**Summary**

Creates a sound filter from the parameters specified.
If a filter property is not passed as a parameter, the filter will take the default property value.
Once a SoundFilter object is created, it can be attached to the output of a source using the :ref:`setAuxiliarySendFilter <setAuxiliarySendFilter>` or :ref:`setDirectFilter <setDirectFilter>` function on the Source object.

**Syntax** ::

    var filter = soundDevice.createFilter({
        name : "LowPassFilter01",
        type : "LowPass",
        gain : 0.7
    });

**Parameters**

When a filter has been created, it takes on the properties of the type specified as an argument.
A list of the properties for the available filters can be found in the :ref:`SoundFilter <soundfilter>` object documentation.

:ref:`LowPass Parameters <sound_filter_lowpass_properties>`

Returns a :ref:`SoundFilter <soundfilter>` object if the parameters are correct.
Returns ``null`` if the filter is not a SoundFilter object or if any of the parameters are incorrect.


.. index::
    pair: SoundDevice; update

.. _soundDevice_update:

`update`
--------

**Summary**

Polls the state of playing sounds and updates data accordingly.

.. note:: This method should be called frequently to avoid sound issues, for example once per rendering frame.

**Syntax** ::

    function renderFrame()
    {
        soundDevice.update();
    }

    TurbulenzEngine.setInterval(renderFrame, (1000 / 60));


.. _sounddevice_issupported:

.. index::
    pair: SoundDevice; isSupported

`isSupported`
-------------

**Summary**

Used to check if a feature is supported.

**Syntax** ::

    var feature = "FILEFORMAT_OGG";

    if (soundDevice.isSupported(feature))
    {
        // ...
    }

``feature``
    One of the following strings:

* "FILEFORMAT_OGG"
* "FILEFORMAT_MP3"
* "FILEFORMAT_WAV"

Returns a boolean.


.. _sounddevice_properties:

Properties
==========

.. index::
    pair: SoundDevice; vendor

`vendor`
--------

**Summary**

The name of the company responsible for the OpenAL sound renderer used by the sound device.

**Syntax** ::

    var vendorString = soundDevice.vendor;

.. note:: Read Only


.. index::
    pair: SoundDevice; renderer

`renderer`
----------

**Summary**

The name of the OpenAL sound renderer used by the sound device.

**Syntax** ::

    var rendererString = soundDevice.renderer;

.. note:: Read Only


.. index::
    pair: SoundDevice; version

`version`
---------

**Summary**

The version string of the OpenAL sound renderer used by the sound device.

**Syntax** ::

    var versionString = soundDevice.version;

.. note:: Read Only


.. index::
    pair: SoundDevice; deviceSpecifier

`deviceSpecifier`
-----------------

**Summary**

The specifier string for the low level sound device used by the engine sound device.

**Syntax** ::

    var deviceSpecifierString = soundDevice.deviceSpecifier;

.. note:: Read Only


.. index::
    pair: SoundDevice; extensions

`extensions`
------------

**Summary**

List of the OpenAL extensions supported by the sound renderer used by the sound device.

**Syntax** ::

    var extensionsString = soundDevice.extensions;
    if (-1 !== extensionsString.indexOf('AL_EXT_MCFORMATS'))
    {
        multiChannelSupported();
    }

.. note:: Read Only


.. index::
    pair: SoundDevice; listenerTransform

`listenerTransform`
-------------------

**Summary**

The :ref:`Matrix43 <m43object>` object representing the position and orientation of the listener in world space.
Default to the identity matrix.

**Syntax** ::

    soundDevice.listenerTransform = mathDevice.m43BuildTranslation(100, 10, 100);


.. index::
    pair: SoundDevice; listenerVelocity

`listenerVelocity`
------------------

**Summary**

The :ref:`Vector3 <v3object>` object representing the velocity of the listener in world space.
Defaults to a zero vector.

**Syntax** ::

    soundDevice.listenerTransform = mathDevice.v3Build(100, 0, 0);


.. index::
    pair: SoundDevice; listenerGain

`listenerGain`
--------------

**Summary**

Indicates the gain (volume amplification) applied to the listener.
The accepted range is 0.0 or above. A value of 1.0 means unattenuated/unchanged.
Each division by 2 equals an attenuation of -6dB. Each multiplication by 2 equals an amplification of +6dB.
A value of 0.0 is meaningless with respect to a logarithmic scale;
it is interpreted as zero volume, the channel is effectively disabled.
Defaults to 1.

**Syntax** ::

    soundDevice.listenerGain = 0.5;


.. index::
    pair: SoundDevice; frequency

`frequency`
-----------

**Summary**

Frequency for mixing output buffer, in units of Hz.
Defaults to 44100.

**Syntax** ::

    var frequency = soundDevice.frequency;

.. note:: Read Only


.. index::
    pair: SoundDevice; dopplerFactor

`dopplerFactor`
---------------

**Summary**

The OpenAL Doppler factor value.
Defaults to 1.

**Syntax** ::

    var dopplerFactor = soundDevice.dopplerFactor;


.. index::
    pair: SoundDevice; dopplerVelocity

`dopplerVelocity`
-----------------

**Summary**

The OpenAL Doppler velocity value.
Defaults to 1.

**Syntax** ::

    var dopplerVelocity = soundDevice.dopplerVelocity;


.. index::
    pair: SoundDevice; speedOfSound

`speedOfSound`
--------------

**Summary**

The OpenAL Speed of Sound value in meters per second.
Defaults to 343.3.

**Syntax** ::

    var speedOfSound = soundDevice.speedOfSound;

`alcVersion`
------------

**Summary**

The string version of OpenAL in use by the SoundDevice.

**Syntax** ::

    var alcVersion = soundDevice.alcVersion;

`alcExtensions`
---------------

**Summary**

A string list of extensions supported by the OpenAL implementation.

**Syntax** ::

    var alcExtensions = soundDevice.alcExtensions;

`alcEfxVersion`
---------------

**Summary**

The string version of the EFX extension that is supported by the OpenAL implementation.

**Syntax** ::

    var alcEfxVersion = soundDevice.alcEfxVersion;

`alcMaxAuxiliarySends`
----------------------

**Summary**

The maximum number of auxiliary sends available per source, that this implementation of OpenAL supports.

**Syntax** ::

    var alcMaxAuxiliarySends = soundDevice.alcMaxAuxiliarySends;
