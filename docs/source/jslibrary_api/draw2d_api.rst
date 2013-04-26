.. index:
    single: Draw2DSprite
    single: Draw2D

.. highlight:: javascript

.. _draw2dsprite:

=======================
The Draw2DSprite Object
=======================

Provides a more efficient path for sprite rendering in Draw2D.

Constructor
===========

.. index::
    pair: Draw2DSprite; create

`create`
--------

**Summary**

**Syntax** ::

    var sprite = Draw2DSprite.create({
        texture : tex,
        textureRectangle : [u1, v1, u2, v2],
        width : w,
        height : h,
        color : [r, g, b, a],
        x : x,
        y : y,
        rotation : rotation,
        origin : [ox, oy],
        scale : [sx, sy],
        shear : [sx, sy]
    });

``texture`` (optional)
    Specifies the :ref:`Texture <texture>` to be used in rendering the sprite. This texture must be mipmapped and have power of 2 dimensions.

    If unspecified (Or set to `null/undefined`), then a solid fill will be used when
    rendering the sprite instead.

``textureRectangle`` (optional)
    Specify which region of the texture is to be used for this sprite.

    Texture coordinates defined in pixels.

    Default value is `[0, 0, texture.width, texture.height]`. The implicit solid fill texture used when none is specified has dimensions `1x1`.

``width`` (optional*)
    Specify the width of the sprite in pixels.

    Default value is `texture.width`. `*` If texture is not specified then the width must be provided.

``height`` (optional*)
    Specify the height of the sprite in pixels.

    Default value is `texture.height`. `*` If texture is not specified then the height must be provided.

``color`` (optional)
    Specify the color of the sprite. Colors are given in normalized values in the range `[0,1]`.

    This color is multiplied with the texture to give the final appearance of the sprite before blending.

    Default value is `[1, 1, 1, 1]`.

``x`` (optional)
    Specify the x-coordinate in pixels for the sprite to be placed. The position is relative to the origin of the sprite.

    Default value is `0`.

``y`` (optional)
    Specify the y-coordinate in pixels for the sprite to be placed. The position is relative to the origin of the sprite.

    Default value is `0`.

``rotation`` (optional)
    Specify the rotation of the sprite in clockwise radians. Rotation is performed about the origin of the sprite.

    This transformation occurs after scaling and shearing, but before translation to position.

    Default value is `0`.

``origin`` (optional)
    Specify the local position for the origin of the sprite in pixels.

    This is where all transformations, and where positioning of sprite is given relative to: if this is the actual center of the sprite
    then when rotating, rotation will be performed about the center and when positioning, we define the position where the center of the sprite
    will go on the screen.

    Default value is `[width / 2, height / 2]`.

``scale`` (optional)
    Specify the scaling factors for the sprite.

    This transformation occurs after shearing, but before rotation and translation.

    Default value is `[1, 1]`.

``shear`` (optional)
    Specify the shearing factors for the sprite.

    This transformation occurs before any other.

    Default value is `[0, 0]`.

A value of `null` will be returned if a texture is not supplied and the width/height of the sprite are unspecified.

Properties
==========

The following are defined as properties of the sprite so as to be most efficient.

Any necessary side effects occur lazily upon drawing the sprite object.

.. index::
    pair: Draw2DSprite; x

`x`
---

**Summary**

The x-coordinate in pixels to place the origin of the sprite to the screen.

This value can be modified at any time including between draw calls of the same sprite object.

**Syntax** ::

    var x = sprite.x;
    sprite.x = 10;

.. index::
    pair: Draw2DSprite; y

`y`
---

**Summary**

The y-coordinate in pixels to place the origin of the sprite to the screen.

This value can be modified at any time including between draw calls of the same sprite object.

**Syntax** ::

    var y = sprite.y;
    sprite.y = 10;


.. index::
    pair: Draw2DSprite; rotation

`rotation`
----------

**Summary**

The rotation of the sprite about its origin in clockwise radians.

This value can be modified at any time including between draw calls of the same sprite object.

