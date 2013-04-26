--------------------
Turbulenz SDK 0.11.0
--------------------

Summary
=======

Turbulenz SDK 0.11.0 is an update for both the Turbulenz Engine Installer and SDK components.

Please see the Change List for details on API changes.

Requirements
============

**Essential**

* Python 2.6.5 - http://www.python.org/download/releases/2.6.5/
* Turbulenz Engine Installer 0.11.0 - http://www.turbulenz.com/download

**Optional**

* Microsoft Visual Studio 2008 - Used to compile speed-ups for python environment if available on platform.
* Java 1.4+ (Required for YUI Compressor) - http://www.java.com/en/download/manual.jsp
* PDF reader

.. NOTE::

    Performance of any Python modules could potentially be slower if speed-ups cannot be compiled.
    It is recommended that you install Visual Studio **before** installing the Turbulenz SDK, so that the speed-ups can be configured in the environment.
    If you are using a 64bit version of Python you **must** have installed a 64bit version of the Visual Studio compilers.

Change List
===========

New Features
------------

**Native Engine**

* :ref:`GraphicsDevice.setScissor <graphicsdevice_setscissor>` has been added.
  :ref:`GraphicsDevice.setViewport <graphicsdevice_setviewport>` no longer automatically set the scissor region.
* Support for multiple physics worlds has been added.
  The new :ref:`DynamicsWorld <dynamicsworld>` object represents a physics world for simulation, created via the :ref:`PhysicsDevice.createDynamicsWorld <physicsdevice_createdynamicsworld>` method.
  Collision objects, rigid bodies, characters and constraints are *created* using the original API on the PhysicsDevice, however the ``update`` and ``add*`` methods of PhysicsDevice are no longer present.
  These operations are now performed on a :ref:`DynamicsWorld <dynamicsworld>`, and each world is updated independently of the others.
  Please see the API reference for details of interface changes.

**Local Server**

* File system view toggle for the game directory under the View Assets action
  including a reverse lookup to the mapping table and highlighting of the assets which are on the mapping table.
* Improved Edit Game functionality (new file browse dialog and improved combo box interfaces)
* Updated styling throughout the Local server.


**Turbulenz Services**

* Added a :ref:`TurbulenzServices <turbulenzservices>` object which allows easier communication with the Turbulenz Services.
* Added a :ref:`GameSession <gamesession>` object for creating game sessions on local and the hub.
* Added a :ref:`MappingTable <mappingtable>` object for easier processing of the mapping table file.
* Added a :ref:`UserData <userdatamanager>` object for making save and load games.

Changes
-------

* Mapping table structure has changed from "urnremapping" to "urnmapping"::

    {
        "urnremapping":
        {
            "textures/duck.png": "E91_Ym3MMRjHxq4mvC7qQQ.png",
            "shaders/debug.cgfx": "IJ_nEyT7jofhyafUf-Opqg.json"
        },
        "version": 1.0
    }

  To::

    {
        "urnmapping":
        {
            "textures/duck.png": "E91_Ym3MMRjHxq4mvC7qQQ.png",
            "shaders/debug.cgfx": "IJ_nEyT7jofhyafUf-Opqg.json"
        },
        "version": 1.0
    }

  You **MUST** make this change in order to deploy to the hub, use the metrics or viewer options on local.

* The method for retrieving the mapping table has changed in this release.
  Previously you set the application settings on the window object in the html file and read the application settings from the window object in the js file.
  Now a ``gameSlug`` property is added to the window by local and hub and a :ref:`GameSession <gamesession>` object and :ref:`MappingTable <mappingtable>` object
  are used to extract the mapping table information::

    var mappingTable;
    var request = function requestFn(assetName, onload)
    {
        return TurbulenzEngine.request(mappingTable.getURL(assetName), onload);
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        loadAssets();
    };

    var gameSessionCreated = function gameSessionCreatedFn(gameSession)
    {
        var defaultMappingSettings = {
            mappingTablePrefix: "staticmax/",
            assetPrefix: "missing/",
            mappingTableURL: "mapping_table.json"
        };
        mappingTable = TurbulenzServices.createMappingTable(gameSession,
                                                            mappingTableReceived,
                                                            defaultMappingSettings)
    };

    var gameSession = TurbulenzServices.createGameSession(gameSessionCreated);

Fixed
-----

* Browsers, namely Safari on Windows and IE8, are more responsive when under heavy processing load.
* Fixed dds loading for R8G8B8A8 format.


Known Issues
============

* The MathDevice ignores JavaScript arrays as destination parameters and acts is if no destination has been given.
* The engine requires a CPU that supports SSE2.
* For shader support the engine requires a GPU that supports GLSL (OpenGL Shading Language).
* The SDK HTML help search feature does not work on Chrome.
  See http://code.google.com/p/chromium/issues/detail?id=47416.
* Running Turbulenz tools at the same time as the Local Server can sometimes result in access errors in "simplejson\_speedupds.pyd".
  Please close the Local Server before running any Turbulenz tools.
* When running intensive JavaScript applications, such as the *multiple animations* sample, some browsers, such as IE9, may lockup the user interface.
  You may have to manually terminate the process to regain control.
  Make sure the browser you are using can handle JavaScript running at full load and scale up slowly.
  Turbulenz recommends Firefox.
* The following browser(s) do not fully support the samples in *development* mode:
    * IE 6/7/8 - Engine not compatible
    * Opera 10.X - Engine not compatible
* The following browser(s) do not fully support the samples in *release* mode:
    * IE 6 - Not compatible with the styling
    * Opera 10.X - Controls are not fully functional
* The following browser(s) are performance limited for the samples in *development* mode:
    * Chrome (not using the Turbulenz JavaScript Engine)
* Some browsers don't support delete on native engine object properties, e.g. delete techniqueParameters.diffuse does not work, use techniqueParameters.diffuse = undefined instead.
* Sound stuttering can be heard when the browser is using 100% of CPU.
* In some cases, refreshing a web page when a Turbulenz application is requesting data can leave the browser in an inconsistent state. Please avoid refreshing when the application is still loading.
* Compatibility
    * Features
        * RenderTargets with format "D24S8" do not work on some Intel graphics chip-set, e.g. G41.
    * Shaders
        * tex2DProj does not work as expected on some Intel chip-sets, e.g. G41. tex2DProj requires a float4 with w=1.0 to be passed, rather than a float3. The sample shaders use tex2DProjFix to work around this issue.
* In some cases on Windows 7, the SDK installer is unable to automatically open the Windows Firewall for the Local Server on a local network if UAC is enabled. To allow the Local Server to be accessed over a local network, please manually update the Windows Firewall rule.
* Pre-releases of the following browsers are not officially supported, but may function:
    * Internet Explorer 9
    * Firefox 4
