.. index::
    single: Shape

.. highlight:: javascript

.. _physics2d_shape:
.. _physics2d_circle:
.. _physics2d_polygon:

================
The Shape Object
================

Constructor
===========

A Shape object can be constructed with :ref:`Physics2DDevice.createCircleShape <physics2ddevice_createcircle>` and :ref:`Physics2DDevice.createPolygonShape <physics2ddevice_createpolygon>`.

.. _physics2d_shape_parameters:

Constructors for shapes take many common parameters which are listed below ::

     {
        sensor : false,
        material : mat,
        group : 1,
        mask : 0xffffffff,
        userData : null
     }

``sensor`` (Optional)
    If true, shape will perform only collision detection, with no contact points generated. The shape will not physically collide.

    Default value is `false`.

``material`` (Optional)
    The :ref:`Material <physics2d_material>` object to assign to this shape.

    Default value is :ref:`Physics2DDevice.getDefaultMaterial() <physics2ddevice_getdefmat>`.

``group`` (Optional)
    The `group` bitmask for this shape. Two shapes will interact only if `(a.group & b.mask !== 0) && (b.group & a.mask !== 0)`.

    Default value is `1`.

``mask`` (Optional)
    The `mask` bitmask for this shape. Two shapes will interact only if `(a.group & b.mask !== 0) && (b.group & a.mask !== 0)`.

    Default value is `0xffffffff`.

``userData`` (Optional)
    Field for storing whatever data you wish.

    Default value is `null`.

Methods
=======

.. index::
    pair: Shape; getGroup

`getGroup`
----------

**Summary**

Get the group bitmask for this Shape.

**Syntax** ::

    var group = shape.getGroup();

.. index::
    pair: Shape; setGroup

`setGroup`
----------

**Summary**

Set the group bitmask for this Shape.

**Syntax** ::

    shape.setGroup(group);

``group``
    The new group bitmask for this Shape.


.. index::
    pair: Shape; getMask

`getMask`
----------

**Summary**

Get the mask bitmask for this Shape.

**Syntax** ::

    var mask = shape.getMask();

.. index::
    pair: Shape; setMask

`setMask`
----------

**Summary**

Set the mask bitmask for this Shape.

**Syntax** ::

    shape.setMask(mask);

``mask``
    The new mask bitmask for this Shape.

.. index::
    pair: Shape; getMaterial

`getMaterial`
-------------

**Summary**

Get the current :ref:`Material <physics2d_material>` object assigned to this Shape.

**Syntax** ::

    var material = shape.getMaterial();

.. index::
    pair: Shape; setMaterial

`setMaterial`
-------------

**Summary**

Set the :ref:`Material <physics2d_material>` object for this Shape.

**Syntax** ::

    shape.setMaterial(material);

.. index::
    pair: Shape; computeArea

`computeArea`
-------------

**Summary**

Compute the area of this shape in units of squared meters.

**Syntax** ::

    var area = shape.computeArea();

.. index::
    pair: Shape; computeMasslessInertia

`computeMasslessInertia`
------------------------

**Summary**

Compute the moment of inertia of this shape, without multiplication by the shape mass.

The full moment of inertia for this shape would be computed with `shape.getArea() * shape.getMasslessInertia() * shape.getMaterial().getDensity()`.

**Syntax** ::

    var masslessInertia = shape.computeMasslessInertia();

.. index::
    pair: Shape; computeCenterOfMass

`computeCenterOfMass`
---------------------

**Summary**

Compute the center of mass for this Shape in local coordinates.

**Syntax** ::

    var com = shape.computeCenterOfMass();
    // or
    shape.computeCenterOfMass(com);

``com`` (Optional)
    If specified, then the center of mass will be stored in this array. Otherwise a new array will be created.

.. index::
    pair: Shape; clone

`clone`
-------

**Summary**

Produce an exact clone of this Shape.

**Syntax** ::

    var clone = shape.clone();

.. index::
    pair: Shape; addEventListener

`addEventListener`
------------------

**Summary**

Add a new event listener for this Shape.

**Syntax** ::

    var success = shape.addEventListener(eventType, handler, mask, isDeterministic);

``eventType``
    One of:

    `'begin'`
        Issued when this shape has begun interacting with another.

    `'end'`
        Issued when this shape has stopped interacting with another. This event is issued even when one of the interacting shapes is removed from the simulation world.

    `'progress'`
        Issued for each simulation step between issue of the `begin` and `end` events for which the interaction is actively occurring, as well as a single issue for the simulation step in which the interaction is deactivated due to objects being put to sleep.

    `'preSolve'`
        A special event type. This event is **not** deferred until the end of a simulation step, and occurs during collision detection for collision type interactions only once contact points have been computed, but before any physics is performed.

        The handler for this event type is permitted only to mutate the :ref:`Arbiter <physics2d_arbiter>` object it is supplied, and this is the only time such mutation is permitted.

        This event is used to set friction and elasticity values on the :ref:`Arbiter <physics2d_arbiter>` manually, as well as being able to ignore collisions for such things as one-way platforms.