Modification to the rotation has a minimal overhead upon drawing the sprite. In any case that the rotation is unchanged there is no overhead.

**Syntax** ::

    var rotation = sprite.rotation;
    sprite.rotation = Math.PI;


Method
======

The following are defined as methods as it is not expected for them to be used continuously the same way that position and rotation is.

Any necessary side effects occur immediately so as not to add overhead to the draw calls.

.. index::
    pair: Draw2DSprite; getColor

`getColor`
----------

**Summary**

Get the current color of the sprite.

**Syntax** ::

    var color = sprite.getColor();
    // or
    sprite.getColor(color);

``color`` (optional)
    If specified then the color of the sprite will be stored into this array. Otherwise a new array will be created.

The return value is the array containing the color of the sprite. Modifications to this array will not change the color of the sprite which must
be done using the `setColor` method.


.. index::
    pair: Draw2DSprite; setColor

`setColor`
----------

**Summary**

Set the current color of the sprite.

**Syntax** ::

    sprite.setColor([r, g, b, a])

``color``
    The array containing the new color value of the sprite with normalized values in the range `[0,1]`.


.. index::
    pair: Draw2DSprite; getTexture

`getTexture`
------------

**Summary**

Get the current :ref:`Texture <texture>` assigned to the sprite.

**Syntax** ::

    var texture = sprite.getTexture();
    if (texture)
    {
        ...
    }


.. index::
    pair: Draw2DSprite; setTexture

`setTexture`
------------

**Summary**

Set the :ref:`Texture <texture>` assigned to the sprite.

**Syntax** ::

    sprite.setTexture(texture);

``texture``
    The texture to assign to sprite. If left unspecified, or explicitly set as `null/undefined` then a solid fill will be used to render the sprite. This texture must be mipmapped and have power of 2 dimensions.


.. index::
    pair: Draw2DSprite; getTextureRectangle

`getTextureRectangle`
---------------------

**Summary**

Get current texture-rectangle of sprite.

**Syntax** ::

    var textureRectangle = sprite.getTextureRectangle();
    // or
    sprite.getTextureRectangle(textureRectangle);

``textureRectangle`` (optional)
    If specified then the texture-rectangle of the sprite will be stored in this array. Otherwise a new array will be created.

The return value is the array containing texture-rectangle. Modifications to this array will not change the texture-rectangle of the sprite which must be done using the `setTextureRectangle` method.

.. index::
    pair: Draw2DSprite; setTextureRectangle

`setTextureRectangle`
---------------------

**Summary**

Set the texture-rectangle of the sprite.

**Syntax** ::

    sprite.setTextureRectangle([u1, v1, u2, v2]);

``textureRectangle``
    The array containing new texture-rectangle for Sprite.


.. index::
    pair: Draw2DSprite; getScale

`getScale`
----------

**Summary**

Get the current scaling of the sprite.

**Syntax** ::

    var scale = sprite.getScale();
    // or
    sprite.getScale(scale);

``scale`` (optional)
    If specified then the scale-factors of the sprite will be returned in this array. Otherwise a new array will be created.

The return value is the array containing the scale factors of the sprite. Modifications to this array will not change the scaling of the sprite which must be done using the `setScale` method.

.. index::
    pair: Draw2DSprite; setScale

`setScale`
----------

**Summary**

Set the current scaling of the sprite.

**Syntax** ::

    sprite.setScale([scaleX, scaleY]);

``scale``
    The new scale-factors of the sprite.


.. index::
    pair: Draw2DSprite; getShear

`getShear`
----------

**Summary**

Get the current shearing of the sprite.

**Syntax** ::

    var shear = sprite.getShear();
    // or
    sprite.getShear(shear);

``shear`` (optional)
    If specified then the shear factors of the sprite will be stored into this array. Otherwise a new array will be created.

The return value is the array containing the shearing factors of the sprite. Modifications to this array will not change the shearing of the sprite which must be done using the `setShear` method.

.. index::
    pair: Draw2DSprite; setShear

`setShear`
----------

**Summary**

Set the current shearing of the sprite.

**Syntax** ::

    sprite.setShear([shearX, shearY]);

