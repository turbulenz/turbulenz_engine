.. index::
    single: MathDevice

.. highlight:: javascript

.. _mathdevice:

---------------------
The MathDevice Object
---------------------

Provides optimized vector and matrix operations.

**Compatibility with JavaScript arrays (returned by VMath function calls and JSON.parse)**

The MathDevice functions are **not compatible with JavaScript arrays** this includes the result of **VMath functions**.
To convert between VMath and MathDevice objects see :ref:`MathDeviceConvert <mathdeviceconvert>`.

.. _mathdevice_optional_dst:

**Optional destination parameter**

Most of the functions on the MathDevice which return a MathDevice object have an optional destination parameter.
This optional last parameter specifies the MathDevice object to copy the result into.
This functionality is useful to avoid the memory allocation of a new vector.
For example, the following code will require memory for 3 Vector3 objects: ::

    var vectorA = mathDevice.v3Build(1, 2, 3);
    var vectorB = mathDevice.v3Build(4, 5, 6);
    vectorB = mathDevice.v3Add(vectorA, vectorB);

Later on the JavaScript VM will have to garbage collect the unreferenced Vector3 memory costing valuable time.
However taking advantage of the destination parameter, the following code will require memory for only 2 Vector3 objects: ::

    var vectorA = mathDevice.v3Build(1, 2, 3);
    var vectorB = mathDevice.v3Build(4, 5, 6);
    mathDevice.v3Add(vectorA, vectorB, vectorB);

This method doesn't require the JavaScript VM to do any unneeded garbage collection.

The destination can also be ``null`` or ``undefined`` in which case the destination is ignored and a new MathDevice object is created.

**Function caching**

When using the MathDevice object is it always best to cache functions when they are called multiple times. For example: ::

    var a, b;
    a = mathDevice.v3Build(1, 1, 1);
    b = mathDevice.v3Build(1, 2, 3);
    for (var i = 0; i < 6; i += 1)
    {
        mathDevice.v3Mul(a, b, a);
    }

Will be slower than: ::

    var a, b;
    a = mathDevice.v3Build(1, 1, 1);
    b = mathDevice.v3Build(2, 3, 4);
    var v3Mul = mathDevice.v3Mul;
    for (var i = 0; i < 6; i += 1)
    {
        v3Mul.call(mathDevice, a, b, a);
    }

For more information, see the section :ref:`caching_functions`.

Methods
=======

The format for all Math Device function names is lower case type name, e.g. v3, m44 or quat, followed by the operation in camel case.
For example::

    mathDevice.typeNameFunctionName();
    mathDevice.typeNameFunctionNameTypeName();

A preceding type name is given if the second parameters type is not clear.
For example, ``mathDevice.quatFromM43`` rather than ``mathDevice.quatFromMatrix``.

The MathDevice uses arrays of single-precision floats for all of its internal objects.
On the other hand the JavaScript representation of numbers uses double-precision floats for all of its number objects.
Subsequently, there is a loss of precision between JavaScript values and the MathDevice objects to be careful of.

.. index::
    pair: MathDevice; objectsAreIdentical

`objectsAreIdentical`
---------------------

**Summary**

Compares two native math device objects and returns true if they are the same object. This method is intended
for debugging and validation purposes only.

**Syntax** ::

    var identical = mathDevice.objectsAreIdentical(v1, v2);

.. index::
    pair: MathDevice; truncate

`truncate`
----------

**Summary**

Converts the given floating point number into an integer, rounding towards zero.

**Syntax** ::

    var index = mathDevice.truncate(fraction * tableSize);

.. index::
    pair: MathDevice; v2Build

`v2Build`
---------

**Summary**

Creates a vector with 2 components.

**Syntax** ::

    var destination = mathDevice.v2Build(a, b, destination);

``a``, ``b``
    A JavaScript number.
    The components of the vector to build.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2BuildZero

`v2BuildZero`
-------------

**Summary**

Creates a vector with 2 components all set to `0.0`.

