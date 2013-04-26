.. index::
    single: RigidBody

.. highlight:: javascript

.. _physics2d_body:

====================
The RigidBody Object
====================

Rigid bodies come in 3 different types:

 * `'static'`: This type of body, once added to a :ref:`World <physics2d_world>` may no longer be mutated in any way (Changing position, changing shapes) except where documented.

 * `'kinematic'`: This type of body is equivalent to a static type, except that it is permitted to move (And will always move to exactly where it is told). Kinematic bodies should be moved by modifying their velocity as changing position directly will be equivalent to teleporting the body.

 * `'dynamic'`: This type of body has non-infinite mass/inertia (Unless explicitly set as such) and is under the influence of gravity, collision and constraint impulses.


Constructor
===========

A RigidBody object can be constructed with :ref:`Physics2DDevice.createRigidBody <physics2ddevice_createbody>`.

Methods
=======

.. index::
    pair: RigidBody; isDynamic

`isDynamic`
-----------

**Summary**

Returns true, if body is of a `dynamic` type.

**Syntax** ::

    var isDynamic = body.isDynamic();

.. index::
    pair: RigidBody; isKinematic

`isKinematic`
-------------

**Summary**

Returns true, if body is of a `kinematic` type.

**Syntax** ::

    var isKinematic = body.isKinematic();

.. index::
    pair: RigidBody; isStatic

`isStatic`
----------

**Summary**

Returns true, if body is of a `static` type.

**Syntax** ::

    var isStatic = body.isStatic();

.. index::
    pair: RigidBody; setAsDynamic

`setAsDynamic`
--------------

**Summary**

Change rigid body type to `dynamic`. This operation can be made at any time except for during a simulation step.

**Syntax** ::

    body.setAsDynamic();

.. index::
    pair: RigidBody; setAsKinematic

`setAsKinematic`
----------------

**Summary**

Change rigid body type to `kinematic`. This operation can be made at any time except for during a simulation step.

**Syntax** ::

    body.setAsKinematic();

.. index::
    pair: RigidBody; setAsStatic

`setAsStatic`
-------------

**Summary**

Change rigid body type to `static`. This operation can be made at any time except for during a simulation step.

This method will also set the `velocity` and `angularVelocity` of the rigid body to `0` as static bodies are not permitted to have velocity.

**Syntax** ::

    body.setAsStatic();







.. index::
    pair: RigidBody; getPosition

`getPosition`
-------------

**Summary**

Retrieve the current position of this rigid body.

**Syntax** ::

    var position = body.getPosition();
    // or
    body.getPosition(position);

``position`` (Optional)
    If specified, the position of the body will be stored in this array, otherwise a new array will be created.

.. index::
    pair: RigidBody; setPosition

`setPosition`
-------------

**Summary**

Set the position of this rigid body.

This method will be ignored for `static` type bodies which are in a World as well as if it is made during a simulation step.

**Syntax** ::

    body.setPosition(position);

``position``
    The position with which to set body.

.. index::
    pair: RigidBody; getRotation

`getRotation`
-------------

**Summary**

Retrieve the current rotation of this rigid body.

**Syntax** ::

    var rotation = body.getRotation();

.. index::
    pair: RigidBody; setRotation

`setRotation`
-------------

**Summary**

Set the rotation of this rigid body.

This method will be ignored for `static` type bodies which are in a World as well as if it is made during a simulation step.

**Syntax** ::

    body.setRotation(rotation)

``rotation``
    The rotation with which to set body.

.. index::
    pair: RigidBody; getVelocity

`getVelocity`
-------------

**Summary**

Retrieve the current velocity of this rigid body.

**Syntax** ::

    var velocity = body.getVelocity();
    // or
    body.getVelocity(velocity);

``velocity`` (Optional)
    If specified, the velocity of the body will be stored in this array, otherwise a new array will be created.

.. index::
    pair: RigidBody; setVelocity

`setVelocity`
-------------

**Summary**

Set the velocity of this rigid body.

This method will be ignored for `static` type bodies which are in a World.