``handler``
    Function to be called when event occurs.

    This function is supplied with the :ref:`Arbiter <physics2d_arbiter>` object for the interaction, and the other :ref:`Shape <physics2d_shape>` involved. The function's `this` object will be set as the :ref:`Shape <physics2d_shape>` for which the event was generated.

``mask`` (Optional)
    A bitmask to use to selectively decide what other :ref:`Shape <physics2d_shape>` objects this event should be issued for.

    Default value is `undefined`, which is considered a separate listener instance and semantically has the same behavior as using a mask of `0xffffffff`.

``isDeterministic`` (Optional)
    This parameter is only for use with `preSolve` type events.

    Default value is `false`.

    This parameter should be set to `true` if the handler for the `preSolve` event is a deterministic function.

    A handler is `deterministic`, if its side effects with respect to the :ref:`Arbiter <physics2d_arbiter>` object are not dependent on any external information. The invocation of this function must have the exact same side effects for the same input.

    If a handler is `deterministic`, then Physics2D will permit rigid bodies which are interacting in a non-persistent state to go to sleep, whereas for a non-deterministic handler this cannot be permitted. ::

        function deterministicHandler(arbiter)
        {
            var normal = arbiter.getNormal();
            if (normal[1] > 0)
            {
                arbiter.setAcceptedState(false);
            }
        }

        function nonDeterministicHandler(arbiter)
        {
            if (TurbulenzEngine.time > 1000) // <-- This condition makes handler non-deterministic
            {
                arbiter.setAcceptedState(false);
            }
        }

    In the first case, Physics2D is permitted to put the objects to sleep as it can never be the case that the Arbiter's normal will change, and that side effects of the handler will change as a result.

    In the second case however, Physics2D is not permitted to put the objects to sleep, as we cannot know when `TurblenzEngine.time` will pass 1000 and wake up the objects in an automated way.

    It is in most cases possible to transform a non-deterministic handler, into a set of deterministic ones in a finite state machine. In this example we could transform the logic into: ::

        function Pre1000Handler(arbiter) { }
        function Post1000Handler(arbiter)
        {
            arbiter.setAcceptedState(false);
        }

    And use appropriate calls to `addEventListener` and `removeEventListener` when `TurbulenzEngine.time > 1000` becomes `true`, noting that both handlers are now trivially deterministic.

    If the handler always puts the :ref:`Arbiter <physics2d_arbiter>` into a persistent state, then the determinism of the handler is no longer important, but it should still be set as a matter of good practice.


This function will fail and return `false` if the event type was not recognized, or if an existing `(handler, mask)` pair exists for the given event type. We consider an `undefined` mask as being separate from it's semantic equivalent `0xffffffff`.

Example: ::

    function spikesOfDoomHandler(arbiter, otherShape)
    {
        var bodyToRemove = otherShape.body;
        bodyToRemove.world.removeRigidBody(bodyToRemove);
    }

    function oneWayHandler(arbiter, otherShape)
    {
        // May need to reverse direction of normal.
        var flip = (arbiter.shapeA !== this);

        // If object is colliding from below, ignore collision
        if ((arbiter.getNormal()[1] >= 0) !== flip)
        {
            arbiter.setAcceptedState(true);
            arbiter.setPersistentState(true);
        }
    }

    spikeShape.addEventlistener('begin', spikesOfDoomHandler, PLAYER_GROUP);
    platformShape.addEventListener('preSolve', oneWayHandler, undefined, true);

As the `begin` event is deferred until the end of the simulation step, it is safe to remove rigid bodies from the world. We make use of the fact that `this` is set to the shape on which the event was defined to choose the player shape which collided with the spikes.

The platform shape is given a `preSolve` event listener, which based on the direction of the contact normal decides to either continue as though nothing happened, or decide to ignore the collision in a persistent state meaning that the handler will no longer be called, and the interaction will be completely ignored until the objects seperate. We take care to reverse the logic depending on the order of the shapes using the knowledge that the :ref:`Arbiter <physics2d_arbiter>` normal will always point from `shapeA` to `shapeB`.

We use a mask of `undefined` (could equally use `0xffffffff`) so that every object will interact via this handler.

As we do not set a persistent state in all cases, it's important we define this handler as `deterministic` (which it is), so that should an object be resting on-top of the platform it will be permitted to go to sleep.

.. index::
    Shape; removeEventListener

`removeEventListener`
---------------------

**Summary**

Remove event listener from this shape.

**Syntax** ::

    shape.removeEventListener(eventType, handler, mask);


.. index::
    Shape; scale

`scale`
-------

**Summary**

Apply a scaling transformation to the Shape in the local coordinate system.

