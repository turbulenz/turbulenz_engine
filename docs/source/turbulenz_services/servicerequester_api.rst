.. index::
    single: ServiceRequester

.. _servicerequester:

.. highlight:: javascript

---------------------------
The ServiceRequester Object
---------------------------

The ServiceRequester object provides a layer for catching and handling 503 Service Unavailable HTTP status codes.
These errors can occur when our services are temporarily disabled or taken down for maintenance.
If a service is disabled the ServiceRequester object will:

* Call the ``onServiceUnavailable`` functions.
* Discard requests and call their error callbacks with a 503 Service Unavailable HTTP status code.
* Polls the service waiting for it to become available.
* Stops discarding requests once the service is available again and calls the ``onServiceAvailable`` functions.

See the :ref:`example <servicerequester_example>` for a more detailed description.

You can get the ServiceRequester object from the ``service`` property on our service managers or from
the :ref:`TurbulenzServices.getService <turbulenzservices_getservice>` function.

.. _servicerequester_servicenames:

**Supported services**

The current supported services are:

* ``userdata`` - See the :ref:`UserDataManager <userdatamanager>`.
* ``badges`` - See the :ref:`BadgeManager <badgemanager>`.
* ``profiles`` - See :ref:`UserProfiles <turbulenzservices_createuserprofile>`.
* ``leaderboards`` - See the :ref:`LeaderboardManager <leaderboardmanager>`.
* ``gameSessions`` - See :ref:`GameSessions <turbulenzservices_creategamesession>`.
* ``store`` - See :ref:`StoreManager <turbulenzservices_createstoremanager>`.
* ``multiplayer`` - See :ref:`Multiplayer <multiplayersession>`.
* ``customMetrics`` - See :ref:`sendCustomMetricEvent <turbulenzservices_sendcustommetricevent>`.
* ``gameProfile`` - See :ref:`GameProfileManager <gameprofilemanager>`.

The ServiceRequester objects are shared for each instance of these managers.

.. _servicerequester_example:

**Example**

::

    leaderboardManager.service.onServiceUnavailable = function onServiceUnavailableFn() {
        document.write(this.serviceName + ' service is unavailable');
    };

    leaderboardManager.service.onServiceAvailable = function onServiceUnavailableFn() {
        document.write(this.serviceName + ' service is available');
    };

    var leaderboardsSetCB = function leaderboardsSetCBFn(key, score, newBest, bestScore)
    {
        document.write('Score has been set');
    }
    var errorCallbackFn = function leaderboardsSetErrorCBFn(msg, status)
    {
        document.write('HTTP Error ' + status);
    };
    leaderboardManager.set(key, score, leaderboardsSetCB, errorCallbackFn);

If the service is down for a long period (for example 10 minutes) then you should expect the following:

* The message ``leaderboards service is unavailable``.
* The message ``HTTP Error 503``.
* A 10 minute pause.
* The message ``leaderboards service is available``.

Properties
==========

.. index::
    pair: ServiceRequester; serviceName

.. _servicerequester_servicename:

`serviceName`
-------------

**Summary**

A JavaScript string.
The name of the service.
This is for developers and should not be directly displayed.

**Syntax** ::

    var serviceName = ServiceRequester.serviceName;

.. index::
    pair: ServiceRequester; available

.. _servicerequester_available:

`running`
---------

**Summary**

A JavaScript boolean.
True, if the service is running, false, if the service is unavailable.

**Syntax** ::

    if (!serviceRequester.running)
    {
        renderServiceUnavailable();
    }

.. note:: If this is true it does not mean that the service will still be available when a request to the service is made.

.. index::
    pair: ServiceRequester; onServiceUnavailable

.. _servicerequester_onserviceunavailable:

`onServiceUnavailable`
----------------------

**Summary**

A JavaScript function.
This function is called when a service has been disabled.

**Syntax** ::

    serviceRequester.onServiceUnavailable = function onServiceUnavailableFn() {
        Utilties.log(this.serviceName + ' is unavailable');
    };


.. index::
    pair: ServiceRequester; onServiceAvailable

.. _servicerequester_onserviceavailable:

`onServiceAvailable`
--------------------

**Summary**

A JavaScript function.
This function is called when a service is re-enabled.

**Syntax** ::

    serviceRequester.onServiceAvailable = function onServiceAvailableFn() {
        Utilties.log(this.serviceName + ' is available');
    };
