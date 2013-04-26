.. _physicsdevice:

.. highlight:: javascript

.. index::
    single: PhysicsDevice

------------------------
The PhysicsDevice Object
------------------------

Provides rigid body physics using the Bullet Physics Library in plugin, and a native
Javascript physics library in canvas.

The PhysicsDevice object can be used to create the following objects:

* Rigid bodies: dynamic or kinematic.
* Collision objects: static or kinematic.
* Shapes: plane, box, sphere, capsule, cylinder, cone, triangle mesh and convex hull.
* Constraints: point to point, hinge, cone twist, 6DOF and slider.
* Character
* DynamicsWorld

Shapes can be shared between multiple rigid bodies or collision objects.


.. _physicsdevice_contactcallbacks:

Contact callbacks
=================

:ref:`RigidBodies <rigidbody>`, :ref:`CollisionObjects <collisionobject>`, and :ref:`Characters <character>`
support contact callbacks. These callbacks can be specified at creation time by setting the following properties
on the parameters object passed to :ref:`createRigidBody <physicsdevice_createrigidbody>`, :ref:`createCollisionObject <physicsdevice_createcollisionobject>`,
and :ref:`createCharacter <physicsdevice_createcharacter>`:

``onPreSolveContact``
    This callback will be triggered when a new contact is first detected between two objects.
    It happens during the simulation step and hence could severely degrade performance if the callback
    performs heavy calculations. As several contacts can be added and removed during a simulation update
    it is then possible this callback will be called more times than the total number of contacts
    active at the end of the simulation.
    The callback will receive as parameters the two objects and the new :ref:`contact <contact>`.
    Usage example::

        function newContact(objectA, objectB, contact)
        {
            ...
        }

        var boxObject = physicsDevice.createCollisionObject({
                    ...
                    onPreSolveContact: newContact
                    ...
                });

``onAddedContacts``
    This callback will be triggered if at least one contact is added during the simulation step.
    It will happen at the end of the simulation update.
    The callback will receive as parameters the two objects and the array of active :ref:`contacts <contact>`.
    Usage example::

        function contactsAdded(objectA, objectB, contacts)
        {
            ...
        }

        var boxObject = physicsDevice.createCollisionObject({
                    ...
                    onAddedContacts: contactsAdded
                    ...
                });

``onProcessedContacts``
    This callback will be triggered if any contact is processed during a simulation step.
    It will happen at the end of the simulation update.
    The callback will receive as parameters the two objects and the array of active :ref:`contacts <contact>`.
    Usage example::

        function contactsProcessed(objectA, objectB, contacts)
        {
            ...
        }

        var boxObject = physicsDevice.createCollisionObject({
                    ...
                    onProcessedContacts: contactsProcessed
                    ...
                });

``onRemovedContacts``
    This callback will be triggered if at least one contact is removed during a simulation step.
    It will happen at the end of the simulation update.
    The callback will receive as parameters the two objects and the array of active :ref:`contacts <contact>`.
    If the two objects are no longer touching,
    the callback will be called with an empty contacts array.
    Usage example::

        function contactsRemoved(objectA, objectB, contacts)
        {
            ...
        }

        var boxObject = physicsDevice.createCollisionObject({
                    ...
                    onRemovedContacts: contactsRemoved
                    ...
                });

``contactCallbacksMask``
    The mask to be used to filter which groups will trigger a collision callback.
    If not specified it will default to the mask defined when creating the object.
    Usage example::

        var boxObject = physicsDevice.createCollisionObject({
                    ...
                    contactCallbacksMask: physicsDevice.FILTER_PROJECTILE
                    ...
                });

    Valid :ref:`FILTER_ <physicsdevice_FILTER>` values are defined as properties on the physicsDevice.


.. _physicsdevice_triggers:

Triggers
========

A `trigger` is a :ref:`CollisionObject <collisionobject>` with :ref:`contact callbacks <physicsdevice_contactcallbacks>`
but without a collision response,
which means that although contacts are detected they do not apply any impulse to
the :ref:`RigidBody <rigidbody>` colliding against the trigger.

