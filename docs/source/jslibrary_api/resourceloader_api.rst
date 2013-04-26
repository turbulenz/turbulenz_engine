.. index::
    single: ResourceLoader

.. highlight:: javascript

-------------------------
The ResourceLoader Object
-------------------------

Provides loading and resolving of JSON files with external references.
Upon completion of the resolution of all references the loader calls a specified callback passing it the resolved
data.

**Required scripts**

The ResourceLoader object requires::

    /*{{ javascript("jslib/resourceloader.js") }}*/
    /*{{ javascript("jslib/vmath.js") }}*/

Constructor
===========

.. index::
    pair: ResourceLoader; create

`create`
--------

**Summary**

**Syntax** ::

    var resourceLoader = ResourceLoader.create();


Method
======


.. index::
    pair: ResourceLoader; load

.. _resourceloader_load:

`load`
------

**Summary**

Requests loading and resolving of a set of JSON data from the specified ``assetPath``.
Upon completion the ``onload`` callback supplied in the ``loadParams`` will be executed.

**Syntax** ::

    var loadParams = {
            append : true,
            nodesNamePrefix : "level1",
            shapesNamePrefix : "level1",
            requestHandler : requestHandler,
            onload : levelLoadedFn
        };

    resourceLoader.load(assetPath, loadParams);

``assetPath``
    An object which has already been loaded via asynchronous requests.

``append``
    Option to specify whether the scene data is appended to the existing loaded resources or if the
    resources already loaded should cleared first.

``nodesNamePrefix``
    Prefix to be added to all node names in the data to be loaded.

``shapesNamePrefix``
    Prefix to be added to all geometry shape names in the data to be loaded.

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``onload``
    Callback to be executed when all the loading and resolving has finished.


.. index::
    pair: ResourceLoader; resolve

.. _resourceloader_resolve:

`resolve`
---------

**Summary**

Requests loading of animation data from an asset with a given path. Any animations stored in the ``animations``
property of the asset loaded will be stored in the animation manager by their dictionary name. The assets will be
loaded asynchronously and may not be immediately available via the ``get`` method.

**Syntax** ::

    var params = {
            data : jsonData,
            append : true,
            nodesNamePrefix : "level1",
            shapesNamePrefix : "level1",
            requestHandler : requestHandler,
            onload : levelLoadedFn
        };

    resourceLoader.resolve(params);

``append``
    Option to specify whether the scene data is appended to the existing loaded resources or if the
    resources already loaded should cleared first.

``data``
    The scene data read from a JSON file, which contains references to be resolved.

``nodesNamePrefix``
    Prefix to be added to all node names in the data to be loaded.

``shapesNamePrefix``
    Prefix to be added to all geometry shape names in the data to be loaded.

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``onload``
    Callback to be executed when all the loading and resolving has finished.

.. index::
    pair: ResourceLoader; clear

`clear`
-------

**Summary**

Clears the contents of the resource loader allowing a new set of resources to be loaded.

**Syntax** ::

    resourceLoader.clear();


Properties
==========

.. index::
    pair: ResourceLoader; version

`version`
---------

**Summary**

The version number of the ResourceLoader implementation.

**Syntax** ::

    var versionNumber = resourceLoader.version;
