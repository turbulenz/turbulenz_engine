.. index::
    single: TextureInstance

.. _textureinstance:

--------------------------
The TextureInstance Object
--------------------------

These are usually created by a :ref:`TextureManager <texturemanager>` and accessed via :ref:`TextureManager.getInstance() <texturemanager_getinstance>`.
Its role is to provide a proxy to a texture and provides a notification mechanism to allow other
code to update texture references, for example when a texture is downloaded.

The TextureInstance are reference counted.

**Required scripts**

The TextureInstance object requires::

    /*{{ javascript("jslib/texturemanager.js") }}*/
    /*{{ javascript("jslib/observer.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/

Constructor
===========

.. index::
    pair: TextureInstance; create

`create`
--------

**Summary**

Creates and returns a TextureInstance object.

**Syntax** ::

    var textureInstance = TextureInstance.create(name, texture);

``name``
    A JavaScript string.
    The name of the texture.

``texture``
    A :ref:`Texture <texture>` object.

Methods
=======

.. index::
    pair: TextureInstance; setTexture

`setTexture`
------------

**Summary**

Set the texture object associated with the TextureInstance. This will notify any observer function registered with `subscribeTextureChanged`.

**Syntax** ::

    textureInstance.setTexture(texture);

``texture``
    A :ref:`Texture <texture>` object.

.. index::
    pair: TextureInstance; getTexture

`getTexture`
------------

**Summary**

Get the texture object associated with the TextureInstance.

**Syntax** ::

    var texture = textureInstance.getTexture();

Returns a :ref:`Texture <texture>` object.

.. index::
    pair: TextureInstance; subscribeTextureChanged

`subscribeTextureChanged`
-------------------------

**Summary**

Register a function object to call when the texture changes.

**Syntax** ::

    textureInstance.subscribeTextureChanged(textureChangedCallback);

``textureChangedCallback``
    A callback function which takes a :ref:`TextureInstance <textureinstance>` object as an argument.

.. index::
    pair: TextureInstance; subscribeTextureChanged

`subscribeTextureChanged`
-------------------------

**Summary**

Unregistered a function object previously registered with `subscribeTextureChanged`.

**Syntax** ::

    textureInstance.unsubscribeTextureChanged(textureChangedCallback);

``textureChangedCallback``
    A callback function.


`destroy`
---------

**Summary**

Free the resources attached to the object. This is normally called automatically when the reference count drops to 0.

**Syntax** ::

    textureInstance.destroy();
