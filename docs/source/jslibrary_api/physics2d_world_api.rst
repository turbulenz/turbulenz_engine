.. index::
    single: World

.. highlight:: javascript

.. _physics2d_world:

================
The World Object
================


Constructor
===========

A World object can be constructed with :ref:`Physics2DDevice.createWorld <physics2ddevice_createworld>`.


Methods
=======

.. index::
    pair: World; step

`step`
------

**Summary**

Step forwards in simulation time.

**Syntax** ::

    world.step(deltaTime);

``deltaTime``
    The amount of time (in seconds) to be simulated.

    This value must be strictly positive.

This methods performs a single simulation step regardless of the input `deltaTime`.

To use a fixed time step in your simulations, but remain flexible to differing run-time performance (Assuming physics is not the bottleneck), you would use a system similar to: ::

    // executed each frame
    while (world.simulatedTime < realTime)
    {
        world.step(fixedTimeStep);
    }

.. index::
    pair: World; getGravity

`getGravity`
------------

**Summary**

Retrieve gravity set on world.

**Syntax** ::

    var gravity = world.getGravity();
    // or
    world.getGravity(gravity);

``gravity`` (Optional)
    If specified then the gravity of the world will be stored into this array. Otherwise a new array will be created.

    Modifications to the return value of this function will not effect the space. Setting gravity must be done through the `setGravity` method.

.. index::
    pair: World; setGravity

`setGravity`
------------

**Summary**

Set gravity on world.

**Syntax** ::

    world.setGravity(gravity);

``gravity``
    New value for gravity of world.


.. index::
    pair: World; addRigidBody

`addRigidBody`
--------------

**Summary**

Add a :ref:`RigidBody <physics2d_body>` to the simulation world.

**Syntax** ::

    var success = world.addRigidBody(body);

``body``
    The RigidBody to add to the world

This method will fail if the body is already in a World.

.. index::
    pair: World; removeRigidBody

`removeRigidBody`
-----------------

**Summary**

Remove a :ref:`RigidBody <physics2d_body>` from the simulation world.

Any :ref:`Constraint <physics2d_constraint>` objects in the world which make use
of the body will also be removed.

**Syntax** ::

    var success = world.removeRigidBody(body);

``body``
    The RigidBody to remove from the world

This method will fail if the body is not in this World.


.. index::
    pair: World; addConstraint

`addConstraint`
---------------

**Summary**

Add a :ref:`Constraint <physics2d_constraint>` to the simulation world.

**Syntax** ::

    var success = world.addConstraint(constraint);

``constraint``
    The Constraint to add to the world

This method will fail if the constraint is already in a World.

.. index::
    pair: World; removeConstraint

`removeConstraint`
------------------

**Summary**

Remove a :ref:`Constraint <physics2d_constraint>` from the simulation world.

**Syntax** ::

    var success = world.removeConstraint(constraint);

``constraint``
    The Constraint to remove from the world

This method will fail if the constraint is not in this World.

.. index::
    pair: World; clear

`clear`
-------

**Summary**

Clear the simulation world of all rigid bodies and constraints.

**Syntax** ::

    world.clear();

.. index::
    pair: World; shapeRectangleQuery

`shapeRectangleQuery`
---------------------

**Summary**

Sample world to find all :ref:`Shape <physics2d_shape>`'s intersecting the given axis aligned rectangle.

**Syntax** ::

    var store = [];
    var count = world.shapeRectangleQuery(rectangle, store);

``rectangle``
    The rectangle in Physics2D coordinates to sample Shapes.

``store``
    The array in which to store intersected shapes.

The return value `count` is the number of shapes which were intersected.



.. index::
    pair: World; bodyRectangleQuery

`bodyRectangleQuery`
--------------------

**Summary**

Sample world to find all :ref:`RigidBody <physics2d_body>`'s intersecting the given axis aligned rectangle.

**Syntax** ::

    var store = [];
    var count = world.bodyRectangleQuery(rectangle, store);

``rectangle``
    The rectangle in Physics2D coordinates to sample rigid bodies.

``store``
    The array in which to store intersected bodies.

The return value `count` is the number of bodies which were intersected.

.. index::
    pair: World; shapePointQuery

`shapeCircleQuery`
------------------

**Summary**

Sample world to find all :ref:`Shape <physics2d_shape>`'s intersecting the given circle.

**Syntax** ::

    var store = [];
    var count = world.shapeCircleQuery(center, radius, store);

``center``
    The point in Physics2D coordinates defining center of the circle.

``radius``
    The radius in Physics2D coordinates for sample circle.

``store``
    The array in which to store intersected shapes.

The return value `count` is the number of shapes which were intersected.



.. index::
    pair: World; bodyCircleQuery

`bodyCircleQuery`
-----------------

**Summary**

Sample world to find all :ref:`RigidBody <physics2d_body>`'s intersecting the given point.

**Syntax** ::

    var store = [];
    var count = world.bodyCircleQuery(center, radius, store);