To create a trigger just specify the property ``trigger`` as ``true`` on the creation parameters passed to
:ref:`createCollisionObject <physicsdevice_createcollisionobject>`.

.. _physicsdevice_canvas_vs_plugin:

Canvas PhysicsDevice vs Plugin PhysicsDevice
============================================

There are several differences between the Canvas and Plugin PhysicsDevice:

* Only the Point2Point constraint has been implemented at the present time, the other
  constraints exist purely as stubs which you can use; but no physics will be performed
  for them.

  The Canvas Point2Point constraint permits values of damping up to any positive value.
  whilst this is possible in Plugin version, values greater than 1 will cause the objects
  to vibrate violently instead of exhibiting an over-dampening of the constraint.

* Continous collision detection in Canvas is implemented in a very different way to that of
  the Bullet Physics Library. In Canvas, very fast moving objects may visually 'stall' as once
  a continuous collision occurs, the related objects are frozen with no additional simulation
  time occuring for these objects. (This is a performance choice; in general application this
  behaviour is acceptable). This may permit collisions to be missed that are the result of an object
  changing direction between continuous collisions, but will not permit tunneling.

  Canvas continuous collisions should never permit tunneling even in extreme cases, this differs
  from Plugin PhysicsDevice where fast moving pairs of objects may be missed, and where a fast
  rotating object may miss a collision should its start and end orientations show no sign of collision.

  In canvas, continuous collisions that are detected and have tunneling prevented do not have physics
  performed until the following update of the world.

* Kinematic objects are implemented, but are treat as static objects during continuous collision detection
  so fast moving kinematic objects may permit tunnelling.

* The Canvas PhysicsDevice uses a slightly different method of resolving positional errors in contacts,
  the result is that penetration of objects will not cause the objects to burst apart as would be
  the case in Plugin version.

* In general, Canvas PhysicsDevice has shown to produce more stable results when considering piles
  of various primitives permitting a lower sleep threshold. Due to present limitations in contact
  generation, you may find the plugin Physics Device to produce better results for such things as
  large stacks of boxes.

* The Canvas implementation of `dynamicsWorld.convexSweep` does not presently permit a non-linear
  sweep. Input transformations should differ only by their translation.

* In Canvas, the Character object is implemented using a Capsule Shape. In Plugin a
  Bullet MultiSphere Shape is used instead.

* The Plugin DynamicsWorld does not expose performance data.

* The Canvas DynamicsWorld permits finer grained control over how simulation time steps are used
  and computed.


Methods
=======

.. _physicsdevice_createdynamicsworld:
.. index::
    pair: PhysicsDevice; createDynamicsWorld

`createDynamicsWorld`
---------------------

**Summary**

Create a simulation world to which collision objects, rigid bodies and
constraints can be added.  Physics objects and constraints can only be
added to a single DynamicsWorld at any given time, although a
constraints can span rigid bodies in two different worlds.

**Syntax** ::

    // Plugin and Canvas.
    var dynamicsWorldParameters = {
            maxSubSteps: 10,
            fixedTimeStep: (1.0 / 60.0),
            gravity: [0, -10, 0]
        };

    // Canvas Only.
    var dynamicsWorldParameters = {
            maxSubSteps: 10,
            variableTimeSteps: true,
            minimumTimeStep: (1.0 / 70.0),
            maximumTimeStep: (1.0 / 50.0),
            gravity: [0, -10, 0]
        };

    // Canvas Only.
    dynamicsWorldParameters.maxGiveUpTimeStep = (1.0 / 40.0);

    var dyncamicsWorld =
        physicsDevice.createDynamicsWorld(dynamicsWorldParameters);

``maxSubSteps``
    Limits the maximum number of substeps the simulation will perform per frame.
    Defaults to 10.

``fixedTimeStep``
    Sets a fixed simulation time in seconds per substep.
    Defaults to 1.0 / 60.0.

``gravity``
    The direction and magnitude of a global `gravity` force applied to the whole scene per frame.
    Defaults to [0, -10, 0].

