.. index::
    single: TextureEncode

.. highlight:: javascript

.. _textureencode:

========================
The TextureEncode Object
========================

**Added SDK 0.28.0**

TextureEncode provides a set of utilities for encoding and decoding normalised floating point values and vectors into integer pixel values for storage in non-floating-point textures.

Analogous functions exist in `assets/shaders/particles-common.cgh` for GPU side encoding and decoding compatible with this object's methods.

.. note::
    This is a low-level particle system API.

Methods
=======

.. index::
    pair: TextureEncode; encodeByteUnsignedFloat

`encodeByteUnsignedFloat`
-------------------------

**Summary**

Encode an unsigned float value `[0,1)` into an 8-bit unsigned integer. Values less than `0` or greater-equal to `1` will be clamped.

.. note :: `1` cannot be encoded in this scheme, but `0.5` can be encoded exactly. The largest representable value is `0.99609375` with the absolute difference between any successive invertible input `0.00390625`. Non-invertible inputs will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeByteUnsignedFloat(value);

.. index::
    pair: TextureEncode; encodeByteSignedFloat

`encodeByteSignedFloat`
-----------------------

**Summary**

Encode a signed float value `[-1,1)` into an 8-bit unsigned integer. Values less than `-1` or greater-equal to `1` will be clamped.

.. note :: `1` cannot be encoded in this scheme, but `0` can be encoded exactly. The largest representable value is `0.9921875` with the absolute difference between any successive invertible input `0.0068125`. Non-invertible inputs will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeByteSignedFloat(value);

.. index::
    pair: TextureEncode; encodeHalfUnsignedFloat

`encodeHalfUnsignedFloat`
-------------------------

**Summary**

Encode an unsigned float value `[0,1)` into a 16-bit unsigned integer. Values less than `0` or greater-equal to `1` will be clamped.

.. note :: `1` cannot be encoded in this scheme, but `0.5` can be encoded exactly. The largest representable value is `0.9999847412109375` with the absolute difference between any successive invertible input `0.0000152587890625`. Non-invertible inputs will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeHalfUnsignedFloat(value);

.. index::
    pair: TextureEncode; encodeHalfSignedFloat

`encodeHalfSignedFloat`
-----------------------

**Summary**

Encode a signed float value `[-1,1)` into a 16-bit unsigned integer. Values less than `-1` or greater-equal to `1` will be clamped.

.. note :: `1` cannot be encoded in this scheme, but `0` can be encoded exactly. The largest representable value is `0.999969482421875` with the absolute difference between any successive invertible input `0.000030517578125`. Non-invertible inputs will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeHalfSignedFloat(value);

.. index::
    pair: TextureEncode; encodeUnsignedFloat

`encodeUnsignedFloat`
---------------------

**Summary**

Encode an unsigned float value `[0,1)` into a 32-bit signed integer. Values less than `0` or greater-equal to `1` will be clamped.

.. note :: `1` cannot be encoded in this scheme, but `0.5` can be encoded exactly. The largest representable value is `0.99999999976716935634613037109375` with the absolute difference between any successive invertible input `0.00000000023283064365386962890625`. Non-invertible inputs will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeUnsignedFloat(value);

.. index::
    pair: TextureEncode; encodeSignedFloat

`encodeSignedFloat`
-------------------

**Summary**

Encode a signed float value `[-1,1)` into a 32-bit signed integer. Values less than `-1` or greater-equal to `1` will be clamped.

.. note :: `1` cannot be encoded in this scheme, but `0` can be encoded exactly. The largest representable value is `0.9999999995343387126922607421875` with the absolute difference between any successive invertible input `0.0000000004656612873077392578125`. Non-invertible inputs will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeSignedFloat(value);

.. index::
    pair: TextureEncode; encodeUnsignedFloat2

`encodeUnsignedFloat2`
----------------------

**Summary**

Encode a pair of unsigned float values `[0,1)` into a 32-bit signed integer. Components less than `0` or greater-equal to `1` will be clamped.

.. note :: Components equal to `1` cannot be encoded in this scheme, but `0.5` can be encoded exactly. The largest representable value for components is `0.9999847412109375` with the absolute difference between any successive invertible input components `0.0000152587890625`. Non-invertible input components will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeUnsignedFloat2([value1, value2]);

.. index::
    pair: TextureEncode; encodeSignedFloat2

`encodeSignedFloat2`
--------------------

**Summary**

Encode a pair of signed float values `[-1,1)` into a 32-bit signed integer. Components less than `-1` or greater-equal to `1` will be clamped.

