.. index::
    single: DebugDraw

.. highlight:: javascript

.. _physics2d_debug:

=============================
The Physics2DDebugDraw Object
=============================

Provides fast line based, GPU powered drawing API for 2d debug drawing, and drawing
of Physics2D physics data.

Coordinates of the DebugDraw object are that of Physics2D, with scaling to pixels
defined solely by the viewports set on this object.

**Required scripts**

The Physics2DDevice object requires::

    /*{{ javascript("jslib/physics2ddevice.js") }}*/
    /*{{ javascript("jslib/physics2ddebugdraw.js") }}*/


Constructor
===========

**Summary**

Create a :ref:`DebugDraw <physics2d_debug>` object.

DebugDraw object uses the :ref:`GraphicsDevice <graphicsdevice>` object to render line based primitives on the GPU with methods for rendering a
Physics2D World and other Physics2D objects.

**Syntax** ::

    var debug = Physics2DDebugDraw({
        graphicsDevice : gd
    });

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object for the debug draw to use.



Methods
=======

.. index::
    pair: DebugDraw; setPhysics2DViewport

`setPhysics2DViewport`
----------------------

**Summary**

Define the region in Physics2D coordinates that is to be drawn to the screen.

This method will take effect upon the next call to `debug.begin()`.

**Syntax** ::

    debug.setPhysics2DViewport(rectangle);

``rectangle``
    The rectangle in Physics2D coordinates to be drawn.

    If using :ref:`Draw2D <draw2d>` in conjunction with Physics2D, then as long as your graphics logic uses the same coordinates as Physics2D you would most likely find that using the value of `draw2D.getViewport()` is the best fit for the Physics2D viewport so that debug drawing is correctly aligned.


.. index::
    pair: DebugDraw; setScreenViewport

`setScreenViewport`
-------------------

**Summary**

Define the region in screen pixels (with top-left corner at (0,0)) to which the
Physics2D viewport will be mapped onto.

Anything outside of this region will be clipped.

**Syntax** ::

    debug.setScreenViewport(rectangle);

``rectangle``
    The rectangle in screen pixels to be drawn to.

    If using :ref:`Draw2D <draw2d>` in conjunction with Physics2D, then you would most likely find that using the value of `draw2D.getScreenSpaceViewport()` is the best fit for the Screen viewport so that debug drawing is correctly aligned.


.. index::
    pair: DebugDraw; begin

`begin`
-------

**Summary**

Begin debug drawing state.

This call will update shader parameters for drawing based on viewports, as well as setting the scissor on the graphics device.

**Syntax** ::

    debug.begin();


.. index::
    pair: DebugDraw; end

`end`
-----

**Summary**

End debug drawing state.

This call will dispatch all drawing data to the GPU that has accumulated since the matching calling to `begin()`.

**Syntax** ::

    debug.end();


.. index::
    pair: DebugDraw; destroy

`destroy`
---------

**Summary**

Destroy debug draw object, releasing memory allocated on GPU through the :ref:`GraphicsDevice <graphicsdevice>`

You cannot use this object after it has been destroyed.

**Syntax** ::

    debug.destroy();


.. index::
    pair: DebugDraw; drawRigidBody

`drawRigidBody`
---------------

**Summary**

Draw a :ref:`RigidBody <physics2d_body>` object.

The colors with which the shapes of the body are drawn is controlled by the various color properties of this object.

**Syntax** ::

    debug.drawRigidBody(rigidBody);

.. index::
    pair: DebugDraw; drawConstraint

`drawConstraint`
----------------

**Summary**

Draw a :ref:`Constraint <physics2d_constraint>` object.

Drawing of the constraint is deferred to the constraint object itself. In built constraints make use of the common DebugDraw methods and colors listed in the properties of this object.

**Syntax** ::

    debug.drawConstraint(constraint);

.. index::
    pair: DebugDraw; drawWorld

`drawWorld`
-----------

**Summary**

Draw a :ref:`World <physics2d_world>` object.

Control of what parts of the world is drawn is given by the various properties of this object like `showRigidBodies` and `showContacts`.

**Syntax** ::

    debug.drawWorld(world);



