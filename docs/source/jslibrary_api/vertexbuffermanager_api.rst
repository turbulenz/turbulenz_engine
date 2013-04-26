.. index::
    single: VertexBufferManager

.. _vertexbuffermanager:

.. highlight:: javascript

------------------------------
The VertexBufferManager Object
------------------------------

Provides allocation and freeing of ranges with in :ref:`VertexBuffers <vertexbuffer>`.

The VertexBufferManager will create and free any VertexBuffers it requires.

**Required scripts**

The VertexBufferManager object requires::

    /*{{ javascript("jslib/vertexbuffermanager.js") }}*/


Constructor
===========

.. index::
    pair: VertexBufferManager; create

`create`
--------

**Summary**

**Syntax** ::

    var vertexBufferManager = VertexBufferManager.create(graphicsDevice, dynamic);

``graphicsDevice``
    The GraphicsDevice object to allocate from.

``dynamic``
    If true the VertexBuffers should be created with the dynamic flag set to true. By default the VertexBuffers are static.


Method
======

.. index::
    pair: VertexBufferManager; allocate

`allocate`
----------

**Summary**

Allocate a number of vertices of a given format.

The returned object should be retained to pass to free().

**Syntax** ::

    var attributes = [graphicsDevice.VERTEXFORMAT_FLOAT4,
                      graphicsDevice.VERTEXFORMAT_FLOAT4,
                      graphicsDevice.VERTEXFORMAT_FLOAT3,
                      graphicsDevice.VERTEXFORMAT_FLOAT3,
                      graphicsDevice.VERTEXFORMAT_FLOAT2];

    var allocation = vertexBufferManager.allocate(numVertices , attributes);

    var vertexBuffer = allocation.vertexBuffer;
    var baseIndex = allocation.baseIndex;


``numVertices``
    The number of vertices to allocate.

``attributes``
    Vertex format. An array of :ref:`vertex format strings <graphicsDevice_VERTEXFORMAT>`.

The returned object has two public values:

``vertexBuffer``
    The VertexBuffer the vertices are allocated from.

``baseIndex``
    The first index in the buffer to use.


.. index::
    pair: VertexBufferManager; free

`free`
------

**Summary**

Called to free an allocation from the VertexBufferManager.

**Syntax** ::

    vertexBufferManager.free(allocation);

``allocation``
    The object returned from allocate().


.. index::
    pair: VertexBufferManager; destroy

`destroy`
---------

**Summary**

Called when the object is no longer required.

**Syntax** ::

    vertexBufferManager.destroy();


Properties
==========

.. index::
    pair: VertexBufferManager; version

`version`
---------

**Summary**

The version number of the VertexBufferManager implementation.

**Syntax** ::

    var versionNumber = vertexBufferManager.version;
