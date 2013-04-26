.. index::
    single: RayHit

.. highlight:: javascript

.. _rayhit:

-----------------
The RayHit Object
-----------------

A RayHit object contains result information of a :ref:`ray test <dynamicsworld_raytest>` or a :ref:`convex sweep test <dynamicsworld_convexsweeptest>`.

Properties
==========

.. index::
    pair: RayHit; collisionObject

`collisionObject`
-----------------

**Summary**

The CollisionObject that caused the hit, or null if the test hit a RigidBody.

**Syntax** ::

    var collisionObject = rayHit.collisionObject;
    if (collisionObject)
    {
    }

.. note:: Read Only


.. index::
    pair: RayHit; body

`body`
------

**Summary**

The RigidBody that caused the hit, or null if the test hit a CollisionObject.

**Syntax** ::

    var body = rayHit.body;
    if (body)
    {
    }

.. note:: Read Only


.. index::
    pair: RayHit; hitPoint

`hitPoint`
----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the location in world space of the hit.

**Syntax** ::

    var hitLocation = rayHit.hitPoint;

.. note:: Read Only


.. index::
    pair: RayHit; hitNormal

`hitNormal`
-----------

**Summary**

The :ref:`Vector3 <v3object>` object representing the normal of the surface in world space of the hit.

**Syntax** ::

    var hitNormal = rayHit.hitNormal;

.. note:: Read Only
