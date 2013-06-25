.. index::
    single: CollisionUtils

.. highlight:: javascript

.. _physics2d_collisionutils:

=========================
The CollisionUtils Object
=========================

The CollisionUtils object provides an interface to the Physics2D collision detection routines, this object can be constructed seperately and used without any physics.

Constructor
===========

A CollisionUtils object can be constructed with :ref:`Physics2DDevice.createCollisionUtils <physics2ddevice_createcollisionutils>`.

Methods
=======

.. index::
    pair: CollisionUtils; containsPoint

`containsPoint`
---------------

**Summary**

Determine if the given point in world coordinates is contained within the given :ref:`Shape <physics2d_shape>`.

**Syntax** ::

    var result = collisionUtils.containsPoint(shape, point);

``shape``
    The shape to test point containment.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates.

``point``
    The point to test containment with.

.. index::
    pair: CollisionUtils; signedDistance

`signedDistance`
----------------

**Summary**

Determine the signed distance between two :ref:`Shape <physics2d_shape>` objects, together with the witness points and axis between them.

**Syntax** ::

    var witnessA = [];
    var witnessB = [];
    var axis = [];

    var distance = collisionUtils.signedDistance(shapeA, shapeB, witnessA, witnessB, axis);

``shapeA``
    The first shape in distance query.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates.

``shapeB``
    The second shape in distance query.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates.

``witnessA``
    An array in which to store the witness point on the first shape in world coordinates.

``witnessB``
    An array in which to store the witness point on the second shape in world coordinates.

``axis``
    An array in which to store the axis between the two shapes in world coordinates. This axis will always be of unit length.

In the case that the two shapes are seperating (positive distance), the witness points will correspond to the closest points between the two shapes, and the axis corresponding to the seperating axis from `shapeA` to `shapeB`.

In the case that the two shapes are penetrating (negative distance), the witness points and axis will correspond to the MTV (Minimum translational vector) for the two shapes from `shapeA` to `shapeB`.

.. index::
    pair: CollisionUtils; intersects

`intersects`
------------

**Summary**

Determine if two :ref:`Shape <physics2d_shape>` objects are intersecting.

**Syntax** ::

    var result = collisionUtils.intersects(shapeA, shapeB);

``shapeA``
    The first shape to test intersection with.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates.

``shapeB``
    The second shape to test intersection with.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates.

.. index::
    pair: CollisionUtils; rayTest

`rayTest`
---------

**Summary**

Determine the intersection of a given :ref:`Shape <physics2d_shape>` and parametric ray.

**Syntax** ::

    var normal = [];
    var ray = {
        origin : [-1, 0],
        direction : [10, 0],
        maxFactor : 1
    };
    var ignoreInnerSurfaces = false;

    var factor = collisionUtils.rayTest(shape, ray, normal, ignoreInnerSurfaces);

``shape``
    The shape to test ray intersection with.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates.

``ray``
    The parametric ray to test for intersection with.

    The ray will not be cast beyond its `maxFactor`.

``normal``
    An array in which to store the normal at point of intersection.

``ignoreInnerSurfaces`` (Optional)
    When true, the ray will not be intersected against the inner surfaces of a shape.

    Default value is `false`.

This method returns either `undefined` indicating that no intersection occured, or the `factor` of the intersection with which one can compute the intersection point using: ::

    mathDevice.v2AddScalarMul(ray.origin, ray.direction, factor);

`sweepTest`
-----------

**Summary**

Determine the time of impact between two :ref:`Shape <physics2d_shape>` objects with point of impact and normal.

**Syntax** ::

    var point = [];
    var normal = [];

    var timeOfImpact = collisionUtils.sweepTest(shapeA, shapeB, deltaTime, point, normal);

``shapeA``
    The first shape to be swept for time of impact.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates, with the body velocities used to define the sweep for this shape.

``shapeB``
    The second shape to be swept for time of impact.

    This shape must be assigned to a :ref:`RigidBody <physics2d_body>` object to define it's position and rotation in world coordinates, with the body velocities used to define the sweep for this shape.

``deltaTime``
    The amount of time in seconds through which the shapes will be swept before returning with failure.

    This value should be strictly positive.

``point``
    An array in which to store the collision point in world space.

``normal``
    An array in which to store the collision normal in world space. This normal will always be of unit length and will point
    from `shapeA` towards `shapeB`.

This method returns either `undefined` indicating that no collision occured in the given time frame, or the `time of impact` of the collision.
