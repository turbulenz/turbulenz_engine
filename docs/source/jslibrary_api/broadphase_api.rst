.. index::
    single: Broadphase

.. highlight:: javascript

.. _broadphase:

=====================
The Broadphase Object
=====================

The Broadphase objects keep a common interface that may be used outside of any 2d physics simulation, nor are Broadphases limited just to two dimensions.

Constructor
===========

Two Broadphase implementation exists in the Turbulenz SDK at present, these can be constructed with :ref:`Physics2DDevice.createSweepAndPruneBroadphase() <physics2ddevice_sap>` and :ref:`Physics2DDevice.createBoxTreeBroadphase() <physics2ddevice_boxtree>`.


Methods
=======

.. index::
    pair: Broadphase; insert

`insert`
--------

**Summary**

Insert data value into broadphase, with given bounds and static type.

**Syntax** ::

    var handle = broadphase.insert(data, bounds, isStatic);

``data``
    The data value to be inserted.

    This value may be of any type, and inserted multiple times if needed.

``bounds``
    The bounds of the data in the broadphase.

    The definition of the bounds is up to the broadphase. For the 2D broadphases used by :ref:`Physics2DDevice <physics2ddevice>` these bounds should be an axis-aligned rectangle defined like
        [minX, minY, maxX, maxY]

``isStatic``
    Whether this data is a static, or dynamic data value.


.. index::
    pair: Broadphase; update

`update`
--------

**Summary**

Update handle bounds and static type.

**Syntax** ::

    broadphase.update(handle, bounds, isStatic);

``handle``
    The handle to be updated as returned by `broadphase.insert`.

``bounds``
    The new bounds for the handle.

``isStatic`` (Optional)
    The new static type for the handle. If unspecified the handles type will remain unchanged.


.. index::
    pair: Broadphase; remove

`remove`
--------

**Summary**

Remove handle from broadphase.

**Syntax** ::

    broadphase.remove(handle);

``handle``
    The handle to be removed as returned by `broadphase.insert`.

Broadphase implementations are free to re-use object handles, so references to handles that have been removed should be deleted.


.. index::
    pair: Broadphase; clear

`clear`
-------

**Summary**

Remove all handles from broadphase, executing given callback (if supplied) for each
handle.

**Syntax** ::

    broadphase.clear(callback, thisObject);

``callback`` (Optional)
    An optional callback which will be called for all handles.

    It should take a single argument as the handle from the broadphase.

``thisObject`` (Optional)
    An optional object to use for the `this` object when calling the callback.


.. index::
    pair: Broadphase; perform

`perform`
---------

**Summary**

Query all pairs of handles overlapping in the broadphase.

Pairs will not be reported for two handles marked as `static`.

**Syntax** ::

    broadphase.perform(callback, thisObject);

``callback``
    A callback which will be called for all handle pairs.

    It should take two arguments as the handles from the broadphase that form
    each pair.

``thisObject`` (Optional)
    An optional object to use for the `this` object when calling the callback.


.. index::
    pair: Broadphase; sample

`sample`
--------

**Summary**

Query all handles overlapping given bounds.

**Syntax** ::

    broadphase.sample(bounds, callback, thisObject);

``bounds``
    The bounds (as defined by broadphase) to sample handles from.

``callback``
    A callback which will be called for all overlapping handles.

    It should take two arguments as the handle that was overlapped, and the input bounds to the sample function.

``thisObject`` (Optional)
    An optional object to use for the `this` object when calling the callback.









.. index::
    single: BroadphaseHandle

============================
The Broadphase Handle Object
============================

Full specification of the handle object is left to the Broadphase implementation.

Broadphase implementations are free to re-use object handles, so references to them
should not be kept.

Properties
==========

.. index::
    pair: BroadphaseHandle; data

`data`
------

The data associated with handle.

.. index::
    pair: BroadphaseHandle; isStatic

`isStatic`
----------

The static type of handle.

.. note:: Read Only
