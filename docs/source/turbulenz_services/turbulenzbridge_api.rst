.. index::
    single: turbulenzbridge

.. _turbulenzbridge:

--------------------
The Turbulenz Bridge
--------------------

The Turbulenz Bridge offers an interface to the EventEmitter module that handles communication between games
running in the Turbulenz Engine or in an WebGL Canvas object. It wraps up the emission and reception of events and
replaces the now deprecated On Screen Library (osdlib).

To use it, simply include the file *jslib/services/turbulenzbridge.js* in your template. There is no need to
create or initialize it. If the game is running with our corresponding counterpart attached, the Turbulenz
Bridge will connect to it and be ready to go.

Methods
=======

.. index::
    pair: turbulenzbridge; startLoading

.. _turbulenzbridge_startLoading:

`startLoading`
--------------

**Summary**

Emits an event that signals the begin of a *loading* process. This enables the page to display a "loading..."
message tab to the user and/or delay less important communication to preserve bandwidth.

*Please note that, because parallel loading/saving processes can overlap each other, for every startXXXXX method call,
there needs to be a corresponding stopXXXXX method call.*

**Syntax** ::

    TurbulenzBridge.startLoading();

|

.. index::
    pair: turbulenzbridge; stopLoading

.. _turbulenzbridge_stopLoading:

`stopLoading`
-------------

**Summary**

Emits an event that signals the end of a *loading* process.

*Please note that, because parallel loading/saving processes can overlap each other, for every startXXXXX method call,
there needs to be a corresponding stopXXXXX method call.*

**Syntax** ::

    TurbulenzBridge.stopLoading();

|

.. index::
    pair: turbulenzbridge; startSaving

.. _turbulenzbridge_startSaving:

`startSaving`
-------------

**Summary**

Emits an event that signals the begin of a *saving* process. This enables the page to display a "saving..."
message tab to the user and/or delay less important communication to preserve bandwidth.

*Please note that, because parallel loading/saving processes can overlap each other, for every startXXXXX method call,
there needs to be a corresponding stopXXXXX method call.*

**Syntax** ::

    TurbulenzBridge.startSaving();

|

.. index::
    pair: turbulenzbridge; stopSaving

.. _turbulenzbridge_stopSaving:

`stopSaving`
------------

**Summary**

Emits an event that signals the end of a *saving* process.

*Please note that, because parallel loading/saving processes can overlap each other, for every startXXXXX method call,
there needs to be a corresponding stopXXXXX method call.*

**Syntax** ::

    TurbulenzBridge.stopSaving();


Examples
========

.. index::
    pair: turbulenzbridge; examples_osd

.. _turbulenzbridge_examples_osd:

OSD-Library
-----------

The TurbulenzBridge replaces the old OnScreenDisplay library (osdlib.js). That means that the code on the
game site that listens to calls like these:

::

    var osd = OSD.create();
    osd.startLoading();

    loadStuff();

    osd.stopLoading();


is likely to disappear in a future update. Please change your code to use the TurbulenzBridge instead:

::

    TurbulenzBridge.startLoading();

    loadStuff();

    TurbulenzBridge.stopLoading();


