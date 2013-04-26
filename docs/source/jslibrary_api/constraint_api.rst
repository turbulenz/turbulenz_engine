.. index::
    single: Constraint

.. highlight:: javascript

.. _constraint:

---------------------
The Constraint Object
---------------------

A Constraint object represents a physics constraint between two rigid bodies.

This is the list of supported constraints:

* Point to Point
* Hinge
* Cone Twist
* 6 Degrees of Freedom
* Slider

These constraints can be constructed with methods on the :ref:`PhysicsDevice <physicsdevice>`.

Properties
==========

.. index::
    pair: Constraint; bodyA

`bodyA`
-------

**Summary**

The first body the constraint applies to.

**Syntax** ::

    var bodyA = constraint.bodyA;

.. note:: Read Only


.. index::
    pair: Constraint; bodyB

`bodyB`
-------

**Summary**

The second body the constraint applies to.

**Syntax** ::

    var bodyB = constraint.bodyB;

.. note:: Read Only


.. index::
    pair: Constraint; transformA

`transformA`
------------

**Summary**

The :ref:`Matrix43 <m43object>` object representing the frame of reference of the constraint for bodyA.
It can only be modified for constraints of type slider or D6.

**Syntax** ::

    // Get the current frame
    var matrix = constraint.transformA;

    // Set it to the origin
    constraint.transformA = mathDevice.m43BuildIdentity();

.. note:: Not present on the Point2Point constraint

.. index::
    pair: Constraint; transformB

`transformB`
------------

**Summary**

The :ref:`Matrix43 <m43object>` object representing the frame of reference of the constraint for bodyB.
It can only be modified for constraints of type slider or D6.

**Syntax** ::

    // Get the current frame
    var matrix = constraint.transformB;

    // Set it to the origin
    constraint.transformB = mathDevice.m43BuildIdentity();

.. note:: Not present on the Point2Point constraint

.. index::
    pair: Constraint; type

`type`
------

**Summary**

Name of the constraint type.

**Syntax** ::

    var constraintTypeName = constraint.type;

.. note:: Read Only

.. _constraint_point2point_properties:

Point2Point Properties
======================

`pointA`
--------

**Summary**

The :ref:`Vector3 <v3object>` value representing the local pivot point on bodyA.

**Syntax** ::

    // Get the current pointA
    var pointA = constraint.pointA;

    // Set a new pivot point for bodyA
    constraint.pointA = mathDevice.v3Build(0, 0, 1);

`pointB`
--------

**Summary**

The :ref:`Vector3 <v3object>` value representing the local pivot point on bodyB.

**Syntax** ::

    // Get the current pointB
    var pointA = constraint.pointB;

    // Set a new pivot point for bodyB
    constraint.pointB = mathDevice.v3Build(0, 0, 1);

`force`
-------

**Summary**

The scalar value representing the maximum force for the constraint.
Synonymous to tau in the bullet documentation.

**Syntax** ::

    // Get the current force
    var force = constraint.force;

    // Double it
    constraint.force = (2.0 * force);

`damping`
---------

**Summary**

The scalar value representing the damping of the constraint.

**Syntax** ::

    // Get the current damping
    var damping = constraint.damping;

    // Half it
    constraint.damping = (0.5 * damping);

`impulseClamp`
--------------

**Summary**

The scalar value representing the impulse clamp of the constraint. A value of 0.0 means no clamp exists.

**Syntax** ::

    // Get the current clamp
    var clamp = constraint.impulseClamp;

    // Change the clamp
    constraint.impulseClamp = 2.0;

.. _constraint_hinge_properties:

Hinge Properties
================

`low`
-----

**Summary**

The scalar value representing the lower limit of the constraint's rotation (in radians).

**Syntax** ::

    // Get the current lower limit
    var lowerLimit = constraint.low;

    // Set a new lower limit
    constraint.low = Math.PI / 2;

`high`
------

**Summary**

The scalar value representing the upper limit of the constraint's rotation (in radians).

**Syntax** ::

    // Get the current upper limit
    var upperLimit = constraint.high;

    // Set a new upper limit
    constraint.high = Math.PI;

.. _constraint_conetwist_properties:

ConeTwist Properties
====================

`swingSpan1`
------------

**Summary**

