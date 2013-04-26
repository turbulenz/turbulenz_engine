.. index::
    single: MathDeviceConvert

.. highlight:: javascript

.. _mathdeviceconvert:

----------------------------
The MathDeviceConvert Object
----------------------------

This object contains a set of functions for converting from MathDevice
objects to JavaScript arrays (returned by VMath function calls and
``JSON.parse``) and vice versa.  These functions should be used
carefully as the conversion from MathDevice objects to VMath objects
is a **slow operation**.  In most cases it is best to use avoid
conversion by continuing to use the same library.

**Required scripts**

The MathDeviceConvert object requires::

    /*{{ javascript("jslib/utilities.js") }}*/

**Converting from MathDevice objects to JavaScript Arrays**

It is **not required** to call these functions when using MathDevice
objects for arguments to VMath functions (see :ref:`VMath
compatibility with MathDevice objects <vmath_compatibility>`).

.. _convert_js_to_md:

**Converting from JavaScript Arrays to MathDevice objects**

You can convert from JavaScript arrays (returned by VMath function calls and ``JSON.parse``) to MathDevice objects using apply.
For example::

    var jsV3 = VMath.v3Build(1, 2, 3);

    var v3Build = mathDevice.v3Build;
    v3 = v3Build.apply(mathDevice, jsV3);

This conversion will **only work with JavaScript arrays** (this will fail if ``jsV3`` is actually a MathDevice object).
If the argument is a MathDevice object then you should be using a copy function (:ref:`mathDevice.v3Copy <v3copy>`) instead.
If a MathDevice destination object is available use::

    var jsV3 = VMath.v3Build(1, 2, 3);

    v3 = MathDeviceConvert.arrayToV3(mathDevice, jsV3, mathDeviceV3);

These conversions are **slow operations** and should be avoided where possible.
For example, the examples above can be replaced with::

    v3 = mathDevice.v3Build(1, 2, 3);
    // or
    v3 = mathDevice.v3Build(1, 2, 3, mathDeviceV3);

Methods
=======

.. index::
    pair: MathDeviceConvert; v2ToArray

`v2ToArray`
-----------

**Summary**

Returns a JavaScript array of length 2 with the values from a :ref:`Vector2 <v2object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.v2ToArray(vector);

``vector``
    A :ref:`Vector2 <v2object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 2.

.. index::
    pair: MathDeviceConvert; arrayToV2

`arrayToV2`
-----------

**Summary**

Returns a :ref:`Vector2 <v2object>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToV2(mathDevice, jsVector, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsVector``
    A JavaScript array of length 2.

``destination`` (Optional)
    A :ref:`Vector2 <v3object>` object.

Returns a :ref:`Vector2 <v3object>` object.

.. index::
    pair: MathDeviceConvert; v3ToArray

`v3ToArray`
-----------

**Summary**

Returns a JavaScript array of length 3 with the values from a :ref:`Vector3 <v3object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.v3ToArray(vector);