``variableTimeSteps``
    When true, sub step simulation time will be permitted to vary within the defined bounds. If reproducibility is not needed, this will permit a smoother physics simulation by increasing the chances that the physics simulation is exactly in sync with real time.

``minimumTimeStep``
    When `variableTimeSteps` is true; sets a minimum simulation time in seconds per sub step.
    Defaults to 1.0 / 70.0

``maximumTimeStep``
    When `variableTimeSteps` is true; sets a maximum simulation time in seconds per sub step.
    Defaults to 1.0 / 50.0

``maxGiveUpTimeStep``
    When `maxSubSteps` is exceeded, the size of a sub step will be permitted to increase to this amount regardless of whether we are using fixed or variable time steps.
    Setting to 0 will disable this behaviour.
    Defaults to 1.0 / 40.0

.. index::
    pair: PhysicsDevice; createPlaneShape

`createPlaneShape`
------------------

**Summary**

Creates a plane shape.

**Syntax** ::

    physicsDevice.createPlaneShape({
            normal : [0, 1, 0],
            distance : 0,
            margin : 0.001
        });

Returns a plane :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createBoxShape

`createBoxShape`
----------------

**Summary**

Creates a box shape.

**Syntax** ::

    physicsDevice.createBoxShape({
            halfExtents : [0.5, 0.5, 0.5],
            margin : 0.001
        });

Returns a box :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createSphereShape

`createSphereShape`
-------------------

**Summary**

Creates a sphere shape.

**Syntax** ::

    physicsDevice.createSphereShape({
            radius : 1.0,
            margin : 0.001
        });

Returns a sphere :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createCapsuleShape

`createCapsuleShape`
--------------------

**Summary**

Creates a capsule shape.

**Syntax** ::

    physicsDevice.createCapsuleShape({
            radius : 0.25,
            height : 1.0,
            margin : 0.001
        });

Returns a capsule :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createCylinderShape

`createCylinderShape`
---------------------

**Summary**

Creates a cylinder shape.

**Syntax** ::

    physicsDevice.createCylinderShape({
            halfExtents : [0.25, 1.0, 0.25],
            margin : 0.001
        });

Returns a cylinder :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createConeShape

`createConeShape`
-----------------

**Summary**

Creates a cone shape.

**Syntax** ::

    physicsDevice.createConeShape({
            radius : 0.25,
            height : 1.0,
            margin : 0.001
        });

Returns a cone :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createCollisionObject

.. _physicsdevice_createcollisionobject:

`createCollisionObject`
-----------------------

**Summary**

Creates a collision object.

**Syntax** ::

    var boxObject = physicsDevice.createCollisionObject({
            shape : boxShape,
            transform : [1.0, 0.0, 0.0,
                         0.0, 1.0, 0.0,
                         0.0, 0.0, 1.0,
                         100.0, 10.0, 0.0],
            friction : 0.5,
            restitution : 0.3,
            kinematic : false,
            group: physicsDevice.FILTER_STATIC,
            mask: physicsDevice.FILTER_ALL
        });

``shape``
    A :ref:`Shape <shape>` object.

This function supports :ref:`contact callbacks <physicsdevice_contactcallbacks>`

This function supports :ref:`triggers <physicsdevice_triggers>`

Returns a :ref:`CollisionObject <collisionobject>` object.


.. index::
    pair: PhysicsDevice; createRigidBody

.. _physicsdevice_createrigidbody:

`createRigidBody`
-----------------

**Summary**

Creates a rigid body.

**Syntax** ::

    var shapeInertia = boxShape.inertia;
    var mass = 10.0;
    var boxBody = physicsDevice.createRigidBody({
            shape : boxShape,
            mass : mass,
            inertia : [mass * shapeInertia[0],
                       mass * shapeInertia[1],
                       mass * shapeInertia[2]],
            transform : [1.0, 0.0, 0.0,
                         0.0, 1.0, 0.0,
                         0.0, 0.0, 1.0,
                         100.0, 1.0, 0.0],
            friction : 0.5,
            restitution : 0.3,
            frozen : false,
            group: physicsDevice.FILTER_DYNAMIC,
            mask: physicsDevice.FILTER_ALL
        });