``shear``
    The new shearing factors of the sprite.


.. index::
    pair: Draw2DSprite; getWidth

`getWidth`
----------

**Summary**

Get the current width of the sprite.

**Syntax** ::

    var width = sprite.getWidth();


.. index::
    pair: Draw2DSprite; setWidth

`setWidth`
----------

**Summary**

Set the current width of the sprite.

**Syntax** ::

    sprite.setWidth(width);

``width``
    The new width of the sprite.

.. index::
    pair: Draw2DSprite; getHeight

`getHeight`
-----------

**Summary**

Get the current height of the sprite.

**Syntax** ::

    var height = sprite.getHeight();


.. index::
    pair: Draw2DSprite; setHeight

`setHeight`
-----------

**Summary**

Set the current height of the sprite.

**Syntax** ::

    sprite.setHeight(height);

``height``
    The new height of the sprite.


.. index::
    pair: Draw2DSprite; getOrigin

`getOrigin`
-----------

**Summary**

Get the current locally defined origin of the sprite in pixels.

**Syntax** ::

    var origin = sprite.getOrigin();
    // or
    sprite.getOrigin(origin);

``origin`` (optional)
    If specified then the origin of the sprite will be stored into this array. Otherwise a new array will be created.

The return value is the array containing the origin of the sprite. Modifications to this array will not change the origin of the sprite which must be done using the `setOrigin` method.

.. index::
    pair: Draw2DSprite; setOrigin

`setOrigin`
-----------

**Summary**

Set the origin of the sprite.

**Syntax** ::

    sprite.setOrigin([originX, originY]);

``origin``
    The new origin for the sprite in pixels.













.. _draw2d:

=================
The Draw2D object
=================

Provides an efficient sprite based 2D rendering API based on WebGL.

Coordinate values are based on pixels relative to the top-left corner of the :ref:`GraphicsDevice <graphicsdevice>`
window.

Draw2D operates in 2 distinct states; a drawing, and non-drawing state.

Drawing state is entered whenever the first call to `begin` is made to permit rendering of objects and exited when the last call to `end` in the stack is made.

Draw calls may only be made in the drawing state, whilst actions like configuring the draw2D object, setting or copying a render target may only be made in the non-drawing state.

A third implicit state occurs when the draw2D object is destroyed and may no longer be used.

Constructor
===========

.. index::
    pair: Draw2D; create

`create`
--------

**Summary**

**Syntax** ::

    var draw2D = Draw2D.create({
        graphicsDevice : gd,
        blendModes : {
            "customBlendMode" : technique,
            ...
        },
        initialGpuMemory : 1024,
        maxGpuMemory : (1024 * 1024)
    });

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object used to create shaders and perform rendering.

``blendModes``
    An optional dictionary providing compatible :ref:`Technique <technique>` objects for custom
    rendering techniques and blending behaviors.

    To best explain what constitutes a compatible Technique, the built in blend modes are based upon
    the following CGFX shaders: ::

       float4 clipSpace;
       sampler2D texture = sampler_state
       {
           MinFilter = LinearMipMapNearest;
           MagFilter = Linear;
           WrapS = ClampToEdge;
           WrapT = ClampToEdge;
       };

       void vp_draw2D(in float2 InPosition : POSITION,
                      in float4 InColor : COLOR,
                      in float2 InTexCoord : TEXCOORD0,
                      out float4 OutPosition : POSITION,
                      out float4 OutColor : COLOR,
                      out float2 OutTexCoord : TEXCOORD0)
       {
           OutPosition = float4(InPosition * clipSpace.xy + clipSpace.zw, 0.0, 1.0);
           OutColor = InColor;
           OutTexCoord = InTexCoord;
       }

       float4 fp_draw2D(float4 InColor : COLOR,
                        float2 InTexCoord : TEXCOORD0) : COLOR
       {
           return InColor * tex2D(texture, InTexCoord);
       }

    Any custom Technique must expose the clipSpace and texture parameters but may do what it likes in terms
    of the output values and blending functions on the technique.

    Custom blend mode techniques are appended, and may replace those provided by Draw2D (opaque, alpha, additive)

