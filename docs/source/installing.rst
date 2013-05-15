.. _developer_requirements:

.. index::
    single: Installing the SDK

------------------
Installing the SDK
------------------

The Turbulenz SDK includes the libraries, tools, documentation and examples to start using Turbulenz.
The SDK includes the contents of the `Turbulenz Engine open source repository <http://github.com/turbulenz/turbulenz_engine>`__ with pre-built examples and the Turbulenz Engine Installer for browsers and platforms that don't support the required features.

Optionally, you can find the Turbulenz Engine Installer for each SDK located at `hub.turbulenz.com/#downloads <https://hub.turbulenz.com/#downloads>`_.

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

    * Python 2.7.3+ - http://www.python.org/download/releases

        .. NOTE::

            It is not possible to use Python 3.X with the Turbulenz tools.

    **Recommended**

    * Microsoft Visual Studio 2008 - Used to compile speed-ups for
      python environment if available on platform.

    * PDF reader - Required to read documentation in PDF format

    After installing the essential and recommended software, install the SDK:

    1) Visit https://hub.turbulenz.com and login
    2) Download SDK X.X.X for Windows
    3) Run TurbulenzSDK-X.X.X.exe
    4) Follow the instructions

    .. NOTE::

        Performance of any Python modules could potentially be slower
        if speed-ups cannot be compiled.  It is recommended that you
        install Visual Studio **before** installing the Turbulenz SDK,
        so that the speed-ups can be configured in the environment.
        If you are using a 64bit version of Python you **must** have
        installed a 64bit version of the Visual Studio compilers.

**Mac OS X 10.6 and above**

    The Turbulenz SDK for Mac OS X is now available to developers in
    beta from https://hub.turbulenz.com as a self-extracting shell
    script.  This contains the tools, samples and engine components
    required to develop Turbulenz applications.

    The following software should be installed before installing the
    Turbulenz SDK:

    **Essential**

    * Python 2.7.3+ - http://www.python.org/download/releases

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
    2) Download SDK X.X.X for Mac
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-X.X.X.run
    5) ./TurbulenzSDK-X.X.X.run
    6) Follow the instructions

**Linux (BETA)**

    A release of the Turbulenz SDK for Linux is available
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

    * Python 2.7.3+ (incl. development files)

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
    2) Download SDK X.X.X for Linux
    3) Open a terminal in the same directory as the SDK installer and type:
    4) chmod a+x TurbulenzSDK-X.X.X.linux.run
    5) ./TurbulenzSDK-X.X.X.linux.run
    6) Follow the instructions


Running the Turbulenz SDK
-------------------------

(See :ref:`requirements` for a list of supported platforms and
prerequisites)

.. _getting_started_run_env:

:Run the Environment:

  This environment allows you to run the tools provided with the SDK.

  **Windows**:

    There is a shortcut in the start menu will start a command prompt
    inside the SDK virtual environment.

    Start Menu -> Programs -> Turbulenz -> SDK X.X.X -> Run Environment X.X.X

    .. NOTE::

      The starting directory of the environment is the SDK directory in which it is installed.

  **Mac / Linux**:

    In a terminal window, enter ::

        cd *SDKINSTALLDIR*
        source start_env

    You should see an **'(env)'** tag in front of your prompt.

  You are now ready to run the tools.


:Run the Local Server:

  **Windows**:

    This shortcut in the start menu will allow you to start the
    development server to test your games on your machine or on a
    local network.

  **Mac / Linux**:

    In a terminal window, enter ::

    *SDKINSTALLDIR*/start_local.sh

  .. Note ::

    When you run the Local Server for the first time, some firewalls
    may prompt you to allow *python* or *python.exe* to listen on a
    port. You will need to grant permission in order to run the
    server.

Verifying the Install
---------------------

Turbulenz tools use a Python virtual environment with the necessary
python packages (avoiding the need to install packages into the
default system Python folders).

To verify the install:

* Run the Local Server (described above) and ensure that there are no
  errors.  On Windows ensure that a browser opens to display the front
  page of the development server.

* Run the Turbulenz Environment (described above).  The string
  ``(env)`` prefixed to the command prompt indicating that the
  environment has been successfully activated.

* From this environment command prompt, type::

    dae2json

  The command line options for the *dae2json* command should be
  displayed.  If you see an error message instead, the environment has
  not been correctly installed.

Running a Sample
----------------

With the local development server running, open your browser and
navigate to http://127.0.0.1:8070.

Click the *Samples* project, and then click the *Play* button to show
the list of available samples.  There are several HTML files available
for each sample, corresponding to the different build configurations.
Clicking on the name of an HTML file will open and run the
corresponding sample.

.. ------------------------------------------------------------