``shape``
    A :ref:`Shape <shape>` object.

This function supports :ref:`contact callbacks <physicsdevice_contactcallbacks>`

Returns a :ref:`RigidBody <rigidbody>` object.


.. index::
    pair: PhysicsDevice; createPoint2PointConstraint

`createPoint2PointConstraint`
-----------------------------

**Summary**

Creates a point to point constraint.

Point to point constraint limits the translation so that the local pivot points of 2 rigidbodies match in worldspace.
A chain of rigidbodies can be connected using this constraint.
If only one body is specified then the body's centre of mass is used as the other pivot.

**Syntax** ::

    var constraint = physicsDevice.createPoint2PointConstraint({
            bodyA : boxBodyA,
            bodyB : boxBodyB,
            pivotA : [0, -1.0, 0],
            pivotB : [0,  1.0, 0],
            force : 0.3,
            damping : 1.0,
            impulseClamp : 0.0
        });

   var constraint = physicsDevice.createPoint2PointConstraint({
            bodyA : boxBodyA,
            pivotA : [0, -1.0, 0],
            force : 0.3,
            damping : 1.0,
            impulseClamp : 2.0
        });

Returns a :ref:`Constraint <constraint>` object.

**Parameters**

``bodyA``
    One of the rigid bodies to be constrained.

``bodyB``
    The  other rigid body to be constrained.

``pivotA``
    The :ref:`Vector3 <v3object>` representing the local point on bodyA.

``pivotB``
    The :ref:`Vector3 <v3object>` representing the local point on bodyB.

``force (Optional)``
    Represents tau in the bullet documentation.
    The scalar value representing the maximum force for the constraint.

``damping (Optional)``
    The scalar value representing the damping of the constraint.

``impulseClamp (Optional)``
    The scalar value representing the maximum impulse the constraint can apply.
    A value of 0.0 means unconstrained.

.. index::
    pair: PhysicsDevice; createHingeConstraint

`createHingeConstraint`
-----------------------

**Summary**

Creates a hinge constraint.

Hinge constraint, or revolute joint restricts two additional angular degrees of freedom, so the body can only rotate around one axis, the hinge axis.
This can be useful to represent doors or wheels rotating around one axis.
The user can specify limits to the rotation.
If only one body is specified then world space is used for the other transform.

**Syntax** ::

    var constraint = physicsDevice.createHingeConstraint({
            bodyA : boxBodyA,
            bodyB : boxBodyB,
            transformA : matrixA,
            transformB : matrixB,
            low  : 0.0,
            high : Math.PI / 2
        });

    var constraint = physicsDevice.createHingeConstraint({
            bodyA : hingeDoorBody,
            transformA : frameInA,
            low  : 0.0,
            high : Math.PI / 2
        });

Returns a :ref:`Constraint <constraint>` object.

**Parameters**

``bodyA``
    One of the rigid bodies to be constrained.

``bodyB``
    The other rigid body to be constrained.

``transformA``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyA.

``transformB``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyB.

``low (Optional)``
    The scalar representing the lower limit of the constraint's rotation (in radians).

``high (Optional)``
    The scalar representing the upper limit of the constraint's rotation (in radians).


.. index::
    pair: PhysicsDevice; createConeTwistConstraint

`createConeTwistConstraint`
---------------------------

**Summary**

Creates a cone twist constraint.

To create ragdolls, the cone twist constraint is very useful for limbs like the upper arm.
It is a special point to point constraint that adds cone and twist axis limits.
The x-axis serves as the twist axis.
If only one body is specified then world space is used for the other transform.

**Syntax** ::

    var constraint = physicsDevice.createConeTwistConstraint({
            bodyA : boxBodyA,
            bodyB : boxBodyB,
            transformA : matrixA,
            transformB : matrixB,
            swingSpan1 : Math.PI / 4,
            swingSpan2 : Math.PI / 4,
            twistSpan  : Math.PI * 0.7,
            damping    : 0.4
        });

    var constraint = physicsDevice.createConeTwistConstraint({
            bodyA : boxBodyA,
            transformA : matrixA,
            swingSpan1 : Math.PI / 4,
            swingSpan2 : Math.PI / 4,
            twistSpan  : Math.PI * 0.7,
            damping    : 0.4
        });