``vector``
    A :ref:`Vector3 <v3object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 3.

.. index::
    pair: MathDeviceConvert; arrayToV3

`arrayToV3`
-----------

**Summary**

Returns a :ref:`Vector3 <v3object>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToV3(mathDevice, jsVector, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsVector``
    A JavaScript array of length 3.

``destination`` (Optional)
    A :ref:`Vector3 <v3object>` object.

Returns a :ref:`Vector3 <v3object>` object.

.. index::
    pair: MathDeviceConvert; v4ToArray

`v4ToArray`
-----------

**Summary**

Returns a JavaScript array of length 4 with the values from a :ref:`Vector4 <v4object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.v4ToArray(vector);

``vector``
    A :ref:`Vector4 <v4object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 4.

.. index::
    pair: MathDeviceConvert; arrayToV4

`arrayToV4`
-----------

**Summary**

Returns a :ref:`Vector4 <v4object>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToV4(mathDevice, jsVector, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsVector``
    A JavaScript array of length 4.

``destination`` (Optional)
    A :ref:`Vector4 <v4object>` object.

Returns a :ref:`Vector4 <v4object>` object.

.. index::
    pair: MathDeviceConvert; quatToArray

`quatToArray`
-------------

**Summary**

Returns a JavaScript array of length 4 with the values from a :ref:`Quaternion <quatobject>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.quatToArray(quat);

``quat``
    A :ref:`Quaternion <quatobject>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 4.

.. index::
    pair: MathDeviceConvert; arrayToQuat

`arrayToQuat`
-------------

**Summary**

Returns a :ref:`Quat <quatobject>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToQuat(mathDevice, jsQuat, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsQuat``
    A JavaScript array of length 4.

``destination`` (Optional)
    A :ref:`Quat <quatobject>` object.

Returns a :ref:`Quat <quatobject>` object.

.. index::
    pair: MathDeviceConvert; quatPosToArray

`quatPosToArray`
----------------

**Summary**

Returns a JavaScript array of length 7 with the values from a :ref:`QuatPos <quatposobject>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.quatPosToArray(quatPos);

``quatPos``
    A :ref:`QuatPos <quatposobject>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 7.

.. index::
    pair: MathDeviceConvert; arrayToQuatPos

`arrayToQuatPos`
----------------

**Summary**

Returns a :ref:`QuatPos <quatposobject>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToQuatPos(mathDevice, jsQuatPos, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsQuatPos``
    A JavaScript array of length 7.

``destination`` (Optional)
    A :ref:`QuatPos <quatposobject>` object.

Returns a :ref:`QuatPos <quatposobject>` object.

.. index::
    pair: MathDeviceConvert; aabbToArray

`aabbToArray`
-------------

**Summary**

Returns a JavaScript array of length 6 with the values from an :ref:`AABB <aabbobject>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.aabbToArray(aabb);

``aabb``
    An :ref:`AABB <aabbobject>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 6.

Returns a JavaScript array object of length 7.

.. index::
    pair: MathDeviceConvert; arrayToAABB

`arrayToAABB`
----------------

**Summary**

Returns a :ref:`AABB <aabbobject>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToAABB(mathDevice, jsAABB, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsAABB``
    A JavaScript array of length 6.

``destination`` (Optional)
    A :ref:`AABB <aabbobject>` object.

Returns a :ref:`AABB <aabbobject>` object.

.. index::
    pair: MathDeviceConvert; m33ToArray

`m33ToArray`
------------

**Summary**

Returns a JavaScript array of length 9 with the values from an :ref:`Matrix33 <m33object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.m33ToArray(m33);

``m33``
    An :ref:`Matrix33 <m33object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 9.

.. index::
    pair: MathDeviceConvert; arrayToM33

`arrayToM33`
------------

**Summary**

Returns a :ref:`Matrix33 <m33object>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToM33(mathDevice, jsM33, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsM33``
    A JavaScript array of length 9.

``destination`` (Optional)
    A :ref:`Matrix33 <m33object>` object.

Returns a :ref:`Matrix33 <m33object>` object.

.. index::
    pair: MathDeviceConvert; m43ToArray

`m43ToArray`
------------

**Summary**

Returns a JavaScript array of length 12 with the values from an :ref:`Matrix43 <m43object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.m43ToArray(m43);

``m43``
    An :ref:`Matrix43 <m43object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 12.

.. index::
    pair: MathDeviceConvert; arrayToM43

`arrayToM43`
------------

**Summary**

Returns a :ref:`Matrix43 <m43object>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToM43(mathDevice, jsM43, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsM43``
    A JavaScript array of length 12.

``destination`` (Optional)
    A :ref:`Matrix43 <m43object>` object.

Returns a :ref:`Matrix43 <m43object>` object.

.. index::
    pair: MathDeviceConvert; m34ToArray

`m34ToArray`
------------

**Summary**

Returns a JavaScript array of length 12 with the values from an :ref:`Matrix34 <m34object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.m34ToArray(m34);

``m34``
    An :ref:`Matrix34 <m34object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 12.

.. index::
    pair: MathDeviceConvert; m44ToArray

`m44ToArray`
------------

**Summary**

Returns a JavaScript array of length 16 with the values from an :ref:`Matrix44 <m44object>` object.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    jsArray = MathDeviceConvert.m44ToArray(m44);

``m44``
    An :ref:`Matrix34 <m44object>` object.
    The MathDevice object to convert.

Returns a JavaScript array object of length 16.

.. index::
    pair: MathDeviceConvert; arrayToM44

`arrayToM44`
------------

**Summary**

Returns a :ref:`Matrix44 <m44object>` object with the values from a JavaScript array.
This function is **slow** and its use should be avoided where possible.

**Syntax** ::

    destination = MathDeviceConvert.arrayToM44(mathDevice, jsM44, destination);

``mathDevice``
    A :ref:`MathDevice <mathdevice>` object.

``jsM44``
    A JavaScript array of length 16.

``destination`` (Optional)
    A :ref:`Matrix44 <m44object>` object.

Returns a :ref:`Matrix44 <m44object>` object.
