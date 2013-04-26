.. index::
    single: Floor

.. highlight:: javascript

.. _floor:

------------------------
The Floor Object
------------------------

Utility object that draws an infinite grid floor at height zero.

Useful for viewers or debug rendering.

**Required scripts**

The Floor object requires::

    /*{{ javascript("jslib/floor.js") }}*/

Constructor
===========

.. index::
    pair: Floor; create

`create`
--------

**Summary**

Creates a Floor object with default values.

**Syntax** ::

    var floor = Floor.create(graphicsDevice, mathDevice);


Method
======

.. index::
    pair: Floor; render

`render`
--------

**Summary**

Renders the grid lines of the floor taking into account the far plane of the camera.

**Syntax** ::

    floor.render(graphicsDevice, camera);

``graphicsDevice``
    The GraphicsDevice to render the floor too.

``camera``
    The Camera object used to render the scene.


Properties
==========

.. index::
    pair: Floor; version

`version`
---------

**Summary**

The version number of the Floor implementation.

**Syntax** ::

    var versionNumber = floor.version;

.. index::
    pair: Floor; color

`color`
-------

**Summary**

Main color of the grid lines.

**Syntax** ::

    floor.color = [1.0, 0.1, 0.1, 1.0];


.. index::
    pair: Floor; fadeToColor

`fadeToColor`
-------------

**Summary**

The color the grid lines fade to at the horizon.

**Syntax** ::

    floor.fadeToColor = [0.95, 0.95, 1.0, 1.0];

.. index::
    pair: Floor; numLines

`numLines`
----------

**Summary**

The maximum number of lines to draw when the whole grid is visible.

**Syntax** ::

    floor.numLines = 400;