**Syntax** ::

    var position = mathDevice.v2BuildZero(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

`v2BuildOne`
------------

**Summary**

Creates a vector with 2 components all set to `1.0`.

**Syntax** ::

    var position = mathDevice.v2BuildOne(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2BuildXAxis

`v2BuildXAxis`
--------------

**Summary**

Creates a vector with 2 components set to `[1.0, 0.0]`.

**Syntax** ::

    var position = mathDevice.v2BuildXAxis(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2BuildYAxis

`v2BuildYAxis`
--------------

**Summary**

Creates a vector with 2 components set to `[0.0, 1.0]`.

**Syntax** ::

    var position = mathDevice.v2BuildYAxis(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2BuildZAxis

.. index::
    pair: MathDevice; v2Copy

.. _v2copy:

`v2Copy`
--------

**Summary**

Returns a 2 component vector copy of the given vector.

**Syntax** ::

    var source = mathDevice.v2Build(0, 20);
    var destination = mathDevice.v2Copy(source, destination);

``source``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2Abs

`v2Abs`
--------

**Summary**

Returns a 2 component vector initialized to the component-wise absolute of the vector parameter given.

**Syntax** ::

    var vector = mathDevice.v2Build(-4, 10);
    destination = mathDevice.v2Abs(vector, destination);

``vectorA``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2Equal

`v2Equal`
---------

**Summary**

Returns a boolean specifying whether the two 2 component vectors are equal.
Optional third parameter specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(2.00049, 0);
    var equal = mathDevice.v2Equal(vectorA, vectorB, scalar);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``scalar`` (Optional)
    A JavaScript number.

.. index::
    pair: MathDevice; v2Neg

`v2Neg`
-------

**Summary**

Returns a 2 component vector initialized to the component-wise negation of a given vector.

**Syntax** ::

    var vector = mathDevice.v2Build(0, 20);
    destination = mathDevice.v2Neg(vector, destination);

``vector``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2Reciprocal

`v2Reciprocal`
--------------

**Summary**

Returns a 2 component vector initialized to the component-wise reciprocal of a given vector.

**Syntax** ::

    var vector = mathDevice.v2Build(0.5, 5);
    destination = mathDevice.v2Reciprocal(vector, destination);

``vector``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

If any of the components is zero this will cause an "Error calling method on NPObject" JavaScript error.

.. index::
    pair: MathDevice; v2Add

`v2Add`
-------

**Summary**

Returns a 2 component vector initialized to the component-wise addition of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    destination = mathDevice.v2Add(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2Add2

`v2Add2`
--------

**Summary**

Returns a 2 component vector initialized to the component-wise addition of 2 other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    var vectorC = mathDevice.v2Build(1, 2);
    destination = mathDevice.v2Add2(vectorA, vectorB, vectorC, destination);

``vectorA``, ``vectorB``, ``vectorC``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2Add4

`v2Add4`
--------

**Summary**

Returns a 2 component vector initialized to the component-wise addition of 4 other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    var vectorC = mathDevice.v2Build(1, 2);
    var vectorD = mathDevice.v2Build(4, 6);
    destination = mathDevice.v2Add4(vectorA, vectorB, vectorC, vectorD, destination);

``vectorA``, ``vectorB``, ``vectorC``, ``vectorD``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2Sub

`v2Sub`
-------

**Summary**

Returns a 2 component vector initialized to the component-wise subtraction of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    destination = mathDevice.v2Sub(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2Mul

`v2Mul`
-------

**Summary**

Returns a 2 component vector initialized to the component-wise multiplication of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    destination = mathDevice.v2Mul(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2Min

`v2Min`
-------

**Summary**

Returns a 2 component vector initialized to the component-wise minimum of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    destination = mathDevice.v2Min(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2Max

`v2Max`
-------

**Summary**

Returns a 2 component vector initialized to the component-wise maximum of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v2Build(2, 0);
    var vectorB = mathDevice.v2Build(7, 4);
    destination = mathDevice.v2Max(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2Dot

`v2Dot`
-------

**Summary**

Returns the scalar dot product of two 2 component vectors.

**Syntax** ::

    var cosAngle = mathDevice.v2Dot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v2Cross

`v2PerpDot`
-----------

**Summary**

Returns the scalar perp-dot product of two 2 component vectors.

**Syntax** ::

    var sinAngle = mathDevice.v2PerpDot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

Returns a JavaScript number.


.. index::
    pair: MathDevice; v2Normalize

`v2Normalize`
-------------

**Summary**

Returns a 2 component vector initialized to the normalized value of another 2 component vector.

**Syntax** ::

    var vector = mathDevice.v2Build(2, 6);
    destination = mathDevice.v2Normalize(vector, destination);

``vector``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2LengthSq

`v2LengthSq`
------------

**Summary**

Returns the scalar squared length of a given 2 component vector.

**Syntax** ::

    var vectorLengthSq = mathDevice.v2LengthSq(vector);

    //example usage:
    if (1.0 !== vectorLengthSq)
    {
        normal = mathDevice.v2ScalarMul(vector, (1.0 / Math.sqrt(vectorLengthSq)));
    }

Returns a JavaScript number.

``vector``
    A :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2Length

`v2Length`
----------

**Summary**

Returns the scalar length of a given 2 component vector.

**Syntax** ::

    var vectorLength = mathDevice.v2Length(vector);

    //example usage:
    if (1.0 !== vectorLength)
    {
        vector = mathDevice.v2ScalarMul(vector, (1.0 / vectorLength));
    }

``vector``
    A :ref:`Vector2 <v2object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v2MulAdd

`v2MulAdd`
----------

**Summary**

Returns a 2 component vector initialized to the addition of the third argument with the multiplication of the first two arguments.

**Syntax** ::

    var vectorMulA = mathDevice.v2Build(2, 2);
    var vectorMulB = mathDevice.v2Build(0, 7);
    var vectorAdd = mathDevice.v2Build(1, 8);
    destination = mathDevice.v2MulAdd(vectorMulA, vectorMulB, vectorAdd, destination);

    //example usage:
    var newPos = mathDevice.v2MulAdd(velocity, deltaTime, pos);

``vectorMulA``, ``vectorMulB``, ``vectorAdd``
    A :ref:`Vector2 <v2object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2ScalarBuild

`v2ScalarBuild`
---------------

**Summary**

Creates a vector with 2 components all set to the scalar argument provided.

**Syntax** ::

    var destination = mathDevice.v2ScalarBuild(100, destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.

.. index::
    pair: MathDevice; v2ScalarAdd

`v2ScalarAdd`
-------------

**Summary**

Returns a 2 component vector initialized to the addition of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v2ScalarAdd(vector, scalar, destination);

    //example usage:
    nodeMaxExtent = mathDevice.v2ScalarAdd(nodeMaxExtent, 0.1);

``vector``
    A :ref:`Vector2 <v2object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2ScalarSub

`v2ScalarSub`
-------------

**Summary**

Returns a 2 component vector initialized to the subtraction of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v2ScalarSub(vector, scalar, destination);

    //example usage:
    nodeMinExtent = mathDevice.v2ScalarSub(nodeMinExtent, 0.1);

``vector``
    A :ref:`Vector2 <v2object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2ScalarMul

`v2ScalarMul`
-------------

**Summary**

Returns a 2 component vector initialized to the multiplication of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v2ScalarMul(vector, scalar, destination);

    //example usage:
    var paddedExtents = mathDevice.v2ScalarMul(extents, 1.1);

``vector``
    A :ref:`Vector2 <v2object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. _mathdevice_v2addscalarmul:

.. index::
    pair: MathDevice; v2AddScalarMul

`v2AddScalarMul`
----------------

**Summary**

Returns a 2 component vector initialized to the sum of the first vector with the multiplication of the second vector parameter by the third scalar one.

**Syntax** ::

    newPosition = mathDevice.v2AddScalarMul(position, velocity, time, newPosition);

``position``
    A :ref:`Vector2 <v2object>` object.

``velocity``
    A :ref:`Vector2 <v2object>` object.

``time``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2Lerp

`v2Lerp`
--------

**Summary**

Returns a 2 component vector initialized to the linear interpolation between the first and second vector parameters using
the delta passed as the third parameter.

**Syntax** ::

    var vectorA = mathDevice.v2Build(10, 20);
    var vectorB = mathDevice.v2Build(20, 0);
    destination = mathDevice.v2Lerp(vectorA, vectorB, scalar, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.


.. index::
    pair: MathDevice; v2CatmullRom

`v2CatmullRom`
--------------

**Summary**

Returns a 2 component vector initialized to the Catmull Rom interpolation through a set of 4 points.

**Syntax** ::

    var vectorA = mathDevice.v2Build(10,  0);
    var vectorB = mathDevice.v2Build(20,  0);
    var vectorC = mathDevice.v2Build(5,  10);
    var vectorD = mathDevice.v2Build(10, 10);
    destination = mathDevice.v2CatmullRom(t, tension, vectorA, vectorB, vectorC, vectorD, destination);

``vectorA``, ``vectorB``, ``vectorC``, ``vectorD``
    A :ref:`Vector2 <v2object>` object.

``t``, ``tension``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector2 <v2object>` object.
The interpolation will be at ``B`` with derivative ``tension * (C - A)``  for ``t = 0``.
The interpolation will be at ``C`` with derivative ``tension * (D - A)``   for ``t = 1``.

.. index::
    pair: MathDevice; v3Build

`v3Build`
---------

**Summary**

Creates a vector with 3 components.

**Syntax** ::

    var destination = mathDevice.v3Build(a, b, c, destination);

``a``, ``b``, ``c``
    A JavaScript number.
    The components of the vector to build.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3BuildZero

`v3BuildZero`
-------------

**Summary**

Creates a vector with 3 components all set to `0.0`.

**Syntax** ::

    var position = mathDevice.v3BuildZero(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

`v3BuildOne`
------------

**Summary**

Creates a vector with 3 components all set to `1.0`.

**Syntax** ::

    var position = mathDevice.v3BuildOne(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3BuildXAxis

`v3BuildXAxis`
--------------

**Summary**

Creates a vector with 3 components set to `[1.0, 0.0, 0.0]`.

**Syntax** ::

    var position = mathDevice.v3BuildXAxis(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3BuildYAxis

`v3BuildYAxis`
--------------

**Summary**

Creates a vector with 3 components set to `[0.0, 1.0, 0.0]`.

**Syntax** ::

    var position = mathDevice.v3BuildYAxis(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3BuildZAxis

`v3BuildZAxis`
--------------

**Summary**

Creates a vector with 3 components set to `[0.0, 0.0, 1.0]`.

**Syntax** ::

    var position = mathDevice.v3BuildZAxis(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Copy

.. _v3copy:

`v3Copy`
--------

**Summary**

Returns a 3 component vector copy of the given vector.

**Syntax** ::

    var source = mathDevice.v3Build(0, 0, 20);
    var destination = mathDevice.v3Copy(source, destination);

``source``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Abs

`v3Abs`
--------

**Summary**

Returns a 3 component vector initialized to the component-wise absolute of the vector parameter given.

**Syntax** ::

    var vector = mathDevice.v3Build(-4, 0, 10);
    destination = mathDevice.v3Abs(vector, destination);

``vectorA``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Equal

`v3Equal`
---------

**Summary**

Returns a boolean specifying whether the two 3 component vectors are equal.
Optional third parameter specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    var vectorA = mathDevice.v3Build(0, 2, 0);
    var vectorB = mathDevice.v3Build(0, 2.00049, 0);
    var equal = mathDevice.v3Equal(vectorA, vectorB, scalar);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``scalar`` (Optional)
    A JavaScript number.

.. index::
    pair: MathDevice; v3Neg

`v3Neg`
-------

**Summary**

Returns a 3 component vector initialized to the component-wise negation of a given vector.

**Syntax** ::

    var vector = mathDevice.v3Build(0, 0, 20);
    destination = mathDevice.v3Neg(vector, destination);

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Reciprocal

`v3Reciprocal`
--------------

**Summary**

Returns a 3 component vector initialized to the component-wise reciprocal of a given vector.

**Syntax** ::

    var vector = mathDevice.v3Build(0.5, 5, 1);
    destination = mathDevice.v3Reciprocal(vector, destination);

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

If any of the components is zero this will cause an "Error calling method on NPObject" JavaScript error.

.. index::
    pair: MathDevice; v3Add

`v3Add`
-------

**Summary**

Returns a 3 component vector initialized to the component-wise addition of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    destination = mathDevice.v3Add(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Add3

`v3Add3`
--------

**Summary**

Returns a 3 component vector initialized to the component-wise addition of 3 other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    var vectorC = mathDevice.v3Build(1, 2, 9);
    destination = mathDevice.v3Add3(vectorA, vectorB, vectorC, destination);

``vectorA``, ``vectorB``, ``vectorC``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Add4

`v3Add4`
--------

**Summary**

Returns a 3 component vector initialized to the component-wise addition of 4 other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    var vectorC = mathDevice.v3Build(1, 2, 9);
    var vectorD = mathDevice.v3Build(4, 6, 0);
    destination = mathDevice.v3Add4(vectorA, vectorB, vectorC, vectorD, destination);

``vectorA``, ``vectorB``, ``vectorC``, ``vectorD``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Sub

`v3Sub`
-------

**Summary**

Returns a 3 component vector initialized to the component-wise subtraction of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    destination = mathDevice.v3Sub(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Mul

`v3Mul`
-------

**Summary**

Returns a 3 component vector initialized to the component-wise multiplication of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    destination = mathDevice.v3Mul(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Min

`v3Min`
-------

**Summary**

Returns a 3 component vector initialized to the component-wise minimum of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    destination = mathDevice.v3Min(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Max

`v3Max`
-------

**Summary**

Returns a 3 component vector initialized to the component-wise maximum of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    destination = mathDevice.v3Max(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Dot

`v3Dot`
-------

**Summary**

Returns the scalar dot product of two 3 component vectors.

**Syntax** ::

    var cosAngle = mathDevice.v3Dot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v3Cross

`v3Cross`
---------

**Summary**

Returns a 3 component vector initialized to the cross product of two other 3 component vectors.

**Syntax** ::

    var vectorA = mathDevice.v3Build(3, 0, 2);
    var vectorB = mathDevice.v3Build(7, 4, 3);
    destination = mathDevice.v3Cross(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Normalize

`v3Normalize`
-------------

**Summary**

Returns a 3 component vector initialized to the normalized value of another 3 component vector.

**Syntax** ::

    var vector = mathDevice.v3Build(3, 2, 6);
    destination = mathDevice.v3Normalize(vector, destination);

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3LengthSq

`v3LengthSq`
------------

**Summary**

Returns the scalar squared length of a given 3 component vector.

**Syntax** ::

    var vectorLengthSq = mathDevice.v3LengthSq(vector);

    //example usage:
    if (1.0 !== vectorLengthSq)
    {
        normal = mathDevice.v3ScalarMul(vector, (1.0 / Math.sqrt(vectorLengthSq)));
    }

Returns a JavaScript number.

``vector``
    A :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3Length

`v3Length`
----------

**Summary**

Returns the scalar length of a given 3 component vector.

**Syntax** ::

    var vectorLength = mathDevice.v3Length(vector);

    //example usage:
    if (1.0 !== vectorLength)
    {
        vector = mathDevice.v3ScalarMul(vector, (1.0 / vectorLength));
    }

``vector``
    A :ref:`Vector3 <v3object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v3MulAdd

`v3MulAdd`
----------

**Summary**

Returns a 3 component vector initialized to the addition of the third argument with the multiplication of the first two arguments.

**Syntax** ::

    var vectorMulA = mathDevice.v3Build(3, 2, 6);
    var vectorMulB = mathDevice.v3Build(0, 7, 3);
    var vectorAdd = mathDevice.v3Build(1, 8, 5);
    destination = mathDevice.v3MulAdd(vectorMulA, vectorMulB, vectorAdd, destination);

    //example usage:
    var newPos = mathDevice.v3MulAdd(velocity, deltaTime, pos);

``vectorMulA``, ``vectorMulB``, ``vectorAdd``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3ScalarBuild

`v3ScalarBuild`
---------------

**Summary**

Creates a vector with 3 components all set to the scalar argument provided.

**Syntax** ::

    var destination = mathDevice.v3ScalarBuild(100, destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; v3ScalarAdd

`v3ScalarAdd`
-------------

**Summary**

Returns a 3 component vector initialized to the addition of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v3ScalarAdd(vector, scalar, destination);

    //example usage:
    nodeMaxExtent = mathDevice.v3ScalarAdd(nodeMaxExtent, 0.1);

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3ScalarSub

`v3ScalarSub`
-------------

**Summary**

Returns a 3 component vector initialized to the subtraction of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v3ScalarSub(vector, scalar, destination);

    //example usage:
    nodeMinExtent = mathDevice.v3ScalarSub(nodeMinExtent, 0.1);

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3ScalarMul

`v3ScalarMul`
-------------

**Summary**

Returns a 3 component vector initialized to the multiplication of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v3ScalarMul(vector, scalar, destination);

    //example usage:
    var paddedExtents = mathDevice.v3ScalarMul(extents, 1.1);

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. _mathdevice_v3addscalarmul:

.. index::
    pair: MathDevice; v3AddScalarMul

`v3AddScalarMul`
----------------

**Summary**

Returns a 3 component vector initialized to the sum of the first vector with the multiplication of the second vector parameter by the third scalar one.

**Syntax** ::

    newPosition = mathDevice.v3AddScalarMul(position, velocity, time, newPosition);

``position``
    A :ref:`Vector3 <v3object>` object.

``velocity``
    A :ref:`Vector3 <v3object>` object.

``time``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3Lerp

`v3Lerp`
--------

**Summary**

Returns a 3 component vector initialized to the linear interpolation between the first and second vector parameters using
the delta passed as the third parameter.

**Syntax** ::

    var vectorA = mathDevice.v3Build(10, 0, 20);
    var vectorB = mathDevice.v3Build(20, 0, 6);
    destination = mathDevice.v3Lerp(vectorA, vectorB, scalar, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; v3CatmullRom

`v3CatmullRom`
--------------

**Summary**

Returns a 3 component vector initialized to the Catmull Rom interpolation through a set of 4 points.

**Syntax** ::

    var vectorA = mathDevice.v3Build(10,  0, 20);
    var vectorB = mathDevice.v3Build(20,  0,  6);
    var vectorC = mathDevice.v3Build(5,  10,  6);
    var vectorD = mathDevice.v3Build(10, 10,  9);
    destination = mathDevice.v3CatmullRom(t, tension, vectorA, vectorB, vectorC, vectorD, destination);

``vectorA``, ``vectorB``, ``vectorC``, ``vectorD``
    A :ref:`Vector3 <v3object>` object.

``t``, ``tension``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
The interpolation will be at ``B`` with derivative ``tension * (C - A)``  for ``t = 0``.
The interpolation will be at ``C`` with derivative ``tension * (D - A)``   for ``t = 1``.

.. index::
    pair: MathDevice; v4Build

`v4Build`
---------

**Summary**

Creates a vector with 4 components.

**Syntax** ::

    var destination = mathDevice.v4Build(100, 10, 0, 42, destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4BuildZero

`v4BuildZero`
-------------

**Summary**

Creates a vector with 4 components all set to `0.0`.

**Syntax** ::

    var destination = mathDevice.v4BuildZero(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4BuildOne

`v4BuildOne`
------------

**Summary**

Creates a vector with 4 components all set to `1.0`.

**Syntax** ::

    var destination = mathDevice.v4BuildOne(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4Copy

`v4Copy`
--------

**Summary**

Returns a 4 component vector copy of the given vector.

**Syntax** ::

    var source = mathDevice.v4Build(0, 0, 0, 20);
    destination = mathDevice.v4Copy(source, destination);

``source``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4Neg

`v4Neg`
-------

**Summary**

Returns a 4 component vector initialized to the component-wise negation of a given vector.

**Syntax** ::

    var vector = mathDevice.v4Build(0, 0, 0, 20);
    destination = mathDevice.v4Neg(vector, destination);

``vector``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Add

`v4Add`
-------

**Summary**

Returns a 4 component vector initialized to the component-wise addition of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 6, 5, 0);
    destination = mathDevice.v4Add(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4Add3

`v4Add3`
--------

**Summary**

Returns a 4 component vector initialized to the component-wise addition of 3 other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 8, 5, 0);
    var vectorC = mathDevice.v4Build(9, 6, 6, 5);
    destination = mathDevice.v4Add3(vectorA, vectorB, vectorC, destination);

``vectorA``, ``vectorB``, ``vectorC``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4Add4

`v4Add4`
--------

**Summary**

Returns a 4 component vector initialized to the component-wise addition of 4 other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 1, 3, 2);
    var vectorB = mathDevice.v4Build(3, 8, 5, 0);
    var vectorC = mathDevice.v4Build(9, 6, 6, 5);
    var vectorD = mathDevice.v4Build(4, 2, 3, 1);
    destination = mathDevice.v4Add3(vectorA, vectorB, vectorC, vectorD, destination);

``vectorA``, ``vectorB``, ``vectorC``, ``vectorD``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4Sub

`v4Sub`
-------

**Summary**

Returns a 4 component vector initialized to the component-wise subtraction of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 6, 5, 0);
    destination = mathDevice.v4Sub(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Mul

`v4Mul`
-------

**Summary**

Returns a 4 component vector initialized to the component-wise multiplication of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 6, 5, 0);
    destination = mathDevice.v4Mul(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Min

`v4Min`
-------

**Summary**

Returns a 4 component vector initialized to the component-wise minimum of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 6, 5, 0);
    destination = mathDevice.v4Min(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Max

`v4Max`
-------

**Summary**

Returns a 4 component vector initialized to the component-wise maximum of two other vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 6, 5, 0);
    destination = mathDevice.v4Max(vectorA, vectorB, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Dot

`v4Dot`
-------

**Summary**

Returns the scalar dot product of to 4 component vectors.

**Syntax** ::

    var vectorA = mathDevice.v4Build(7, 4, 3, 2);
    var vectorB = mathDevice.v4Build(3, 6, 5, 0);
    var dot = mathDevice.v4Dot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v4Normalize

`v4Normalize`
-------------

**Summary**

Returns a 4 component vector initialized to the normalized value of another 4 component vector.

**Syntax** ::

    var vector = mathDevice.v4Build(7, 4, 3, 2);
    var destination = mathDevice.v4Normalize(vector, destination);

``vectorA``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4LengthSq

`v4LengthSq`
------------

**Summary**

Returns the scalar squared length of a given 4 component vector.

**Syntax** ::

    var vectorLengthSq = mathDevice.v4LengthSq(vector);

    //example code:
    if (1.0 !== vectorLengthSq)
    {
        vector = mathDevice.v4ScalarMul(vector, (1.0 / Math.sqrt(vectorLengthSq)));
    }

``vector``
    A :ref:`Vector4 <v4object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v4Length

`v4Length`
----------

**Summary**

Returns the scalar length of a given 4 component vector.

**Syntax** ::

    var vectorLength = mathDevice.v4Length(vector);

    //example code:
    if (1.0 !== vectorLength)
    {
        vector = mathDevice.v4ScalarMul(vector, (1.0 / vectorLength));
    }

``vector``
    A :ref:`Vector4 <v4object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; v4MulAdd

`v4MulAdd`
----------

**Summary**

Returns a 4 component vector initialized to the addition of the third argument with the multiplication of the first two arguments.

**Syntax** ::

    var vectorMulA = mathDevice.v4Build(3, 2, 6);
    var vectorMulB = mathDevice.v4Build(0, 7, 3);
    var vectorAdd = mathDevice.v4Build(1, 8, 5);
    destination = mathDevice.v4MulAdd(vectorMulA, vectorMulB, vectorAdd, destination);

    //example usage:
    var newPos = mathDevice.v4MulAdd(velocity, deltaTime, pos);

``vectorMulA``, ``vectorMulB``, ``vectorAdd``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4ScalarBuild

`v4ScalarBuild`
---------------

**Summary**

Creates a vector with 4 components all set to the argument given.

**Syntax** ::

    var destination = mathDevice.v4ScalarBuild(100, destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; v4ScalarAdd

`v4ScalarAdd`
-------------

**Summary**

Returns a 4 component vector initialized to the addition of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v4ScalarAdd(vector, scalar, destination);

``vector``
    A :ref:`Vector4 <v4object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4ScalarSub

`v4ScalarSub`
-------------

**Summary**

Returns a 4 component vector initialized to the subtraction of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v4ScalarSub(color, scalar, destination);

``vector``
    A :ref:`Vector4 <v4object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4ScalarMul

`v4ScalarMul`
-------------

**Summary**

Returns a 4 component vector initialized to the multiplication of the first vector parameter to the second scalar one.

**Syntax** ::

    destination = mathDevice.v4ScalarMul(vector, scalar, destination);

``vector``
    A :ref:`Vector4 <v4object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. _mathdevice_v4addscalarmul:

.. index::
    pair: MathDevice; v4AddScalarMul

`v4AddScalarMul`
----------------

**Summary**

Returns a 4 component vector initialized to the sum of the first vector with the multiplication of the second vector parameter by the third scalar one.

**Syntax** ::

    destination = mathDevice.v4AddScalarMul(vector1, vector2, delta, destination);

``vector1``
    A :ref:`Vector4 <v4object>` object.

``vector2``
    A :ref:`Vector4 <v4object>` object.

``delta``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Lerp

`v4Lerp`
--------

**Summary**

Returns a 4 component vector initialized to the linear interpolation between the first and second vector parameters using
the delta passed as the third parameter.

**Syntax** ::

    var vectorA = mathDevice.v4Build(10, 0, 20, 0);
    var vectorB = mathDevice.v4Build(20, 0, 6, 0);
    destination = mathDevice.v4Lerp(vectorA, vectorB, scalar, destination);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Abs

`v4Abs`
--------

**Summary**

Returns a 4 component vector initialized to the component-wise absolute of the vector parameter given.

**Syntax** ::

    var vector = mathDevice.v4Build(-4, 0, 10, -5);
    destination = mathDevice.v4Abs(vector, destination);

``vector``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; v4Equal

`v4Equal`
---------

**Summary**

Returns a boolean specifying whether the two 4 component vectors are equal.
Optional third parameter specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    var vectorA = mathDevice.v4Build(0, 2, 0, -1);
    var vectorB = mathDevice.v4Build(0, 2.00014, 0, -1);
    var equal = mathDevice.v4Equal(vectorA, vectorB, scalar);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object.

``scalar`` (Optional)
    A JavaScript number.
    The precision of the equality test.

.. index::
    pair: MathDevice; planeNormalize

`planeNormalize`
----------------

**Summary**

Returns a 4D vector initialized to the normalized value of a 4D vector interpreted as a :ref:`Plane <plane>` equation.

**Syntax** ::

    var vector = mathDevice.v4Build(5, 3, 2, 9);
    destination = mathDevice.planeNormalize(vector, destination);

``vector``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; aabbBuild

`aabbBuild`
------------

**Summary**

Creates an AABB object, containing bounding box defined by two points; a minimum and a maximum.

**Syntax** ::

    var destination = mathDevice.aabbBuild(minX, minY, minZ, maxX, maxY, maxZ, destination);

    // example usage:
    var unitBox = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);

``minX``, ``minY``, ``minZ``
    JavaScript numbers giving the coordinates of the minimum point.

``maxX``, ``maxY``, ``maxZ``
    JavaScript numbers giving the coordinates of the maximum point.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbBuildEmpty

`aabbBuildEmpty`
----------------

**Summary**

Creates an AABB object, containing bounding box defined by two points; a minimum and a maximum.
The box has its minimum point set to the maximum values possible and its maximum point set to the minimum values possible.

**Syntax** ::

    var destination = mathDevice.aabbBuildEmpty(destination);

    // example usage:
    var aabbEmpty = mathDevice.aabbBuildEmpty();
    var unitBox = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);
    var union = mathDevice.aabbUnion(aabbEmpty, unitBox);
    // union is now equal to unitBox

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbCopy

`aabbCopy`
----------

**Summary**

Returns a copy of the given AABB object.

**Syntax** ::

    var source = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);
    var destination = mathDevice.aabbCopy(source, destination);

``source``
    An :ref:`AABB <aabbobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns an :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbIsEmpty

`aabbIsEmpty`
-------------

**Summary**

Returns a true if the given AABB object is empty, false otherwise.

**Syntax** ::

    var source = mathDevice.aabbBuildEmpty();
    var isEmpty = mathDevice.aabbIsEmpty(aabb);

``aabb``
    An :ref:`AABB <aabbobject>` object.

Returns an JavaScript boolean object.

.. index::
    pair: MathDevice; aabbGetCenterAndHalf

`aabbGetCenterAndHalf`
----------------------

**Summary**

Gets the center point and the half extents of the AABB object.

**Syntax** ::

    var source = mathDevice.aabbBuildEmpty();
    mathDevice.aabbGetCenterAndHalf(aabb, center, halfExtents);

    //example usage:
    var newBox = mathDevice.aabbBuild(center[0] - halfExtents[0],
                                      center[1] - halfExtents[1],
                                      center[2] - halfExtents[2],
                                      center[3] - halfExtents[3],
                                      center[4] - halfExtents[4],
                                      center[5] - halfExtents[5],);

``aabb``
    An :ref:`AABB <aabbobject>` object.

``center``
    A :ref:`Vector3 <v3object>` object.

``halfExtents``
    A :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; aabbIsInsidePlanes

`aabbIsInsidePlanes`
--------------------

**Summary**

Returns true if the any point in the AABB object is on the correct side of each plane, false otherwise.

**Syntax** ::

    var isInside = mathDevice.aabbIsInsidePlanes(aabb, planes);

    //example usage:
    mathDevice.aabbIsInsidePlanes(aabb, [mathDevice.v4Build(0, 0, -1, 4),
                                         mathDevice.v4Build(0, 0, 1, -4)]);

``aabb``
    An :ref:`AABB <aabbobject>` object.

``planes``
    An array of :ref:`Vector4 <v4object>` objects representing :ref:`planes <plane>`.

Returns an JavaScript boolean object.

.. index::
    pair: MathDevice; aabbIsFullyInsidePlanes

`aabbIsFullyInsidePlanes`
-------------------------

**Summary**

Returns true if the all points in the AABB object are on the correct side of each plane, false otherwise.

**Syntax** ::

    var isFullyInside = mathDevice.aabbIsFullyInsidePlanes(aabb, planes);

    //example usage:
    mathDevice.aabbIsFullyInsidePlanes(aabb, [mathDevice.v4Build(0, 0, -1, 4),
                                              mathDevice.v4Build(0, 0, 1, -4)]);

``aabb``
    An :ref:`AABB <aabbobject>` object.

``planes``
    An array of :ref:`Vector4 <v4object>` objects representing :ref:`planes <plane>`.

Returns an JavaScript boolean object.

.. index::
    pair: MathDevice; aabbUnion

`aabbUnion`
-----------

**Summary**

Returns the union of two given AABB objects.
The union of any AABB object ``a`` and an empty AABB object is ``a``.

**Syntax** ::

    var boxA = mathDevice.aabbBuild(0, 0, 0, 1, 1, 4);
    var boxB = mathDevice.aabbBuild(1, 0, 1, 2, 3, 2);
    var destination = mathDevice.aabbUnion(boxA, boxB, destination);
    // the result is a box with minimum at the origin and
    // maximum at point (2, 3, 4)

``boxA``, ``boxB``
    An :ref:`AABB <aabbobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbUnionArray

`aabbUnionArray`
----------------

**Summary**

Returns the union of an array of AABB objects.
The union of any AABB object ``a`` and an empty AABB object is ``a``.

**Syntax** ::

    var boxA = mathDevice.aabbBuild(0, 0, 0, 1, 1, 4);
    var boxB = mathDevice.aabbBuild(1, 0, 1, 2, 3, 2);
    var destination = mathDevice.aabbUnionArray([boxA, boxB], destination);
    // the result is a box with minimum at the origin and
    // maximum at point (2, 3, 4)

``boxA``, ``boxB``
    An :ref:`AABB <aabbobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbAddPoints

`aabbAddPoints`
---------------

**Summary**

"Stretches" an AABB object to contain a set of points.

**Syntax** ::

    var box = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);
    var points = [];
    points[0] = mathDevice.v3Build(0, 0, 2);
    points[1] = mathDevice.v3Build(0, -1, -2);
    points[2] = mathDevice.v3Build(1, 0, 1);
    mathDevice.aabbAddPoints(box, points);
    // box will now have minimum (0, -1, -2) and
    // maximum (1, 1, 2)

``box``
    An :ref:`AABB <aabbobject>` object.

``points``
    An array of :ref:`Vector3 <v3object>` objects.

.. index::
    pair: MathDevice; aabbTransform

`aabbTransform`
---------------

**Summary**

Returns a transformed AABB object.

**Syntax** ::

    var sqrt = Math.sqrt;
    var box = mathDevice.aabbBuild(0, 0, 0, sqrt(2), 1, sqrt(2));
    var up = mathDevice.v3BuildYAxis();
    var matrix = mathDevice.m43FromAxisRotation(up, Math.PI / 4);
    var destination = mathDevice.aabbTransform(box, matrix, destination);
    // returns a box with roughly minimum (-1, 0, 0) and maximum (1, 1, 2)

``box``
    An :ref:`AABB <aabbobject>` object.

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbIntercept

`aabbIntercept`
---------------

**Summary**

Returns the interception of two given AABB objects.
The interception of any AABB object ``a`` and an empty AABB object is an empty AABB object.

**Syntax** ::

    var boxA = mathDevice.aabbBuild(0, 0, 0, 1, 1, 4);
    var boxB = mathDevice.aabbBuild(1, 0, 1, 2, 3, 2);
    var destination = mathDevice.aabbIntercept(boxA, boxB, destination);
    // the result is a box with minimum at (1, 0, 1) and
    // maximum at point (1, 1, 2)

``boxA``, ``boxB``
    An :ref:`AABB <aabbobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDevice; aabbOverlaps

`aabbOverlaps`
--------------

**Summary**

Returns true if the two given AABB objects overlap (including edges), false otherwise.
The overlap of any AABB object ``a`` and an empty AABB object is false.

**Syntax** ::

    var boxA = mathDevice.aabbBuild(0, 0, 0, 1, 1, 4);
    var boxB = mathDevice.aabbBuild(1, 0, 1, 2, 3, 2);
    var bool = mathDevice.aabbOverlaps(boxA, boxB);
    // returns true

``boxA``, ``boxB``
    An :ref:`AABB <aabbobject>` object.

Returns a JavaScript boolean.

.. index::
    pair: MathDevice; aabbSphereOverlaps

`aabbSphereOverlaps`
--------------------

**Summary**

Returns true if the given AABB object overlaps with the sphere (including edges), false otherwise.

**Syntax** ::

    var box = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);
    var center = mathDevice.v3Build(0, 0, 0);
    var radius = 2;
    var bool = mathDevice.aabbSphereOverlaps(box, center, radius);
    // returns true

``box``
    An :ref:`AABB <aabbobject>` object.

``center``
    A :ref:`Vector3 <v3object>` object.
    The center of the sphere to check.

``radius``
    A JavaScript number.

Returns a JavaScript boolean.

.. index::
    pair: MathDevice; aabbIsInside

`aabbIsInside`
--------------

**Summary**

Returns true if the first given AABB object is inside the second given AABB object (including edges), false otherwise.

**Syntax** ::

    var boxA = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);
    var boxB = mathDevice.aabbBuild(0, 0, 0, 0.5, 0.5, 0.5);
    var bool = mathDevice.aabbIsInside(boxA, boxB);
    // returns true

``boxA``, ``boxB``
    An :ref:`AABB <aabbobject>` object.

Returns a JavaScript boolean.

.. index::
    pair: MathDevice; aabbTestInside

`aabbTestInside`
----------------

**Summary**

* Returns 2 if the first given AABB object is inside the second given AABB object (including edges).
* Returns 1 if the first given AABB object overlaps with the second given AABB object (including edges) but is not inside it.
* Returns 0 if there is no overlap between the objects.

**Syntax** ::

    var boxA = mathDevice.aabbBuild(0, 0, 0, 1, 1, 1);
    var boxB = mathDevice.aabbBuild(0, 0, 0, 0.5, 0.5, 0.5);
    var bool = mathDevice.aabbTestInside(boxA, boxB);
    // returns 2

``boxA``, ``boxB``
    An :ref:`AABB <aabbobject>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; quatBuild

`quatBuild`
-----------

**Summary**

Creates a quat object, containing a rotation represented by a quaternion.

**Syntax** ::

    var destination = mathDevice.quatBuild(a, b, c, d, destination);

``a``, ``b``, ``c``, ``d``
    A JavaScript number.
    The components of the Quaternion.

Returns a :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

.. index::
    pair: MathDevice; quatEqual

.. _mathdevice_quatEqual:

`quatEqual`
-----------

**Summary**

Returns a boolean specifying whether the two quaternions are equal.
Optional third parameter specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    var equal = mathDevice.quatEqual(quatA, quatB, scalar);

``quatA``, ``quatB``
    A :ref:`Quaternion <quatobject>` object.

``scalar``
    A JavaScript number.

Returns a JavaScript boolean.

.. index::
    pair: MathDevice; quatIsSimilar

`quatIsSimilar`
---------------

**Summary**

Returns a boolean specifying whether the two quaternions are similar.
This function differs from :ref:`mathDevice.quatEqual <mathdevice_quatEqual>` in that it will
evaluate to true for quaternions which have similar rotations rather than similar quaternion
component values.
Optional third parameter specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    var equal = mathDevice.quatIsSimilar(quatA, quatB, scalar);

``quatA``, ``quatB``
    A :ref:`Quaternion <quatobject>` object.

``scalar`` (Optional)
    A JavaScript number.

Returns a JavaScript boolean.

.. index::
    pair: MathDevice; quatLength

`quatLength`
------------

**Summary**

Returns the scalar length of a given quaternion.

**Syntax** ::

    var quatLength = mathDevice.quatLength(quat);

``quat``
    A :ref:`Quaternion <quatobject>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; quatNormalize

`quatNormalize`
---------------

**Summary**

Returns a quaternion initialized to the normalized value of another quaternion.

**Syntax** ::

    destination = mathDevice.quatNormalize(quat, destination);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.

.. index::
    pair: MathDevice; quatConjugate

`quatConjugate`
---------------

**Summary**

Returns a quaternion initialized to the conjugate value of another quaternion.

**Syntax** ::

    destination = mathDevice.quatConjugate(quat, destination);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.

.. index::
    pair: MathDevice; quatDot

`quatDot`
---------

**Summary**

Returns a scalar, the dot product of the two given quaternions.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    scalar = mathDevice.quatDot(quatA, quatB);

``quatA``, ``quatB``
    A :ref:`Quaternion <quatobject>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; quatMul

`quatMul`
---------

**Summary**

Returns a quaternion object representing the multiplication of the two given quaternions.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    destination = mathDevice.quatMul(quatA, quatB, destination);

``quatA``, ``quatB``
    A :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.

.. index::
    pair: MathDevice; quatToAxisRotation

`quatToAxisRotation`
----------------------

**Summary**

Creates a vector initialized to the rotation and angle represented by the quaternion parameter.

**Syntax** ::

    destination = mathDevice.quatToAxisRotation(quat, destination);

    //example usage:
    var axis = mathDevice.v3Build(destination[0], destination[1], destination[2]);
    var rotation = destination[3];

``quat``
    A :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object with the first 3 components as the axis of rotation and the 4th component as the rotation in radians.

.. index::
    pair: MathDevice; quatTransformVector

`quatTransformVector`
----------------------

**Summary**

Creates a vector initialized to the second vector parameter transformed by the first quaternion parameter.

**Syntax** ::

    destination = mathDevice.quatTransformVector(quat, vector, destination);

    //example usage:
    var axis = mathDevice.v3Build(0, 1, 0);
    var quat = mathDevice.quatFromAxisRotation(axis, Math.PI * 0.5);
    var vec3 = mathDevice.v3Build(1, 0, 0);
    var transformedVec = mathDevice.quatTransformVector(quat, vec3);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; quatFromAxisRotation

`quatFromAxisRotation`
----------------------

**Summary**

Creates a quaternion initialized to the rotation represented by the first parameter as the axis vector and second as the rotation in radians.

**Syntax** ::

    destination = mathDevice.quatFromAxisRotation(vector, scalar, destination);

    //example usage:
    var up = mathDevice.v3BuildYAxis();
    var deltaRotation = mathDevice.quatFromAxisRotation(up, angle);

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.


.. index::
    pair: MathDevice; quatFromM43

`quatFromM43`
-------------

**Summary**

Creates a quaternion initialized to the rotation part of the given 4x3 orthogonal matrix.

**Syntax** ::

    destination = mathDevice.quatFromM43(matrix, destination);

    //example usage:
    var matrix = camera.getMatrix();
    var rotation = mathDevice.quatFromM43(matrix);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.


.. index::
    pair: MathDevice; quatCopy

`quatCopy`
----------

**Summary**

Returns a quaternion copy of the given quaternion.

**Syntax** ::

    var quat = mathDevice.quatBuild(0, 0, 0, 1);
    destination = mathDevice.quatCopy(quat, destination);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.

.. index::
    pair: MathDevice; quatLerp

`quatLerp`
-----------

**Summary**

Returns a quaternion initialized to the linear interpolation of the
given two quaternions at the given delta between them.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    destination = mathDevice.quatLerp(quatA, quatB, scalar, destination);

``quatA``, ``quatB``
    A :ref:`Quaternion <quatobject>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.

.. index::
    pair: MathDevice; quatSlerp

`quatSlerp`
-----------

**Summary**

Returns a quaternion initialized to the `spherical linear interpolation <http://en.wikipedia.org/wiki/Slerp>`_ of the
given two quaternions at the given delta between them.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    destination = mathDevice.quatSlerp(quatA, quatB, scalar, destination);

``quatA``, ``quatB``
    A :ref:`Quaternion <quatobject>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Quaternion <quatobject>` object.


.. index::
    pair: MathDevice; QuatPosBuild

.. _quatpos:

`QuatPosBuild`
--------------

**Summary**

Creates a quatPos object, containing a position and a rotation represented by a quaternion.

**Syntax** ::

    var destination = mathDevice.QuatPosBuild(quatA, quatB, quatC, quatD, v3A, v3B, v3C, destination);
    var destination = mathDevice.QuatPosBuild(quat, v3, destination);

``quatA``, ``quatB``, ``quatC``, ``quatD``
    A JavaScript number.
    These numbers give the components of the quaternion.

``v3A``, ``v3B``, ``v3C``
    A JavaScript number.
    These numbers give the components of the position.

``quat``
    A :ref:`Quat <quatobject>` object.

``v3``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`QuaternionPosition <quatposobject>` object.
The parameters are given as quaternion components and then position components.

.. index::
    pair: MathDevice; quatMulTranslate

`quatMulTranslate`
------------------

**Summary**

Multiplies together two pairs of rotations and translations represented as a quaternion and 3 component vector. The
result is given in an additional quaternion and 3 component vector passed as the fifth and sixth parameters. This
method matches m43Mul in functionality but working with quaternion representations.

**Syntax** ::

    var quatA = mathDevice.quatBuild(0, 0, 0, 1);
    var vectorA = mathDevice.v3Build(0, 20, 0);

    var quatB = mathDevice.quatBuild(0, 0.707, 0, 0.707);
    var vectorB = mathDevice.v3Build(0, 4, 10);

    var destinationQuat = mathDevice.quatBuild(0, 0, 0, 0);
    var destinationVector = mathDevice.v3Build(0, 0, 0);
    mathDevice.quatMulTranslate(quatA, vectorA, quatB, vectorB, destinationQuat, destinationVector);

``quatA``, ``quatB``, ``destinationQuat``
    A :ref:`Quaternion <quatobject>` object.

``vectorA``, ``vectorB``, ``destinationVector``
    A :ref:`Vector3 <v3object>` object.

Notice that the destinations are not optional here they must be provided, this function returns null.

.. index::
    pair: MathDevice; m33BuildIdentity

`m33BuildIdentity`
------------------

**Summary**

Creates a 3x3 matrix initialized to the identity.

**Syntax** ::

    var destination = mathDevice.m33BuildIdentity(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.


.. index::
    pair: MathDevice; m33Build

.. _m33:

`m33Build`
-----------

**Summary**

Creates a 3x3 matrix initialized to the 3 given 3 component vectors.

**Syntax** ::

    var destination = mathDevice.m33Build(a, b, c,
                                          d, e, f,
                                          g, h, i,
                                          destination);
    var destination = mathDevice.m33Build(right, up, at, destination);

``a``, ``b``, ``c``, ``d``, ``e``, ``f``, ``g``, ``h``, ``i``
    A JavaScript number.
    The components of the matrix given in row column format.

``right``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the first row of the matrix.

``up``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the second row of the matrix.

``at``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the last row of the matrix.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.

.. index::
    pair: MathDevice; m33Copy

.. _m33copy:

`m33Copy`
-----------

**Summary**

Copies a 3x3 matrix.

**Syntax** ::

    var destination = mathDevice.m33Build(matrix, destination);

``matrix``
    A :ref:`Matrix33 <m33object>` object.
    The elements of this matrix are copied into the ``destination`` matrix.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.

.. index::
    pair: MathDevice; m33FromAxisRotation

`m33FromAxisRotation`
---------------------

**Summary**

Creates a 3x3 matrix initialized to the rotation represented by the first parameter as the axis vector
and the second scalar one as the angle.

**Syntax** ::

    destination = mathDevice.m33FromAxisRotation(vector, scalar, destination);

    //example usage:
    var up = mathDevice.v3Build(0, 1, 0);
    var deltaRotation = mathDevice.m33FromAxisRotation(up, angle);

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.


.. index::
    pair: MathDevice; m33Mul

`m33Mul`
--------

**Summary**

Creates a 3x3 matrix initialized to the multiplication of two other 3x3 matrices.

**Syntax** ::

    var matrixA = mathDevice.m33Build(rightA, upA, atA);
    var matrixB = mathDevice.m33Build(rightB, upB, atB);
    destination = mathDevice.m33Mul(matrixA, matrixB, destination);

``matrixA``, ``matrixB``
    A :ref:`Matrix33 <m33object>` or :ref:`Matrix43 <m33object>` object.
    If a :ref:`Matrix43 <m33object>` object is given only its 3x3 components are used for the multiplication.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.


.. index::
    pair: MathDevice; m33Transform

`m33Transform`
--------------

**Summary**

Creates a Vector3 initialized to the transform of a Vector3 by a 3x3 matrix.

**Syntax** ::

    destination = mathDevice.m33Transform(matrix, vector, destination);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m33Transpose

`m33Transpose`
--------------

**Summary**

Creates a 3x3 matrix initialized to the transposed of the given 3x3 matrix.

**Syntax** ::

    destination = mathDevice.m33Transpose(matrix, destination);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)


Returns a :ref:`Matrix33 <m33object>` object.

.. index::
    pair: MathDevice; m33InverseTranspose

`m33InverseTranspose`
---------------------

**Summary**

Creates a 3x3 matrix initialized to the transposed inverse of the given 3x3 matrix.

**Syntax** ::

    destination = mathDevice.m33InverseTranspose(matrix, destination);

    //example usage:
    var worldToObjectInverseTranspose = mathDevice.m33InverseTranspose(worldRotation);

``matrix``
    Either a :ref:`Matrix33 <m33object>` or a :ref:`Matrix43 <m43object>` object.
    If a :ref:`Matrix43 <m33object>` object is given only its 3x3 components are used for the transposed inverse.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.

.. index::
    pair: MathDevice; m33Determinant

`m33Determinant`
----------------

**Summary**

Evaluates the determinant of a 3x3 matrix.

**Syntax** ::

    var determinant = mathDevice.m33Determinant(matrix);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

Returns a JavaScript number.

.. index::
    pair: MathDevice; m33MulM43

`m33MulM43`
-----------

**Summary**

Creates a 4x3 matrix initialized to the multiplication of the 3x3 part of a 3x3 or 4x3 matrix
with a 4x3 matrix. This operation keeps the 4th row of the second argument.

**Syntax** ::

    destination = mathDevice.m33MulM43(matrixA, matrixB, destination);

``matrixA``
    Either a :ref:`Matrix33 <m33object>` or :ref:`Matrix43 <m43object>` object.
    If a :ref:`Matrix43 <m33object>` object is given only its 3x3 component is used for the multiplication.

``matrixB``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object with ``matrixB``'s 4th row.

.. index::
    pair: MathDevice; m33MulM44

`m33MulM44`
-----------

**Summary**

Creates a 4x4 matrix initialized to the multiplication of a 3x3 matrix with a 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m33MulM44(matrixA, matrixB, destination);

``matrixA``
    A :ref:`Matrix33 <m33object>` object.

``matrixB``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.

.. index::
    pair: MathDevice; m33FromQuat

`m33FromQuat`
-------------

Creates a 3x3 matrix initialized to the rotation represented by a quaternion.

**Syntax** ::

    destination = mathDevice.m33FromQuat(quat, destination);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix33 <m33object>` object.

.. index::
    pair: MathDevice; m33Right

`m33Right`
----------

**Summary**

Creates a 3 component vector initialized to the `right` element of the given 3x3 matrix.

**Syntax** ::

    destination = mathDevice.m33Right(matrix, destination);

    //example usage:
    var right = mathDevice.m33Right(rotation);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the first row of the matrix.

.. index::
    pair: MathDevice; m33Up

`m33Up`
-------

**Summary**

Creates a 3 component vector initialized to the `up` element of the given 3x3 matrix.
Optional second parameter specifies the vector to copy the results to -
this destination parameter should be created beforehand and it will also be the return value.
This functionality is useful to avoid the memory allocation of a new vector.

**Syntax** ::

    destination = mathDevice.m33Up(matrix, destination);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the second row of the matrix.


.. index::
    pair: MathDevice; m33At

`m33At`
-------

**Summary**

Creates a 3 component vector initialized to the `at` element of the given 3x3 matrix.

**Syntax** ::

    destination = mathDevice.m33At(matrix, destination);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the last row of the matrix.

.. index::
    pair: MathDevice; m43SetRight

`m33SetRight`
-------------

**Summary**

Sets the `right` element of a 3x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m33SetRight(matrix, vector);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

This function sets the first row of the matrix.

.. index::
    pair: MathDevice; m33SetUp

`m33SetUp`
----------

**Summary**

Sets the `up` element of a 3x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m33SetUp(matrix, vector);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

This function sets the second row of the matrix.


.. index::
    pair: MathDevice; m33SetAt

`m33SetAt`
----------

**Summary**

Sets the `at` element of a 3x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m33SetAt(matrix, vector);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

This function sets the last row of the matrix.

.. index::
    pair: MathDevice; m34BuildIdentity

.. _m34:

`m34BuildIdentity`
------------------

**Summary**

Creates a 3x4 matrix initialized to the identity.

**Syntax** ::

    var destination = mathDevice.m34BuildIdentity(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix34 <m34object>` object.


.. index::
    pair: MathDevice; m34Pos

`m34Pos`
--------

**Summary**

Creates a 3 component vector initialized to the `position` element of the given 3x4 matrix.

**Syntax** ::

    destination = mathDevice.m34Pos(matrix, destination);

``matrix``
    A :ref:`Matrix33 <m33object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This returns the first row of the matrix.


.. index::
    pair: MathDevice; m43BuildIdentity

`m43BuildIdentity`
------------------

**Summary**

Creates a 4x3 matrix initialized to the identity.

**Syntax** ::

    var destination = mathDevice.m43BuildIdentity(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43Build

.. _m43:

`m43Build`
-----------

**Summary**

Creates a 4x3 matrix initialized to the 4 given 3 component vectors.

**Syntax** ::

    var destination = mathDevice.m43Build(a, b, c,
                                          d, e, f,
                                          g, h, i,
                                          j, k, l,
                                          destination);
    var destination = mathDevice.m43Build(right, up, at, pos, destination);

``a``, ``b``, ``c``, ``d``, ``e``, ``f``, ``g``, ``h``, ``i``, ``j``, ``k``, ``l``
    A JavaScript number.
    The components of the matrix given in row column format.

``right``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the first row of the matrix.

``up``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the second row of the matrix.

``at``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the third row of the matrix.

``pos``
    A :ref:`Vector3 <v3object>` object.
    The components of this vector are copied to the last row of the matrix.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43BuildTranslation

`m43BuildTranslation`
---------------------

**Summary**

Creates a 4x3 matrix initialized with the identity matrix for its first 3 rows and a given 3 component vector for the position row.

**Syntax** ::

    var destination = mathDevice.m43BuildTranslation(a, b, c, destination);
    var destination = mathDevice.m43BuildTranslation(vector, destination);

``a``, ``b``, ``c``
    A JavaScript number.
    The components of the translation.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43Copy

`m43Copy`
---------

**Summary**

Creates a 4x3 matrix initialized to a copy of the given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Copy(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43FromM33V3

.. _m43fromm33v3:

`m43FromM33V3`
--------------

**Summary**

Creates a 4x3 matrix with the first 3 rows set equal to the matrix and the last row equal to the vector.

**Syntax** ::

    destination = mathDevice.m43FromM33V3(matrix, vector, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43FromAxisRotation

`m43FromAxisRotation`
---------------------

**Summary**

Creates a 4x3 matrix initialized to the rotation represented by the first parameter as the axis vector
and the second scalar one as the angle. Position element is initialized to zero.

**Syntax** ::

    destination = mathDevice.m43FromAxisRotation(vector, scalar, destination);

    //example usage:
    var up = mathDevice.v3Build(0, 1, 0);
    var transform = mathDevice.m43FromAxisRotation(up, angle);

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43FromQuatPos

`m43FromQuatPos`
----------------

**Summary**

Creates a 4x3 matrix initialized to a quatPos vector.

**Syntax** ::

    destination = mathDevice.m43FromQuatPos(quatPos, destination);

    //example usage:
    var boneTransform = mathDevice.quatPos(0, 1, 0, 1,
                                           5, 3, 0);
    var transform = mathDevice.m43FromQuatPos(boneTransform);

``quatPos``
    A :ref:`QuaternionPosition <quatposobject>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43FromRTS

`m43FromRTS`
------------

**Summary**

Creates a 4x3 matrix initialized from a given Quaternion, 3 component position vector and 3 component scale vector.

**Syntax** ::

    destination = mathDevice.m43FromRTS(quat, vector, scalar, destination);

    //example usage:
    var rotation = mathDevice.quatBuild(0, 0, 0, 1);
    var translation = mathDevice.v3Build(10, 10, 10);
    var scale = mathDevice.v3Build(2, 1, 1);
    var transform = mathDevice.m43FromRTS(rotation, translation, scale);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43FromRT

`m43FromRT`
-----------

**Summary**

Creates a 4x3 matrix initialized from a given Quaternion and 3 component position vector.

**Syntax** ::

    destination = mathDevice.m43FromRT(quat, vector, destination);

    //example usage:
    var rotation = mathDevice.quatBuild(0, 0, 0, 1);
    var translation = mathDevice.v3Build(10, 10, 10);
    var transform = mathDevice.m43FromRT(rotation, translation);

``quat``
    A :ref:`Quaternion <quatobject>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43Right

`m43Right`
----------

**Summary**

Creates a 3 component vector initialized to the `right` element of the given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Right(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the first row of the matrix.


.. index::
    pair: MathDevice; m43Up

`m43Up`
-------

**Summary**

Creates a 3 component vector initialized to the `up` element of the given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Up(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the second row of the matrix.


.. index::
    pair: MathDevice; m43At

`m43At`
-------

**Summary**

Creates a 3 component vector initialized to the `at` element of the given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43At(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the third row of the matrix.


.. index::
    pair: MathDevice; m43Pos

`m43Pos`
--------

**Summary**

Creates a 3 component vector initialized to the `position` element of the given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Pos(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.
This function returns the fourth row of the matrix.

.. index::
    pair: MathDevice; m43Mul

`m43Mul`
--------

**Summary**

Creates a 4x3 matrix initialized to the multiplication of two other 4x3 matrices.

**Syntax** ::

    destination = mathDevice.m43Mul(matrixA, matrixB, destination);

``matrixA``, ``matrixB``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43MulTranspose

`m43MulTranspose`
-----------------

**Summary**

Creates a 3x4 matrix initialized to the transposed multiplication of two 4x3 matrices.

**Syntax** ::

    destination = mathDevice.m43MulTranspose(matrixA, matrixB, destination);

``matrixA``, ``matrixB``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix34 <m34object>` object.

.. index::
    pair: MathDevice; m43MulM44

`m43MulM44`
-----------

**Summary**

Creates a 4x4 matrix initialized to the multiplication of a 4x3 matrix by a 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m43MulM44(matrixA, matrixB, destination);

    //example usage:
    var worldViewProjection = mathDevice.m43MulM44(worldTransform, viewProjection);

``matrixA``, ``matrixB``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.


.. index::
    pair: MathDevice; m43Transpose

`m43Transpose`
--------------

**Summary**

Creates a 3x4 matrix initialized to the transpose of the given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Transpose(matrix, destination);

    //example usage:
    var worldTransformTransposed = mathDevice.m43Transpose(worldTransform);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix34 <m34object>` object.


.. index::
    pair: MathDevice; m43InverseOrthonormal

`m43InverseOrthonormal`
-----------------------

**Summary**

Creates a 4x3 matrix initialized to the inverse of a given orthonormal 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43InverseOrthonormal(matrix, destination);

    //example usage:
    var viewTransform = mathDevice.m43InverseOrthonormal(cameraTransform);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43Orthonormalize

`m43Orthonormalize`
-------------------

**Summary**

Creates a 4x3 matrix initialized to the othogonalized and normalized value of a given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Orthonormalize(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43Determinant

`m43Determinant`
----------------

**Summary**

Evaluates the determinant of a 4x3 matrix.

**Syntax** ::

    var det = mathDevice.m43Determinant(matrix);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

Returns a JavaScript number value.

.. index::
    pair: MathDevice; m43Inverse

`m43Inverse`
-----------------------

**Summary**

Creates a 4x3 matrix initialized to the inverse of a given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43Inverse(matrix, destination);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43Translate

`m43Translate`
--------------

**Summary**

Adds component-wise the given 3 component vector to the `position` element of a 4x3 matrix.

**Syntax** ::

    mathDevice.m43Translate(matrix, vector);

    //example usage:
    var deltaPos = mathDevice.v3Build(0, 0, 20);
    mathDevice.m43Translate(worldTransform, deltaPos);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDevice; m43Scale

.. _m43scale:

`m43Scale`
----------

**Summary**

Scales up the 3x3 part of a 4x3 matrix.
Each row is multiplied by each component of the scale vector.

**Syntax** ::

    destination = mathDevice.m43Scale(matrix, vector, destination);

    //example usage:
    var vecScale = mathDevice.v3ScalarBuild(10);
    mathDevice.m43Scale(matrix, vecScale, matrix);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDevice; m43Offset

`m43Offset`
-----------

**Summary**

Creates a 4x3 matrix initialized to the given 4x3 matrix translated to the given relative 3 component vector.
The relative vector is first rotated with the 3x3 component of the matrix and then added to its `position` element.

**Syntax** ::

    destination = mathDevice.m43Offset(matrix, vector, destination);

    //example usage:
    var newTransform = mathDevice.m43Offset(initialTransform, relativeOffset);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43NegOffset

`m43NegOffset`
--------------

**Summary**

Creates a 4x3 matrix initialized to the given 4x3 matrix translated to the given relative 3 component vector.
The relative vector is first rotated with the 3x3 component of the matrix and then subtracted to its `position` element.

**Syntax** ::

    destination = mathDevice.m43NegOffset(matrix, vector, destination);

    //example usage:
    var newTransform = mathDevice.m43NegOffset(initialTransform, negativeRelativeOffset);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix43 <m43object>` object.


.. index::
    pair: MathDevice; m43InverseTransposeProjection

`m43InverseTransposeProjection`
-------------------------------

**Summary**

Creates a 3x4 matrix initialized to the transposed inverse of the given 4x3 matrix projected to the given 3
component vector.

**Syntax** ::

    destination = mathDevice.m43InverseTransposeProjection(matrix, vector, destination);

    //example usage:
    var worldViewMatrix = mathDevice.m43Mul(worldMatrix, viewMatrix, worldViewMatrix);
    var newTransform = mathDevice.m43InverseTransposeProjection(worldViewMatrix, halfExtents);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix34 <m34object>` object.

This function gives the same result as the following function calls:::

    var inverse = mathDevice.m43InverseOrthonormal(matrix);
    var result = mathDevice.m34Transpose(inverse);

For example for applying a texture to a point light.
Then ``matrix`` would be a transform from object space into view space.
The ``vector`` would then be the half extents of the light.
The result of this example operation would give a transform from world space to light space.
This light space is normalized to have its extents from (0, 0, 0) to (1, 1, 1).

.. index::
    pair: MathDevice; m43TransformPoint

`m43TransformPoint`
-------------------

**Summary**

Creates a 3 component vector initialized to the transformation as a point of the given 3 component vector by the given
4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43TransformPoint(matrix, vector, destination);

    //example usage:
    var worldPosition = mathDevice.m43TransformPoint(worldTransform, localPosition);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m43TransformVector

`m43TransformVector`
--------------------

**Summary**

Creates a 3 component vector initialized to the transformation as a direction of the given 3 component vector by the
given 4x3 matrix.

**Syntax** ::

    destination = mathDevice.m43TransformVector(matrix, vector, destination);

    //example usage:
    var worldNormal = mathDevice.m43TransformVector(worldTransform, localNormal);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m43SetRight

`m43SetRight`
-------------

**Summary**

Sets the `right` element of a 4x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m43SetRight(matrix, vector);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m43SetUp

`m43SetUp`
----------

**Summary**

Sets the `up` element of a 4x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m43SetUp(matrix, vector);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m43SetAt

`m43SetAt`
----------

**Summary**

Sets the `at` element of a 4x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m43SetAt(matrix, vector);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m43SetPos

`m43SetPos`
-----------

**Summary**

Sets the `position` element of a 4x3 matrix to the values of the given 3 component vector.

**Syntax** ::

    mathDevice.m43SetPos(matrix, vector);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.


.. index::
    pair: MathDevice; m43SetAxisRotation

`m43SetAxisRotation`
--------------------

**Summary**

Sets the 3x3 rotation component of a 4x3 matrix to the rotation defined by the given 3D axis and the given scalar angle.

**Syntax** ::

    mathDevice.m43SetAxisRotation(matrix, vector, scalar);

``matrix``
    A :ref:`Matrix43 <m43object>` object.

``vector``
    A :ref:`Vector3 <v3object>` object.

``scalar``
    A JavaScript number.


.. index::
    pair: MathDevice; m44BuildIdentity

.. _m44:

`m44BuildIdentity`
------------------

**Summary**

Creates a 4x4 matrix initialized to the identity.

**Syntax** ::

    var matrix = mathDevice.m44BuildIdentity(destination);

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.

.. index::
    pair: MathDevice; m44Build

`m44Build`
-----------

**Summary**

Creates a 4x4 matrix initialized to the 4 given 4 component vectors.

**Syntax** ::

    var destination = mathDevice.m44Build(a, b, c, d,
                                          e, f, g, h,
                                          i, j, k, l,
                                          m, n, o, p,
                                          destination);
    var destination = mathDevice.m44Build(right, up, at, pos, destination);

``a``, ``b``, ``c``, ``d``, ``e``, ``f``, ``g``, ``h``, ``i``, ``j``, ``k``, ``l``, ``m``, ``n``, ``o``, ``p``
    A JavaScript number.
    The components of the matrix given in row column format.

``right``, ``up``, ``at``, ``pos``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.


.. index::
    pair: MathDevice; m44Copy

.. _m44copy:

`m44Copy`
-----------

**Summary**

Copies a 4x4 matrix.

**Syntax** ::

    var destination = mathDevice.m44Build(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.
    The elements of this matrix are copied into the ``destination`` matrix.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m33object>` object.

.. index::
    pair: MathDevice; m44Mul

`m44Mul`
--------

**Summary**

Creates a 4x4 matrix initialized to the multiplication of two other 4x4 matrices.

**Syntax** ::

    destination = mathDevice.m44Mul(matrixA, matrixB, destination);

    //example usage:
    var newTransform = mathDevice.m44Mul(initialTransform, deltaTransform);

``matrixA``, ``matrixB``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.


.. index::
    pair: MathDevice; m44Inverse

`m44Inverse`
------------

**Summary**

Creates a 4x4 matrix initialized to the inverse of a given non-orthonormal 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44Inverse(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.

.. index::
    pair: MathDevice; m44Transpose

`m44Transpose`
--------------

**Summary**

Creates a 4x4 matrix initialized to the transpose of the given 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44Transpose(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.

.. index::
    pair: MathDevice; m44Transform

`m44Transform`
--------------

**Summary**

Creates a 4 component vector initialized to the transformation of the given 4 component vector by the given 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44Transform(matrix, vector, destination);

    //example usage:
    var worldPosition = mathDevice.m44Transform(worldTransform, localPosition);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; m44Translate

`m44Translate`
--------------

**Summary**

Adds component-wise the given 3 component vector to the `position` element of a 4x4 matrix.

**Syntax** ::

    mathDevice.m44Translate(matrix, vector);

    //example usage:
    var deltaPos = mathDevice.v3Build(0, 0, 20);
    mathDevice.m44Translate(worldTransform, deltaPos);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDevice; m44Scale

.. _m44scale:

`m44Scale`
----------

**Summary**

Scales up the 3x3 part of a 4x4 matrix.
Each row is multiplied by each component of the scale vector.

**Syntax** ::

    destination = mathDevice.m44Scale(matrix, vector, destination);

    //example usage:
    var vecScale = mathDevice.v4ScalarBuild(10);
    mathDevice.m44Scale(matrix, vecScale, matrix);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Matrix44 <m44object>` object.

.. index::
    pair: MathDevice; m44SetRight

`m44SetRight`
-------------

**Summary**

Sets the `right` element of a 4x4 matrix to the values of the given 4 component vector.

**Syntax** ::

    mathDevice.m44SetRight(matrix, vector);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; m44SetUp

`m44SetUp`
----------

**Summary**

Sets the `up` element of a 4x4 matrix to the values of the given 4 component vector.

**Syntax** ::

    mathDevice.m44SetUp(matrix, vector);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; m44SetAt

`m44SetAt`
----------

**Summary**

Sets the `at` element of a 4x4 matrix to the values of the given 4 component vector.

**Syntax** ::

    mathDevice.m44SetAt(matrix, vector);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; m44SetPos

`m44SetPos`
-----------

**Summary**

Sets the `position` element of a 4x4 matrix to the values of the given 4 component vector.

**Syntax** ::

    mathDevice.m44SetPos(matrix, vector);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``vector``
    A :ref:`Vector4 <v4object>` object.


.. index::
    pair: MathDevice; m44Right

`m44Right`
----------

**Summary**

Creates a 4 component vector initialized to the `right` element of the given 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44Right(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.
This function returns the first row of the matrix.


.. index::
    pair: MathDevice; m44Up

`m44Up`
-------

**Summary**

Creates a 4 component vector initialized to the `up` element of the given 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44Up(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.
This function returns the second row of the matrix.


.. index::
    pair: MathDevice; m44At

`m44At`
-------

**Summary**

Creates a 4 component vector initialized to the `at` element of the given 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44At(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.
This function returns the third row of the matrix.


.. index::
    pair: MathDevice; m44Pos

`m44Pos`
--------

**Summary**

Creates a 4 component vector initialized to the `position` element of the given 4x4 matrix.

**Syntax** ::

    destination = mathDevice.m44Pos(matrix, destination);

``matrix``
    A :ref:`Matrix44 <m44object>` object.

``destination`` (:ref:`Optional <mathdevice_optional_dst>`)

Returns a :ref:`Vector4 <v4object>` object.
This function returns the fourth row of the matrix.

.. index::
    pair: MathDevice; isInsidePlanesAABB

`isInsidePlanesAABB`
--------------------

**Summary**

Returns true if the axis-aligned bounding box defined by the extents is inside the planes array.

**Syntax** ::

    var boolean = mathDevice.isInsidePlanesAABB(extents, planes);

    //example usage:
    var isVisible = mathDevice.isInsidePlanesAABB(extents, camera.frustumPlanes);

``extents``
    An :ref:`extents <extents>` object.

``planes``
    A JavaScript array of :ref:`Plane <plane>` objects.

Returns a True or False.

.. index::
    pair: MathDevice; isInsidePlanesAABB

`isFullyInsidePlanesAABB`
-------------------------

**Summary**

Returns true if the axis-aligned bounding box defined by the extents is fully inside the planes array.

**Syntax** ::

    var boolean = mathDevice.isFullyInsidePlanesAABB(extents, planes);

    //example usage:
    var isVisible = mathDevice.isFullyInsidePlanesAABB(extents, camera.frustumPlanes);

``extents``
    An :ref:`extents <extents>` object.

``planes``
    A JavaScript array of :ref:`Plane <plane>` objects.

Returns true or false.


.. index::
    pair: MathDevice; isVisibleBox

`isVisibleBox`
--------------

**Summary**

Returns true if the box defined by the center and half extents 3 component vectors is inside the projection space
defined by the given 4x4 matrix.

**Syntax** ::

    var boolean = mathDevice.isVisibleBox(center, halfExtents, matrix);

    //example usage:
    var isVisible = mathDevice.isVisibleBox(center, halfExtents, worldViewProjection);

``center``
    A :ref:`Vector3 <v3object>` object.

``halfExtents``
    A :ref:`Vector3 <v3object>` object.

``matrix``
    A :ref:`Matrix44 <m44object>` object.

Returns true or false.


.. index::
    pair: MathDevice; isVisibleBoxOrigin

`isVisibleBoxOrigin`
--------------------

**Summary**

Returns true if the box located at the local origin with the given half extents 3 component vector is inside
the projection space defined by the given 4x4 matrix.

**Syntax** ::

    var boolean = mathDevice.isVisibleBoxOrigin(halfExtents, matrix);

    //example usage:
    var isVisible = mathDevice.isVisibleBoxOrigin(halfExtents, worldViewProjection);

``halfExtents``
    A :ref:`Vector3 <v3object>` object.

``matrix``
    A :ref:`Matrix44 <m44object>` object.

Returns true or false.


Properties
==========

.. index::
    pair: MathDevice; FLOAT_MAX

`FLOAT_MAX`
-----------

**Summary**

Largest value available to the internal representation used in the
MathDevice objects.
