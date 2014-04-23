.. index::
    single: RenderTarget

.. highlight:: javascript

.. _renderTarget:

-----------------------
The RenderTarget Object
-----------------------

A RenderTarget object is collection of renderable objects, :ref:`Textures <texture>` or :ref:`RenderBuffers <renderbuffer>`, that can be set as a rendering target.

:ref:`GraphicsDevice.maxSupported("RENDERTARGET_COLOR_TEXTURES") <graphicsdevice_maxsupported>` can be use to check the number of supported color textures.

Constructor
===========

A RenderTarget object can be constructed with :ref:`GraphicsDevice.createRenderTarget <graphicsdevice_createrendertarget>`.

Methods
=======

.. index::
    pair: RenderTarget; getWidth

`getWidth`
----------
**Summary**

Get the width of the current RenderTarget object.

**Syntax** ::

    var width = renderTarget.getWidth();


.. index::
    pair: RenderTarget; getHeight

`getHeight`
-----------
**Summary**

Get the height of the current RenderTarget object.

**Syntax** ::

    var height = renderTarget.getHeight();


.. index::
    pair: RenderTarget; setColorTexture0

`setColorTexture0`
------------------
**Summary**

Change the first color attachement of the RenderTarget.

**Syntax** ::

    renderTarget.setColorTexture0(texture);

The `Texture` parameter should be a :ref:`Texture <texture>` object and
it must much the dimensions and format of the previous color attachement.


.. index::
    pair: RenderTarget; setColorTexture1

`setColorTexture1`
------------------
**Summary**

Change the second color attachement of the RenderTarget.

**Syntax** ::

    renderTarget.setColorTexture1(texture);

The `Texture` parameter should be a :ref:`Texture <texture>` object and
it must much the dimensions and format of the previous color attachement.


.. index::
    pair: RenderTarget; setColorTexture2

`setColorTexture2`
------------------
**Summary**

Change the third color attachement of the RenderTarget.

**Syntax** ::

    renderTarget.setColorTexture2(texture);

The `Texture` parameter should be a :ref:`Texture <texture>` object and
it must much the dimensions and format of the previous color attachement.


.. index::
    pair: RenderTarget; setColorTexture3

`setColorTexture3`
------------------
**Summary**

Change the fourth color attachement of the RenderTarget.

**Syntax** ::

    renderTarget.setColorTexture3(texture);

The `Texture` parameter should be a :ref:`Texture <texture>` object and
it must much the dimensions and format of the previous color attachement.


.. index::
    pair: RenderTarget; destroy

`destroy`
---------

**Summary**

Releases the RenderTarget resources, the object will be invalid after the method is called.

**Syntax** ::

    renderTarget.destroy();


Properties
==========

.. index::
    pair: RenderTarget; id

`id`
----

**Summary**

The unique identification number of the RenderTarget object.

**Syntax** ::

    var renderTargetId = renderTarget.id;

.. note:: Read Only


.. index::
    pair: RenderTarget; colorTexture0

`colorTexture0`
---------------

**Summary**

The Texture object set as the target for color rendering at index 0.

**Syntax** ::

    var mainColor = renderTarget.colorTexture0;

.. note:: Read Only


.. index::
    pair: RenderTarget; colorTexture1

`colorTexture1`
---------------

**Summary**

The Texture object set as the target for color rendering at index 1.

**Syntax** ::

    var color1 = renderTarget.colorTexture1;

.. note:: Read Only


.. index::
    pair: RenderTarget; colorTexture2

`colorTexture2`
---------------

**Summary**

The Texture object set as the target for color rendering at index 2.

**Syntax** ::

    var color2 = renderTarget.colorTexture2;

.. note:: Read Only


.. index::
    pair: RenderTarget; colorTexture3

`colorTexture3`
---------------

**Summary**

The Texture object set as the target for color rendering at index 3.

**Syntax** ::

    var color3 = renderTarget.colorTexture3;

.. note:: Read Only


.. index::
    pair: RenderTarget; depthBuffer

`depthBuffer`
-------------

**Summary**

The RenderBuffer object set as the target for depth rendering.

**Syntax** ::

    var depthBuffer = renderTarget.depthBuffer;

.. note:: Read Only


.. index::
    pair: RenderTarget; depthTexture

`depthTexture`
--------------

**Summary**

The Texture object set as the target for depth rendering.

**Syntax** ::

    var depthTexture = renderTarget.depthTexture;

.. note:: Read Only


.. index::
    pair: RenderTarget; face

`face`
------

**Summary**

The index of the destination face when using cubemaps as rendering targets.

**Syntax** ::

    var faceIndex = renderTarget.face;

.. note:: Read Only
