.. index::
    single: CollisionObject

.. highlight:: javascript

.. _collisionobject:

--------------------------
The CollisionObject Object
--------------------------

A CollisionObject object represents an static or kinematic body against which rigid bodies can collide.

Constructor
===========

A CollisionObject object can be constructed with :ref:`PhysicsDevice.createCollisionObject <physicsdevice_createcollisionobject>`.

Methods
=======

.. index::
    pair: CollisionObject; calculateTransform

`calculateTransform`
--------------------

**Summary**

Calculates the world matrix of the collision object.

**Syntax** ::

    var transform = mathDevice.m43BuildIdentity();
    var n, collisionObject, node;
    for (n = 0; n < numNodes; n += 1)
    {
        collisionObject = collisionObjects[n];
        node = nodes[n];

        collisionObject.calculateTransform(transform, node.origin);

        drawNode(node, transform);
    }

The `transform` parameter should be a :ref:`Matrix43 <m43object>` object and
it will be set to the world matrix of the collision object.

The optional `origin` parameter can be used to offset the world matrix.


.. index::
    pair: CollisionObject; calculateExtents

`calculateExtents`
------------------

**Summary**

Calculates the world extents of the collision object.

**Syntax** ::

    var extents = [];
    collisionObject.calculateExtents(extents);


``extents``
    The world :ref:`extents <extents>` of the collision object.


.. index::
    pair: CollisionObject; clone

`clone`
-------

**Summary**

Clones the collision object.

**Syntax** ::

    var clonedCollisionObject = collisionObject.clone();

Returns a new collision object identical to the original and located at the same position.

Properties
==========

.. index::
    pair: CollisionObject; transform

`transform`
-----------

**Summary**

The :ref:`Matrix43 <m43object>` representing the rotation and location of the collision object.

Changing the transform could be an expensive operation because the internal acceleration structures may need updating.
Also, it should only be done for kinematic objects once the object is in the physics world.

**Syntax** ::

    // Get the current location
    var matrix = collisionObject.transform;

    // Move it to the origin
    collisionObject.transform = mathDevice.m43BuildIdentity();

.. note::

    This property is implemented using getters and setters. Setting the property copies the vector values
    to the CollisionObject's internal storage, and querieng the property generates a new vector and copies the values
    from the CollisionObject's internal storage. ::

        // THIS WILL NOT WORK!!!
        collisionObject.transform[10] = 4;

        // THIS WILL NOT WORK!!!
        VMath.m43Copy(newTransform, collisionObject.transform);


.. index::
    pair: CollisionObject; shape

`shape`
-------

**Summary**

The Shape object assigned to the collision object.

**Syntax** ::

    var shape = collisionObject.shape;

.. note:: Read Only


.. index::
    pair: CollisionObject; group

`group`
-------

**Summary**

The collision group number assigned to the collision object.

**Syntax** ::

    var collisionGroup = collisionObject.group;

.. note:: Read Only


.. index::
    pair: CollisionObject; mask

`mask`
------

**Summary**

The collision mask number assigned to the collision object.

**Syntax** ::

    var collisionMask = collisionObject.mask;

.. note:: Read Only


.. index::
    pair: CollisionObject; userData

`userData`
----------

**Summary**

The user object associated with the collision object.

**Syntax** ::

    // Get current user object
    var sceneOwner = collisionObject.userData;

    // Set a new one
    collisionObject.userData = doorEntity;


.. index::
    pair: CollisionObject; friction

`friction`
----------

**Summary**

The friction value of the collision object.

**Syntax** ::

    // Get current friction
    var friction = collisionObject.friction;

    // Double it
    collisionObject.friction = (2.0 * friction);


.. index::
    pair: CollisionObject; restitution

`restitution`
-------------

**Summary**

The restitution value of the collision object.

**Syntax** ::

    // Get current restitution
    var restitution = collisionObject.restitution;

    // Half it
    collisionObject.restitution = (0.5 * restitution);


.. index::
    pair: CollisionObject; kinematic

`kinematic`
-----------

**Summary**

True if the collision object was created as kinematic, false otherwise.

**Syntax** ::

    var isKinematic = collisionObject.kinematic;

.. note:: Read Only
