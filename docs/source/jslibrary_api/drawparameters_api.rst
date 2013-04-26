.. index::
    single: DrawParameters

.. highlight:: javascript

.. _drawparameters:

-------------------------
The DrawParameters Object
-------------------------

A DrawParameters object is a collection of state used by the renderer to render an object. Its purpose is to provide an efficient way to draw large number of objects.  They are rendered with :ref:`GraphicsDevice.drawArray() <graphicsdevice_drawarray>`.

A :ref:`Renderable <renderable>` generates a collection of these that are processed by the renderers, ordering them by pass.

They are created using :ref:`GraphicsDevice.createDrawParameters() <graphicsdevice_createdrawparameters>`.

Methods
=======

.. index::
    pair: DrawParameters; setTechniqueParameters


`setTechniqueParameters`
------------------------

**Summary**

Sets an element of the array of :ref:`TechniqueParameters <techniqueparameters>` objects.

These are applied in order when an object is rendered. They are applied after any global techniqueParameters the renderers set for each technique.

**Syntax** ::

    drawParameters.setTechniqueParameters(index, techniqueParameters);

``index``
    An index in to the array. Valid values are 0 to 7.

``techniqueParameters``
    A techniqueParameters object. This can be null to clear previously set values.

.. index::
    pair: DrawParameters; setVertexBuffers

`setVertexBuffer`
-----------------

**Summary**

Sets an element of the array of :ref:`VertexBuffers <vertexbuffer>` objects.

There should be an equal number of Semantics and VertexBuffers.

**Syntax** ::

    drawParameters.setVertexBuffer(index,  vertexBuffer);
    drawParameters.setSemantics(index,  semantics);

``index``
    An index in to the array. Valid values are 0 to 15.

``vertexBuffer``
    A vertexBuffer object. This can be null to clear previously set values.

.. index::
    pair: DrawParameters; setSemantics

`setSemantics`
--------------

**Summary**

Sets an element of the array of :ref:`Semantics <semantics>` objects.

There should be an equal number of Semantics and VertexBuffers.

**Syntax** ::

    drawParameters.setVertexBuffer(index,  vertexBuffer);
    drawParameters.setSemantics(index,  semantics);

``index``
    An index in to the array. Valid values are 0 to 15.

``semantics``
    A semantics object. This can be null to clear previously set values.

.. index::
    pair: DrawParameters; setOffset

`setOffset`
-----------

**Summary**

Sets an element of the array of offsets. The offsets are the index in the appropriate VertexBuffer that the index calls are relevant to.

These are 0 by default.

**Syntax** ::

    drawParameters.setVertexBuffer(index,  vertexBuffer);
    drawParameters.setSemantics(index,  semantics);
    drawParameters.setOffset(index,  offset);

``index``
    An index in to the array. Valid values are 0 to 15.

``offset``
    The offset value.

.. index::
    pair: DrawParameters; getTechniqueParameters

`getTechniqueParameters`
------------------------

**Summary**

Gets an element of the array of :ref:`TechniqueParameters <techniqueparameters>` objects.

**Syntax** ::

    var techniqueParameters = drawParameters.getTechniqueParameters(index);

``index``
    An index in to the array. Valid values are 0 to 7.

Returns a :ref:`TechniqueParameters <techniqueparameters>` object, which may be null.

.. index::
    pair: DrawParameters; getVertexBuffer

`getVertexBuffer`
-----------------

**Summary**

Gets an element of the array of :ref:`VertexBuffers <vertexbuffer>` objects.

**Syntax** ::

    var vertexBuffer = drawParameters.getVertexBuffer(index);

``index``
    An index in to the array. Valid values are 0 to 15.

Returns a :ref:`VertexBuffers <vertexbuffer>` object, which may be null.

.. index::
    pair: DrawParameters; getSemantics

`getSemantics`
--------------

**Summary**

Gets an element of the array of :ref:`Semantics <semantics>` objects.

**Syntax** ::

    var semantics = drawParameters.getSemantics(index);

``index``
    An index in to the array. Valid values are 0 to 15.

Returns a :ref:`Semantics <semantics>` object, which may be null.

.. index::
    pair: DrawParameters; getOffset

`getOffset`
-----------

**Summary**

Gets an element of the array of offsets.

**Syntax** ::

    var offset = drawParameters.getOffset(index);

``index``
    An index in to the array. Valid values are 0 to 15.

Returns a number.

Properties
==========

.. index::
    pair: DrawParameters; technique

`technique`
-----------

**Summary**

The :ref:`Technique <technique>` object to render with.

**Syntax** ::

    drawParameters.technique = shader.getTechnique(techniqueName);

.. index::
    pair: DrawParameters; primitive

`primitive`
-----------

**Summary**

The kind of :ref:`Primitive <graphicsDevice_PRIMITIVE>`.


**Syntax** ::

    drawParameters.primitive = graphicsDevice.PRIMITIVE_TRIANGLES;

.. index::
    pair: DrawParameters; indexBuffer

`indexBuffer`
-------------

**Summary**

Use for drawing indexed primitives with an :ref:`IndexBuffer <indexbuffer>`. If this is set then `count` must also be specified.

See `count` and `firstIndex` for non-indexed primitives.

**Syntax** ::

    drawParameters.indexBuffer = indexBuffer;
    drawParameters.numIndices = numIndices;

.. index::
    pair: DrawParameters; count

`count`
-------

**Summary**

If the indexBuffer is set then this is the number of indices to draw.

If the indexBuffer is *not* set then this is the number of vertices to draw.

**Syntax** ::

    drawParameters.indexBuffer = indexBuffer;
    drawParameters.count = numIndices;

or ::

    drawParameters.count = numVertices;
    drawParameters.firstIndex = firstIndex;

.. index::
    pair: DrawParameters; firstIndex

`firstIndex`
------------

**Summary**

If the indexBuffer is set then this is the offset in the IndexBuffer of the first index to be used.

If the indexBuffer is *not* set then this is the index in the VertexBuffer of first vertex to use.

It defaults to 0.

**Syntax** ::

    drawParameters.count = numVertices;
    drawParameters.firstIndex = firstIndex;

.. index::
    pair: DrawParameters; sortKey

.. _drawparameters_sortkey:

`sortKey`
---------

**Summary**

A number used to sort arrays of DrawParameters by. Typically for transparent passes this would be distance and for opaque passes a value designed for efficiency, e.g. grouping objects with the same technique together.

It defaults to 0.

**Syntax** ::

    drawParameters.sortKey = object.distance;

.. index::
    pair: DrawParameters; userData

`userData`
----------

**Summary**

An object for custom use. When using the JSLib renderers this object has the passIndex attached to it.

**Syntax** ::

    drawParameters.userData.passIndex = renderer.passIndex.transparent;