Returns a :ref:`Constraint <constraint>` object.

**Parameters**

``bodyA``
    One of the rigid bodies to be constrained.

``bodyB``
    The other rigid body to be constrained.

``transformA``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyA.

``transformB``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyB.

``swingSpan1 (Optional)``
    The scalar representing the angle used to form the ellipsis in one axis (in radians).

``swingSpan2 (Optional)``
    The scalar representing the angle used to form the ellipsis in one axis (in radians).

``twistSpan (Optional)``
    The scalar representing the limit of the rotation around the x-axis (in radians).

``damping (Optional)``
    The scalar representing the damping of the constraint.

.. index::
    pair: PhysicsDevice; create6DOFConstraint

`create6DOFConstraint`
----------------------

**Summary**

Creates a 6 degrees of freedom constraint.

This generic constraint can emulate a variety of standard constraints, by configuring each of the 6 degrees of freedom (dof).
The first 3 dof axis are linear axis, which represent translations of rigid bodies.
The latter 3 dof axis represent the angular motion.
Each axis can be either locked, free or limited.
On construction of a new 6DOFConstraint, all axis are locked.
Afterwards the axis can be reconfigured.
Note that several combinations that include free and/or limited angular degrees of freedom are undefined.

::

    For each axis:

    Lowerlimit == Upperlimit -> axis is locked.
    Lowerlimit > Upperlimit -> axis is free
    Lowerlimit < Upperlimit -> axis is limited in that range

**Syntax** ::

    var constraint = physicsDevice.create6DOFConstraint({
            bodyA : boxBodyA,
            bodyB : boxBodyB,
            transformA : matrixA,
            transformB : matrixB,
            linearLowerLimit  : mathDevice.v3Build(-4.0, -2.0, -2.0),
            linearUpperLimit  : mathDevice.v3Build(4.0, 2.0, 2.0),
            angularLowerLimit : mathDevice.v3Build(-Math.PI / 2, -0.75, -Math.PI / 2),
            angularUpperLimit : mathDevice.v3Build(Math.PI / 2, 0.75, Math.PI / 2)
        });

Returns a :ref:`Constraint <constraint>` object.

**Parameters**

``bodyA``
    One of the rigid bodies to be constrained.

``bodyB``
    The other rigid body to be constrained.

``transformA``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyA.

``transformB``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyB.

``linearLowerLimit (Optional)``
    The :ref:`Vector3 <v3object>` representing the translational lower limit for each axis.

``linearUpperLimit (Optional)``
    The :ref:`Vector3 <v3object>` representing the translational upper limit for each axis.

``angularLowerLimit (Optional)``
    The :ref:`Vector3 <v3object>` representing the angular lower limit for each axis.

``angularUpperLimit (Optional)``
    The :ref:`Vector3 <v3object>` representing the angular upper limit for each axis.

.. index::
    pair: PhysicsDevice; createSliderConstraint

`createSliderConstraint`
------------------------

**Summary**

Creates a slider constraint.

The slider constraint allows the body to rotate around the x-axis and translate along this axis.

**Syntax** ::

    var constraint = physicsDevice.createSliderConstraint({
            bodyA : boxBodyA,
            bodyB : boxBodyB,
            transformA : matrixA,
            transformB : matrixB,
            linearLowerLimit : 1.2,
            linearUpperLimit : 8,
            angularLowerLimit : 0,
            angularUpperLimit : Math.PI / 2
        });

Returns a :ref:`Constraint <constraint>` object.

**Parameters**

``bodyA``
    One of the rigid bodies to be constrained.

``bodyB``
    The other rigid body to be constrained.

``transformA``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyA.

``transformB``
    The :ref:`Matrix43 <m43object>` representing the constraint's transform local to bodyB.

