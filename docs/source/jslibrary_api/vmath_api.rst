.. index::
    single: VMath

.. _vmath:

----------------
The VMath Object
----------------

Provides vector and matrix operations for quick and easy use.

.. _vmath_compatibility:

**Compatibility with MathDevice objects**

All of the VMath functions are completely compatible with the MathDevice objects.
However, the native MathDevice objects will be converted into JavaScript arrays when you do this.
This conversion is a **slow operation** and should be avoided wherever possible.

Note that although the MathDevice objects can be used with the VMath functions the reverse is not true.
The MathDevice functions only support MathDevice objects as arguments.
To convert between VMath and MathDevice objects see :ref:`MathDeviceConvert <mathdeviceconvert>`.

.. _vmath_objects:

**VMath vector and matrix data representations**

The VMath objects are all stored as JavaScript arrays.
So for example a ``VMath.v3Add(a, b)`` takes two JavaScript arrays of length 3 and returns another JavaScript array of length three.
The sizes and formats of each of the types are as follows

* v2 - An array of length 2.
* v3 - An array of length 3.
* v4 - An array of length 4.
* quat - An array of length 4.
* m33 - An array of length 9 accessed in a row column format.
* m43 - An array of length 12 accessed in a row column format.
* m34 - An array of length 12 accessed in a row column format.
* m44 - An array of length 16 accessed in a row column format.

So cell with row 1 and column 2 in an m33 matrix is at index 1 in the array (row 1 column 1 is index 0).

The MathDevice uses arrays of single-precision floats for all of its internal objects.
On the other hand the JavaScript representation of numbers uses double-precision floats for all of its number objects.
Subsequently, there is a loss of precision between JavaScript values and the MathDevice objects to be aware of.

.. index::
    pair: VMath; Extents

.. _extents:

**Extents**

``extents`` are widely used throughout the JavaScript library.
Extents are implemented as a JavaScript array of 6 numbers that define the
minimum coordinate, index 0-2, and maximum coordinate, index 3-5 of an object.


**Additional functions on the VMath object (these functions are not on the MathDevice)**

.. index::
    pair: VMath; MaskFunctions

**Mask functions**

The mask functions perform a per-component arithmetic or logic.
For example the ``v3MaskLess`` function:

**Syntax** ::

    v3MaskLess : function v3MaskLessFn(a, b)
    {
        return [(a[0] < b[0]),
                (a[1] < b[1]),
                (a[2] < b[2])];
    }

Sets each result component to a less than comparison between the equivalent components on ``a`` and ``b``.

**Required scripts**

The VMath object requires::

    /*{{ javascript("jslib/vmath.js") }}*/

The VMath object is a singleton.

Methods
=======

.. index::
    pair: VMath; v2MaskEqual

