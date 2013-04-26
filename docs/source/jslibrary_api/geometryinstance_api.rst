.. index::
    single: GeometryInstance

.. highlight:: javascript

.. _geometryinstance:

---------------------------
The GeometryInstance Object
---------------------------

The GeometryInstance is the standard implementation of the :ref:`Renderable Interface <renderable>`.

It owns a reference to a :ref:`Geometry <geometry>` object and is usually attached to a :ref:`SceneNode <scenenode>`, either automatically during loading or via :ref:`SceneNode.addRenderable() <scenenode_addrenderable>`.

**Required scripts**

The GeometryInstance object requires::

    /*{{ javascript("jslib/geometry.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/

It also requires that a :ref:`GraphicsDevice <tz_creategraphicsdevice>` has been created before calling the GeometryInstance constructor.

Constructor
===========

.. index::
    pair: GeometryInstance; create

`create`
--------

**Summary**

Creates and returns a GeometryInstance object with passed in :ref:`Geometry <geometry>`.

**Syntax** ::

    var geometryInstance = GeometryInstance.create(geometry,
                                                   surface,
                                                   sharedMaterial);

``geometry``
    The :ref:`geometry <geometry>` to reference.

``surface``
    Which one of the :ref:`geometry's <geometry>` :ref:`surfaces <surface>` to render.

``sharedMaterial``
    The :ref:`material <material>` to apply on the :ref:`geometry <geometry>`.
    This can be shared between multiple geometries.


Methods
=======

.. index::
    pair: GeometryInstance; clone

`clone`
-------

**Summary**

Creates a GeometryInstance by cloning an existing GeometryInstance.

**Syntax** ::

    var newGeometryInstance = geometryInstance.clone();

.. index::
    pair: GeometryInstance; getWorldExtents

`getWorldExtents`
-----------------

**Summary**

Get the world extents of the GeometryInstance.

This is only valid when attached to a :ref:`SceneNode <scenenode>` and the node has been updated.

**Syntax** ::

    var extents = geometryInstance.getWorldExtents();

Returns an :ref:`extents <extents>` array.

.. index::
    pair: GeometryInstance; addCustomWorldExtents

`addCustomWorldExtents`
-----------------------

**Summary**

User defined extents that replace the ones calculated from the Geometry and the :ref:`SceneNode's <scenenode>` world transform.

**Syntax** ::

    var customExtents = geometryInstance.getWorldExtents().slice();
    var padding = 10;
    customExtents[0] -= padding;
    customExtents[1] -= padding;
    customExtents[2] -= padding;
    customExtents[3] += padding;
    customExtents[4] += padding;
    customExtents[5] += padding;
    geometryInstance.addCustomWorldExtents(customExtents);

``customExtents``
    The custom :ref:`extents <extents>` to use instead of the default.

The GeometryInstance must be attached to a :ref:`SceneNode <scenenode>`.
Even if the :ref:`SceneNode <scenenode>` moves the extents will not be recalculated.
This can be used as an optimization for animated objects that are constrained to a location.

`removeCustomWorldExtents`
--------------------------

**Summary**

Remove previously attached custom world extents.

**Syntax** ::

    geometryInstance.removeCustomWorldExtents();

.. index::
    pair: GeometryInstance; getCustomWorldExtents

`getCustomWorldExtents`
-----------------------

**Summary**

Get previously attached world extents. Maybe undefined.


**Syntax** ::

    var extents = geometryInstance.getCustomWorldExtents();

Returns an :ref:`extents <extents>` array.

.. index::
    pair: GeometryInstance; hasCustomWorldExtents

`hasCustomWorldExtents`
-----------------------

**Summary**

Returns a whether the object has custom world extents.

**Syntax** ::

    if (geometryInstance.hasCustomWorldExtents())
    {
        //...
    }


.. index::
    pair: GeometryInstance; getNode

`getNode`
---------

**Summary**

Get the :ref:`SceneNode <scenenode>` the GeometryInstance is attached to.

**Syntax** ::

    var node = geometryInstance.getNode();


.. index::
    pair: GeometryInstance; setMaterial

`setMaterial`
-------------

**Summary**

Set the material.

**Syntax** ::

   geometryInstance.setMaterial(material);

``material``
    :ref:`Material <material>` to set.


.. index::
    pair: GeometryInstance; getMaterial

`getMaterial`
-------------

**Summary**

Get the :ref:`material <material>`.

**Syntax** ::

   var material = geometryInstance.getMaterial();


.. index::
    pair: GeometryInstance; destroy

`destroy`
---------

**Summary**

Free the resources attached to the object. GeometryInstance attached to a :ref:`SceneNode <scenenode>` are destroyed when it is destroyed.

**Syntax** ::

    geometryInstance.destroy();
