.. index::
    single: Profile

.. highlight:: javascript

.. _profile:

------------------
The Profile Object
------------------

The Profile object uses the TurbulenzEngine.time to provide a high precision timing.
This can be with in a single function, e.g. timing the main loop and functions with in it, or over several frames, e.g. measuring the start up time.

The Profile object is a singleton, it does not have a create().

See :ref:`profilingjavascript` for an overview of profiling.

**Required scripts**

The Profile object requires::

    /*{{ javascript("jslib/utilities.js") }}*/

Methods
=======

.. index::
    pair: Profile; start

`start`
-------

**Summary**

Starts a profiling sampler with a given unique name.

**Syntax** ::

    Profile.start("myFunction");
    // Code to sample
    Profile.stop("myFunction");

.. index::
    pair: Profile; stop

`stop`
------

**Summary**

Stops a profiling sampler with a given unique name. If you are profiling a function make sure all code paths that return call stop().

**Syntax** ::

    Profile.start("myFunction");
    // Code to sample
    Profile.stop("myFunction");


.. index::
    pair: Profile; reset

`reset`
-------

**Summary**

Resets the profiling, clearing all previous data.

**Syntax** ::

    Profile.reset();


.. index::
    pair: Profile; getReport

`getReport`
-----------

**Summary**

Gets a string that contains all the report data. Each line of text is data formatted with the following properties:

* name
* calls
* duration
* max
* min
* average
* standard deviation
* % of the highest duration of all profiles

Usually this will be called outside of any start/stop pair, e.g. at the end of the main loop.

**Syntax** ::

    var text = Profile.getReport(sortMode, format);

``sortMode``
    Optional. One of Profile.sortMode. The default is Profile.sortMode.duration.

``format``
    Optional. An object specifying the format of the output with the following properties.

    * precision, defaults to 8.
    * percentagePrecision, defaults to 1.
    * separator, string that defaults to " " (space).

Properties
==========

.. index::
    pair: Profile; profiles

`profiles`
----------
A dictionary of objects, keyed off the names passed in to start().

Each object has the following properties:

* `name` a string, the value passed in to start().
* `calls` an integer of the number of times start(name) was called.
* `duration` a number of the total time, in seconds.
* `min` a number of the minimum time, in seconds.
* `max` a number of the maximum time, in seconds.
* `sumOfSquares` the sum of the squares of duration. Used for calculating standard deviation.

**Syntax** ::

    var profile = Profile.profiles["myFunction"];
    var averageTime = profile.duration / profile.calls;

.. index::
    pair: Profile; sortMode

`sortMode`
----------

An enumeration used in the getReport method.

* alphabetical
* duration
* max
* min
* calls