.. index::
    pair: DebugDraw; drawLine

`drawLine`
----------

**Summary**

Draw a single line with given color.

**Syntax** ::

    debug.drawLine(x1, y1, x2, y2, color);

``x1``
    The x-coordinate for the start point of the line in Physics2D coordinates.

``y1``
    The y-coordinate for the start point of the line in Physics2D coordinates

``x2``
    The x-coordinate for the end point of the line in Physics2D coordinates

``y2``
    The y-coordinate for the end point of the line in Physics2D coordinates.

``color``
    The normalized RGBA color values in the range `[0, 1]`.

.. index::
    pair: DebugDraw; drawCurve

`drawCurve`
-----------

**Summary**

Draw a quadratic bezier curve with given color.

The accuracy with which the curve is drawn is controlled by the `curveMaxError` property.

**Syntax** ::

    debug.drawCurve(x1, y1, cx, cy, x2, y2, color);

``x1``
    The x-coordinate for the start point of the curve in Physics2D coordinates.

``y1``
    The y-coordinate for the start point of the curve in Physics2D coordinates

``cx``
    The x-coordinate for the bezier control point in Physics2D coordinates.

``cy``
    The y-coordinate for the bezier control point in Physics2D coordinates.

``x2``
    The x-coordinate for the end point of the curve in Physics2D coordinates

``y2``
    The y-coordinate for the end point of the curve in Physics2D coordinates.

``color``
    The normalized RGBA color values in the range `[0, 1]`.


.. index::
    pair: DebugDraw; drawRectangle

`drawRectangle`
---------------

**Summary**

Draw an axis aligned rectangle with given color.

**Syntax** ::

    debug.drawRectangle(x1, y1, x2, y2, color);

``x1``
    The x-coordinate of the top-left corner of rectangle in Physics2D coordinates.

``y1``
    The y-coordinate of the top-left corner of rectangle in Physics2D coordinates

``x2``
    The x-coordinate of the bottom-right corner of rectangle in Physics2D coordinates

``y2``
    The y-coordinate of the bottom-right corner of rectangle in Physics2D coordinates.

``color``
    The normalized RGBA color values in the range `[0, 1]`.


.. index::
    pair: DebugDraw; drawCircle

`drawCircle`
------------

**Summary**

Draw a circle with given color.

The accuracy with which this circle is drawn is controlled by the `circleMaxError` property of this object.

**Syntax** ::

    debug.drawCircle(x, y, radius, color);

``x``
    The x-coordinate of the center of the circle in Physics2D coordinates.

``y``
    The y-coordinate of the center of the circle in Physics2D coordinates.

``radius``
    The radius of the circle in Physics2D coordinates.

``color``
    The normalized RGBA color values in the range `[0, 1]`.


.. index::
    pair: DebugDraw; drawSpiral

`drawSpiral`
------------

**Summary**

Draw a circular spiral with given color.

**Syntax** ::

    debug.drawSpiral(x, y, angle1, angle2, radius1, radius2, color);

``x``
    The x-coordinate of the center of the spiral in Physics2D coordinates.

``y``
    The y-coordinate of the center of the spiral in Physics2D coordinates.

``angle1``
    The angle for the start point in spiral in clockwise radians.

``angle2``
    The angle for the end point in spiral in clockwise radians.

``radius1``
    The radius to the start point in spiral in Physics2D coordinates.

``radius2``
    The radius to the end point in spiral in Physics2D coordinates.

``color``
    The normalized RGBA color values in the range `[0, 1]`.

.. index::
    pair: DebugDraw; drawLinearSpring

`drawLinearSpring`
------------------

**Summary**

Draw a linear spring (sine-wave) with given color.

**Syntax** ::

    debug.drawLinearSpring(x1, y1, x2, y2, numCoils, radius, color);

``x1``
    The x-coordinate for the start point of the spring in Physics2D coordinates.

``y1``
    The y-coordinate for the start point of the spring in Physics2D coordinates

``x2``
    The x-coordinate for the end point of the spring in Physics2D coordinates

``y2``
    The y-coordinate for the end point of the spring in Physics2D coordinates.

``numCoils``
    The number of coils (full sine waves) in the spring. This value must be
    positive.