``linearLowerLimit (Optional)``
    The scalar representing the translational lower limit along the x-axis.

``linearUpperLimit (Optional)``
    The scalar representing the translational upper limit along the x-axis.

``angularLowerLimit (Optional)``
    The scalar representing the angular lower limit around the x-axis.

``angularUpperLimit (Optional)``
    The scalar representing the angular upper limit around the x-axis.

.. index::
    pair: PhysicsDevice; createTriangleArray

.. _physicsdevice_createtrianglearray:

`createTriangleArray`
---------------------

**Summary**

Creates a triangle array object, required for triangle mesh shapes.

**Syntax** ::

    var triangleArray = physicsDevice.createTriangleArray({
            vertices: positionsData,
            indices: indices,
            minExtent: positionsMin,
            maxExtent: positionsMax
        });

Returns a :ref:`TriangleArray <trianglearray>` object.


.. index::
    pair: PhysicsDevice; createTriangleMeshShape

`createTriangleMeshShape`
-------------------------

**Summary**

Creates a triangle mesh shape.

**Syntax** ::

    var triangleMeshShape = physicsDevice.createTriangleMeshShape({
            triangleArray: triangleArray,
            margin: 0.001
        });

Returns a triangle mesh :ref:`Shape <shape>` object.


.. index::
    pair: PhysicsDevice; createConvexHullShape

`createConvexHullShape`
-----------------------

**Summary**

Creates a convex hull shape.

**Syntax** ::

    var convexHullShape = physicsDevice.createConvexHullShape({
            points: positionsData,
            margin: 0.001
        });

Returns a convex hull :ref:`Shape <shape>` object.

.. _physicsdevice_createcharacter:

.. index::
    pair: PhysicsDevice; createCharacter

`createCharacter`
-----------------

**Summary**

Creates a Character object.

**Syntax** ::

    var character = physicsDevice.createCharacter({
            transform : characterMatrix,
            mass: 100.0,
            radius : characterRadius,
            height : characterHeight,
            crouchHeight: (characterHeight * 0.5)),
            stepHeight : (characterHeight * 0.1),
            maxJumpHeight : (characterHeight * 0.4),
            restitution: 0.1,
            friction: 0.7,
            group: physicsDevice.FILTER_CHARACTER,
            mask: physicsDevice.FILTER_ALL
        });

This function supports :ref:`contact callbacks <physicsdevice_contactcallbacks>`

Returns a :ref:`Character <character>` object.

Properties
==========

.. index::
    pair: PhysicsDevice; vendor

`vendor`
--------

**Summary**

The name of the company responsible for the physics library used by the physics device.

**Syntax** ::

    var vendorString = physicsDevice.vendor;

.. note:: Read Only


.. index::
    pair: PhysicsDevice; version

`version`
---------

**Summary**

The version string of the physics library used by the physics device.

**Syntax** ::

    var versionString = physicsDevice.version;
    if ('2.75' >= versionString)
    {
        useFeaturesFrom275();
    }

.. note:: Read Only


.. index::
    pair: PhysicsDevice; FILTER_

.. _physicsdevice_FILTER:

`FILTER_`
---------

**Summary**

Valid filter values, required for queries and when creating rigid bodies or collision objects.

.. hlist::
    :columns: 3

    - FILTER_DYNAMIC
    - FILTER_STATIC
    - FILTER_KINEMATIC
    - FILTER_DEBRIS
    - FILTER_TRIGGER
    - FILTER_CHARACTER
    - FILTER_PROJECTILE
    - FILTER_USER_MIN
    - FILTER_USER_MAX
    - FILTER_ALL

**Syntax** ::

    var queryFilterMask = (physicsDevice.FILTER_CHARACTER + physicsDevice.FILTER_PROJECTILE);

When using values in the user range, the value of the filter should be a power of 2::

    var allUserFilters = [];
    for (var i = physicsDevice.FILTER_USER_MIN; i <= physicsDevice.FILTER_USER_MAX; i *= 2)
    {
        allUserFilters.push(i); 
    }

.. note:: Read Only