**Syntax** ::

    body.setVelocity(velocity);

``velocity``
    The velocity with which to set body.

.. index::
    pair: RigidBody; getAngularVelocity

`getAngularVelocity`
--------------------

**Summary**

Retrieve the current angular velocity of this rigid body.

**Syntax** ::

    var angularVelocity = body.getAngularVelocity();

.. index::
    pair: RigidBody; setAngularVelocity

`setAngularVelocity`
--------------------

**Summary**

Set the angular velocity of this rigid body.

This method will be ignored for `static` type bodies which are in a World.

**Syntax** ::

    body.setAngularVelocity(angularVelocity)

``angularVelocity``
    The angular velocity with which to set body.

.. index::
    pair: RigidBody; getForce

`getForce`
----------

**Summary**

Retrieve the current force of this rigid body.

**Syntax** ::

    var force = body.getForce();
    // or
    body.getForce(force);

``force`` (Optional)
    If specified, the force of the body will be stored in this array, otherwise a new array will be created.

.. index::
    pair: RigidBody; setForce

`setForce`
----------

**Summary**

Set the force of this rigid body.

Static bodies may have their force changed even if they are in a World.

**Syntax** ::

    body.setForce(force);

``force``
    The force with which to set body.

.. index::
    pair: RigidBody; getTorque

`getTorque`
-----------

**Summary**

Retrieve the current torque of this rigid body.

**Syntax** ::

    var torque = body.getTorque();

.. index::
    pair: RigidBody; setTorque

`setTorque`
-----------

**Summary**

Set the torque of this rigid body.

Static bodies may have their torque changed even if they are in a World.

**Syntax** ::

    body.setTorque(torque)

``torque``
    The torque with which to set body.

.. index::
    pair: RigidBody; getSurfaceVelocity

`getSurfaceVelocity`
--------------------

**Summary**

Retrieve the current surface velocity of this rigid body.

**Syntax** ::

    var velocity = body.getSurfaceVelocity();
    // or
    body.getSurfaceVelocity(velocity);

``velocity`` (Optional)
    If specified, the surface velocity of the body will be stored in this array, otherwise a new array will be created.

.. index::
    pair: RigidBody; setSurfaceVelocity

`setSurfaceVelocity`
--------------------

**Summary**

Set the surface velocity of this rigid body.

Static bodies are permitted to have their surface velocity changed even if they are inside of a World.

**Syntax** ::

    body.setSurfaceVelocity(velocity);

``velocity``
    The surface velocity with which to set body.


.. index::
    pair: RigidBody; getMass

`getMass`
---------

**Summary**

Get the mass of this rigid body. This mass is equal to that set in body constructor, even if body is static or kinematic.

**Syntax** ::

    var mass = body.getMass();

.. index::
    pair: RigidBody; setMass

`setMass`
---------

**Summary**

Set the mass of this rigid body.

The mass of a static/kinematic body may be set at any time, but it will make no effect on the physics unless that body is later set as dynamic.

**Syntax** ::

    body.setMass(mass);

``mass``
    The new mass for the rigid body, this value must be greater than zero for dynamic bodies, though it may be set to `0` for static and kinematics (Doing such will have no effect on physics for such bodies).

.. index::
    pair: RigidBody; setMassFromShapes

`setMassFromShapes`
-------------------

**Summary**

Set body so that its mass will always be computed from its Shapes.

This is `not` the same as: `body.setMass(body.computeMassFromShapes())`, as when setting mass from shapes the mass will be recomputed should the shapes be modified.

This may be called for any object at any time.

**Syntax** ::

    body.setMassFromShapes();

.. index::
    pair: RigidBody; getInertia

`getInertia`
------------

**Summary**

Get the moment of inertia for this rigid body. This inertia is equal to that set in body constructor, even if body is static or kinematic.

**Syntax** ::

    var inertia = body.getInertia();

.. index::
    pair: RigidBody; setInertia

`setInertia`
------------

**Summary**

Set the moment of inertia for this rigid body.

The inertia of a static/kinematic body may be set at any time, but it will make no effect on the physics unless that body is later set as dynamic.

