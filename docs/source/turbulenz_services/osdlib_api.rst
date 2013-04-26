.. index::
    single: osdlib

.. _osdlib:

-----------------------------
The On Screen Display Library
-----------------------------

.. WARNING::

    This module has been deprecated in SDK 0.19.0. Meaning it and its support on the Hub and the game site is likely going
    to disappear in the near future. Its functionality is now integrated into the new :ref:`TurbulenzBridge library <turbulenzbridge>`.
    For more details, please see the :ref:`OSD-Examples <turbulenzbridge_examples_osd>`.


The On Screen Display Library (osdlib) offers an interface to the osdobserver module that displays ready-styled
**save**/**load**/**busy** messages on the Turbulenz pages.
It uses the same little tab that you can sometimes see when logging into the page.

To use it, include the file *jslib/services/osdlib.js* in your template and create an **osd**-object by calling **OSD.create()**.

Please note that for every *start-* call there should be one *stop-* call.
The object keeps count of how many calls to *startLoading* and *startSaving* there where.
The counter is decreased for every call to *stopLoading* and *stopSaving*.
Only when the counter reaches zero is the tab removed.

.. NOTE::
    Any processing code following the OSD call must :ref:`give time back to the browser <giving_time_back_to_the_browser>`
    to allow the browser to render the OSD message.

Constructor
===========

.. index::
    pair: osdlib; create

`create`
--------

**Summary**

Creates an OSD object. (DEPRECATED in SDK 0.19.0, please refer to the  :ref:`TurbulenzBridge <turbulenzbridge>` documentation for details)

**Syntax** ::

    var osd = OSD.create();

Returns an OSD object.

Methods
=======

.. index::
    pair: osdlib; startLoading

.. _osdlib_startLoading:

`startLoading`
--------------

**Summary**

Signals the begin of a *loading* process. (DEPRECATED in SDK 0.19.0, please refer to the  :ref:`TurbulenzBridge <turbulenzbridge_startLoading>` documentation for details)

**Syntax** ::

    var osd = OSD.create();

    osd.startLoading();



.. index::
    pair: osdlib; stopLoading

.. _osdlib_stopLoading:

`stopLoading`
-------------

**Summary**

Signals the end of a *loading* process. (DEPRECATED in SDK 0.19.0, please refer to the  :ref:`TurbulenzBridge <turbulenzbridge_stopLoading>` documentation for details)

**Syntax** ::

    var osd = OSD.create();

    osd.stopLoading();



.. index::
    pair: osdlib; startSaving

.. _osdlib_startSaving:

`startSaving`
-------------

**Summary**

Signals the begin of a *saving* process. (DEPRECATED in SDK 0.19.0, please refer to the  :ref:`TurbulenzBridge <turbulenzbridge_startSaving>` documentation for details)

**Syntax** ::

    var osd = OSD.create();

    osd.startSaving();



.. index::
    pair: osdlib; stopSaving

.. _osdlib_stopSaving:

`stopSaving`
------------

**Summary**

Signals the end of a *saving* process. (DEPRECATED in SDK 0.19.0, please refer to the  :ref:`TurbulenzBridge <turbulenzbridge_stopSaving>` documentation for details)

**Syntax** ::

    var osd = OSD.create();

    osd.stopSaving();
