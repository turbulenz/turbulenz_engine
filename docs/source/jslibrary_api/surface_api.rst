.. index::
    single: Surface

.. _surface:

------------------
The Surface Object
------------------

A Surface object is a JavaScript object that represents one of the surfaces of a :ref:`Geometry <geometry>`.
It defines part or all of the the geometry to draw and provides the indexing information required to draw it.
The data is stored using either `indexBuffer` and `numIndices` *or* `first` and `numVertices`.::

    if (surface.indexBuffer)
    {
        drawParameters.indexBuffer = surface.indexBuffer;
        drawParameters.count = surface.numIndices;
    }
    else
    {
        drawParameters.firstIndex = surface.first;
        drawParameters.count = surface.numVertices;
    }

Properties
==========

.. index::
    pair: Surface; primitive

`primitive`
-----------

**Summary**

The :ref:`primitive <graphicsDevice_PRIMITIVE>` type the surface.

**Syntax** ::

    var primitive = surface.primitive;

.. index::
    pair: Surface; indexBuffer

`indexBuffer`
-------------

**Summary**

The :ref:`IndexBuffer <indexbuffer>` for the surface.

This may be undefined.

If it is defined then `numIndices` is also defined.

**Syntax** ::

    var indexBuffer = surface.indexBuffer;

.. index::
    pair: Surface; numIndices

`numIndices`
------------

**Summary**

When `indexBuffer` is defined this is the number of indicies in the buffer to use.

This may be undefined.

**Syntax** ::

    var numIndices = surface.numIndices;

.. index::
    pair: Surface; first

`first`
-------

**Summary**

When `indexBuffer` is *not* defined this is the first index of the first vertex in the :ref:`Geometry's <geometry>` vertexBuffer to start from.

This may be undefined.

If it is defined then `numVertices` is also defined.

**Syntax** ::

    var first = surface.first;

.. index::
    pair: Surface; numVertices

`numVertices`
-------------

**Summary**

When `indexBuffer` is *not* defined this is the number of vertices to process.

This may be undefined.

**Syntax** ::

    var numVertices = surface.numVertices;


.. index::
    pair: Surface; vertexData

`vertexData`
------------

**Summary**

A native array of vertexData that can be use to create or update a :ref:`VertexBuffer <vertexbuffer>`.

See :ref:`Scene.load <scene_load>`.

This may be undefined.

**Syntax** ::

    var vertexData = surface.vertexData;

.. index::
    pair: Surface; vertexData

`indexData`
------------

**Summary**

A native array of indexData that can be use to create or update a :ref:`IndexBuffer <indexbuffer>`.

See :ref:`Scene.load <scene_load>`.

This may be undefined.

**Syntax** ::

    var indexData = surface.indexData;
