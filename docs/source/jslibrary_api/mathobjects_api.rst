.. highlight:: javascript


.. index::
    single: Vector2

.. _vector2:
.. _v2object:

------------------
The Vector2 Object
------------------

A Vector2 object represents a fixed length array with 2 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Vector2; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var vecCopy = vec.slice();

Returns a :ref:`Vector2 <v2object>` object.

Properties
==========

.. index::
    pair: Vector2; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Vector2 will be 2.

**Syntax** ::

    var numElements = vec.length;

.. note:: Read Only


.. index::
    single: Vector3

.. _vector3:
.. _v3object:

------------------
The Vector3 Object
------------------

A Vector3 object represents a fixed length array with 3 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Vector3; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var vecCopy = vec.slice();

Returns a :ref:`Vector3 <v3object>` object.

Properties
==========

.. index::
    pair: Vector3; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Vector3 will be 3.

**Syntax** ::

    var numElements = vec.length;

.. note:: Read Only


.. index::
    single: Vector4

.. _vector4:
.. _v4object:
.. _plane:

------------------
The Vector4 Object
------------------

A Vector4 object represents a fixed length array with 4 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

**Planes**

Planes are represented with a Vector4 object.
The first 3 components are the normal of the plane and the fourth component is its distance, in the
direction of the normal, from the origin.

Methods
=======

.. index::
    pair: Vector4; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var vecCopy = vec.slice();

Returns a :ref:`Vector4 <v4object>` object.

Properties
==========

.. index::
    pair: Vector4; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Vector4 will be 4.

**Syntax** ::

    var numElements = vec.length;

.. note:: Read Only


.. index::
    single: AABB

.. _aabbobject:

-------------------------------------------
The AABB (Axis Aligned Bounding Box) Object
-------------------------------------------

A AABB object represents a fixed length array with 6 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

The AABB object is represented internally as minimum and maximum points in 3D.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: AABB; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var aabbCopy = aabb.slice();
    var aabbMin = aabb.slice(0, 3);
    var aabbMax = aabb.slice(3, 6);

Returns a :ref:`AABB <aabbobject>` object.

Properties
==========

.. index::
    pair: AABB; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a AABB object will be 6.

**Syntax** ::

    var numElements = aabb.length;

.. note:: Read Only

.. index::
    single: Quaternion

.. _quatobject:

---------------------
The Quaternion Object
---------------------

A Quaternion object represents a rotation stored as a `quaternion <http://en.wikipedia.org/wiki/Quaternion>`_.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Quaternion; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var quatCopy = quat.slice();

Returns a :ref:`Quaternion <quatobject>` object.


Properties
==========

.. index::
    pair: Quaternion; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Quaternion will be 4.

**Syntax** ::

    var numElements = quat.length;

.. note:: Read Only

.. index::
    single: QuaternionPosition

.. _quatposobject:

-----------------------------
The QuaternionPosition Object
-----------------------------

A QuaternionPosition object represents a rotation stored as a `quaternion <http://en.wikipedia.org/wiki/Quaternion>`_ and
a position stored as 3 floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.
The quaternion is stored on the first 4 elements and the position on the last 3.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: QuaternionPosition; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var quatPosCopy = quatPos.slice();
    var quat = quatPos.slice(0, 4);
    var pos = quatPos.slice(4, 7);

Returns a :ref:`QuaternionPosition <quatposobject>` object.

Properties
==========

.. index::
    pair: QuaternionPosition; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a QuaternionPosition will be 7.

**Syntax** ::

    var numElements = quatPos.length;

.. note:: Read Only

.. index::
    single: Matrix33

.. _m33object:

-------------------
The Matrix33 Object
-------------------

A Matrix33 object represents a 3 by 3 matrix stored as a fixed length array with 9 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Matrix33; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var matrixCopy = matrix.slice();
    var right = matrix.slice(0, 3);
    var up    = matrix.slice(3, 6);
    var at    = matrix.slice(6, 9);

The optional first parameter represents the offset of the element to start copying,
valid values are multiples of 3.

The optional second parameter represents the offset of the element to end the copy,
it is required to be the start offset plus 3.

Returns a Matrix33 object if no parameters are passed, a Vector3 otherwise.

Properties
==========

.. index::
    pair: Matrix33; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Matrix33 will be 9.

**Syntax** ::

    var numElements = matrix.length;

.. note:: Read Only

.. index::
    single: Matrix34

.. _m34object:

-------------------
The Matrix34 Object
-------------------

A Matrix34 object represents a 3 by 4 matrix stored as a fixed length array with 12 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Matrix34; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var matrixCopy = matrix.slice();
    var vec0 = matrix.slice(0, 4);
    var vec1 = matrix.slice(4, 8);
    var vec2 = matrix.slice(8, 12);

The optional first parameter represents the offset of the element to start copying,
valid values are multiples of 4.

The optional second parameter represents the offset of the element to end the copy,
it is required to be the start offset plus 4.

Returns a Matrix34 object if no parameters are passed, a Vector4 otherwise.

Properties
==========

.. index::
    pair: Matrix34; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Matrix34 will be 12.

**Syntax** ::

    var numElements = matrix.length;

.. note:: Read Only

.. index::
    single: Matrix43

.. _m43object:

-------------------
The Matrix43 Object
-------------------

A Matrix43 object represents a 4 by 3 matrix stored as a fixed length array with 12 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Matrix43; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var matrixCopy = matrix.slice();
    var right = matrix.slice(0, 3);
    var up    = matrix.slice(3, 6);
    var at    = matrix.slice(6, 9);
    var pos   = matrix.slice(9, 12);

The optional first parameter represents the offset of the element to start copying,
valid values are multiples of 3.

The optional second parameter represents the offset of the element to end the copy,
it is required to be the start offset plus 3.

Returns a Matrix43 object if no parameters are passed, a Vector3 otherwise.

Properties
==========

.. index::
    pair: Matrix43; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Matrix43 will be 12.

**Syntax** ::

    var numElements = matrix.length;

.. note:: Read Only

.. index::
    single: Matrix44

.. _m44object:

-------------------
The Matrix44 Object
-------------------

A Matrix44 object represents a 4 by 4 matrix stored as a fixed length array with 16 single-precision floating point values.
It behaves like a JavaScript array for getting or setting array elements but it can not be resized.

This object has been designed to provide optimal data storage for calculations done by the MathDevice.

Methods
=======

.. index::
    pair: Matrix44; slice

`slice`
-------

**Summary**

Create a new math object copying the contents from the current math object.

**Syntax** ::

    var matrixCopy = matrix.slice();
    var vec0 = matrix.slice(0, 4);
    var vec1 = matrix.slice(4, 8);
    var vec2 = matrix.slice(8, 12);
    var vec3 = matrix.slice(12, 16);

The optional first parameter represents the offset of the element to start copying,
valid values are multiples of 4.

The optional second parameter represents the offset of the element to end the copy,
it is required to be the start offset plus 4.

Returns a Matrix44 object if no parameters are passed, a Vector4 otherwise.

Properties
==========

.. index::
    pair: Matrix44; length

`length`
--------

**Summary**

The number of elements on the math object,
which for a Matrix44 will be 16.

**Syntax** ::

    var numElements = matrix.length;

.. note:: Read Only
