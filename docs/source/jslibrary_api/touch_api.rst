.. _touch:

.. highlight:: javascript

.. index::
    single: Touch

-----------------
The Touch Object
-----------------

A Touch object represents a single contact point on the screen. Touch objects are immutable and read-only. This closely
matches the 'Touch' interface described in the
`W3 Touch Events specification <http://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html>`_.


Properties
==========

.. _touch-identifier:

`identifier`
------------

**Summary**

A unique number used to identify touch. Persistent over the touch lifetime.

**Syntax** ::

    var identifier = touch.identifier;

.. _touch-positionx:

`positionX`
-----------

**Summary**

The horizontal position of the touch relative to the left of the game area (in pixels).

**Syntax** ::

    var positionX = touch.positionX;

.. _touch-positiony:

`positionY`
-----------

**Summary**

The vertical position of the touch relative to the top of the game area (in pixels).

**Syntax** ::

    var positionY = touch.positionY;

.. _touch-radiusx:

`radiusX`
---------

**Summary**

The radius of the ellipse which most closely circumscribes the touch area along the x-axis (in pixels). 1 if no value is
known. Always positive.

**Syntax** ::

    var radiusX = touch.radiusX;

.. _touch-radiusy:

`radiusY`
---------

**Summary**

The radius of the ellipse which most closely circumscribes the touch area along the y-axis (in pixels). 1 if no value is
known. Always positive.

**Syntax** ::

    var radiusY = touch.radiusY;

.. _touch-rotationangle:

`rotationAngle`
---------------

**Summary**

The angle (in degrees) that the ellipse described by :ref:`radiusX <touch-radiusx>` and :ref:`radiusY <touch-radiusy>`
is rotated clockwise about its center. 0 if no value is known, otherwise between 0 and 90.

**Syntax** ::

    var rotationAngle = touch.rotationAngle;

.. _touch-force:

`force`
-------

**Summary**

The pressure of the touch, between 0 and 1 where 0 is no pressure, and 1 is maximum pressure. Defaults to 0 when
unsupported by the device.

**Syntax** ::

    var force = touch.force;

.. _touch-isgametouch:

`isGameTouch`
-------------

**Summary**

True if the touch started in the game area, false otherwise.

**Syntax** ::

    var didStartInGameArea = touch.isGameTouch;
