
.. _android_readme:

----------------------------------------
The Turbulenz Android Development Client
----------------------------------------

.. NOTE::

  PLEASE NOTE: This is a developer preview of software that is still
  being actively developed.  Please report any bugs to the
  turbulenz-engine-users Google Group.

Introduction
============

The Turbulenz Android Development Client is a native implementation of
some low-level components of the Turbulenz HTML5 Engine, which allows
Turbulenz games to run on Android even when the installed browsers do
not fully support HTML5 and related standards.

This technology can be applied to deploy specific games to the various
app stores, and integrate those games with the underlying platform
services, such as payment, user notifications, etc.  However, the
primary role of the Development Client is to allow developers to
quickly test and iterate their Turbulenz games on Android devices
during development.

The client can load and run .tzjs and .tzo files via URLs, or paths to
files on the local device.  See the Turbulenz Engine Documentation for
details of how to build your application code and data.  Diagnostic
and log output is available via the system log, and we recommend that
developers install the Android SDK so that they can examine the log
and run other development tools.

The development client requires the following permissions:

- **INTERNET** - Connect to internet
- **WAKE_LOCK** - Prevent the device from sleeping while the game is
  active
- **WRITE_EXTERNAL_STORAGE** - Cache data to reduce bandwidth and
  latency
- **BILLING** - Enable in-app purchases
- **READ_PHONE_STATE** - Used to create unique codes for fast login
  (securely anonymized)

Requirements
============

You will need:
- The Turbulenz SDK installed on your host machine.
- The Turbulenz Android Development Client installed on your android
  device

The following is also recommended:
- The `Android SDK <http://developer.android.com/sdk/index.html>`_,
  including a working version of the adb tool.

This allows you to launch the client via script or command line from a
PC connected to your android device. It also allows you to view the
log output from the android client.

Getting Started
===============

URLs to .tzjs files and .tzo files can be opened from the browser and
run in the Turbulenz Engine client.

- Install the Turbulenz Android Development Client via Google Play
- Start the local development server on your host machine and ensure
  it is accessible from your Android device.
- Browse to your local development server, and click on the .tzjs
  file entry in the ‘Play’ section for the relevant project.

.. NOTE::

  Depending on the version of the development server you are running,
  the .tzjs link may be of the form ::

    http://192.168.1.2:8070/#/play/samples/animation.tzjs

  which the browser will NOT run in the Turbulenz client.  If the
  client fails to launch, your local development server may be out of
  date.  Try removing the ‘#/’ characters from the URL ::

    http://192.168.1.2:8070/play/samples/animation.tzjs

  The local development server can be upgraded by running this command
  in the python env ::

    easy_install -Z -U turbulenz_local

Applications that have been deployed to the `Turbulenz HUB
<https://hub.turbulenz.com>`_ can also be launched by clicking on the
‘Play on Android’ button from the Android browser.  The client will
ask for login details the first time you launch a game from the HUB.

Developer Workflow
==================

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
