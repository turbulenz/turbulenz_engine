.. index::
    single: OcclusionQuery

.. highlight:: javascript

.. _occlusionquery:

-------------------------
The OcclusionQuery Object
-------------------------

An OcclusionQuery object collects from the GPU how many fragments passed the depth test
from draw commands executed between :ref:`graphicsDevice.beginOcclusionQuery <graphicsdevice_beginocclusionquery>`
and :ref:`graphicsDevice.endOcclusionQuery <graphicsdevice_endocclusionquery>` for the given OcclusionQuery.

Properties
==========

.. index::
    pair: OcclusionQuery; pixelCount

`pixelCount`
------------

**Summary**

Number of fragments that passed the depth test.

**Syntax** ::

    var pixelCount = occlusionQuery.pixelCount;

Calling this property would stall the CPU waiting for the GPU if the query results are not ready.

.. note:: Read Only