``radius``
    The radius of the spring (amplitude of the sine waves) in Physics2D coordinates.

``color``
    The normalized RGBA color values in the range `[0, 1]`.

.. index::
    pair: DebugDraw; drawSpiralSpring

`drawSpiralSpring`
------------------

**Summary**

Draw a spiral spring (sine-wave perturbed circular spiral) with given color.

The percentage of the gap between spiral arms into which the spring is drawn is controlled by the `spiralSpringSize` property of this object.

**Syntax** ::

    debug.drawSpiralSpring(x, y, angle1, angle2, radius1, radius2, numCoils, color);

``x``
    The x-coordinate of the center of the spiral in Physics2D coordinates.

``y``
    The y-coordinate of the center of the spiral in Physics2D coordinates.

``angle1``
    The angle for the start point in spiral in clockwise radians.

``angle2``
    The angle for the end point in spiral in clockwise radians.

``radius1``
    The radius to the start point in spiral in Physics2D coordinates.

``radius2``
    The radius to the end point in spiral in Physics2D coordinates.

``numCoils``
    The number of coils (full sine waves) in the spring. This value must be
    positive.

``color``
    The normalized RGBA color values in the range `[0, 1]`.


Properties
==========

.. index::
    pair: DebugDraw; physics2DToScreen

`physics2DToScreen`
-------------------

Provides a scaling factor from physics coordinates to screen pixels.

This value is computed when `begin()` is called.

.. note:: Read Only

.. index::
    pair: DebugDraw; screenToPhysics2D

`screenToPhysics2D`
-------------------

Provides a scaling factor from screen pixels to physics coordinates.

This value is computed when `begin()` is called.

.. note:: Read Only

.. index::
    pair: DebugDraw; showConstraints

`showConstraints`
-----------------

Flag determining whether constraints will be drawn in calls to `drawWorld(..)`.

Default value is `true`.

.. index::
    pair: DebugDraw; showContacts

`showContacts`
--------------

Flag determining whether contact points will be drawn in calls to `drawWorld(..)`.

Default value is `false`.

.. index::
    pair: DebugDraw; showContactImpulses

`showContactImpulses`
---------------------

Flag determining whether contact impulses will be drawn in calls to `drawWorld(..)`.

For impulses to be drawn, it must also be the case that `showContacts` is true.

Default value is `false`.

.. index::
    pair: DebugDraw; showRigidBodies

`showRigidBodies`
-----------------

Flag determining whether rigid bodies will be drawn in calls to `drawWorld(..)`.

Default value is `true`.

.. index::
    pair: DebugDraw; showColliderShapes

`showColliderShapes`
--------------------

Flag determining whether collidable shapes will be drawn in calls to `drawWorld(..)` and `drawRigidBody(..)`.

Default value is `true`.

.. index::
    pair: DebugDraw; showSensorShapes

`showSensorShapes`
------------------

Flag determining whether shapes with `sensor` true will be drawn in calls to `drawWorld(..)` and `drawRigidBody(..)`.

Default value is `true`.

.. index::
    pair: DebugDraw; showBodyDetail

`showBodyDetail`
----------------

Flag determining whether rigid body details (origin, and change in position since last update) will be drawn in calls to
`drawWorld(..)`, and `drawRigidBody(..)`.

Default value is `false`.

.. index::
    pair: DebugDraw; showShapeDetail

`showShapeDetail`
-----------------

Flag determining whether shape details (world-space bounds) will be drawn in calls to `drawWorld(..)`, and `drawRigidBody(..)`.

Default value is `false`.

.. index::
    pair: DebugDraw; circleMaxError

`circleMaxError`
----------------

The maximum error, measured as the distance from the chord drawn to the circle in pixels.

Default value is `0.4px`.

.. index::
    pair: DebugDraw; curveMaxError

`curveMaxError`
---------------

The maximum error, measured as the distance from the chord drawn to the curve in pixels.

Default value is `0.6px`.

.. index::
    pair: DebugDraw; spiralSpringSize

`spiralSpringSize`
------------------

The fraction of the gap between spiral arms, in which the spring will be drawn.

Default value is `0.75`.
