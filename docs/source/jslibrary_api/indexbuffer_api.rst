.. index::
    single: IndexBuffer

.. highlight:: javascript

.. _indexbuffer:

----------------------
The IndexBuffer Object
----------------------

An IndexBuffer object is an optimal read-only container for index data.

Constructor
===========

IndexBuffers are created using :ref:`GraphicsDevice.createIndexBuffer <graphicsdevice_createindexbuffer>`.

Methods
=======

.. index::
    pair: IndexBuffer; setData

.. _indexbuffer_setdata:

`setData`
---------
**Summary**

Set the data by passing in an array of numbers.  When the JavaScript
engine exposes Typed Arrays, data can be passed to this function in
the appropriate ArrayBufferView.  If the Typed Array matches the index
format (e.g. `Uint16Array` for `INDEXFORMAT_USHORT` or `Uint32Array`
for `INDEXFORMAT_UINT`) then the data will copied in an optimized way.

Create the IndexBuffer as dynamic if you are planning to update the
index data at runtime.

**Syntax** ::

    var indexData = [0, 1, 2];
    var offset = 0;
    var count = indexData.length;
    indexBuffer.setData(indexData, offset, count);

``indexData``
    An array of numbers.

``offset`` (Optional)
    Offset in indicies from the beginning of the buffer. Optional, assumed to be 0 if omitted.

``count`` (Optional)
    The number of elements to write, normally indexData.length. Optional, assumed to be IndexBuffer.numIndices if omitted.

.. index::
    pair: IndexBuffer; map

`map`
-----

**Summary**

Requests write access to an IndexBuffer.

Create the IndexBuffer as dynamic if you are planning to update the index data at runtime.

**Syntax** ::

    var writer = indexBuffer.map(offset, count);
    if (writer)
    {
        for (var n = 0; n < (numIndices / 3); n += 1)
        {
            writer(n, (n + 1), (n + 2));
        }

        indexBuffer.unmap(writer);
    }

Returns an index writer.

``offset`` (Optional)
    Offset in indicies from the beginning of the buffer. Optional, assumed to be 0 if omitted.

``count`` (Optional)
    The number of elements to be written. Optional, assumed to be IndexBuffer.numIndices if omitted.

The writer can be called once for each mapped index.
It can also be called with multiple values in order to write multiple indices with just one call,
this is more optimal than a call per index but be careful not to write more indices than the ones the IndexBuffer was created with or
the writer will fail.

The entire contents of the buffer must be updated.

.. index::
    pair: IndexBuffer; unmap

`unmap`
-------

**Summary**

Communicate to the IndexBuffer that write access is no longer required.

**Syntax** ::

    var writer = indexBuffer.map();
    if (writer)
    {
        // Do something with the writer here

        indexBuffer.unmap(writer);
    }

``writer``
    The index writer returned by a previous call to ``map``.

This method **must** be called if ``map`` returns a valid writer.


.. index::
    pair: IndexBuffer; destroy

`destroy`
---------

**Summary**

Releases the IndexBuffer resources; the object will be invalid after the method is called.

**Syntax** ::

    indexBuffer.destroy();


Properties
==========

.. index::
    pair: IndexBuffer; id

`id`
----

**Summary**

The unique identification number of the IndexBuffer object.

**Syntax** ::

    var indexBufferId = indexBuffer.id;

.. note:: Read Only


.. index::
    pair: IndexBuffer; numIndices

`numIndices`
-------------

**Summary**

Number of indices stored on the IndexBuffer.

**Syntax** ::

    var numIndices = indexBuffer.numIndices;

.. note:: Read Only

.. index::
    pair: IndexBuffer; format

`format`
--------

**Summary**

Format type of the index data.

**Syntax** ::

    var indexFormat = indexBuffer.format;

    var gd = TurbulenzEngine.getGraphicsDevice();
    if (indexFormat === gd.INDEXFORMAT_USHORT)
    {
        // ...
    }

.. note:: Read Only


.. index::
    pair: IndexBuffer; dynamic

`dynamic`
---------

**Summary**

True if the IndexBuffer was created as dynamic and hence can be modified at runtime, false otherwise.

**Syntax** ::

    var isDynamic = indexBuffer.dynamic;

.. note:: Read Only
