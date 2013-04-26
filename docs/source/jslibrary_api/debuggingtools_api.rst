.. index::
    single: DebuggingTools

.. highlight:: javascript

.. _debuggingTools:

-------------------------
The DebuggingTools Object
-------------------------

The DebuggingTools provide some additional functionality to help debugging.
It implements a data breakpoint that can stop in the debugger when a value is read or/and written to.
It currently supports object properties, array indices and function properties.
However it does not support typed arrays.

Typically DebuggingTools would be invoked from the console while paused but can also be called directly from code.

The DebuggingTools object is a singleton, it does not have a create().

Methods
=======

.. index::
    pair: DebuggingTools; dataBreakpoint

`dataBreakpoint`
----------------

**Summary**

Add a data breakpoint on an object property, array index or function property.

If no property or index is specified then all properties have breakpoints added to them.
This may be slow for large arrays or objects with many properties.

Multiple properties of the same object can have breakpoints added.

The implementation changes the object by using getters and setters which may cause side effects.
For values that are implemented with getters and setters the breakpoint needs to be set on the value they alter.

**Syntax** ::

    DebuggingTools.dataBreakpoint(anObjectOrArray, "aPropertyOrIndex", breakOnRead, breakOnWrite);

``anObjectOrArray``
    The object, array or function to set the breakpoints on.

``aPropertyOrIndex``
    Optional, defaults to undefined. The string name of the property or string index to break on. If undefined then it will add all properties.

``breakOnRead``
    Optional, defaults to true. Whether to break in to the debugger when the value is read. This can be toggled in the debugger.

``breakOnWrite``
    Optional, defaults to true. Whether to break in to the debugger when the value is written to. This can be toggled in the debugger.

**Examples** ::

    DebuggingTools.dataBreakpoint(anObject, "name"); // break on read or write of anObject.name
    DebuggingTools.dataBreakpoint(anObject); // break on read or write of any object property
    DebuggingTools.dataBreakpoint(anArray, "1"); // break on read or write of anArray[1]
    DebuggingTools.dataBreakpoint(anArray); // break on read or write of anArray[*]
    DebuggingTools.dataBreakpoint(anArray, undefined, false, true); // break on writes to anArray[*]


.. index::
    pair: DebuggingTools; clearDataBreakpoint

`clearDataBreakpoint`
---------------------

**Summary**
Remove a breakpoint from an object or all breakpoints.

**Syntax** ::

    DebuggingTools.clearDataBreakpoint(anObjectOrArray, "aPropertyOrIndex");

``anObjectOrArray``
    Optional. The object to remove breakpoints from. If not specified then all breakpoints on all objects are removed.

``aPropertyOrIndex``
    Optional. The string name of the property or string index remove the breakpoint from. If undefined then it removes all breakpoints on the object.


**Examples** ::

    DebuggingTools.clearDataBreakpoint(); // clear all breakpoints
    DebuggingTools.clearDataBreakpoint(anObject); // clear all breakpoints on the anObject
    DebuggingTools.clearDataBreakpoint(anObject, "name"); // clear the breakpoint on anObject.name
