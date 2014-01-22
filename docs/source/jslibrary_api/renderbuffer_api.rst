.. index::
    single: RenderBuffer

.. highlight:: javascript

.. _renderbuffer:

-----------------------
The RenderBuffer Object
-----------------------

A RenderBuffer object is a 2D container of pixel data to be used as a target for rendering, mostly to store depth information.

Constructor
===========

A RenderBuffer object can be constructed with :ref:`GraphicsDevice.createRenderBuffer <graphicsdevice_createrenderbuffer>`.


Methods
=======


.. index::
    pair: RenderBuffer; destroy

`destroy`
---------

**Summary**

Releases the RenderBuffer resources, the object will be invalid after the method is called.

**Syntax** ::

    renderBuffer.destroy();


Properties
==========

.. index
    pair: RenderBuffer; id

`id`
----

**Summary**

The unique identification number of the RenderBuffer object.

**Syntax** ::

    var renderBufferId = renderBuffer.id;

.. note:: Read Only


.. index::
    pair: RenderBuffer; width

`width`
-------

**Summary**

Width of the render buffer in pixels.

**Syntax** ::

    var renderBufferWidth = renderBuffer.width;

.. note:: Read Only


.. index::
    pair: RenderBuffer; height

`height`
--------

**Summary**

Height of the render buffer in pixels.

**Syntax** ::

    var renderBufferHeight = renderBuffer.height;

.. note:: Read Only


.. index::
    pair: RenderBuffer; format

`format`
--------

**Summary**

Name of the format used to store the pixel data.

**Syntax** ::

    var renderBufferFormat = renderBuffer.format;

.. note:: Read Only