.. note :: Components equal to `1` cannot be encoded in this scheme, but `0.5` can be encoded exactly. The largest representable value for components is `0.999969482421875` with the absolute difference between any successive invertible input components `0.000030517578125`. Non-invertible input components will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeSignedFloat2([value1, value2]);

.. index::
    pair: TextureEncode; encodeUnsignedFloat4

`encodeUnsignedFloat4`
----------------------

**Summary**

Encode a quartet of unsigned float values `[0,1]` into a 32-bit signed integer. Components less than `0` or greater than `1` will be clamped.

.. note :: Different from the other encoding schemes, components equal to `1` can be encoded exactly in this scheme, but components equal to `0.5` will not be encoded. The absolute difference between any successive invertible input components `0.00392156862745098..`. Non-invertible input components will be rounded down to the nearest invertible representation.

**Syntax** ::

    var encoding = TextureEncode.encodeUnsignedFloat4([value1, value2, value3, value4]);

.. index::
    pair: TextureEncode; decodeByteUnsignedFloat

`decodeByteUnsignedFloat`
-------------------------

**Summary**

Decode an 8-bit unsigned integer into an unsigned float value `[0,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeByteUnsignedFloat`.

**Syntax** ::

    var value = TextureEncode.decodeByteUnsignedFloat(encoding);

.. index::
    pair: TextureEncode; decodeByteSignedFloat

`decodeByteSignedFloat`
-----------------------

**Summary**

Decode an 8-bit unsigned integer into a signed float value `[-1,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeByteSignedFloat`.

**Syntax** ::

    var value = TextureEncode.decodeByteSignedFloat(encoding);

.. index::
    pair: TextureEncode; decodeHalfUnsignedFloat

`decodeHalfUnsignedFloat`
-------------------------

**Summary**

Decode a 16-bit unsigned integer into an unsigned float value `[0,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeHalfUnsignedFloat`.

**Syntax** ::

    var value = TextureEncode.decodeHalfUnsignedFloat(encoding);

.. index::
    pair: TextureEncode; decodeHalfSignedFloat

`decodeHalfSignedFloat`
-----------------------

**Summary**

Decode a 16-bit unsigned integer into a signed float value `[-1,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeHalfSignedFloat`.

**Syntax** ::

    var value = TextureEncode.decodeHalfSignedFloat(encoding);

.. index::
    pair: TextureEncode; decodeUnsignedFloat

`decodeUnsignedFloat`
---------------------

**Summary**

Decode a 32-bit signed integer into an unsigned float value `[0,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeUnsignedFloat`.

**Syntax** ::

    var value = TextureEncode.decodeUnsignedFloat(encoding);

.. index::
    pair: TextureEncode; decodeSignedFloat

`decodeSignedFloat`
-------------------

**Summary**

Decode a 32-bit signed integer into a signed float value `[-1,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeSignedFloat`.

**Syntax** ::

    var value = TextureEncode.decodeSignedFloat(encoding);

.. index::
    pair: TextureEncode; decodeUnsignedFloat2

`decodeUnsignedFloat2`
----------------------

**Summary**

Decode a 32-bit signed integer into a pair of unsigned float values `[0,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeUnsignedFloat2`.

**Syntax** ::

    var values = TextureEncode.decodeUnsignedFloat2(encoding);
    // or
    TextureEncode.decodeUnsignedFloat2(encoding, dst);

``dst`` (Optional)
    If specified, the decoded values will be stored in this array, otherwise a new array will be created.

.. index::
    pair: TextureEncode; decodeSignedFloat2

`decodeSignedFloat2`
--------------------

**Summary**

Decode a 32-bit signed integer into a pair of signed float values `[-1,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeSignedFloat2`.

**Syntax** ::

    var values = TextureEncode.decodeSignedFloat2(encoding);
    // or
    TextureEncode.decodeSignedFloat2(encoding, dst);

``dst`` (Optional)
    If specified, the decoded values will be stored in this array, otherwise a new array will be created.

.. index::
    pair: TextureEncode; decodeUnsignedFloat4

`decodeUnsignedFloat4`
----------------------

**Summary**

Decode a 32-bit signed integer into a quartet of unsigned float values `[0,1)`.

.. note :: This is an exact inverse (for representable values) of `encodeUnsignedFloat4`.

**Syntax** ::

    var values = TextureEncode.decodeUnsignedFloat4(encoding);
    // or
    TextureEncode.decodeUnsignedFloat4(encoding, dst);

``dst`` (Optional)
    If specified, the decoded values will be stored in this array, otherwise a new array will be created.

