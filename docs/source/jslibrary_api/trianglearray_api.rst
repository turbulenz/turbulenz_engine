.. index::
    single: TriangleArray

.. highlight:: javascript

.. _trianglearray:

------------------------
The TriangleArray Object
------------------------

A TriangleArray object contains an array of triangles to be used to create a TriangleMesh shape.

Constructor
===========

A TriangleArray object can be constructed with :ref:`PhysicsDevice.createTriangleArray <physicsdevice_createtrianglearray>`.

Properties
==========

.. index::
    pair: TriangleArray; vertices

`vertices`
----------

**Summary**

Array of floating point values representing the vertices used by the triangles,
there are 3 values for each vertex.

**Syntax** ::

    var vertices = triangleArray.vertices;

.. note:: Read Only


.. index::
    pair: TriangleArray; indices

`indices`
---------

**Summary**

Array of integers representing the indices of the vertices used by each triangle,
there are 3 values per triangle.

**Syntax** ::

    var indices = triangleArray.indices;

.. note:: Read Only
