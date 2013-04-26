--------------------
Turbulenz SDK 0.25.1
--------------------

.. highlight:: javascript

Summary
=======

Turbulenz SDK 0.25.1 is an update for both the Turbulenz Engine
Installer and SDK components.


Change List
===========

New Features
------------

**0.25.1**

* Added global volume control to sound sample.

* Updated the "Getting Started Guide" to include sections on :ref:`TypeScript <getting_started_typescript>` and :ref:`Rebuilding an Application <getting_started_rebuilding_an_application>`.


**0.25.0**

* Added :ref:`RequestHandler.destroy <requesthandler-destroy>`.

* A new method :ref:`createVideo <graphicsdevice_createvideo>` has been added to :ref:`GraphicsDevice
  <graphicsdevice>` to create video playback objects.

* A new video playback sample has been added called 'video'.

* Added supported file formats to :ref:`GraphicsDevice.isSupported <graphicsdevice_issupported>`.

* New methods :ref:`createSnapshot <physicsmanager_createsnapshot>` and
  :ref:`restoreSnapshot <physicsmanager_restoresnapshot>` have been added to :ref:`PhysicsManager
  <physicsmanager>` to create and restore snapshops for the dynamic physics objects on the scene.

* The  :ref:`DefaultRendering <defaultrendering_techniqueparameters>`,
  :ref:`DeferredRender <deferredrendering_techniqueparameters>` and
  :ref:`ForwardRender <forwardrendering_techniqueparameters>`
  now support uvTransform.
  The uvTransform is an array of 6 numbers that can be used to rotate, scale and translated the uvs.

  Example::

      // Transform the uvs so they rotate around the centre of the texture
      var uvTransform = new Float32Array(6);

      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var offset = 0.5;

      uvTransform[0] = cos;
      uvTransform[1] = sin;
      uvTransform[2] = -sin;
      uvTransform[3] = cos;
      uvTransform[4] = -offset * (cos - sin) + offset;
      uvTransform[5] = -offset * (sin + cos) + offset;

* NvTriStripper tool has been added to the SDK. This tool optimizes meshes when run as part of :ref:`dae2json <dae2json>`.
  To run this tool specify it as an argument to dae2json e.g.::

    dae2json --nvtristrip=<PATH_TO_NVTRISTRIP> -i source.dae -o target.json

  This step is recommended for certain COLLADA files exported from Sketchup.
  NvTriStripper can be found in *external/NvTriStrip/bin/<PLATFORM>* in SDK 0.25.0 onwards.


Changes
-------

**0.25.0**

* The JavaScript library 'jslib' and several of the samples and
  applications included in the SDK are now written in TypeScript
  (http://www.typescriptlang.org).  Except for fixes and changes
  listed in these notes, the generated version of the code should be
  functionally equivalent to previous JavaScript implementations and
  there have been no resulting interface changes.  However, the
  generated code it may not pass all the same static checks that
  previous versions did.

* The SDK now includes a preliminary version of TypeScript
  declarations for the Turbulenz APIs (in the `jslib-modular`
  directory).  These should be considered pre-alpha, for developers
  who are interested in trying to build their code with TypeScript.
  The declarations have been used to build the samples and several
  apps from the SDK, and they will improve over time to include
  stricter type information.

* For more information see the :ref:`TypeScript recommendation <typescript_recommendation>`.
  Please notify us if you discover bugs or regressions related to this change.

Fixed
-----

**0.25.1**

* Various fixes to :ref:`dae2json <dae2json>`
    * Added bump texture exporting.
    * Improvements to physics processing.
    * Improved logging for shapes with no indicies.
    * T1408 - Support for animating scale to zero.

* Added missing payments sample template.

* T1397 - soundDevice.listenerGain has no effect on canvas.

* Removed the viewer.ts file from tslib. Can be found as part of the local server.

* Fixed minor referencing issues in certain tslib files.

**0.25.0**

* An issue where :ref:`deploygame <deploygame>` tool was unable to upload to the Hub.

* A rounding error for certain values in storeitems.yaml that caused an error on the Hub.

* Various fixes to :ref:`dae2json <dae2json>` to avoid crashing and give more warnings for incorrect/unsupported files.

* Fixed an issue where JSProfiling was unable to generate array information in the latest Chrome.

Known Issues
============

New
---

**0.25.0**

* Installing a 32-bit version of Python 2.7 on a 64-bit Windows 8 machine will still install, but fail to setup the environment.
  Make sure to use a 64-bit Python 2.7 with a 64-bit machine.

* The video sample has audio/video sync problems on Safari 5.1 on Mac. Try Safari 6.0 for an improved experience.

* On Linux machines, the camera position on canvas samples using the camera controller gets reset when losing focus in Firefox/Chrome.

Unchanged
---------

For a list of current known issues see the :ref:`known issues section
<known_issues>`.