**Syntax** ::

    body.setInertia(inertia);

``inertia``
    The new inertia for the rigid body, this value must be greater than zero for dynamic bodies, though it may be set to `0` for static and kinematics (Doing such will have no effect on physics for such bodies).

.. index::
    pair: RigidBody; setMassFromShapes

`setInertiaFromShapes`
----------------------

**Summary**

Set body so that its inertia will always be computed from its Shapes.

This is `not` the same as: `body.setInertia(body.computeInertiaFromShapes())`, as when setting inertia from shapes the inertia will be recomputed should the shapes be modified.

This may be called for any object at any time.

**Syntax** ::

    body.setInertiaFromShapes();


.. index::
    pair: RigidBody; getLinearDrag

`getLinearDrag`
---------------

**Summary**

Retrieve the current value for the linear drag applied to this body.

**Syntax** ::

    var linearDrag = body.getLinearDrag();

.. index::
    pair: RigidBody; setLinearDrag

`setLinearDrag`
---------------

**Summary**

Set the linear drag on this body.

This may be set on any body type at any time though it will have an affect only on dynamic bodies.

**Syntax** ::

    body.setLinearDrag(linearDrag);

``linearDrag``
    The new linear drag for this body.

    This value must be between 0 and 1.

.. index::
    pair: RigidBody; getLinearDrag

`getLinearDrag`
---------------

**Summary**

Retrieve the current value for the angular drag applied to this body.

**Syntax** ::

    var angularDrag = body.getLinearDrag();

.. index::
    pair: RigidBody; setLinearDrag

`setLinearDrag`
---------------

**Summary**

Set the angular drag on this body.

This may be set on any body type at any time though it will have an affect only on dynamic bodies.

**Syntax** ::

    body.setLinearDrag(angularDrag);

``angularDrag``
    The new angular drag for this body.

    This value must be between 0 and 1.


.. index::
    pair: RigidBody; addShape

`addShape`
----------

**Summary**

Add a :ref:`Shape <physics2d_shape>` to this Body.

This method will fail should the Shape already be in a Body, or this Body is a `static` type body, and is part of a World or if it is made during a simulation step.

**Syntax** ::

    var success = body.addShape(shape);

``shape``
    The :ref:`Shape <physics2d_shape>` to add to this body.

.. index::
    pair: RigidBody; removeShape

`removeShape`
-------------

**Summary**

Remove a :ref:`Shape <physics2d_shape>` from this Body.

This method will fail should the Shape not be in this Body, or this Body is a `static` type body, and is part of a World or if it is made during a simulation step.

**Syntax** ::

    var success = body.removeShape(shape);

``shape``
    The :ref:`Shape <physics2d_shape>` to remove from this body.



.. index::
    pair: RigidBody; applyImpulse

`applyImpulse`
--------------

**Summary**

Apply an impulse to this rigid body. This has an effect only for dynamic bodies.

**Syntax** ::

    body.applyImpulse(impulse, position);

``impulse``
    The impulse to apply to the rigid body. This impulse is defined in world coordinates.

``position`` (optional)
    The position to apply the impulse at. This position is also defined in world coordinates.

    If unspecified, the rigid body's position is used.


.. index::
    pair: RigidBody; setVelocityFromPosition

`setVelocityFromPosition`
-------------------------

**Summary**

This function will set the velocity of a body, so that under no other influence it will move to the target position and rotation via its velocity.

This is an aid for animation of kinematic object types.

**Syntax** ::

    body.setVelocityFromPosition(targetPosition, targetRotation, deltaTime);

``targetPosition``
    The position body will be moved to under no other influence after the given amount of time has passed.

``targetRotation``
    The rotation body will be rotated to under no other influence after the given amount of time has passed.

``deltaTime``
    The amount of time in which it should take the body to reach its target.

    Likely, this will be the same time used in calls to space.step() in animating a kinematic object.



.. index::
    pair: RigidBody; transformWorldPointToLocal

`transformWorldPointToLocal`
----------------------------

**Summary**