``center``
    The point in Physics2D coordinates defining center of the circle.

``radius``
    The radius in Physics2D coordinates for sample circle.

``store``
    The array in which to store intersected bodies.

The return value `count` is the number of bodies which were intersected.

.. index::
    pair: World; shapePointQuery

`shapePointQuery`
-----------------

**Summary**

Sample world to find all :ref:`Shape <physics2d_shape>`'s intersecting the given point.

**Syntax** ::

    var store = [];
    var count = world.shapePointQuery(point, store);

``point``
    The point in Physics2D coordinates to sample Shapes.

``store``
    The array in which to store intersected shapes.

The return value `count` is the number of shapes which were intersected.



.. index::
    pair: World; bodyPointQuery

`bodyPointQuery`
----------------

**Summary**

Sample world to find all :ref:`RigidBody <physics2d_body>`'s intersecting the given point.

**Syntax** ::

    var store = [];
    var count = world.bodyPointQuery(point, store);

``point``
    The point in Physics2D coordinates to sample rigid bodies.

``store``
    The array in which to store intersected bodies.

The return value `count` is the number of bodies which were intersected.


.. index::
    pair: World; rayCast

`rayCast`
---------

**Summary**

Sample world for the first intersection of the given parametric ray.

**Syntax** ::

    var ray = {
        origin : [-1, 0],
        direction : [10, 0],
        maxFactor : 2
    };
    var callback = {
        ignored : someShape,
        filter : function(ray, temporaryResult)
        {
            if (this.ignored === temporaryResult.shape)
            {
                return false;
            }

            if (temporaryResult.hitNormal[1] > 0.5)
            {
                return false;
            }

            return true;
        }
    };

    var result = world.rayCast(ray, ignoreInnerSurfaces, callback.filter, callback);
    if (result !== null)
    {
        console.log("Ray intersected!");
        console.log("Distance to intersection = " + (result.factor / mathDevice.v2Length(ray.direction)));
    }

``ray``
    Parametric ray to be cast through the world. Ray cast will be limited to a factor of `maxFactor` of the ray direction.

``ignoreInnerSurfaces`` (Optional)
    If true, then intersections with the `inner` surfaces of Shapes will be ignored.

    Default value is `false`.

``callback`` (Optional)
    If supplied, this function will be called after each intersection test with the input `ray` and a temporary results object detailing the intersection.

    This result object is re-used and you should not keep any references to it.

    Any intersection for which the callback function returns false, will be ignored.

``thisObject`` (Optional)
    If supplied, the `callback` function supplied will be called with `thisObject` as its `this` value.

The return value of this function is a new results result object detailing the closest intersection to the ray.

This results object has the following fields: ::

    {
        hitPoint : [x, y],  // point of intersection
        hitNormal : [x, y], // normal at intersection on intersected shape.
        shape : intersectedShape,
        factor : // factor corresponding to ray intersection
    }


.. index::
    pair: World; convexCast

`convexCast`
------------

**Summary**

Sample world for the first intersection of the given :ref:`Shape <physics2d_shape>` as determined by its :ref:`RigidBody <physics2d_body>`'s velocities.

**Syntax** ::

    var sweepShape = phys2D.createCircleShape({
        radius : 1
    });
    var sweepBody = phys2D.createRigidBody({
        shapes : [circle],
        position : [-1, 0],
        velocity : [100, 0],
        angularVelocity : 20
    });

    var callback = {
        ignored : someShape,
        filter : function(shape, temporaryResult)
        {
            if (this.ignored === temporaryResult.shape)
            {
                return false;
            }

            if (temporaryResult.hitNormal[1] > 0.5)
            {
                return false;
            }

            return true;
        }
    };

    var maxTime = 2; // seconds
    var result = world.convexCast(sweepShape, maxTime, callback.filter, callback);
    if (result !== null)
    {
        console.log("Shape intersected!");
        console.log("Time of Impact = " + result.factor);
    }

``shape``
    The :ref:`Shape <physics2d_shape>` to be swept through the world. This shape must belong to a :ref:`RigidBody <physics2d_body>` which defines the sweep
    start position/rotation and sweep velocities.

    This shape/body pair is permitted belong to the world, in which case it will ignore itself automatically.

``deltaTime``
    The amount of time shape will be swept through before returning failure.

``callback`` (Optional)
    If supplied, this function will be called after each intersection test with the input `shape` and a temporary results object detailing the intersection.

    This result object is re-used and you should not keep any references to it.

    Any intersection for which the callback function returns false, will be ignored.

``thisObject`` (Optional)
    If supplied, the `callback` function supplied will be called with `thisObject` as its `this` value.

The return value of this function is a new results result object detailing the first intersection of swept shape in the world.

This results object has the same fields as that of the `rayCast` method.

Properties
==========

.. index::
    pair: World; simulatedTime

`simulatedTime`
---------------

The amount of time in seconds that has been simulated since world creation.

.. note:: Read Only

