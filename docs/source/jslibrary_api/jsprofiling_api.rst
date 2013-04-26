.. index::
    single: JSProfiling

.. highlight:: javascript

.. _jsprofiling:

----------------------
The JSProfiling Object
----------------------

The JSProfiling object provides some utilities to help process the results of
:ref:`TurbulenzEngine.stopProfiling <turbulenzengine_stopprofiling>`.


See :ref:`profilingjavascript` for an overview of profiling.

**Required scripts**

The JSProfiling object requires::

    /*{{ javascript("jslib/utilities.js") }}*/

Methods
=======

.. index::
    pair: JSProfiling; createArray

`createArray`
-------------

**Summary**

Creates a flat array of profile nodes by merging all the common function calls in the passed in profile node tree.

**Syntax** ::

    var rootNode = TurbulenzEngine.stopProfiling();

    if (rootNode)
    {
        var array = JSProfiling.createArray(rootNode);
        JSProfiling.sort(array);
        // ...
    }

.. index::
    pair: JSProfiling; sort

`sort`
------

**Summary**

Sorts the passed in array.

**Syntax** ::

    JSProfiling.sort(array, propertyName, descending);

``array``
    See JSProfiling.createArray()

``propertyName``
    Optional property to sort by. Defaults to 'totalTime'.

``descending``
    Optional boolean, defaults to true.
