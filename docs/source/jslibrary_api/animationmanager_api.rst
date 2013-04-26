.. index::
    single: AnimationManager

.. highlight:: javascript

---------------------------
The AnimationManager Object
---------------------------

Provides loading and managing of keyframe animations.

This object keeps a map of loaded animations stored by name, allowing reuse and avoiding duplication.

**Required scripts**

The AnimationManager object requires::

    /*{{ javascript("jslib/animationmanager.js") }}*/

It also requires that a :ref:`MathDevice <tz_createmathdevice>` has been created before calling the AnimationManager constructor.

Constructor
===========

.. index::
    pair: AnimationManager; create

`create`
--------

**Summary**

**Syntax** ::

    var animationManager = AnimationManager.create(errorCallback);

``errorCallback`` (Optional)
    The callback function to be called when any error occurs during manager operations.


Method
======


.. index::
    pair: AnimationManager; loadData

`loadData`
----------

**Summary**

Requests loading of animation data from an already requested JSON object. Any animations stored in the ``animations``
property of the data object passed in will be stored in the animation manager by their dictionary name.

**Syntax** ::

    animationManager.loadData(jsonData);

``jsonData``
    An object which has already been loaded via asynchronous requests.


.. index::
    pair: AnimationManager; loadFile

`loadFile`
----------

**Summary**

Requests loading of animation data from an asset with a given path. Any animations stored in the ``animations``
property of the asset loaded will be stored in the animation manager by their dictionary name. The assets will be
loaded asynchronously and may not be immediately available via the ``get`` method.

**Syntax** ::

    animationManager.loadFile(assetPath);

``assetPath``
    The path to the asset containing the animations to be loaded.


.. index::
    pair: AnimationManager; get

`get`
-----

**Summary**

Returns the animation stored on the manager with the given name.

**Syntax** ::

    var animation = animationManager.get(name);

``name``
    The name of the animations to get.

Returns undefined if the named animation is not yet loaded.


.. index::
    pair: AnimationManager; getAll

`getAll`
--------

**Summary**

Returns a dictionary of all the animations stored in the manager.

**Syntax** ::

    var animations = animationManager.getAll();

Returns the dictionary of animations, an empty dictionary will be returned if no animations are loaded.


.. index::
    pair: AnimationManager; remove

`remove`
--------

**Summary**

Deletes the animation stored with the given name.

**Syntax** ::

    animationManager.remove(name);

``name``
    The name of the animation to remove.


`setPathRemapping`
------------------

**Summary**

Enables remapping of loading paths.

The remapping only affects the loading URLs.
The animation will be stored under the names stored inside the requested data object.

**Syntax** ::

    animationManager.setPathRemapping(mappingDictionary, prefix);

    // example usage:
    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        animationManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
    };
    mappingTable = TurbulenzServices.createMappingTable(gameSession,
                                                        mappingTableReceived);

``mappingDictionary``
    A JavaScript object.
    A mapping table dictionary that can be used to map the game's logical asset paths to physical paths.

``prefix``
    A string that will be appended to all paths, useful for global redirections.

Both arguments for ``setPathRemapping`` are properties on the :ref:`MappingTable <mappingtable>` object.

.. TODO To deploy a game you should use create a MappingTable and use the setMappingTable function.


Properties
==========

.. index::
    pair: AnimationManager; version

`version`
---------

**Summary**

The version number of the AnimationManager implementation.

**Syntax** ::

    var versionNumber = animationManager.version;