**Syntax** ::

    shape.scale(scaleX, scaleY);

``scaleX``
    The scaling in x-axis direction.

``scaleY`` (Optional)
    The scaling in y-axis direction, this parameter is ignored for Circle shapes.

    If unspecified, is given the value of `scaleX` parameter.

This method will fail if used on a shape belonging to a `static` type :ref:`RigidBody <physics2d_body>` which is inside of a :ref:`World <physics2d_world>`.

.. index::
    Shape; translate

`translate`
-----------

**Summary**

Apply a translation transformation to the Shape in the local coordinate system.

**Syntax** ::

    shape.translate(translation);

``translation``
    The translation (x, y) to apply to the Shape.

This method will fail if used on a shape belonging to a `static` type :ref:`RigidBody <physics2d_body>` which is inside of a :ref:`World <physics2d_world>`.

.. index::
    Shape; rotate

`rotate`
--------

**Summary**

Apply a rotation transformation to the Shape in the local coordinate system.

**Syntax** ::

    shape.rotate(clockwiseRadians);

``angle``
    The angle to rotate Shape by given in clockwise radians.

This method will fail if used on a shape belonging to a `static` type :ref:`RigidBody <physics2d_body>` which is inside of a :ref:`World <physics2d_world>`.

.. index::
    Shape; transform

`transform`
-----------

**Summary**

Apply a general 2D transformation matrix to the Shape in the local coordinate system.

**Syntax** ::

    shape.transform(matrix);

``matrix``
    The 2x3 transformation matrix (row-major order) to transform Shape by.

    This matrix must not be singular, and for Circles should be such that any circle is transformed into any other circle (No non-equal scaling, or shearing). Circle radius is transformed by querying the determinant of the matrix so that this method will not fail when supplied with an ill-formed matrix.

This method will fail if used on a shape belonging to a `static` type :ref:`RigidBody <physics2d_body>` which is inside of a :ref:`World <physics2d_world>`.









.. index::
    pair: Shape; getOrigin

`getOrigin`
-----------

**Summary**

Get the locally defined origin for Circle shape.

**Syntax** ::

    var origin = circle.getOrigin();
    // or
    circle.getOrigin(origin);

``origin`` (Optional)
    If specified, then the origin will be stored in this array. Otherwise a new array will be created.

.. note:: This method exists only for Circle shapes.

.. index::
    pair: Shape; setOrigin

`setOrigin`
-----------

**Summary**

Set the locally defined origin for Circle shape.

This method is ignored should this Circle be part of a `static` body which is inside of a World, or if part of a body that is inside of a world and we are in the middle of a world step.

**Syntax** ::

    var origin = circle.getOrigin();
    // or
    circle.getOrigin(origin);

``origin`` (Optional)
    If specified, then the origin will be stored in this array. Otherwise a new array will be created.

.. note:: This method exists only for Circle shapes.

.. index::
    pair: Shape; getRadius

`getRadius`
-----------

**Summary**

Get the radius for Circle shape.

**Syntax** ::

    var radius = circle.getRadius();

.. note:: This method exists only for Circle shapes.

.. index::
    pair: Shape; setRadius

`setRadius`
-----------

**Summary**

Set the radius of the Circle shapes.

This method is ignored should this Circle be part of a `static` body which is inside of a World, or if part of a body that is inside of a world and we are in the middle of a world step.

**Syntax** ::

    circle.setRadius(radius);

.. note:: This method exists only for Circle shapes.




.. index::
    pair: Shape; setVertices

`setVertices`
-------------

**Summary**

Set the vertices of the Polygon shape.

This method is ignored should this Polygon be part of a `static` body which is inside of a World, or if part of a body that is inside of a world and we are in the middle of a world step.

This method is most efficient when the number of vertices is unchanged.

**Syntax** ::

    polygon.setVertices(newVertexList);

.. note:: This method exists only for Polygon shapes.


Properties
==========

.. index::
    pair: Shape; type

`type`
------

A string identifying the type of this Shape object, one of:

* `'CIRCLE'`
* `'POLYGON'`

.. note:: Read Only

.. index::
    pair: Shape; id

`id`
----

A unique integer identifier for this Shape object.

.. note:: Read Only

.. index::
    pair: Shape; sensor

`sensor`
----------

Whether this shape was created as a sensor, or collider.

.. note:: Read Only

.. index::
    pair: Shape; userData

`userData`
----------

A field for any data you wish to store on this Shape.

.. index::
    pair: Shape; arbiters

`arbiters`
----------

An array of all :ref:`Arbiter <physics2d_arbiter>` objects containing contact information about this Shape and its interactors.

Removing a shape or body from the simulation world may mutate this list, and such actions should be avoided if iterating over it.

.. note:: Read Only

.. index::
    pair: Shape; body

`body`
------

The :ref:`RigidBody <physics2d_body>` this Shape is presently assigned to.

.. note:: Read Only
