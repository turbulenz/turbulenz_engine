.. index::
    single: Texture

.. highlight:: javascript

.. _texture:

------------------
The Texture Object
------------------

A Texture object is a multidimensional container of pixel data.

Constructor
===========

You can create a texture using the :ref:`GraphicsDevice.createTexture <graphicsdevice_createtexture>` function.

Methods
=======

.. _texture_setdata:

.. index::
    pair: Texture; setData

`setData`
---------

**Summary**

Set the data by passing in an array of numbers.

Pixel data consists of an array of
numbers, one value for each component of every pixel.  The number of
components per pixel depends on the pixel format.

Create the texture as dynamic if you are planning to update the pixel
data at runtime.  If the texture has a mipmap chain all the levels
will be recalculated.

This function accepts Typed Arrays and will set the data in an
optimized way if the size and type of the Typed Array are appropriate
for the PixelFormat of the Texture (as described in the WebGL
standards).

Changing the pixel data can be an expensive operation.

**Syntax** ::

    //set the data post-creation for a 2x2 texture of depth 1 and format 'R8G8B8A8'
    texture.setData([255, 0, 0, 255,
                     0, 255, 0, 255,
                     0, 255, 0, 255,
                     0, 0, 255, 255]);

When Typed Arrays are available, the following is also valid ::

    texture.setData(new Uint8Array([255, 0, 0, 255,
                                    0, 255, 0, 255,
                                    0, 255, 0, 255,
                                    0, 0, 255, 255]));

To only update a region of the texture ::

    texture.setData(pixelData, face, level, x, y, width, height);

Where `face` should be zero except for cubemap textures and `level`
refers to the mipmap level to be updated.


.. index::
    pair: Texture; destroy

`destroy`
---------

**Summary**

Releases the Texture resources; the object will be invalid after the method is called.

**Syntax** ::

    texture.destroy();


Properties
==========

.. index::
    pair: Texture; name

`name`
------

**Summary**

The name of the texture object,
usually the path to the image file that provided the pixel data.

**Syntax** ::

    var textureName = texture.name;

.. note:: Read Only


.. index::
    pair: Texture; id

`id`
----

**Summary**

The unique identification number of the Texture object.

**Syntax** ::

    var textureId = texture.id;

.. note:: Read Only


.. index::
    pair: Texture; width

`width`
-------

**Summary**

Width of the top-level of the texture in pixels.

**Syntax** ::

    var textureWidth = texture.width;

.. note:: Read Only


.. index::
    pair: Texture; height

`height`
--------

**Summary**

Height of the top-level of the texture in pixels.

**Syntax** ::

    var textureHeight = texture.height;

.. note:: Read Only


.. index::
    pair: Texture; depth

`depth`
-------

**Summary**

Depth of the top-level of the texture in pixels. It would be 1 for non 3D textures.

**Syntax** ::

    var textureDepth = texture.depth;

.. note:: Read Only


.. index::
    pair: Texture; format

`format`
--------

**Summary**

Format used to store the pixel data.

**Syntax** ::

    var textureFormat = texture.format;

    var gd == TurbulenzEngine.getGraphicsDevice();
    if (textureFormat === gd.PIXELFORMAT_R8G8B8A8)
    {
        // ...
    }

.. note:: Read Only


.. index::
    pair: Texture; cubemap

`cubemap`
---------

**Summary**

True if the texture is a cubemap, false otherwise.

**Syntax** ::

    var isCubemap = texture.cubemap;

.. note:: Read Only


.. index::
    pair: Texture; mipmaps

`mipmaps`
---------

**Summary**

True if the texture has a mipmap chain, false otherwise.

**Syntax** ::

    var hasMipmaps = texture.mipmaps;

.. note:: Read Only


.. index::
    pair: Texture; renderable

`renderable`
------------

**Summary**

True if the texture can be rendered to, false otherwise.

**Syntax** ::

    var isRenderable = texture.renderable;

.. note:: Read Only


.. index::
    pair: Texture; dynamic

`dynamic`
---------

**Summary**

True if the texture was created as dynamic and hence can be modified at runtime, false otherwise.

**Syntax** ::

    var isDynamic = texture.dynamic;

.. note:: Read Only
