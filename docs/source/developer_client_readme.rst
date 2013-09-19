
.. _developer_client_readme:

================================
 The Turbulenz Developer Client
================================

.. NOTE::

  PLEASE NOTE: This is a developer preview of software that is still
  being actively developed.  Please report any bugs to the
  turbulenz-engine-users Google Group.

Introduction
============

The Turbulenz Developer Client is a native implementation of some
low-level components of the Turbulenz HTML5 Engine, which allows
Turbulenz games to run on mobile devices, even when the installed
browsers do not fully support HTML5 and related standards.

This technology can be applied to deploy specific games to the various
app stores, and integrate those games with the underlying platform
services, such as payment, user notifications, etc.  However, the
primary role of the Developer Client is to allow developers to quickly
test and iterate their Turbulenz games on Android and iOS devices
during development.

The recommended way to launch Turbulenz applications on the Developer
Client is to use the .tzjs file links on the local development server.
See the :ref:`getting_started_guide` for details of how to build your
application code and data.

.. NOTE::

 The local development server may need to be upgraded to support
 mobile platforms.  This can be done by running this command in the
 python env ::

   easy_install -Z -U turbulenz_local

Android
=======

.. NOTE::

 On Android, the Developer Client does not create an icon in the
 Android Launcher.  This is intentional, since it is intended to be
 run in response to opening URLs, either via the browser or through
 the Android SDK Tools.

Diagnostic and log output is available via the system logs, and we
recommend that developers install the Android SDK so that they can
examine the log and run other development tools.

The development client requires the following permissions:

- **INTERNET** - Connect to internet
- **WAKE_LOCK** - Prevent the device from sleeping while the game is
  active
- **WRITE_EXTERNAL_STORAGE** - Cache data to reduce bandwidth and
  latency
- **BILLING** - Enable in-app purchases
- **READ_PHONE_STATE** - Used to create unique codes for fast login
  (securely anonymized)

------------
Requirements
------------

You will need:

- The Turbulenz SDK installed on your host machine.
- The Turbulenz Android Developer Client installed on your android
  device

The following is also recommended:

- The `Android SDK <http://developer.android.com/sdk/index.html>`_,
  including a working version of the adb tool.

This allows you to launch the client via script or command line from a
PC connected to your android device. It also allows you to view the
log output from the android client.

-------
Running
-------

- Install the Developer Client via Google Play
- Start the local development server on your host machine and ensure
  it is accessible from your Android device.
- Browse to your local development server, and click on the .tzjs
  file entry in the ‘Play’ section for the relevant project.

On Android, generic URLs to .tzjs files and .tzo files can be opened
from the browser and run in the Turbulenz Engine client.

.. NOTE::

  Depending on the version of the development server you are running,
  the .tzjs link may be of the form ::

    http://192.168.1.2:8070/#/play/samples/animation.tzjs

  which the browser will NOT run in the Turbulenz client.  If the
  client fails to launch, your local development server may be out of
  date.  Try removing the ‘#/’ characters from the URL ::

    http://192.168.1.2:8070/play/samples/animation.tzjs

Applications that have been deployed to the `Turbulenz HUB
<https://hub.turbulenz.com>`_ can also be launched by clicking on the
‘Play on Android’ button from the Android browser.  The client will
ask for login details the first time you launch a game from the HUB.

------------------
Developer Workflow
------------------

Options Menu
------------

Swipe down from the very top of the screen to open a development
dialog.  From here, developers can perform operations such as logout,
clearing the internal cache, etc.

Using the Android SDK
---------------------

Ensure that the Android SDK is installed correctly, and adb is
available from the command line.

To view the system log (including the output from window.console.log) ::

  adb logcat

Clear the system log ::

  adb logcat -c

Launch a URL on the device ::

  adb shell am start http://192.168.1.2:8070/play/samples/animation.tzjs

See the documentation for the adb command for more information and
uses of the adb command.

iOS
===

.. NOTE::

 iOS does not permit applications to take advantage of *JIT
 compilation*, the technology responsible for significant performance
 gains when executing Javascript code.  For this reason, developers
 may see a noticable difference in performance between the same game
 running on Android and iOS.  Note that the performance of hardware
 rendering operations is not affected by this.

 We recommend that developers targetting mobile platforms check the
 performance of their games on target devices *early* and *often*
 during development.

On iOS, the Developer Client is distributed as an Xcode project that
developers can build using their own provisioning profiles, in order
to run on their own devices.  See `the Apple Developer documentation
<https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4>`_
and related articles for details.

When run via Xcode, the debug console shows all output from the
engine, including the results of Javascript calls to
`window.console.log`.

------------
Requirements
------------

You will need:

- The Turbulenz Developer Client project, distributed as a .zip file
- Xcode, including the iOS developement modules

The Developer Client Xcode project will build and run using the iOS
simulator, included in Xcode.  In order to run on iOS devices
(recommended for performance measurement), you will need:

- An iOS device
- An Apple developer account

-------
Running
-------

- Build and install the Xcode project in the developer client package
- Start the local development server on your host machine, ensuring it
  is accessible from the iOS device or simulator
- Browse to the local development server and click on a .tzjs file in
  the 'Play' section of the relevant project.

On iOS, the Developer Client is not able to intercept arbitrary URLs
in the same way as on Android.  By default, it is configured to open
in response to URLs with the `tblz` and `tblzs` schemes.  Internally,
these are translated into `http` and `https`.  The Turbulenz servers
automatically generates URLs of the appropriate form when viewed from
the iOS browser.

.. NOTE::

 At this time, games deployed to the HUB and Gamesite cannot be opened
 by the iOS client.

------------------
Developer Workflow
------------------

Run the Developer Client from Xcode to capture the log output into the
debug console.

It is possible to hard-code URLs into the Developer Client (see the
comments at the top of the file `ViewController.mm` in the Xcode
project).  When this is done, the hard-coded URL will be used whenever
the app is run from Xcode or and launched via the Turbulenz
Developer Client icon in the home screen.
