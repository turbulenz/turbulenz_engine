.. index::
    single: ShaderManager

.. highlight:: javascript

.. _shadermanager:

------------------------
The ShaderManager Object
------------------------

Provides loading and managing of :ref:`shaders <shader>`.

This object keeps a map of requested shaders by path in order to avoid duplicates.
It also provides a default shader for those cases where the required one is missing or still not yet loaded.

Loading of shaders is an asynchronous operation,
so the application should periodically check for the manager to finish all the pending requests
before updating all its shader references.

Remapping functionality is also supported by the manager.

**Required scripts**

The ShaderManager object requires::

    /*{{ javascript("jslib/shadermanager.js") }}*/
    /*{{ javascript("jslib/observer.js") }}*/

Constructor
===========

.. index::
    pair: ShaderManager; create

.. _shadermanager_create:

`create`
--------

**Summary**

**Syntax** ::

    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, defaultShader, errorCallback);

``graphicsDevice``
    The GraphicsDevice object to be used to create and load the individual shaders.

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``defaultShader`` (Optional)
    The default shader to be used when the required one is not available.
    Defaults to a simple flat texture rendering.

``errorCallback`` (Optional)
    The callback to be called when any error occurs during manager operations.


Method
======

.. index::
    pair: ShaderManager; load

.. _shadermanager_load:

`load`
------

**Summary**

Requests loading of a shader by path.

**Syntax** ::

    var onload = function onloadFn(shader) {};
    var shader = shaderManager.load(path, onload);

``path``
    The URL of the shader to be loaded.

``onload`` (Optional)
    The callback function to call once the shader has loaded.
    This function is called asynchronously.

Returns the requested shader if already loaded, the default shader otherwise.
The callback function is called with the loaded shader as an argument.


.. index::
    pair: ShaderManager; get

`get`
-----

**Summary**

Returns the loaded shader stored with the given path.

**Syntax** ::

    var shader = shaderManager.get(path);

``path``
    The path of the shader to get.

Returns the default shader if the required one is missing or not yet loaded.


.. index::
    pair: ShaderManager; map

.. _shadermanager_map:

`map`
-----

**Summary**

Alias one shader to another name.

**Syntax** ::

    shaderManager.map(alias, name);

``name``
    The name to be mapped.

``alias``
    The new alias for ``name``.


.. index::
    pair: ShaderManager; remove

`remove`
--------

**Summary**

Deletes the shader stored with the given path.

**Syntax** ::

    shaderManager.remove(path);

``path``
    The path of the shader to remove.


.. index::
    pair: ShaderManager; reload

.. _shadermanager_reload:

`reload`
--------

**Summary**

Reloads the shader stored with the given path.
Useful when the shader has been updated on the server and the application wants to retrieve the new one.
The reloading of the shader will be done asynchronously.

**Syntax** ::

    shaderManager.reload(path, callback);

``path``
    The path of the shader to be reloaded.

``callback``
    Called once the shader has loaded.

The callback function is called with the loaded shader as an argument.


.. index::
    pair: ShaderManager; reloadAll

`reloadAll`
-----------

**Summary**

Reloads all the stored shaders.
Useful when many shaders have been updated on the server and the application wants to retrieve the new ones.

This operation may take a long time to complete, the reloading of the shader will be done asynchronously.

**Syntax** ::

    shaderManager.reloadAll();


.. index::
    pair: ShaderManager; getNumPendingShaders

`getNumPendingShaders`
-----------------------

**Summary**

Returns the number of shaders requested but still to be loaded.

**Syntax** ::

    var numPendingShaders = shaderManager.getNumPendingShaders();
    if (numPendingShaders)
    {
        keepWaiting();
    }


.. index::
    pair: ShaderManager; isShaderLoaded

`isShaderLoaded`
-----------------

**Summary**

Returns true if a shader is not pending.

**Syntax** ::

    if (shaderManager.isShaderLoaded(path))
    {
        noMoreWaiting();
    }

``path``
    The path of the shader to be checked.


.. index::
    pair: ShaderManager; isShaderMissing

`isShaderMissing`
------------------

**Summary**

Returns true if a shader is missing.

**Syntax** ::

    if (shaderManager.isShaderMissing(path))
    {
        errorWhilstLoading();
    }

``path``
    The path of the shader to be checked.


.. index::
    pair: ShaderManager; setPathRemapping

`setPathRemapping`
------------------

**Summary**

Enables remapping of loading paths.

The remapping only affects the loading URLs.
The shader will be stored under the original path it was requested with.

**Syntax** ::

    shaderManager.setPathRemapping(mappingDictionary, prefix);

    // example usage:
    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
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
    pair: ShaderManager; setAutomaticParameterResize

`setAutomaticParameterResize`
-----------------------------

**Summary**

Enables automatic resizing of a parameter arrays.

The resizing is done during loading, existing shaders will not be updated.

Ideally developers should modify the source shader code instead of patching it at runtime
but this method is provided for convenience for those cases where the shader code may be
used for separate applications with different requirements.

**Syntax** ::

    shaderManager.setAutomaticParameterResize(name, size);

    // example usage:
    // The model used for this sample only has 20 bones so we optimize for it.
    // Each bone has 3 V4s.
    shaderManager.setAutomaticParameterResize("skinBones", 20 * 3);

``name``
    The name of the parameter to be resized.

``size``
    The size the parameter will be resized to.


.. index::
    pair: ShaderManager; destroy

`destroy`
---------

**Summary**

Releases the ShaderManager object and all the resources it allocated;
the object and the shaders it referenced will be invalid after the method is called.

**Syntax** ::

    shaderManager.destroy();


Properties
==========

.. index::
    pair: ShaderManager; version

`version`
---------

**Summary**

The version number of the ShaderManager implementation.

**Syntax** ::

    var versionNumber = shaderManager.version;
