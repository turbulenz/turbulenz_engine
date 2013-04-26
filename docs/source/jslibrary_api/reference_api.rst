.. index::
    single: Reference

.. highlight:: javascript

.. _reference:

--------------------
The Reference Object
--------------------

This provides a proxy object that can be used to implement weak referencing.
One use case is the object managers that want to clear a dictionary entry when no other references exist.

**Required scripts**

The Reference object requires::

    /*{{ javascript("jslib/utilities.js") }}*/

Constructor
===========

.. index::
    pair: Reference; create

`create`
--------

**Summary**

Creates and returns a Reference object.

**Syntax** ::

    var reference = Reference.create(objectToReference);

``objectToReference``
    The object that should be reference counted.

Methods
=======

.. index::
    pair: Reference; add

`add`
-----

**Summary**

Increment the reference count.

**Syntax** ::

    reference.add();

.. index::
    pair: Reference; remove

`remove`
--------

**Summary**

Decrement the reference count.
When it reaches 0 the subscribed observer functions are called and the object.destroy() method is called.

**Syntax** ::

    reference.remove();

.. index::
    pair: Reference; subscribeDestroyed

`subscribeDestroyed`
--------------------

**Summary**

Register a function to call when the reference count is 0.


**Syntax** ::

    someObject.reference.subscribeDestroyed(onSomeObjectDestroyed);

``onSomeObjectDestroyed``
    The function to call.

.. index::
    pair: Reference; unsubscribeDestroyed

`unsubscribeDestroyed`
----------------------

**Summary**

Unregister a previously subscribed function.

**Syntax** ::

    someObject.reference.unsubscribeDestroyed(onSomeObjectDestroyed);

``onSomeObjectDestroyed``
    The function previously passed to subscribeDestroyed().
