.. index::
    single: VertexBuffer

.. highlight:: javascript

.. _vertexbuffer:

-----------------------
The VertexBuffer Object
-----------------------

A VertexBuffer object is an optimal read-only container for vertex data.

Constructor
===========

A VertexBuffer object can be constructed with :ref:`GraphicsDevice.createVertexBuffer <graphicsdevice_createvertexbuffer>`.

Methods
=======

.. _vertexbuffer_setdata:

.. index::
    pair: VertexBuffer; setData

`setData`
---------
**Summary**

Set the data by passing in an array of numbers.

Vertex data stored on the VertexBuffer, it consists of an array of
numbers, one value for each component of every attribute of all
vertices.  The number of components per attribute depends on the
attribute format.

Create the VertexBuffer as dynamic if you are planning to update the
vertex data at runtime.

Changing or requesting the vertex data can be an expensive operation.

**Syntax** ::

    // request all the data
    var vertexData = [100.0, 200.0, 3, 1000,
                      200.0, 200.0, 4, 2000,
                      100.0, 100.0, 5, 3000,
                      200.0, 100.0, 6, 4000]

    var offset = 0;
    var count = vertexData.length / vertexBuffer.stride;
    vertexBuffer.setData(vertexData, offset, count);

``vertexData``

    An array of numbers in the same format as the `data` element
    passed in to :ref:`createVertexBuffer
    <graphicsdevice_createvertexbuffer>`.  If `data` is a Typed Array
    whose typed matches the underlying vertex format then the engine
    can optimize the transfer of data into the VertexBuffer.  For this
    optimization to be enabled, all the streams defined in the
    VertexBuffer must be of the same format (e.g. FLOAT, USHORT)
    although they do not necessarily all need to contain all the same
    number of components.  For example, it is possible to optimally
    set data for a buffer with attributes [ FLOAT3, FLOAT2 ] using a
    `Float32Array` of the appropriate length.  Note that the engine
    distinguishes between signed and unsigned variants so that a
    buffer with attributes [ BYTE4N, UBYTE4 ] cannot be set with a
    Typed Array in an optimized way.

``offset`` (Optional)
    Offset from the beginning of the buffer in vertices. Optional, assumed to be 0 if omitted.

``count`` (Optional)
    The number of vertices to write. Optional, assumed to be size of the buffer if omitted.


.. index::
    pair: VertexBuffer; map

.. _vertexbuffer_map:

`map`
-----

**Summary**

Requests write access to a region of the VertexBuffer.

**Syntax** ::

    var writer = vertexBuffer.map(offset, count);
    if (writer)
    {
        for (var n = 0; n < count; n += 1)
        {
            // This VertexBuffer has 3 attributes
            writer(0, 1, 2, // first attribute has 3 components
                   0, 1, 2, // second attribute has also 3 components
                   0, 1);   // third attribute has only 2
        }

        vertexBuffer.unmap(writer);
    }

``offset`` (Optional)
    The zero-based index of the first vertex to map.
    If it is not specified the whole VertexBuffer will be mapped.

``count`` (Optional)
    The number of vertices to map.
    If it is not specified all the vertices after and including ``offset`` will be mapped.

Returns a vertex writer.
The writer can be called once for each mapped vertex to replace each of the components of every attribute.


.. index::
    pair: VertexBuffer; unmap

.. _vertexbuffer_unmap:

`unmap`
-------

**Summary**

Communicate to the VertexBuffer that write access to a mapped region is no longer required.

**Syntax** ::

    var writer = vertexBuffer.map(firstVertexToMap, numVerticesToMap);
    if (writer)
    {
        // Do something with the writer here

        vertexBuffer.unmap(writer);
    }

``writer``
    The vertex writer returned by a previous call to ``map``.

This method **must** be called if ``map`` returns a valid writer.


.. index::
    pair: VertexBuffer; destroy

`destroy`
---------

**Summary**

Releases the VertexBuffer resources; the object will be invalid after the method is called.

**Syntax** ::

    vertexBuffer.destroy();


Properties
==========

.. index::
    pair: VertexBuffer; id

`id`
----

**Summary**

The unique identification number of the VertexBuffer object.

**Syntax** ::

    var vertexBufferId = vertexBuffer.id;

.. note:: Read Only


.. index::
    pair: VertexBuffer; numVertices

`numVertices`
-------------

**Summary**

Number of vertices stored on the VertexBuffer.

**Syntax** ::

    var numVertices = vertexBuffer.numVertices;

.. note:: Read Only


.. index::
    pair: VertexBuffer; numAttributes

`numAttributes`
---------------

**Summary**

Number of attributes per vertex.

**Syntax** ::

    var numAttributes = vertexBuffer.numAttributes;

.. note:: Read Only


.. index::
    pair: VertexBuffer; attributes

`attributes`
------------

**Summary**

Array containing the format of each vertex attribute.

**Syntax** ::

    var vertexAttributesArray = vertexBuffer.attributes;

    var gd == TurbulenzEngine.getGraphicsDevice();
    if (vertexAttributesArray[0] === gd.VERTEXFORMAT_FLOAT4)
    {
        // ...
    }

.. note:: Read Only


.. index::
    pair: VertexBuffer; stride

`stride`
--------

**Summary**

The number of total components per vertex.
Each vertex attribute can have up to 4 components depending on the attribute format.

**Syntax** ::

    var vertexBufferStride = vertexBuffer.stride;

.. note:: Read Only


.. index::
    pair: VertexBuffer; dynamic

`dynamic`
---------

**Summary**

True if the VertexBuffer was created as dynamic and hence can be modified at runtime, false otherwise.

**Syntax** ::

    var isDynamic = vertexBuffer.dynamic;

.. note:: Read Only