``initialGpuMemory`` (optional)
    The initial amount of memory in bytes allocated on the GPU for vertex and index buffers by draw2D.

    This value is clamped to be in the range `[140,2293760]` and has default value of `140`.

``maxGpuMemory`` (optional)
    The maximum amount of memory in bytes that may be allocated on GPU for vertex and index buffers by draw2D.

    This value is clamped to be greater or equal to the initialGpuMemory, and has no upper limit though a hard
    limit is placed at `2293760` internally.

    The hard limit at `2293760` is a direct result of the amount of memory used per-vertex for drawing sprites and
    the choice of 16bit integers for index data.


Properties
==========

.. index::
    pair: Draw2D; scale

`scale`
-------

**Summary**

Dictionary of supported scale modes for parameters of `configure` method.

**Syntax** ::

    var mode0 = draw2D.scale.none;  //mode0 === 'none'
    var mode1 = draw2D.scale.scale; //mode1 === 'scale'

``none``
    With scale mode `'none'`, the draw2D viewport will be mapped to the screen with no scaling performed. The viewport will be aligned to the top-left corner of the graphicsDevice window.

    This is the default scale mode.

``scale``
    With scale mode `'scale'`, the draw2D viewport will be scaled to fit the graphicsDevice window with letter-boxing to keep aspect ratio unchanged. The viewport will be centered in the window.

.. note:: Read Only

.. index::
    pair: Draw2D; sort

`sort`
------

**Summary**

Dictionary of supported sort modes for parameters of `begin` method.

**Syntax** ::

    var mode0 = draw2D.sort.immediate; //mode0 === 'immediate'
    var mode1 = draw2D.sort.deferred;  //mode1 === 'deferred'
    var mode2 = draw2D.sort.texture;   //mode2 === 'texture'

``immediate``
    With sort mode `'immediate'`, each draw call made will invoke an immediate dispatch to the graphics device. This method of rendering is slow, but may be useful for debugging purposes.

``deferred``
    With sort mode `'deferred'`, each draw call made will be buffered with dispatching occurring only once the corresponding `end` or a nested `begin` call is made. Draw order will be preserved with draw calls batched into as long as possible chains to minimize state changes.

    This is the default sort mode.

``texture``
    With sort mode `'texture'`, draw calls will be buffered like in `deferred` mode. But draw order will not be preserved with all draw calls using the same texture batched together. In this way we guarantee at most `N` state changes, where `N` is the number of textures used.

    When only one texture is in use, this sort mode is equivalent to `deferred`.

    The benefits of this sort mode, whilst preserving draw order can often be found by creating a sprite sheet so that the number of different textures used is minimal.

.. note:: Read Only

.. index::
    pair: Draw2D; blend

`blend`
-------

**Summary**

Dictionary of supported blend modes for parameters of `begin` method.

**Syntax** ::

    var mode0 = draw2D.blend.opaque;   //mode0 === 'opaque'
    var mode1 = draw2D.blend.alpha;    //mode1 === 'alpha'
    var mode2 = draw2D.blend.additive; //mode2 === 'additive'

    // auxiliary blend modes defined in construction of draw2D object.
    ..
    var modeN = draw2D.blend.customBlendMode; //modeN === 'customBlendMode'

``opaque``
    With blend mode `'opaque'`, sprites will be drawn with full alpha regardless of any alpha present in textures, or the sprite color.

    This is the default blend mode.

``alpha``
    With blend mode `'alpha'`, sprites will be drawn respecting color and texture alpha values blending appropriately with previously drawn overlapping sprites.

``additive``
    With blend mode `'additive'`, sprites will be drawn respecting color and texture alpha values, but with color values added together when sprites overlap.

    In this blend mode draw order makes no difference.

.. note:: Read Only


.. index::
    pair: Draw2D; gpuMemoryUsage

`performanceData`
-----------------

**Summary**

Performance data collected by Draw2D.

For applicable fields, values can be reset by calling `resetPerformanceData`.

