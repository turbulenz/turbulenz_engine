.. index::
    single: Geometry

.. highlight:: javascript

.. _geometry:

-------------------
The Geometry Object
-------------------

A Geometry is a mesh usually referenced from a :ref:`GeometryInstance <GeometryInstance>` that is attached to a :ref:`SceneNode <SceneNode>`.

Geometry objects are usually created via :ref:`Scene.load() <scene_load>` but can be created procedurally.

**Required scripts**

The Geometry object requires::

    /*{{ javascript("jslib/geometry.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/

Constructor
===========

.. index::
    pair: Geometry; create

`create`
--------

**Summary**

Creates and returns a Geometry object.

**Syntax** ::

    var geometry = Geometry.create();

Properties
==========

.. index::
    pair: Geometry; vertexBuffer

`vertexBuffer`
--------------

**Summary**

The :ref:`VertexBuffer <vertexbuffer>` the geometry vertex data is stored in. The first used index is stored in `baseIndex`.

**Syntax** ::

    var vertexBuffer = geometry.vertexBuffer;

.. index::
    pair: Geometry; baseIndex

`baseIndex`
-----------

**Summary**

The baseIndex is the first index in the `vertexBuffer` property of the geometry's vertex data.

**Syntax** ::

    var baseIndex = geometry.baseIndex;

.. index::
    pair: Geometry; semantics

`semantics`
-----------

**Summary**

The :ref:`semantics <semantics>` of the vertex data stored in the `vertexBuffer` property.

**Syntax** ::

    var semantics = geometry.semantics;

.. index::
    pair: Geometry; surfaces

`surfaces`
----------

**Summary**

The surfaces is a dictionary of named :ref:`surfaces <surface>`.

**Syntax** ::

    var surfaces = geometry.surfaces;
    for (var surface in surfaces)
    {
        if (surfaces.hasOwnProperty(surface))
        {
            // ...
        }
    }

`type`
------

.. index::
    pair: Geometry; type

**Summary**

The type is one of the :ref:`geometryTypes <renderable_geometrytype>`.
It is used in the :ref:`Effects <effect>` to find the relevant :ref:`Technique <technique>` for the vertex type.

**Syntax** ::

    if ("rigid" === geometry.type)
    {
        // ...
    }

.. index::
    pair: Geometry; center

`center`
--------

**Summary**

An array of 3 numbers for defining the center of the object's bounding box.

**Syntax** ::

    var center = geometry.center;

`halfExtents`
-------------

.. index::
    pair: Geometry; halfExtents

**Summary**

An array of 3 numbers for the half-extents of the object from the `center`.

**Syntax** ::

    var minX = geometry.center[0] - geometry.halfExtents[0];

.. index::
    pair: Geometry; skeleton

`skeleton`
----------

**Summary**

The value is a :ref:`skeleton <turbulenz_json_skeletons>` object that is used in the skinning to find the matrices required to render the geometry.

This property is only defined if the `type` is `skinned`.

**Syntax** ::

    var skeleton = geometry.skeleton;

.. index::
    pair: Geometry; reference

`reference`
-----------

**Summary**

The :ref:`reference <reference>` object relating to this geometry. It is used by the :ref:`Scene <scene>` to manage a dictionary of Geometries.


**Syntax** ::

    var reference = geometry.reference;


Methods
=======

.. index::
    pair: Geometry; destroy

`destroy`
---------

**Summary**

Free the resources attached to the object.

This is usually called automatically when a :ref:`GeometryInstance <geometryinstance>` is destroyed.

**Syntax** ::

    geometry.destroy();