Transform a point defined in world coordinates, into the local coordinates of this rigid body.

**Syntax** ::

    var worldPoint = body.transformWorldPointToLocal(localPoint);
    // or
    body.transformWorldPointToLocal(localPoint, worldPoint);

``worldPoint`` (Optional)
    If specified, then the transformed point will be stored in this array. Otherwise a new array will be created.

.. index::
    pair: RigidBody; transformLocalPointToWorld

`transformLocalPointToWorld`
----------------------------

**Summary**

Transform a point defined in local coordinates, into the world coordinates of this rigid body.

**Syntax** ::

    var localPoint = body.transformWorldPointToLocal(worldPoint);
    // or
    body.transformWorldPointToLocal(worldPoint, localPoint);

``localPoint`` (Optional)
    If specified, then the transformed point will be stored in this array. Otherwise a new array will be created.

.. index::
    pair: RigidBody; transformWorldVectorToLocal

`transformWorldVectorToLocal`
-----------------------------

**Summary**

Transform a vector defined in world coordinates, into the local coordinates of this rigid body.

**Syntax** ::

    var worldVector = body.transformWorldVectorToLocal(localVector);
    // or
    body.transformWorldVectorToLocal(localVector, worldVector);

``worldVector`` (Optional)
    If specified, then the transformed vector will be stored in this array. Otherwise a new array will be created.


.. index::
    pair: RigidBody; transformLocalVectorToWorld

`transformLocalVectorToWorld`
-----------------------------

**Summary**

Transform a vector defined in local coordinates, into the world coordinates of this rigid body.

**Syntax** ::

    var localVector = body.transformWorldVectorToLocal(worldVector);
    // or
    body.transformWorldVectorToLocal(worldVector, localVector);

``localVector`` (Optional)
    If specified, then the transformed vector will be stored in this array. Otherwise a new array will be created.


.. index::
    pair: RigidBody; computeMassFromShapes

`computeMassFromShapes`
-----------------------

**Summary**

Compute the sum mass of all Shapes in this body as computed based on their area and material densities.

**Syntax** ::

    var mass = body.computeMassFromShapes();

.. index::
    pair: RigidBody; computeInertiaFromShapes

`computeInertiaFromShapes`
--------------------------

**Summary**

Compute the sum moment of inertia of all Shapes in this body as computed based on their material densities and profiles.

**Syntax** ::

    var inertia = body.computeInertiaFromShapes();

.. index::
    pair: RigidBody; wake

`wake`
------

**Summary**

Manually wake this RigidBody.

Waking a rigid body in Physics2D is not generally required. It is only ever required to manually wake a rigid body, if you manually put it to sleep or added it as a sleeping body.

Mutations to the body, and interactions with other bodies in the world will otherwise automatically wake the body.

**Syntax** ::

    body.wake();

.. index::
    pair: RigidBody; sleep

`sleep`
-------

**Summary**

Manually put this RigidBody to sleep.

This body will be woken as soon as it is interacted with in a World, or is mutated in any way that would require it to wake up in normal circumstances.

**Syntax** ::

    body.sleep();


.. index::
    pair: RigidBody; computeLocalCenterOfMass

`computeLocalCenterOfMass`
--------------------------

**Summary**

Compute the center of mass of this RigidBody in its local coordinate system, as based on Shape profiles and material densities.

**Syntax** ::

    var com = body.computeLocalCenterOfMass();
    // or
    body.computeLocalCenterOfMass(com);

``com`` (Optional)
    If specified, the local center of mass will be stored in this array, otherwise a new array will be created.


.. index::
    pair: RigidBody; computeWorldBounds

`computeWorldBounds`
--------------------

**Summary**

Compute the axis-aligned bounding rectangle of this RigidBody in world coordinates.

This method is only well defined if this Body contains at least one shape, and otherwise will have meaningless bounds.

**Syntax** ::

    var bounds = body.computeWorldBounds();
    // or
    body.computeWorldBounds(bounds);

``bounds``
    If specified, the bounds of this body will be stored in this array, otherwise a new array will be created.