**Fields**

``gpuMemoryUsage``
    The amount of memory in bytes this draw2D object has allocated on the GPU for vertex and index buffers. This will increase as you draw more sprites at any given time.

    Draw2D will additionally allocate some additional bytes for such things as the default solid fill texture which are not included here.

    This field is `not` reset by `resetPerformanceData`.

``dataTransfers``
    The number of times Draw2D has dispatched vertex data to the GPU.

``batchCount``
    The number of batches Draw2D has rendered. This is the number of state changes for such things as texture or blend mode.

``minBatchSize``
    The minimum size of a rendered batch.

    This value is equal to `undefined` when `batchCount === 0`.

``maxBatchSize``
    The maximum size of a rendered batch.

    This value is equal to `undefined` when `batchCount === 0`.

``avgBatchSize``
    The average size of a rendered batch.

    This value is equal to `undefined` when `batchCount === 0`.

.. note:: Read Only



Method
======

.. index::
    pair: Draw2D; configure

`configure`
-----------

**Summary**

Configure memory usage parameters, viewport and scale mode.

**Syntax** ::

    var success = draw2D.configure({
        scaleMode : 'scale',
        viewportRectangle : [x1, y1, x2, y2]
    });

``scaleMode`` (optional)
    If specified will define the new scale mode to use. Otherwise the scale mode will be unchanged from its
    current value.

    If the scale mode defined is not present in the `draw2D.scale` dictionary then this method will
    fail and `false` will be returned.

    If defining scale mode `'scale'`, then a viewport must currently be defined on the draw2D object, whether
    by this call or a previous one.

``viewportRectangle`` (optional)
    If specified will define the new viewport to use. Otherwise the viewport will be unchanged from its current value.

    By default (and by setting explicitly to `null/undefined` in this call), there is no viewport for this draw2D object, and
    the entire graphicsDevice window will be used as an implicit viewport with top left corner at `(0,0)`.

    A viewport must be defined to use the `'scale'` scale mode.

This function cannot be called whilst in a drawing state.


.. index::
    pair: Draw2D; destroy

`destroy`
---------

**Summary**

Destroy draw2D object, performing necessary deallocation of resources from :ref:`GraphicsDevice <graphicsdevice>`.

**Syntax** ::

    draw2D.destroy();

Once destroyed, you may no longer use the draw2D object.

.. index::
    pair: Draw2D; begin

`begin`
-------

**Summary**

Begin a new drawing state.

**Syntax** ::

    var success = draw2D.begin(blendMode, sortMode);

``blendMode`` (optional)
    If this is the first call to begin, and this value is unspecified then the default blend mode `'opaque'` will be used.
    Otherwise when unspecified, the blend mode will be unchanged.

    This method will fail with `false` if blend mode is specified, but is not defined in the `draw2D.blend` dictionary.

``sortMode`` (optional)
    If this is the first call to begin, and this value is unspecified then the default sort mode `'deferred'` will be used.
    Otherwise when unspecified, the sort mode will be unchanged.

    This method will fail with `false` if sort mode is specified, but is not defined in the `draw2D.sort` dictionary.

These calls may as hinted be nested: ::

    draw2D.begin('alpha');
    // blendMode = 'alpha', sortMode = 'deferred' (default)

        draw2D.begin('additive');
        //blendMode = 'additive', sortMode = 'deferred' (unchanged)

        draw2D.end();

    // blendMode = 'alpha', sortMode = 'deferred' (both reverted to previous value at begin call)
    draw2D.end();

.. index::
    pair: Draw2D; end

`end`
-----

**Summary**

End a drawing state.

**Syntax** ::

    var success = draw2D.end();

This call may only occur during a drawing state, in any other case will fail with `false`.

.. index::
    pair: Draw2D; clear

`clear`
-------

**Summary**

Clear current draw target.

**Syntax** ::

    var success = draw2D.clear([r, g, b, a]);

``clearColor`` (optional)
    Specify the RGBA color with which to clear the current draw target.

    Color is defined with normalized values in the range `[0, 1]`.

    Default value is `[0, 0, 0, 1]`

