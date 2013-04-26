.. index::
    single: Canvas

.. highlight:: javascript

.. _Canvas:

-----------------
The Canvas Object
-----------------

Implements the Canvas API.

For more information about the standard please read the
`canvas element specification <http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element>`_.

This article will only document the differences between the Turbulenz Engine implementation and browser implementations;
all methods and properties are supported as defined by the specification unless documented otherwise.

**Required scripts**

The Canvas object requires::

    /*{{ javascript("jslib/canvas.js") }}*/


Turbulenz Engine Canvas vs Browser Canvas
=========================================

There are several differences between the Turbulenz Engine canvas implementation and browser implementations:

Performance
-----------

The performance of the Turbulenz Engine implementation of canvas is generally better than the implementation provided by
the browser. Early browser canvas implementations did not use the GPU to render the canvas commands hence the
performance was poor. Most newer browsers do use the GPU and performance is much better but, based on our limited tests,
the Turbulenz Engine implementation is still faster.

Some potential reasons for the performance difference are that:

* Browsers follow the standard closely.
    * Turbulenz Canvas deviates from the standard in a couple of cases for performance reasons. The `Behavior` section documents these deviations.
* Browsers enable anti-aliasing by default.
    * When using Turbulenz Canvas you would need to use super-sampling or create the GraphicsDevice with multi-sampling enabled to get similar results - performance will not be severely affected.
* The canvas element is transparent by default, which may force additional blending with the background.
    * The Turbulenz element in the page is always opaque.
* Browsers may need to do complex composition to render the canvas element as part of the page.
    * The Turbulenz element is rendered independently of the page.

Behavior
--------

As well as performance differences, there are also behavioral differences when using the Turbulenz Engine Canvas.

**SVG paths**

Turbulenz Canvas provides support for drawing `SVG path strings <http://www.w3.org/TR/SVG/paths.html>`_ directly
with the method :ref:`CanvasContext.path <CanvasContext_path>`. SVG paths are a really good compact way of storing
complex shapes. This feature is not yet part of the standard.

**Anti-aliasing**

Turbulenz Canvas does not provide anti-aliasing by default. You would need to use super-sampling or create the
GraphicsDevice with multi-sampling enabled to get some form of anti-aliasing.

**Shadows Blur**

Turbulenz Canvas does not support blurring of shapes shadows.

**Complex Clipping**

Turbulenz Canvas only provides clipping for the intersection of the combined rectangular extents of the shapes on the
path. It uses the :ref:`scissor rectangle <graphicsdevice_setscissor>` provided by the GPU for fast clipping.

**Global composition**

Turbulenz Canvas supports all the global composition modes on the global alpha value but only applied locally to the
current shape, hence the composition is more 'local' than 'global'.

Full support for global composition of the most complex modes would require the use of temporary render targets and it
would severely impact performance.

**Non-zero winding number rule**

Turbulenz Canvas does not implement the non-zero winding number rule of the specification,
thus if two overlapping but otherwise independent subpaths have opposite windings, they will both be filled, as opposed
to what the standard requires.

**Filling concave polygons**

Turbulenz Canvas uses the `ear clipping <http://en.wikipedia.org/wiki/Polygon_triangulation#Ear_clipping_method>`_
algorithm to fill concave polygons. This method is suboptimal and only works on polygons without holes, but it is easy
to implement and requires less amount code to be written.

**Text rendering**

Turbulenz Canvas offers limited support for
`fillText <http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-filltext>`_
when a :ref:`FontManager <FontManager>` object is provided with :ref:`Canvas.setFontManager <Canvas_setFontManager>`:

* Pattern and gradient styles are not supported, only colors.
* Only `alphabetic` and `top` are supported for `textBaseline`.
* `left` and `start` are equivalent, `right` and `end` are also equivalent for `textAlign`.

Turbulenz Canvas does not support
`strokeText <http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-stroketext>`_.

**Begin/End Of Frame**

Turbulenz 2D Context Canvas requires calls to :ref:`CanvasContext.beginFrame <CanvasContext_beginFrame>` and
:ref:`CanvasContext.endFrame <CanvasContext_endFrame>` in order to support mixing of other 2D or 3D rendering to the
same rendering targets.

**Changing width or height**

Changing the width or height attributes of a browser canvas element resizes the HTML element on the page. In contrast,
changing the width or height attributes of a Turbulenz canvas object only scales the coordinate system used and leaves
the render-target size unchanged. The dimensions of the render target itself are defined by, and can be changed using,
:ref:`CanvasContext.beginFrame <CanvasContext_beginFrame>`.

**drawSystemFocusRing / drawCustomFocusRing / scrollPathIntoView**

