.. index::
    single: Observer

.. highlight:: javascript

.. _observer:

-------------------
The Observer Object
-------------------

A utility object that implements the observer design pattern. It maintains a list of functions to call when an event occurs.

**Required scripts**

The Observer object requires::

    /*{{ javascript("jslib/observer.js") }}*/

Constructor
===========

.. index::
    pair: Observer; create

`create`
--------

**Summary**

Creates and returns an Observer object.

**Syntax** ::

    var observer = Observer.create();

Methods
=======

.. index::
    pair: Observer; subscribe

`subscribe`
-----------

**Summary**

Add a function to the list of functions to call when the event occurs. The function can only be registered once.

The functions should take a single argument, i.e. callback(data);

Using closure is useful pattern to allow additional state to be associated with the function.

**Syntax** ::

    observer.subscribe(callback);

``callback``
    A function to call.

.. index::
    pair: Observer; unsubscribe

`unsubscribe`
-------------

**Summary**

Remove a previously registered function.

**Syntax** ::

    observer.unsubscribe(callback);

``callback``
    A function.

.. index::
    pair: Observer; unsubscribeAll

`unsubscribeAll`
----------------

**Summary**

Remove all previously registered functions.

**Syntax** ::

    observer.unsubscribeAll();

.. index::
    pair: Observer; notify

`notify`
--------

**Summary**

Calls all the subscribed functions with the passed in data.

**Syntax** ::

    observer.notify(data);

``data``
    An object that is passed as an argument to the function.
