.. index::
    single: Effect

.. highlight:: javascript

.. _effect:

-----------------
The Effect Object
-----------------

An Effect is a named object that defines a standard appearance style, e.g. "blinn", "translucent" and "env".

It provides a mapping from a :ref:`geometryType <renderable_geometrytype>`, e.g. "rigid" and "skinned", to an object that can prepare a renderable so that it can be drawn. Typically the prepare function will reference  :ref:`shaders <shader>` and :ref:`techniques <technique>` it has requested to be loaded.

The renderers register a number of Effects during their create() methods.

This abstraction allows custom effect types to be registered for custom geometry types.

**Required scripts**

The Effect object requires::

    /*{{ javascript("jslib/effectmanager.js") }}*/

Constructor
===========

.. index::
    pair: Effect; create

`create`
--------

**Summary**

Create a named Effect.

**Syntax** ::

    var effect = Effect.create(name);

Method
======

.. index::
    pair: Effect; add

`add`
-----

**Summary**

For a given geometry type add a prepare object that can process a renderable of that type.

**Syntax** ::

    effect.add(geometryType, prepareObject);

``geometryType``
    A string identifying the type.

``prepareObject``
    An object with a prepare() method that takes a renderable as an argument. i.e. prepareObject.prepare(renderable).

See also :ref:`Effect Registration <effectmanager_effectregistration>`.

`remove`
--------

**Summary**

Deletes the geometryType stored with the given name.

**Syntax** ::

    effect.remove(name);

``name``
    The name of the geometryType to remove.


.. index::
    pair: Effect; get

`get`
-----

**Summary**

Returns the prepare object associated with the geometryType.

**Syntax** ::

    var prepareObject = effect.get("rigid");
    prepareObject.prepare(geometryInstance);

``name``
    The name of the geometryType to get.

Returns a prepareObject previously registered with the add() method.


Properties
==========

.. index::
    pair: Effect; version

`version`
---------

**Summary**

The version number of the Effect implementation.

**Syntax** ::

    var versionNumber = Effect.version;

.. index::
    pair: Effect; name

`name`
------

**Summary**

The name of the Effect.

**Syntax** ::

    var name = effect.name;