.. index::
    pair: Draw2D; getViewport

`getViewport`
-------------

**Summary**

Get current viewport.

**Syntax** ::

    var viewport = draw2D.getViewport();
    // or
    draw2D.getViewport(viewport);

``viewport`` (optional)
    If specified the viewport will be stored into this array. Otherwise a new array will be created.

The return value is the array containing the current viewport (if defined), or in the case that a viewport is not presently defined on the draw2D object the implicit viewport `[0, 0, graphicsDevice.width, graphicsDevice.height]`.

.. index::
    pair: Draw2D; getScreenSpaceViewport

`getScreenSpaceViewport`
------------------------

**Summary**

Get current viewport in screen coordinates.

**Syntax** ::

    var viewport = draw2D.getScreenSpaceViewport();
    // or
    draw2D.getScreenSpaceViewport(viewport);

``viewport`` (optional)
    If specified the viewport will be stored into this array. Otherwise a new array will be created.

The return value is the array containing the screen space viewport, with viewport defined as in `getViewport`.

Screen space is defined in pixels with `(0,0)` at the top-left corner of the graphicsDevice window.


.. index::
    pair: Draw2D; viewportMap

`viewportMap`
-------------

**Summary**

Map screen space point into draw2D point.

**Syntax** ::

    var point = draw2D.viewportMap(x, y);
    // or
    draw2D.viewportMap(x, y, point);

``x``
    x-coordinate in screen space to be mapped.

``y``
    y-coordinate in screen space to be mapped.

``point`` (optional)
    If specified the point will be stored into this array. Otherwise a new array will be created.

Returns the array containing mapped point. This point is not clamped to the viewport.

Screen space is defined in pixels with `(0,0)` at the top-left corner of the graphicsDevice window.


.. index::
    pair: Draw2D; viewportUnmap

`viewportUnmap`
---------------

**Summary**

Map draw2D point into screen space point.

**Syntax** ::

    var point = draw2D.viewportUnmap(x, y);
    // or
    draw2D.viewportUnmap(x, y, point);

``x``
    x-coordinate in draw2D to be unmapped.

``y``
    y-coordinate in draw2D to be unmapped.

``point`` (optional)
    If specified the point will be stored into this array. Otherwise a new array will be created.

Returns the array containing unmapped point. This point is not clamped to the graphicsDevice window.

Screen space is defined in pixels with `(0,0)` at the top-left corner of the graphicsDevice window.

.. index::
    pair: Draw2D; viewportClamp

`viewportClamp`
---------------

**Summary**

Clamp draw2D point to the viewport.

**Syntax** ::

    draw2D.viewportClamp(point);

``point``
    The point to be clamped to viewport. This point is modified.

This function will return the same point object after clamping.


.. index::
    pair: Draw2D; draw

`draw`
------

**Summary**

Draw a sprite defined by a rotated rectangle with given texture to draw2D.

**Syntax** ::

    draw2D.draw({
        texture : texture,
        sourceRectangle : [u1, v1, u2, v2],
        destinationRectangle : [x1, y1, x2, y2],
        rotation : rotation,
        origin : [x, y],
        color : [r, g, b, a]
    });

``texture`` (optional)
    Specifies the :ref:`Texture <texture>` to use in rendering the sprite. This texture must be mipmapped and have power of 2 dimensions.

    If unspecified (Or explicitly set as `null/undefined`) then the sprite will be drawn with a solid fill.

``sourceRectangle`` (optional)
    Specifies the region of the texture corresponding to the sprite to be drawn.

    This field is unused if no texture is specified. Otherwise its default value is `[0, 0, texture.width, texture.height]`.

``destinationRectangle``
    The rectangle in draw2D coordinates to which the sprite is drawn (Ignoring any rotation).

``rotation`` (optional)
    Specify the rotation of the sprite rectangle in clockwise radians.

    This rotation will occur at the defined origin of the sprite.

    Drawing a sprite with a non-zero rotation is inherently slower than drawing with `0` rotation.

    By default this is equal to `0`.