.. index::
    pair: World; timeStamp

`timeStamp`
-----------

The current time stamp for this World: equal to the number of times step() has been executed.

.. note:: Read Only

.. index::
    pair: World; rigidBodies

`rigidBodies`
-------------

Array of all :ref:`RigidBody <physics2d_body>` that are in the World.

Removing, or adding body from the world will modify this array, and should not be performed during iteration. If you wish to remove all rigid bodies from the world you may use the following pattern: ::

    var rigidBodies = world.rigidBodies;
    while (rigidBodies.length !== 0)
    {
        world.removeRigidBody(rigidBodies[0]);
    }

.. note:: Read Only

.. index::
    pair: World; constraints

`constraints`
-------------

Array of all :ref:`Constraint <physics2d_constraint>` that are in the World.

Removing, or adding constraint from the world will modify this array, and should not be performed during iteration. If you wish to remove all constraints from the world you may use the following pattern: ::

    var constraints = world.constraints;
    while (constraints.length !== 0)
    {
        world.removeConstraint(constraints[0]);
    }

.. note:: Read Only

.. index::
    pair: World; liveDynamics

`liveDynamics`
--------------

Array of all non-sleeping `dynamic` type Rigid Bodies that are in the World.

Dynamic bodies are put to sleep when the island of objects formed by contacts
with other dynamic bodies, and constraints are all sufficiently slow moving for
a sufficient amount of time.

Any operation that causes a :ref:`RigidBody <physics2d_body>` or :ref:`Constraint <physics2d_constraint>` to be woken, or forced to sleep may modify this array, you should be carefully not to perform any such mutation of any such objects in the world during iteration.

.. note:: Read Only

.. index::
    pair: World; liveDynamics

`liveKinematics`
----------------

Array of all non-sleeping `kinematic` type Rigid Bodies that are in the World.

Kinematic bodies are put to sleep when they have not moved during a world `step()`.

Any operation that causes a :ref:`RigidBody <physics2d_body>` or :ref:`Constraint <physics2d_constraint>` to be woken, or forced to sleep may modify this array, you should be carefully not to perform any such mutation of any such objects in the world during iteration.

.. note:: Read Only

.. index::
    pair: World; liveKinematics

`liveConstraints`
-----------------

Array of all non-sleeping Constraints that are in the World.

Constraints are put to sleep when the island of dynamic bodies they are connected
to is put to sleep.

Any operation that causes a :ref:`RigidBody <physics2d_body>` or :ref:`Constraint <physics2d_constraint>` to be woken, or forced to sleep may modify this array, you should be carefully not to perform any such mutation of any such objects in the world during iteration.

.. note:: Read Only

.. index::
    pair: World; broadphase

`broadphase`
------------

The :ref:`Broadphase <broadphase>` object assigned to this World.

You should not modify the broadphase object, though you are free to query it.

.. note:: Read Only

.. index::
    pair: World; velocityIterations

`velocityIterations`
--------------------

The number of iterations used in the physics step when solving errors in velocity constraints.

This value must be positive.

.. index::
    pair: World; positionIterations

`positionIterations`
--------------------

The number of iterations used in the physics step when solving errors in position constraints.

This value must be positive.

.. index::
    pair: World; dynamicArbiters

`dynamicArbiters`
-----------------

Set of all non-sleeping :ref:`Arbiter <physics2d_arbiter>` objects between pairs of dynamic rigid bodies.

If iterating over this array, you should be careful to ignore any :ref:`Arbiter <physics2d_arbiter>` object
whose `active` field is false. Such objects correspond either to an interaction which has recently ended
and exists purely to cache values that may shortly be re-used, or that is waiting to be destroyed. ::

    var arbiters = world.dynamicArbiters;
    var numArbiters = arbiters.length;
    var i;
    for (i = 0; i < numArbiters; i += 1)
    {
        var arb = arbiters[i];
        if (!arb.active)
        {
            continue;
        }
        ...
    }

This array may be modified by removing a :ref:`RigidBody <physics2d_body>` object from the World and should be avoided during iteration.

.. note:: Read Only

.. index::
    pair: World; staticArbiters

`staticArbiters`
----------------

Set of all non-sleeping :ref:`Arbiter <physics2d_arbiter>` objects between a dynamic, and non-dynamic rigid body.

If iterating over this array, you should be careful to ignore any :ref:`Arbiter <physics2d_arbiter>` object
whose `active` field is false. Such objects correspond either to an interaction which has recently ended
and exists purely to cache values that may shortly be re-used, or that is waiting to be destroyed. ::

    var arbiters = world.staticArbiters;
    var numArbiters = arbiters.length;
    var i;
    for (i = 0; i < numArbiters; i += 1)
    {
        var arb = arbiters[i];
        if (!arb.active)
        {
            continue;
        }
        ...
    }

This array may be modified by removing a :ref:`RigidBody <physics2d_body>` object from the World and should be avoided during iteration.

.. note:: Read Only

