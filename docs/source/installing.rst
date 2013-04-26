.. _developer_requirements:

.. index::
    single: Installing the SDK

------------------
Installing the SDK
------------------

The Turbulenz Engine Installer is now included with the SDK.
Optionally, you can find the Turbulenz Engine Installer for each SDK located `here <https://hub.turbulenz.com/#downloads>`_.

.. NOTE::
    This Turbulenz Engine is a pre-release for developers and is only intended for development with the SDK.
    If you want to access games on turbulenz.com, the site will ask you to update to the latest compatible version required by the game.
    If your game requires a version of the Turbulenz Engine that is not yet available to the public, you may have to install it from `https://hub.turbulenz.com/#downloads <https://hub.turbulenz.com/#downloads>`_
    In the future, engine version management will be taken care of automatically.

**Support**

The latest documentation can be found online at http://docs.turbulenz.com

If you are having difficulties with Turbulenz Technology, the
following steps will get you to the support site:

1) Log in to the Turbulenz Hub at `https://hub.turbulenz.com <https://hub.turbulenz.com>`_.
2) Press the 'Support' button on the landing page. This with automatically log you into the support service.
3) Take a look at the knowledge base or create a support request.

For more help using the support site see the :ref:`support section <support>`.

Installation steps
------------------

**Windows XP/Vista/7**

    The Turbulenz SDK for Windows is available from https://hub.turbulenz.com as a downloadable a self-extracting installer exe.
    This contains the tools, samples and engine components required to develop Turbulenz applications.

    The following software should be installed before installing the Turbulenz SDK:

    **Essential**

    * Python 2.7.2+ - http://www.python.org/download/releases

        .. NOTE::

            It is not possible to use Python 3.X with the Turbulenz tools.

    **Recommended**

    * Microsoft Visual Studio 2008 - Used to compile speed-ups for
      python environment if available on platform.

    * PDF reader - Required to read documentation in PDF format

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK |release| for Windows
    3) Run TurbulenzSDK-|release|.exe
    4) Follow the instructions

    .. NOTE::

        Performance of any Python modules could potentially be slower
        if speed-ups cannot be compiled.  It is recommended that you
        install Visual Studio **before** installing the Turbulenz SDK,
        so that the speed-ups can be configured in the environment.
        If you are using a 64bit version of Python you **must** have
        installed a 64bit version of the Visual Studio compilers.

**Mac OS X 10.6 and above (BETA)**

    The Turbulenz SDK for Mac OS X is now available to developers in
    beta from https://hub.turbulenz.com as a self-extracting shell
    script.  This contains the tools, samples and engine components
    required to develop Turbulenz applications.

    The following software should be installed before installing the
    Turbulenz SDK:

    **Essential**

    * Python 2.7.2+ - http://www.python.org/download/releases

        .. NOTE::

            It is not possible to use Python 3.X with the Turbulenz tools.

    * Cg Toolkit - http://developer.nvidia.com/cg-toolkit - Required
      to compile shaders using the cgfx2json tool.

    *Mac OS X 10.6*

    * Xcode 3.2.6+ - This MUST be installed before running the
      script so that Python can compile certain modules.

        .. NOTE::

            Only the command line development tools are required from
            Xcode and the iOS SDK is NOT required.

    *Mac OS X 10.7 and above*

    * Xcode 4.3.2+ Command Line Tools for Xcode (February 2012 or later)

        .. NOTE::

            If you DON'T already have Xcode installed, Turbulenz
            recommend the command line tools only, which is the
            minimum required for Turbulenz development.

            If you DO already have Xcode installed, go to the "Downloads"
            preference pane in Xcode and under the "components" tab you
            can select to install the "Command Line Tools".



    After installing the essential software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK |release| for Mac
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-|release|.run
    5) ./TurbulenzSDK-|release|.run
    6) Follow the instructions

**Linux (ALPHA)**

    An Alpha release of the Turbulenz SDK for Linux is now available
    from https://hub.turbulenz.com as a self-extracting shell script.
    This contains the tools, samples and engine components required to
    develop Turbulenz applications.  Not that the Linux version of the
    browser plugin is not released.  Developers must use 'canvas' mode
    when running on Linux.

    This release has only been tested against Ubuntu 12.04 (64bit),
    although feedback from developers using other recent releases of
    other distributions is welcome.

    The following software should be installed before installing the
    Turbulenz SDK.  We recommend installing via your package manager:

    **Essential**

    * Python 2.7.2+ (incl. development files)

        * Under Linux, the Python development package (libraries and
          header files) must be installed.  On Ubuntu, this can be
          done with the following command::

            sudo apt-get install python-dev

        * It is recommended that you install `virtualenv` and
          `setuptools` for Python from your for your distribution's
          package manager.  On Ubuntu::

            sudo apt-get install python-virtualenv python-setuptools

        .. NOTE::

            It is not possible to use Python 3.X with the Turbulenz tools.

    * GCC (including g++)

        * This MUST be installed before running the script so that
          Python can compile certain modules.

    * Cg Toolkit 3.0+

        * The cgfx2json tool in the SDK relies on this library being
          installed.  Either install from your package manager or
          visit http://developer.nvidia.com/cg-toolkit to download the
          latest version.  Make sure you have the correct
          configuration for your system (32 / 64-bit).

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK |release| for Linux
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-|release|.linux.run
    5) ./TurbulenzSDK-|release|.linux.run
    6) Follow the instructions
