.. _touchevent:

.. highlight:: javascript

.. index::
    single: TouchEvent

---------------------
The TouchEvent Object
---------------------

A TouchEvent object describes the touches which caused a touch event. TouchEvent objects are immutable and read-only.
This closely matches the 'TouchEvent' interface described in the
`W3 Touch Events specification <http://dvcs.w3.org/hg/webevents/raw-file/default/touchevents.html>`_.


Properties
==========

.. _touchevent-changedtouches:

`changedTouches`
----------------

**Summary**

An array of :ref:`Touch <touch>` objects which contributed to the touch event (see
:ref:`touch events <inputdevice-touchevents>`).

**Syntax** ::

    var changedTouches = touch.changedTouches;

.. _touchevent-gametouches:

`gameTouches`
-------------

**Summary**

An array of all current touches (of type :ref:`Touch <touch>`) which started in the game area.

**Syntax** ::

    var gameTouches = touch.gameTouches;

.. _touchevent-touches:

`touches`
---------

**Summary**

An array of all current touches(of type :ref:`Touch <touch>`).

**Syntax** ::

    var touches = touch.touches;