Turbulenz Canvas does not support `drawSystemFocusRing`, `drawCustomFocusRing` or `scrollPathIntoView`.

**lineJoin / lineCap**

Turbulenz Canvas only supports `butt` for `lineCap` and `miter` for `lineJoin`.

**Graphics/Math device required**

When using the Turbulenz Canvas implementation, you are required to provide a mathDevice and graphicsDevice object.
This is so the implementation can setup the canvas element.
When running in plugin mode, this will use the plugin object. In canvas mode, this will attempt to create a WebGL 3D context.

.. NOTE::

    If using the Turbulenz Canvas with either plugin or canvas (WebGL), you will not be able to request the canvas context directly i.e.::

        var mathDevice = TurbulenzEngine.createMathDevice({});
        var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

        var canvasElem = TurbulenzEngine.canvas;
        var canvas = Canvas.create(graphicsDevice, mathDevice);

        //BAD: ctx === null
        var ctx = canvasElem.getContext('2d');

    since a context has already been created by the graphics device. To access it call::

        var mathDevice = TurbulenzEngine.createMathDevice({});
        var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

        var canvasElem = TurbulenzEngine.canvas;
        var canvas = Canvas.create(graphicsDevice, mathDevice);

        //OK: ctx === Turbulenz Canvas Context
        var ctx = canvas.getContext('2d');


Constructor
===========

.. index::
    pair: Canvas; create

.. _Canvas_create:

`create`
--------

**Summary**

Creates and returns a Canvas object with default state.

**Syntax** ::

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
    var mathDevice = TurbulenzEngine.createMathDevice({});
    var canvas = Canvas.create(graphicsDevice, mathDevice);


Methods
=======

.. index::
    pair: Canvas; setFontManager

.. _Canvas_setFontManager:

`setFontManager`
----------------

**Summary**

Sets the :ref:`FontManager <FontManager>` object to be used by the :ref:`CanvasContext <CanvasContext>` object to render
text.

**Syntax** ::

    canvas.setFontManager(fontManager);

``fontManager``
    A :ref:`FontManager <FontManager>` object.


Properties
==========

.. index::
    pair: Canvas; version

`version`
---------

**Summary**

The version number of the Canvas implementation.

**Syntax** ::

    var canvasVersionNumber = canvas.version;


.. index::
    single: CanvasContext

.. _CanvasContext:

------------------------
The CanvasContext Object
------------------------

Implements the 2D Context Canvas API.

For more information about the standard please read the
`2D context specification <http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#2dcontext>`_.

This article will only document the differences between the Turbulenz Engine implementation and the browser
implementation; all methods and properties are supported as defined by the specification unless documented otherwise.

To get a CanvasContext object you have to request a '2d' context from a :ref:`Canvas <Canvas>` object::

    var canvas2dContext = canvas.getContext('2d');


Methods
=======

.. index::
    pair: CanvasContext; beginFrame

.. _CanvasContext_beginFrame:

`beginFrame`
------------

**Summary**

Signals the beginning of a new render frame.

**Syntax** ::

    var viewportRect = [x, y, width, height];
    canvas2dContext.beginFrame(target, viewportRect);

``target``
    A :ref:`GraphicsDevice <GraphicsDevice>` object or a :ref:`Texture <Texture>` object.
    This will inform the 2D context of the rendering target for the drawing commands,
    it is needed in order to adjust the viewport and scissor rectangles.
    If not specified it will assume the target is the GraphicsDevice which was passed to
    :ref:`Canvas.create <Canvas_create>`.

``viewportRect``
    An optional array of numbers specifying the destination viewport rectangle on the target.
    The format is similar to that used by :ref:`setViewport  <graphicsdevice_setviewport>`.
    It defaults to the size of ``target``.


.. index::
    pair: CanvasContext; path

.. _CanvasContext_path:

`path`
------

**Summary**

Adds the given `SVG path string <http://www.w3.org/TR/SVG/paths.html>`_ to the current path.

**Syntax** ::

    canvas2dContext.beginPath();
    canvas2dContext.path("M 100 100 L 300 100 L 200 300 z");
    canvas2dContext.fillStyle = "red";
    canvas2dContext.fill();


.. index::
    pair: CanvasContext; endFrame

.. _CanvasContext_endFrame:

`endFrame`
----------

**Summary**

Signals the end of a render frame.

**Syntax** ::

    if (canvas2dContext.beginFrame(target, viewportRect))
    {
        canvas2dContext.endFrame();
    }



Properties
==========

.. index::
    pair: CanvasContext; version

`version`
---------

**Summary**

The version number of the CanvasContext implementation.

**Syntax** ::

    var ctxVersionNumber = ctx.version;
