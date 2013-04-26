.. index:
    single: DynamicsWorld

.. highlight:: javascript

.. _dynamicsworld:

========================
The DynamicsWorld object
========================

Constructor
===========

A DynamicsWorld object can be constructed with :ref:`PhysicsDevice.createDynamicsWorld <physicsdevice_createdynamicsworld>`.


Methods
=======

.. index::
    pair: DynamicsWorld; update

`update`
--------

**Summary**

Updates the state of the physics simulation.
Only needs to be called once per frame.

**Syntax** ::

    dynamicsWorld.update();

.. _dynamicsworld_raytest:

.. index::
    pair: DynamicsWorld; rayTest

`rayTest`
---------

**Summary**

Performs a ray query against the physics world.

**Syntax** ::

    var rayHit = dynamicsWorld.rayTest({
            from: hitScanStart,
            to: hitScanEndPoint,
            group: physicsDevice.FILTER_PROJECTILE,
            exclude: ownerPhysicsObject
        });
    if (rayHit)
    {
    }

``group``
    A :ref:`filter value <physicsdevice_FILTER>`.

Returns a :ref:`RayHit <rayhit>` object if the test succeeded, null otherwise.

.. _dynamicsworld_convexsweeptest:

.. index::
    pair: DynamicsWorld; convexSweepTest

`convexSweepTest`
-----------------

**Summary**

Performs a convex sweep query against the physics world.

**Syntax** ::

    var hit = dynamicsWorld.convexSweepTest({
            shape: queryShape,
            from: transformStart,
            to: transformEnd,
            group: physicsDevice.FILTER_PROJECTILE,
            exclude: myRigidBody
        });

``shape``
    A :ref:`Shape <shape>` object.

``group``
    A :ref:`filter value <physicsdevice_FILTER>`.

Returns a :ref:`RayHit <rayhit>` object if the test succeeded, null otherwise.

.. index::
    pair: DynamicsWorld; addCollisionObject

`addCollisionObject`
--------------------

**Summary**

Adds a collision object to the simulation.

**Syntax** ::

    dynamicsWorld.addCollisionObject(collisionObject);

``collisionObject``
    A :ref:`CollisionObject <collisionobject>`.

Returns ``true`` if the collision object was added to the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; removeCollisionObject

`removeCollisionObject`
-----------------------

**Summary**

Removes a collision object from the simulation.

**Syntax** ::

    dynamicsWorld.removeCollisionObject(collisionObject);

``collisionObject``
    A :ref:`CollisionObject <collisionobject>`.

Returns ``true`` if the collision object was removed from the simulation, ``false`` otherwise.


.. index::
    pair: PhysicsDevice; addRigidBody

`addRigidBody`
--------------

**Summary**

Adds a rigid body to the simulation.

**Syntax** ::

    dynamicsWorld.addRigidBody(rigidBody);

``rigidBody``
    A :ref:`RigidBody <rigidbody>` object.

Returns ``true`` if the rigid body was added to the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; removeRigidBody

`removeRigidBody`
-----------------

**Summary**

Removes a rigid body from the simulation.

**Syntax** ::

    dynamicsWorld.removeRigidBody(rigidBody);

``rigidBody``
    A :ref:`RigidBody <rigidbody>` object.

Returns ``true`` if the rigid body was removed from the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; addConstraint

`addConstraint`
---------------

**Summary**

Adds a constraint to the simulation.

**Syntax** ::

    dynamicsWorld.addConstraint(constraint);

``constraint``
    A :ref:`Constraint <constraint>` object.

Returns ``true`` if the constraint was added to the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; removeConstraint

`removeConstraint`
------------------

**Summary**

Removes a constraint from the simulation.

**Syntax** ::

    dynamicsWorld.removeConstraint(constraint);

``constraint``
    A :ref:`Constraint <constraint>` object.

Returns ``true`` if the constraint was removed from the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; addCharacter

`addCharacter`
--------------

**Summary**

Adds a Character object to the simulation.

**Syntax** ::

    dynamicsWorld.addCharacter(character);

``character``
    A :ref:`Character <character>` object.

Returns ``true`` if the character was added to the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; removeCharacter

`removeCharacter`
-----------------

**Summary**

Removes a Character object from the simulation.

**Syntax** ::

    dynamicsWorld.removeCharacter(character);

``character``
    A :ref:`Character <character>` object.

Returns ``true`` if the character was removed from the simulation, ``false`` otherwise.


.. index::
    pair: DynamicsWorld; flush

`flush`
-------

**Summary**

Removes all objects from the DynamicsWorld.

**Syntax** ::

    dynamicsWorld.flush();


Properties
==========

.. index::
    pair: DynamicsWorld; maxSubSteps

`maxSubSteps`
-------------

**Summary**

The maximum number of substeps the simulation will perform per frame.

**Syntax** ::

    var maxSubSteps = dynamicsWorld.maxSubSteps;

.. note:: Read Only


.. index::
    pair: DynamicsWorld; fixedTimeStep

`fixedTimeStep`
---------------

**Summary**

Fixed simulation time in seconds per substep.

**Syntax** ::

    var fixedTimeStep = dynamicsWorld.fixedTimeStep;

.. note:: Read Only


.. index::
    pair: DynamicsWorld; gravity

`maxGiveUpTimeStep`
-------------------

**Summary**

Should the number of sub steps required exceed `maxSubSteps` then whether
using fixed or variable time steps, the size of a time step will be permitted
to reach a maximum of this amount to prevent loss of simulation time.

Setting to 0 means that we will not permit time step to be increased.

**Syntax** ::

    var maxGiveUpTimeStep = dynamicsWorld.maxGiveUpTimeStep;

.. note:: Read Only, Canvas Only

`minimumTimeStep`
-----------------

**Summary**

Minimum simulation time in seconds per substep.

**Syntax** ::

    var minimumTimeStep = dynamicsWorld.minimumTimeStep;

.. note:: Read Only, Canvas Only.

`maximumTimeStep`
-----------------

**Summary**

Maximum simulation time in seconds per substep.

**Syntax** ::

    var maximumTimeStep = dynamicsWorld.maximumTimeStep;

.. note:: Read Only, Canvas Only.

`gravity`
---------

**Summary**

The direction and magnitude of a global `gravity` force applied to the
whole scene per frame.

**Syntax** ::

    var gravity = dynamicsWorld.gravity;

.. note:: Read Only

`performanceData`
-----------------

**Summary**

Performance data about internal stages of the ``update()`` method, this is available only in Canvas.

Each field records the approximate number of seconds spent in the corresponding area for the previous call
to ``update()``. If more than one substep occured, this information will relate to the summation of sub-step costs.

**Fields**

``discrete``
    The time spent performing discrete collision detection.

``sleepComputation``
    The time spent evaluating which objects can be put to sleep.

``prestepContacts``
    The time spent performing precomputations on contacts.

``prestepConstraints``
    The time spent performing precomputations on constraints.

``integrateVelocities``
    The time spent integrating body velocities

``warmstartContacts``
    The time spent applying previous update's cached impulses for contacts.

``warmstartConstraints``
    The time spent applying previous update's cached impulses for constraints.

``physicsIterations``
    The time spent solving constraint errors for impulses for both contacts and constraints.

``integratePositions``
    The time spent integrating body positions and preparing bodies for continous collision detection.

``continuous``
    The time spent performing the actual continuous collision detection.

.. note:: Read Only