`v2MaskEqual`
-------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask equality of the
first vector parameter to the second vector parameter.
The VMath library specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    maskEqual = VMath.v2MaskEqual(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskLess

`v2MaskLess`
------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask LESS THAN operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskLess = VMath.v2MaskLess(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskGreater

`v2MaskGreater`
---------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask GREATER THAN operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskGreater = VMath.v2MaskGreater(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskGreaterEq

`v2MaskGreaterEq`
-----------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask GREATER THAN OR
EQUAL to operator of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskGreaterEq = VMath.v2MaskGreaterEq(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskNot

`v2MaskNot`
-----------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask NOT operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskNot = VMath.v2MaskNot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskOr

`v2MaskOr`
----------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask OR operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskOr = VMath.v2MaskOr(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskAnd

`v2MaskAnd`
-----------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask AND operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskAnd = VMath.v2MaskAnd(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2MaskSelect

`v2MaskSelect`
--------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask SELECT operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskSelect = VMath.v2MaskSelect(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: MathDevice; v2ScalarMax

`v2ScalarMax`
-------------

**Summary**

Returns a JavaScript array of length 2, initialized to the maximum of the first vector parameter to the second scalar one.

**Syntax** ::

    scalarMax = VMath.v2ScalarMax(vector, scalar);

``vector``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 2.

.. index::
    pair: MathDevice; v2ScalarMin

`v2ScalarMin`
-------------

**Summary**

Returns a JavaScript array of length 2, initialized to the minimum of the first vector parameter to the second scalar one.

**Syntax** ::

    scalarMin = VMath.v2ScalarMin(vector, scalar);

``vector``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 2.

.. index::
    pair: VMath; v2EqualScalarMask

`v2EqualScalarMask`
-------------------

**Summary**


Returns a JavaScript array of length 2, initialized to the minimum of the first vector parameter to the second scalar one.
The VMath library specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    equalScalarMask = VMath.v2EqualScalarMask(vector, scalar);

``vector``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2LessScalarMask

`v2LessScalarMask`
------------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask LESS THAN operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    lessScalarMask = VMath.v2LessScalarMask(vector, scalar);

``vector``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2GreaterScalarMask

`v2GreaterScalarMask`
---------------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask GREATER THAN operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    greaterScalarMask = VMath.v2GreaterScalarMask(vector, scalar);

``vector``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v2GreaterEqScalarMask

`v2GreaterEqScalarMask`
-----------------------

**Summary**

Returns a JavaScript array of length 2, initialized to the mask GREATER THAN OR EQUAL operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    greaterEqScalarMask = VMath.v2GreaterEqScalarMask(vector, scalar);

``vector``
    A :ref:`Vector2 <v2object>` object or a JavaScript array of length 2.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 2 containing either true or false.

.. index::
    pair: VMath; v3MaskEqual

`v3MaskEqual`
-------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask equality of the
first vector parameter to the second vector parameter.
The VMath library specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    maskEqual = VMath.v3MaskEqual(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskLess

`v3MaskLess`
------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask LESS THAN operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskLess = VMath.v3MaskLess(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskGreater

`v3MaskGreater`
---------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask GREATER THAN operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskGreater = VMath.v3MaskGreater(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskGreaterEq

`v3MaskGreaterEq`
-----------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask GREATER THAN OR
EQUAL to operator of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskGreaterEq = VMath.v3MaskGreaterEq(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskNot

`v3MaskNot`
-----------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask NOT operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskNot = VMath.v3MaskNot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskOr

`v3MaskOr`
----------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask OR operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskOr = VMath.v3MaskOr(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskAnd

`v3MaskAnd`
-----------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask AND operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskAnd = VMath.v3MaskAnd(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3MaskSelect

`v3MaskSelect`
--------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask SELECT operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskSelect = VMath.v3MaskSelect(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: MathDevice; v3ScalarMax

`v3ScalarMax`
-------------

**Summary**

Returns a JavaScript array of length 3, initialized to the maximum of the first vector parameter to the second scalar one.

**Syntax** ::

    scalarMax = VMath.v3ScalarMax(vector, scalar);

``vector``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 3.

.. index::
    pair: MathDevice; v3ScalarMin

`v3ScalarMin`
-------------

**Summary**

Returns a JavaScript array of length 3, initialized to the minimum of the first vector parameter to the second scalar one.

**Syntax** ::

    scalarMin = VMath.v3ScalarMin(vector, scalar);

``vector``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 3.

.. index::
    pair: VMath; v3EqualScalarMask

`v3EqualScalarMask`
-------------------

**Summary**


Returns a JavaScript array of length 3, initialized to the minimum of the first vector parameter to the second scalar one.
The VMath library specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    equalScalarMask = VMath.v3EqualScalarMask(vector, scalar);

``vector``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3LessScalarMask

`v3LessScalarMask`
------------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask LESS THAN operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    lessScalarMask = VMath.v3LessScalarMask(vector, scalar);

``vector``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3GreaterScalarMask

`v3GreaterScalarMask`
---------------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask GREATER THAN operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    greaterScalarMask = VMath.v3GreaterScalarMask(vector, scalar);

``vector``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 3 containing either true or false.

.. index::
    pair: VMath; v3GreaterEqScalarMask

`v3GreaterEqScalarMask`
-----------------------

**Summary**

Returns a JavaScript array of length 3, initialized to the mask GREATER THAN OR EQUAL operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    greaterEqScalarMask = VMath.v3GreaterEqScalarMask(vector, scalar);

``vector``
    A :ref:`Vector3 <v3object>` object or a JavaScript array of length 3.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 3 containing either true or false.


.. index::
    pair: VMath; v4MaskEqual

`v4MaskEqual`
-------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask equality of the
first vector parameter to the second vector parameter.
The VMath library specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    maskEqual = VMath.v4MaskEqual(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskLess

`v4MaskLess`
------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask LESS THAN operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskLess = VMath.v4MaskLess(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskGreater

`v4MaskGreater`
---------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask GREATER THAN operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskGreater = VMath.v4MaskGreater(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskGreaterEq

`v4MaskGreaterEq`
-----------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask GREATER THAN OR
EQUAL to operator of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskGreaterEq = VMath.v4MaskGreaterEq(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskNot

`v4MaskNot`
-----------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask NOT operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskNot = VMath.v4MaskNot(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskOr

`v4MaskOr`
----------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask OR operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskOr = VMath.v4MaskOr(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskAnd

`v4MaskAnd`
-----------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask AND operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskAnd = VMath.v4MaskAnd(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4MaskSelect

`v4MaskSelect`
--------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask SELECT operator
of the first vector parameter to the second vector parameter.

**Syntax** ::

    maskSelect = VMath.v4MaskSelect(vectorA, vectorB);

``vectorA``, ``vectorB``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: MathDevice; v4ScalarMax

`v4ScalarMax`
-------------

**Summary**

Returns a JavaScript array of length 4, initialized to the maximum of the first vector parameter to the second scalar one.

**Syntax** ::

    scalarMax = VMath.v4ScalarMax(vector, scalar);

``vector``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 4.

.. index::
    pair: MathDevice; v4ScalarMin

`v4ScalarMin`
-------------

**Summary**

Returns a JavaScript array of length 4, initialized to the minimum of the first vector parameter to the second scalar one.

**Syntax** ::

    scalarMin = VMath.v4ScalarMin(vector, scalar);

``vector``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 4.

.. index::
    pair: VMath; v4EqualScalarMask

`v4EqualScalarMask`
-------------------

**Summary**


Returns a JavaScript array of length 4, initialized to the minimum of the first vector parameter to the second scalar one.
The VMath library specifies the precision of the comparison with a default of 1E-06.

**Syntax** ::

    equalScalarMask = VMath.v4EqualScalarMask(vector, scalar);

``vector``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4LessScalarMask

`v4LessScalarMask`
------------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask LESS THAN operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    lessScalarMask = VMath.v4LessScalarMask(vector, scalar);

``vector``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4GreaterScalarMask

`v4GreaterScalarMask`
---------------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask GREATER THAN operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    greaterScalarMask = VMath.v4GreaterScalarMask(vector, scalar);

``vector``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 4 containing either true or false.

.. index::
    pair: VMath; v4GreaterEqScalarMask

`v4GreaterEqScalarMask`
-----------------------

**Summary**

Returns a JavaScript array of length 4, initialized to the mask GREATER THAN OR EQUAL operator
of the first vector parameter to the second scalar parameter.

**Syntax** ::

    greaterEqScalarMask = VMath.v4GreaterEqScalarMask(vector, scalar);

``vector``
    A :ref:`Vector4 <v4object>` object or a JavaScript array of length 4.

``scalar``
    A JavaScript number.

Returns a JavaScript array object of length 4 containing either true or false.
