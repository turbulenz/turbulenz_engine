.. index::
    single: RigidBody

.. highlight:: javascript

.. _rigidbody:

--------------------------
The RigidBody Object
--------------------------

A RigidBody object represents a dynamic body that physically reacts to collisions with other rigid bodies or
with collision objects.

Constructor
===========

A RigidBody object can be constructed with :ref:`PhysicsDevice.createRigidBody <physicsdevice_createrigidbody>`.

Methods
=======

.. index::
    pair: RigidBody; calculateTransform

`calculateTransform`
--------------------

**Summary**

Calculates the world matrix of the rigid body.

**Syntax** ::

    var transform = mathDevice.m43BuildIdentity();
    var n, rigidBody, node;
    for (n = 0; n < numNodes; n += 1)
    {
        rigidBody = rigidBodies[n];
        node = nodes[n];

        rigidBody.calculateTransform(transform, node.origin);

        drawNode(node, transform);
    }

The `transform` parameter should be a :ref:`Matrix43 <m43object>` object and
it will be set to the world matrix of the rigid body.

The optional `origin` parameter can be used to offset the world matrix.


.. index::
    pair: RigidBody; calculateExtents

`calculateExtents`
------------------

**Summary**

Calculates the world extents of the rigid body.

**Syntax** ::

    var extents = [];
    rigidBody.calculateExtents(extents);

The :ref:`extents <extents>` parameter is the world extents of the rigid body.


.. index::
    pair: RigidBody; clone

`clone`
-------

**Summary**

Clones the rigid body.

**Syntax** ::

    var clonedRigidBody = rigidBody.clone();

Returns a new rigid body identical to the original and located at the same position.


Properties
==========

.. index::
    pair: RigidBody; transform

`transform`
-----------

**Summary**

The :ref:`Matrix43 <m43object>` object representing the rotation and location of the rigid body.

Changing the transform could be an expensive operation because the internal acceleration structures may need updating.
Also, it should only be done for kinematic objects.

**Syntax** ::

    // Get the current location
    var matrix = rigidBody.transform;

    // Move it to the origin
    rigidBody.transform = mathDevice.m43BuildIdentity();

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the RigidBody's internal storage, and querieng the property generates a new vector and copies the values
    from the RigidBody's internal storage. ::

        // THIS WILL NOT WORK!!!
        rigidBody.transform[10] = 4;

        // THIS WILL NOT WORK!!!
        VMath.m43Copy(newTransform, rigidBody.transform);


.. index::
    pair: RigidBody; linearVelocity

`linearVelocity`
----------------

**Summary**

The :ref:`Vector3 <v3object>` object representing the linear velocity of the rigid body in world space.

**Syntax** ::

    // Get current linear velocity
    var linearVelocity = rigidBody.linearVelocity;

    // Double it
    rigidBody.linearVelocity = mathDevice.v3ScalarMul(linearVelocity, 2.0);

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the RigidBody's internal storage, and querieng the property generates a new vector and copies the values
    from the RigidBody's internal storage. ::

        // THIS WILL NOT WORK!!!
        rigidBody.linearVelocity[1] = 4;

        // THIS WILL NOT WORK!!!
        VMath.v3Copy(newVelocity, rigidBody.linearVelocity);


.. index::
    pair: RigidBody; angularVelocity

`angularVelocity`
-----------------

**Summary**

The :ref:`Vector3 <v3object>` object representing the angular velocity of the rigid body.

**Syntax** ::

    // Get current angular velocity
    var angularVelocity = rigidBody.angularVelocity;

    // Double it
    rigidBody.angularVelocity = mathDevice.v3ScalarMul(angularVelocity, 2.0);

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the RigidBody's internal storage, and querieng the property generates a new vector and copies the values
    from the RigidBody's internal storage. ::

        // THIS WILL NOT WORK!!!
        rigidBody.angularVelocity[1] = 4;

        // THIS WILL NOT WORK!!!
        VMath.v3Copy(newVelocity, rigidBody.angularVelocity);


.. index::
    pair: RigidBody; linearDamping

`linearDamping`
---------------

**Summary**

The linear damping set to the rigid body.

**Syntax** ::

    // Get current linear damping
    var linearDamping = rigidBody.linearDamping;

    // Double it
    rigidBody.linearDamping = (2.0 * linearDamping);


.. index::
    pair: RigidBody; angularDamping

`angularDamping`
----------------

**Summary**

The angular damping set to the rigid body.

**Syntax** ::

    // Get current angular damping
    var angularDamping = rigidBody.angularDamping;

    // Double it
    rigidBody.angularDamping = (2.0 * angularDamping);


.. index::
    pair: RigidBody; active

`active`
--------

**Summary**

True if the rigid body is currently flagged as active, false otherwise.

**Syntax** ::

    // Is the body active
    var isActive = rigidBody.active;

    // Put to sleep
    rigidBody.active = false;


.. index::
    pair: RigidBody; shape

`shape`
-------

**Summary**

The Shape object assigned to the rigid body.

**Syntax** ::

    var shape = rigidBody.shape;

.. note:: Read Only


.. index::
    pair: RigidBody; mass

`mass`
------

**Summary**

The mass of the rigid body.

**Syntax** ::

    var mass = rigidBody.mass;

.. note:: Read Only


.. index::
    pair: RigidBody; inertia

`inertia`
---------

**Summary**

The :ref:`Vector3 <v3object>` object representing the inertia of the rigid body.

**Syntax** ::

    var inertia = rigidBody.inertia;

.. note:: Read Only


.. index::
    pair: RigidBody; group

`group`
-------

**Summary**

The collision group number assigned to the rigid body.

**Syntax** ::

    var collisionGroup = rigidBody.group;

.. note:: Read Only


.. index::
    pair: RigidBody; mask

`mask`
------

**Summary**

The collision mask number assigned to the rigid body.

**Syntax** ::

    var collisionMask = rigidBody.mask;

.. note:: Read Only


.. index::
    pair: RigidBody; userData

`userData`
----------

**Summary**

The user object associated with the rigid body.

**Syntax** ::

    // Get current user object
    var sceneOwner = rigidBody.userData;

    // Set a new one
    rigidBody.userData = doorEntity;


.. index::
    pair: RigidBody; friction

`friction`
----------

**Summary**

The friction value of the rigid body.

**Syntax** ::

    // Get current friction
    var friction = rigidBody.friction;

    // Double it
    rigidBody.friction = (2.0 * friction);


.. index::
    pair: RigidBody; restitution

`restitution`
-------------

**Summary**

The restitution value of the rigid body.

**Syntax** ::

    // Get current restitution
    var restitution = rigidBody.restitution;

    // Half it
    rigidBody.restitution = (0.5 * restitution);


.. index::
    pair: RigidBody; kinematic

`kinematic`
-----------

**Summary**

True if the rigid body was created as kinematic, false otherwise.

**Syntax** ::

    var isKinematic = rigidBody.kinematic;

.. note:: Read Only
