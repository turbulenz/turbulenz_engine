.. index::
    single: IndexBufferManager

.. _indexbuffermanager:

.. highlight:: javascript

-----------------------------
The IndexBufferManager Object
-----------------------------

Provides allocation and freeing of ranges within :ref:`IndexBuffers <indexbuffer>`.

The IndexBufferManager will create and free any IndexBuffers it requires.

**Required scripts**

The IndexBufferManager object requires::

    /*{{ javascript("jslib/indexbuffermanager.js") }}*/


Constructor
===========

.. index::
    pair: IndexBufferManager; create

`create`
--------

**Summary**

**Syntax** ::

    var indexBufferManager = IndexBufferManager.create(graphicsDevice, dynamic);

``graphicsDevice``
    The GraphicsDevice object to allocate from.

``dynamic``
    If true the IndexBuffers should be created with the dynamic flag set to true. By default the IndexBuffers are static.


Method
======

.. index::
    pair: IndexBufferManager; allocate

`allocate`
----------

**Summary**

Allocate a number of indices of a given format.

The returned object should be retained to pass to free().

**Syntax** ::

    var format = graphicsDevice.INDEXFORMAT_USHORT;

    var allocation = indexBufferManager.allocate(numIndices, format);

    var indexBuffer = allocation.indexBuffer;
    var baseIndex = allocation.baseIndex;


``numIndices``
    The number of indices to allocate.

``format``
    An :ref:`index format <graphicsDevice_INDEXFORMAT>`.

The returned object has two public values:

``indexBuffer``
    The IndexBuffer the indices are allocated from.

``baseIndex``
    The first index in the buffer to use.


.. index::
    pair: IndexBufferManager; free

`free`
------

**Summary**

Called to free an allocation from the IndexBufferManager.

**Syntax** ::

    indexBufferManager.free(allocation);

``allocation``
    The object returned from allocate().


.. index::
    pair: IndexBufferManager; destroy

`destroy`
---------

**Summary**

Called when the object is no longer required.

**Syntax** ::

    indexBufferManager.destroy();


Properties
==========

.. index::
    pair: IndexBufferManager; version

`version`
---------

**Summary**

The version number of the IndexBufferManager implementation.

**Syntax** ::

    var versionNumber = indexBufferManager.version;
