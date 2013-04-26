.. index::
    single: Shape

.. highlight:: javascript

.. _shape:

----------------
The Shape Object
----------------

A Shape object represents a volume and it is required for creating :ref:`RigidBody objects <rigidbody>`
and for :ref:`convex sweep tests <dynamicsworld_convexsweeptest>`.

This is the list of supported volumes:

* Plane
* Box
* Sphere
* Capsule
* Cylinder
* Cone
* Triangle Mesh
* Convex Hull

They call all be created with functions on the :ref:`PhysicsDevice <physicsdevice>`.

Properties
==========

.. index::
    pair: Shape; margin

`margin`
--------

**Summary**

The collision margin to be used with the shape.

**Syntax** ::

    // Get the current margin
    var margin = shape.margin;

    // Make it twice bigger
    shape.margin = (2.0 * margin);


.. index::
    pair: Shape; radius

`radius`
--------

**Summary**

Radius of the minimum sphere that overlaps the whole shape.
This value may not be optimal for triangle meshes or convex hulls.

**Syntax** ::

    var shapeRadius = shape.radius;

.. note:: Read Only


.. index::
    pair: Shape; halfExtents

`halfExtents`
-------------

**Summary**

A :ref:`Vector3 <v3object>` object containing the half extents of the shape.

**Syntax** ::

    var halfExtents = shape.halfExtents;
    var width  = (2.0 * halfExtents[0]);
    var height = (2.0 * halfExtents[1]);

.. note:: Read Only


.. index::
    pair: Shape; inertia

`inertia`
---------

**Summary**

A :ref:`Vector3 <v3object>` object containing the local inertia of the shape.

**Syntax** ::

    var inertia = shape.inertia;

.. note:: Read Only


.. index::
    pair: Shape; type

`type`
------

**Summary**

Name of the shape type.

**Syntax** ::

    var shapeType = shape.type;

.. note:: Read Only
