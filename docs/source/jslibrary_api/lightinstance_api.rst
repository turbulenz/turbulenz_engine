.. index::
    single: LightInstance

.. highlight:: javascript

.. _lightinstance:

------------------------
The LightInstance Object
------------------------

A LightInstance has a reference to a :ref:`Light <light>` object and is usually attached to a :ref:`SceneNode <scenenode>`.

**Required scripts**

The Light object requires::

    /*{{ javascript("jslib/light.js") }}*/

Constructor
===========

.. index::
    pair: LightInstance; create

`create`
--------

**Summary**

Creates and returns a LightInstance object with passed in light.

**Syntax** ::

    var lightInstance = LightInstance.create(light);
    node.addLightInstance(lightInstance);

``light``
    A :ref:`Light <light>` object.

Methods
=======

.. index::
    pair: LightInstance; clone

`clone`
--------

**Summary**

Creates a LightInstance by cloning an existing LightInstance.

**Syntax** ::

    var newLightInstance = lightInstance.clone();

.. index::
    pair: LightInstance; getWorldExtents

`getWorldExtents`
-----------------

**Summary**

Get the world extents of the LightInstance.

This is only valid when attached to a SceneNode and the node has been updated.

**Syntax** ::

    var extents = lightInstance.getWorldExtents();

Returns an :ref:`extents <extents>` array.

.. index::
    pair: LightInstance; getNode

`getNode`
---------

**Summary**

Get the SceneNode the LightInstance is attached to.

**Syntax** ::

    var node = lightInstance.getNode();

Returns a :ref:`SceneNode <scenenode>`.
