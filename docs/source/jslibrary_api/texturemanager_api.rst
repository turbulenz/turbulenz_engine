.. index::
    single: TextureManager

.. _texturemanager:

.. highlight:: javascript

-------------------------
The TextureManager Object
-------------------------

Provides loading and managing of textures.

This object keeps a map of requested textures by name in order to avoid duplicates.
It also provides a default texture for those cases where the required one is missing or not yet loaded.

Loading of textures is an asynchronous operation.
The :ref:`TextureInstance <textureinstance>` objects can be used to automatically update references when the texture is downloaded.
Using :ref:`Scene.load() <scene_load>` will automatically update textures.

Remapping functionality is also supported by the manager.

Some default procedural textures are provided by the manager:

* `white`: A 2x2 opaque white texture.
* `black`: A 2x2 opaque black texture.
* `flat`: A 2x2 normalmap texture pointing straight up.

**Required scripts**

The TextureManager object requires::

    /*{{ javascript("jslib/texturemanager.js") }}*/
    /*{{ javascript("jslib/observer.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/


Constructor
===========

.. index::
    pair: TextureManager; create

.. _texturemanager_create:

`create`
--------

**Summary**

**Syntax** ::

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, defaultTexture, errorCallback);

``graphicsDevice``
    The GraphicsDevice object to be used to create and load the individual textures.

``requestHandler``
    A :ref:`RequestHandler <requesthandler>` object.

``defaultTexture`` (Optional)
    The default texture to be used when the required one is not available.
    Defaults to a 2x2 pink-red texture for easy debugging of missing textures.

``errorCallback`` (Optional)
    The callback to be called when any error occurs during manager operations.


Method
======

.. index::
    pair: TextureManager; load

.. _texturemanager_load:

`load`
------

**Summary**

Requests loading of a texture by path.

**Syntax** ::

    var onload = function onloadFn(textureInstance) {};
    var texture = textureManager.load(path, nomipmaps, onload);

``path``
    The URL of the texture to be loaded.
    It can also be an identifier for procedural textures.

``nomipmaps`` (Optional)
    The generation of a mipmap chain for the loaded texture.
    Defaults to false.

``onload`` (Optional)
    The callback function to call once the texture has loaded.
    This function is called asynchronously.

Returns the requested :ref:`Texture <texture>` if already loaded, the default texture otherwise.
The callback function is called with the loaded :ref:`Texture <texture>` as an argument.

.. index::
    pair: TextureManager; add

`add`
-----

**Summary**

Adds a procedural texture to the manager.

**Syntax** ::

    textureManager.add(name, texture);

``name``
    The identifier of the procedural texture.

``texture``
    The :ref:`Texture <texture>` to be stored under the given name.


.. index::
    pair: TextureManager; loadArchive

.. _texturemanager_loadarchive:

`loadArchive`
-------------

**Summary**

Loads a texture archive.

If a texture named in the archive is already resident it will not be replaced.

**Syntax** ::

    var onTextureLoaded = function onloadFn(texture) {};
    var onArchiveLoaded = function onloadFn(success) {};
    textureManager.loadArchive(path, nomipmaps, onTextureLoaded, onArchiveLoaded);

``path``
    The URL of the texture archive to be loaded.
    The texture will be stored in the manager under the name they were stored on the archive.

``nomipmaps`` (Optional)
    The generation of a mipmap chain for the textures to be loaded.
    Defaults to false.

``onTextureLoaded`` (Optional)
    The callback function to call for each :ref:`Texture <texture>` loaded.
    This function is called asynchronously.

``onArchiveLoaded`` (Optional)
    The callback function to call once the archive has loaded.
    This function is called asynchronously.

Supports is TAR files only.

.. index::
    pair: TextureManager; removeArchive

`removeArchive`
---------------

**Summary**

Removes a loaded archive and removes all the textures the archive loaded.

Only textures actually loaded by the archive are unloaded, textures that are in the file archive but were already resident at load time will not be removed.

**Syntax** ::

    textureManager.removeArchive(path);

``path``
    The URL the texture archive was loaded with.

.. index::
    pair: TextureManager; isArchiveLoaded

`isArchiveLoaded`
-----------------

**Summary**

Returns true if an archive is not pending.

**Syntax** ::

    if (textureManager.isArchiveLoaded(path))
    {
        noMoreWaiting();
    }

``path``
    The name or path of the archive to be checked.

.. index::
    pair: TextureManager; get

`get`
-----

**Summary**

Returns the loaded texture stored with the given path or name.

**Syntax** ::

    var texture = textureManager.get(path);

``path``
    The name or path of the texture to get.

Returns the default texture if the required one is missing or not yet loaded.

.. index::
    pair: TextureManager; get

.. _texturemanager_getinstance:

`getInstance`
-------------

**Summary**

Returns the TextureInstance stored with the given path or name.

**Syntax** ::

    var textureInstance = textureManager.getInstance(path);

``path``
    The name or path of the texture to get.

Returns a :ref:`TextureInstance <textureinstance>` object.

.. index::
    pair: TextureManager; map

.. _texturemanager_map:

`map`
-----

**Summary**

Alias one texture to another name.

**Syntax** ::

    textureManager.map(alias, name);

``name``
    The name to be mapped.

``alias``
    The new alias for ``name``.

.. index::
    pair: TextureManager; remove

`remove`
--------

**Summary**

Deletes the texture stored with the given path or name.

**Syntax** ::

    textureManager.remove(path);

``path``
    The name or path of the texture to remove.


.. index::
    pair: TextureManager; reload

`reload`
--------

**Summary**

Reloads the texture stored with the given path or name.
Useful when the texture has been updated on the server and the application wants to retrieve the new one.
The reloading of the texture will be done asynchronously.

**Syntax** ::

    textureManager.reload(path);

``path``
    The name or path of the texture to be reloaded.


.. index::
    pair: TextureManager; reloadAll

`reloadAll`
-----------

**Summary**

Reloads all the stored textures.
Useful when many textures have been updated on the server and the application wants to retrieve the new ones.

This operation may take a long time to complete. The reloading of the texture will be done asynchronously.

**Syntax** ::

    textureManager.reloadAll();


.. index::
    pair: TextureManager; getNumPendingTextures

`getNumPendingTextures`
-----------------------

**Summary**

Returns the number of textures requested but still to be loaded.

**Syntax** ::

    var numPendingTextures = textureManager.getNumPendingTextures();
    if (numPendingTextures)
    {
        keepWaiting();
    }


.. index::
    pair: TextureManager; isTextureLoaded

`isTextureLoaded`
-----------------

**Summary**

Returns true if a texture is not pending.

**Syntax** ::

    if (textureManager.isTextureLoaded(path))
    {
        noMoreWaiting();
    }

``path``
    The name or path of the texture to be checked.


.. index::
    pair: TextureManager; isTextureMissing

`isTextureMissing`
------------------

**Summary**

Returns true if a texture is missing.

**Syntax** ::

    if (textureManager.isTextureMissing(path))
    {
        errorWhilstLoading();
    }

``path``
    The name or path of the texture to be checked.


.. index::
    pair: TextureManager; setPathRemapping

`setPathRemapping`
------------------

**Summary**

Enables remapping of loading paths.

The remapping only affects the loading URL,
the texture will be stored under the original name it was requested with.

**Syntax** ::

    textureManager.setPathRemapping(mappingDictionary, prefix);

    // example usage:
    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
    };
    mappingTable = TurbulenzServices.createMappingTable(gameSession,
                                                        mappingTableReceived);

``mappingDictionary``
    A JavaScript object.
    A mapping table dictionary that can be used to map the game's logical asset paths to physical paths.

``prefix``
    A string that will be appended to all paths, useful for global redirections.

Both arguments for ``setPathRemapping`` are properties on the :ref:`MappingTable <mappingtable>` object.


.. index::
    pair: TextureManager; destroy

`destroy`
---------

**Summary**

Releases the TextureManager object and all the resources it allocated;
the object and the textures it referenced will be invalid after the method is called.

**Syntax** ::

    textureManager.destroy();


Properties
==========

.. index::
    pair: TextureManager; version

`version`
---------

**Summary**

The version number of the TextureManager implementation.

**Syntax** ::

    var versionNumber = textureManager.version;
