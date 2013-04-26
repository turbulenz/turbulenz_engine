.. index::
    single: SoundManager

.. _soundmanager:

.. highlight:: javascript

-------------------------
The SoundManager Object
-------------------------

Provides loading and managing of sounds.

This object keeps a map of requested sounds by path in order to avoid duplicates,
it also provides a default sound for those cases where the required one is missing or still not yet loaded.

Loading of sounds is an asynchronous operation,
so the application should periodically check for the manager to finish all the pending requests
before updating all its sound references.

Remapping functionality is also supported by the manager.

**Required scripts**

The SoundManager object requires::

    /*{{ javascript("jslib/soundmanager.js") }}*/
    /*{{ javascript("jslib/observer.js") }}*/

Constructor
===========

.. index::
    pair: SoundManager; create

.. _soundmanager_create:

`create`
--------

**Summary**

**Syntax** ::

    var soundManager = SoundManager.create(soundDevice, requestHandler, defaultSound, errorCallback);

``soundDevice``
    The soundDevice object to be used to create and load the individual sounds.

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``defaultSound`` (Optional)
    The default sound to be used when the required one is not available.
    Defaults to an annoying long beep to help identify missing sounds.

``errorCallback`` (Optional)
    The callback to be called when any error occurs during manager operations.


Method
======


.. index::
    pair: SoundManager; load

.. _soundmanager_load:

`load`
------

**Summary**

Requests loading of a sound by path.

**Syntax** ::

    var onload = function onloadFn(sound) {};
    var sound = soundManager.load(path, uncompress, onload);

``path``
    The URL of the sound to be loaded.

``uncompress`` (Optional)
    The SoundDevice to decompress all the sound data in memory.
    Increases memory usage but removes the CPU streaming costs, not required unless playing plenty of compressed sounds
    at the same time.

``onload`` (Optional)
    The callback function to call once the sound has loaded.
    This function is called asynchronously.

Returns the requested :ref:`Sound <sound>` if already loaded, the default sound otherwise.
The callback function is called with the loaded :ref:`Sound <sound>` as an argument.

.. index::
    pair: SoundManager; get

`get`
-----

**Summary**

Returns the loaded sound stored with the given path.

**Syntax** ::

    var sound = soundManager.get(path);

``path``
    The path of the sound to get.

Returns the requested :ref:`Sound <sound>` object or the default sound if the requested one is missing or not yet loaded.


.. index::
    pair: SoundManager; map

`map`
-----

**Summary**

Alias one sound to another name.

**Syntax** ::

    soundManager.map(alias, name);

``name``
    The name to be mapped.

``alias``
    The new alias for ``name``.


.. index::
    pair: SoundManager; remove

`remove`
--------

**Summary**

Deletes the sound stored with the given path.

**Syntax** ::

    soundManager.remove(path);

``path``
    The path of the sound to remove.


.. index::
    pair: SoundManager; reload

`reload`
--------

**Summary**

Reloads the sound stored with the given path.
Useful when the sound has been updated on the server and the application wants to retrieve the new one.
The reloading of the sound will be done asynchronously.

**Syntax** ::

    soundManager.reload(path);

``path``
    The path of the sound to be reloaded.


.. index::
    pair: SoundManager; reloadAll

`reloadAll`
-----------

**Summary**

Reloads all the stored sounds.
Useful when many sounds have been updated on the server and the application wants to retrieve the new ones.

This operation may take a long time to complete, the reloading of the sound will be done asynchronously.

**Syntax** ::

    soundManager.reloadAll();


.. index::
    pair: SoundManager; getNumPendingSounds

`getNumPendingSounds`
-----------------------

**Summary**

Returns the number of sounds requested but still to be loaded.

**Syntax** ::

    var numPendingSounds = soundManager.getNumPendingSounds();
    if (numPendingSounds)
    {
        keepWaiting();
    }


.. index::
    pair: SoundManager; isSoundLoaded

`isSoundLoaded`
-----------------

**Summary**

Returns true if a sound is not pending.

**Syntax** ::

    if (soundManager.isSoundLoaded(path))
    {
        noMoreWaiting();
    }

``path``
    The path of the sound to be checked.


.. index::
    pair: SoundManager; isSoundMissing

`isSoundMissing`
------------------

**Summary**

Returns true if a sound is missing.

**Syntax** ::

    if (soundManager.isSoundMissing(path))
    {
        errorWhilstLoading();
    }

``path``
    The path of the sound to be checked.


.. index::
    pair: SoundManager; setPathRemapping

`setPathRemapping`
------------------

**Summary**

Enables remapping of loading paths.

The remapping only affects the loading URLs,
the sound will be stored under the original path it was requested with.

**Syntax** ::

    soundManager.setPathRemapping(mappingDictionary, prefix);

    // example usage:
    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        soundManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
    };
    mappingTable = TurbulenzServices.createMappingTable(gameSession,
                                                        mappingTableReceived);

``mappingDictionary``
    A remapping table that can be used to redirect specific paths.

``prefix``
    A string that will be appended to all paths, useful for global redirections.

If a remapping is required to find the shaders then this must be called before the renderer is created.
If the remapping is done afterwards then some shaders may not load correctly.

Both arguments for ``setPathRemapping`` are properties on the :ref:`MappingTable <mappingtable>` object.


.. index::
    pair: SoundManager; beep

`beep`
------------------

**Summary**

Generates a `beep` sound.

**Syntax** ::

    var beepSound = soundManager.beep(frequency, wavefrequency, length);

``frequency``
    The number of samples per second of the beep sound.

``wavefrequency``
    The frequency of the beep sound wave.

``length``
    The length in seconds of the beep sound.

The beep used as default sound is generated with ``beep(4000, 400, 1)``.


.. index::
    pair: SoundManager; destroy

`destroy`
---------

**Summary**

Releases the SoundManager object and all the resources it allocated;
the object and the sounds it referenced will be invalid after the method is called.

**Syntax** ::

    soundManager.destroy();


Properties
==========

.. index::
    pair: SoundManager; version

`version`
---------

**Summary**

The version number of the SoundManager implementation.

**Syntax** ::

    var versionNumber = soundManager.version;