``origin`` (optional)
    Specify the origin of the sprite relative to the top-left corner of the destination rectangle in pixels.

    This is the center of rotation for the sprite with default value `[width / 2, height / 2]` for the width/height of `destinationRectangle`.

``color`` (optional)
    The color to draw sprite with. This is specified with normalized values in the range `[0,1]`.

    This color is multiplied with the sprite texture to determine final sprite appearance before blending.

    By default this is equal to `[1, 1, 1, 1]`.

For performance reasons, this method does not perform any checking of input parameters or draw2D object state but should be called only whilst in a drawing state.


.. index::
    pair: Draw2D; drawSprite

`drawSprite`
------------

**Summary**

Draw a :ref:`Draw2DSprite <draw2dsprite>` object to draw2D.

**Syntax** ::

    draw2D.draw(sprite);

``sprite``
    The :ref:`Draw2DSprite <draw2dsprite>` to be drawn.

For performance reasons, this method does not perform any checking of input parameters or draw2D object state but should be called only whilst in a drawing state.


.. index::
    pair: Draw2D; drawRaw

`drawRaw`
---------

**Summary**

Draw buffered sprite information to draw2D with given :ref:`Texture <texture>`.

This is the most performant way of drawing sprites and is best used to pre-batch large amounts of
static sprites.

**Syntax** ::

    draw2D.drawRaw(texture, buffer, count, offset)

``texture``
    The :ref:`Texture <texture>` to draw sprites from buffer with. This texture must be mipmapped and have power of 2 dimensions.

    If `undefined` or `null` then the sprites will be drawn with a solid
    fill.

``buffer``
    Buffered sprite data to be drawn. This buffer must adhere to the following semantics: ::

        [ x1, y1, x2, y2,
          x3, y3, x4, y4,
          cr, cg, cb, ca,
          u1, v1, u2, v2,
          ** repeated ** ]

   Each sprite is represented by 16 values:

   ``x1, y1 to x4, y4``
        The vertices of the quad in draw2D coordinates defining the post-transformed sprite rectangle.

        These are given in the order `top-left`, `top-right`, `bottom-left`, `bottom-right`.

    ``cr, cg, cb, ca``
        The normalised color values for the sprite in the range `[0,1]`.

    ``u1, v1, u2, v2``
        The `normalized` texture coordinates for the region of the texture corresponding to the sprite.

        Normalized texture coordinates can be found by dividing by texture width/height to get values in the range `[0, 1]`.

``count`` (optional)
    Specify the number of sprites to be drawn.

    By default this is equal to `buffer.length / 16`.

``offset`` (optional)
    Specify a `sprite` offset at which to begin drawing. This is an offset in terms of the number of sprites represented to be skipped so that an offset of `1` means to started rendering at index `16` in the buffer.

    By default this is equal to `0`.

For performance reasons, this method does not perform any checking of input parameters or draw2D object state but should only be
called in a drawing state.


.. index::
    pair: Draw2D; bufferSprite

`bufferSprite`
--------------

**Summary**

Buffer the present state of a :ref:`Draw2DSprite <draw2dsprite>` object for use with `drawRaw` method.

**Syntax** ::

    draw2D.bufferSprite(buffer, sprite, index);

``buffer``
    The buffer (An `Array`, or WebGL `Float32Array`) in which to place sprite data.

    In the case of a WebGL Array, it should be large enough to fit the data.

``sprite``
    The :ref:`Draw2DSprite <draw2dsprite>` object to be buffered.

``index``
    The index at which to place the sprite data. This is specified as a `sprite` index so that an index of `1` will insert the sprite data into the second set of `16` values of the buffer.

For performance reasons, this method does not perform any checking of input parameters. It can be called at any time.


.. index::
    pair: Draw2D; createRenderTarget

`createRenderTarget`
--------------------

**Summary**

Create a new 2D :ref:`RenderTarget <rendertarget>` object with a related :ref:`Texture <texture>`.