.. index::
    pair: RigidBody; alignWithOrigin

`alignWithOrigin`
-----------------

**Summary**

Translate the Shapes of this body, in local coordinate system so that the center of mass of this body as computed by `computeLocalCentreOfMass` is equal to `[0, 0]`.

It is important for a rigid body to be aligned with the origin to behave intuitively.

This method will be ignored for `static` type bodies which are inside of a World or if it is made during a simulation step.

**Syntax** ::

    body.alignWithOrigin();


.. index::
    pair: RigidBody; integrate

`integrate`
-----------

**Summary**

Perform an integration of this body's position and rotation based the bodies current velocities.

This method will be ignored for `static` type bodies which are inside of a World or if it is made during a simulation step.

**Syntax** ::

    body.integrate(deltaTime);

``deltaTime``
    The amount of time in seconds to integrate body. Negative values are also permitted.

.. index::
    pair: RigidBody; addEventListener

`addEventListener`
------------------

**Summary**

Add a new event listener to this Body.

**Syntax** ::

    var success = body.addEventListener(eventType, handler);

``eventType``
    One of:

    `'wake'`
       Issued when this rigid body was woken. This event is not generated when using the wake() method manually.

    `'sleep'`
       Issued when this rigid body goes to sleep. This event is not generated when using the sleep() methods manually.

``handler``
    Function to be called when this event occurs (Noting that events as usual are deferred until the end of world `step()`).

    Function is called with no arguments, and with its `this` object as the :ref:`RigidBody <physics2d_body>` to which the event relates.

This function will fail, and return `false` if the event type was not accepted, or if the handler already exists for the given event type.

Example: ::

    function wakeHandler() {
        console.log("Body named: " + this.userData.name+" woke up!");
    }

    var body = phys2D.createRigidBody({
        ...
        userData : {
            name : "Box no. 1"
        }
    });
    body.addEventListener('wake', wakeHandler);

You may add as many handlers for a given event type as you wish, and handlers will be called in the same order in which they were added.

`removeEventListener`
---------------------

**Summary**

Remove existing event listener from this Body.

**Syntax** ::

    var success = body.removeEventListener(eventType, handler);

This function will fail, and return `false` if the event type was not accepted, or if the handler was not found on the body for the given event type.


Properties
==========

.. index::
    pair: RigidBody; shapes

`shapes`
--------

The set of :ref:`Shape <physics2d_shape>` objects assigned to this body.

Adding and removing shapes from this body will mutate this list and should be avoided during iteration. To remove all :ref:`Shape <physics2d_shape>` objects from this Body, you may use the following pattern: ::

    var shapes = body.shapes;
    while (shapes.length > 0)
    {
        body.removeShape(shapes[0]);
    }

.. note:: Read Only.

.. index::
    pair: RigidBody; constraints

`constraints`
-------------

The set of :ref:`Constraint <physics2d_constraint>` objects making use of this body which are presently part of a simulation World.

Adding and removing constraints from the world will mutate this list and should be avoided during iteration. To remove all :ref:`Constraint <physics2d_constraint>` objects from the world which make us of this Body, you may use the following pattern: ::

    var constraints = body.constraints;
    while (constraints.length > 0)
    {
        world.removeConstraint(constraints[0]);
    }

This action is performed automatically when removing the Body itself from the simulation world.

.. note:: Read Only.

.. index::
    pair: RigidBody; world

`world`
-------

The :ref:`World <physics2d_world>` object this rigid body has been assigned to.

.. note:: Read Only.

.. index::
    pair: RigidBody; sleeping

`sleeping`
----------

Whether this body is presently sleeping. If true, and body is added to a simulation World, then it will be added as a sleeping body.

.. note:: Read Only.

.. index::
    pair: RigidBody; bullet

`bullet`
----------

Whether this body is marked for continuous collisions against other dynamic bodies. Due to implementation details it is advised not to create a group of bullet objects that interact together as there may be visual stalling.

.. index::
    pair: RigidBody; userData

`userData`
----------

Field to which you may assign whatever data you like.