The scalar value representing the angle used to form the ellipsis in one axis (in radians).

**Syntax** ::

    // Get the current lower limit
    var swingSpan1 = constraint.swingSpan1;

    // Set a new lower limit
    constraint.swingSpan1 = Math.PI / 2;

`swingSpan2`
------------

**Summary**

The scalar value representing the angle used to form the ellipsis in one axis (in radians).

**Syntax** ::

    // Get the current lower limit
    var swingSpan2 = constraint.swingSpan2;

    // Set a new lower limit
    constraint.swingSpan2 = Math.PI / 2;

`twistSpan`
-----------

**Summary**

The scalar value representing the limit of the rotation around the x-axis (in radians).

**Syntax** ::

    // Get the current lower limit
    var twistSpan = constraint.twistSpan;

    // Set a new lower limit
    constraint.twistSpan = Math.PI / 2;

`twistAngle`
------------

**Summary**

The scalar value representing the angle with the x-axis the body can rotate to (in radians).

**Syntax** ::

    // Get the twist angle
    var twistAngle = constraint.twistAngle;

.. note:: Read Only

.. _constraint_6dof_properties:

6DOF Properties
===============

`linearLowerLimit`
------------------

**Summary**

The :ref:`Vector3 <v3object>` value representing the translational lower limit for each axis.
Each component of the vector represents the lower limit in that axis.

**Syntax** ::

    // Get the current lower limit
    var linearLowerLimit = constraint.linearLowerLimit;

    // Set a new lower limit
    constraint.linearLowerLimit = mathDevice.v3Build(1, 1, 1);

`linearUpperLimit`
------------------

**Summary**

The :ref:`Vector3 <v3object>` value representing the translational upper limit for each axis.
Each component of the vector represents the upper limit in that axis.

**Syntax** ::

    // Get the current upper limit
    var linearUpperLimit = constraint.linearUpperLimit;

    // Set a new upper limit
    constraint.linearUpperLimit = mathDevice.v3Build(1, 1, 1);

`angularLowerLimit`
-------------------

**Summary**

The :ref:`Vector3 <v3object>` value representing the angular motion lower limit for each axis.
Each component of the vector represents the lower limit in that axis (in radians).

**Syntax** ::

    // Get the current lower limit
    var angularLowerLimit = constraint.angularLowerLimit;

    // Set a new lower limit
    constraint.angularLowerLimit = mathDevice.v3Build(-Math.PI, -Math.PI, -Math.PI);

`angularUpperLimit`
-------------------

**Summary**

The :ref:`Vector3 <v3object>` value representing the angular motion upper limit for each axis.
Each component of the vector represents the upper limit in that axis (in radians).

**Syntax** ::

    // Get the current upper limit
    var angularUpperLimit = constraint.angularUpperLimit;

    // Set a new upper limit
    constraint.angularUpperLimit = mathDevice.v3Build(Math.PI, Math.PI, Math.PI);

.. _constraint_slider_properties:

Slider Properties
=================

`linearLowerLimit`
------------------

**Summary**

The scalar value representing the translational lower limit for the x-axis.

**Syntax** ::

    // Get the current lower limit
    var linearLowerLimit = constraint.linearLowerLimit;

    // Set a new lower limit
    constraint.linearLowerLimit = -3.0;

`linearUpperLimit`
------------------

**Summary**

The scalar value representing the translational upper limit for the x-axis.

**Syntax** ::

    // Get the current upper limit
    var linearUpperLimit = constraint.linearUpperLimit;

    // Set a new upper limit
    constraint.linearUpperLimit = 3.0;

`angularLowerLimit`
-------------------

**Summary**

The scalar value representing the angular motion lower limit for the x-axis (in radians).

**Syntax** ::

    // Get the current lower limit
    var angularLowerLimit = constraint.angularLowerLimit;

    // Set a new lower limit
    constraint.angularLowerLimit = -(Math.PI / 2);

`angularUpperLimit`
-------------------

**Summary**

The scalar value representing the angular motion upper limit for the x-axis (in radians).

**Syntax** ::

    // Get the current upper limit
    var angularUpperLimit = constraint.angularUpperLimit;

    // Set a new upper limit
    constraint.angularUpperLimit = Math.PI / 2;