**Syntax** ::

    // Dynamic render target matching viewport size.
    // When the viewport changes size, so will this render target and its texture.
    var renderTargetIndex = draw2D.createRenderTarget({
        name : "texture name",
        backBuffer : true
    });

    // Static render target with supplied fixed size.
    var renderTargetIndex = draw2D.createRenderTarget({
        name : "texture name",
        backBuffer : true
        width : targetWidth,
        height : targetHeight,
    });

``name`` (optional)
    Specify the name for the related :ref:`Texture <texture>` object.

    If unspecified the name `"RenderTarget#N"` with `N` replaced by the returned index will be used.

``backBuffer`` (optional)
    Specify the nature of this render target.

    So that the texture related to this render target can be mipmapped, the texture is created with power of 2 dimensions.

    If this render target is used (as is the usual case) as an intermediate rendering buffer before or during application of texture effects before being copied onto the screen, then we want to have pixel perfect rendering.

    The only way to achieve that is to only render to the subset of the texture corresponding to the width/height of the render target.

    This field - when `true` (default) - specifies that this is the case, and this property is respected when copying a render target to draw2d.

    If `false`, then the entire texture will be used instead.

``width`` (optional)
    Specify a fixed width for this render target.

``height`` (optional)
    Specify a fixed height for this render target.

    The `width/height` fields are only respected when both are supplied, and in this case the render target will be made static.

    When one or both of the fields are unspecified, this render target is created as dynamic and will be dynamically reconstructed when the viewport changes size.

This render target, and its related texture are owned by the draw2D object, and will be destroyed when the draw2D object is destroyed.


.. index::
    pair: Draw2D; getRenderTarget

`getRenderTarget`
-----------------

**Summary**

Get the current :ref:`RenderTarget <rendertarget>` object allocated for the given render target index.

**Syntax** ::

    var renderTarget = draw2D.getRenderTarget(renderTargetIndex);

For static render targets, you may assume that the RenderTarget object allocated will not be changed at run-time and that this
method will always return the same object.

However it is suggested that you do not rely on this assumption should you later decide to change the render target to be created as dynamic.


.. index::
    pair: Draw2D; getRenderTargetTexture

`getRenderTargetTexture`
------------------------

**Summary**

Get the current :ref:`Texture <texture>` object allocated for the given render target index.

**Syntax** ::

    var texture = draw2D.getRenderTargetTexture(renderTargetIndex);

For static render targets, you may assume that the Texture object allocated will not be changed at run-time and that this method
will always return the same object.

However it is suggested that you do not rely on this assumption should you later decide to change the render target to be created as dynamic.

This texture is equal to `draw2D.getRenderTarget(renderTargetIndex).colorTexture0`.


.. index::
    pair: Draw2D; setBackBuffer

`setBackBuffer`
---------------

**Summary**

Set current render target of draw2D object to the graphicsDevice back-buffer.

**Syntax** ::

    var success = draw2D.setBackBuffer();

This method may only be called outside of a drawing state and will fail returning `false` otherwise.


.. index::
    pair: Draw2D; setRenderTarget

`setRenderTarget`
-----------------

**Summary**

Set current render target of draw2D object to the given render target.

**Syntax** ::

    var success = draw2D.setRenderTarget(renderTargetIndex);

This method may only be called outside of a drawing state and will fail returning `false` otherwise.

This method will also fail if the given index does not relate to any created render target.


.. index::
    pair: Draw2D; copyRenderTarget

`copyRenderTarget`
------------------

**Summary**

Copy the given render target to fill the active draw target of draw2D.

**Syntax** ::

    var success = draw2D.copyRenderTarget(renderTargetIndex);

This method is not a draw call, and may only occur outside of a drawing state.

This method is a fast copy, with no blending performed.

This method will return `false` if the given index does not relate to any created render target.

This method is sensitive to the render target nature; if the render target was created with `backBuffer = true` so that only the subset of the texture representing the render target dimension is used, then only that subset will be copied to draw2D.


.. index::
    pair: Draw2D; resetPerformanceData

`resetPerformanceData`
----------------------

**Summary**

Reset recorded performance data for this object.

**Syntax** ::

    draw2D.resetPerformanceData();

