.. index::
    single: Conventions

.. _conventions:

-----------
Conventions
-----------

This appendix contains a reference guide for conventions for notation and terminology used in this documentation.

**Notation**

.. NOTE::

    This is information relevant to this topic that you should be aware of.

.. WARNING::

    This is important information that may have an impact on what you are trying to achieve. It might point out a pitfall or describe an essential step.

.. TIP::

    This is time-saving information that provides inside knowledge to help make the development process quicker and smoother.

**Terminology**

:\*GAMEDIR\*:
    This refers to the "Game Directory" which is the root directory of the game/application you are working on.
    If you are attempting to run commands described in the documentation on your project, then "Game Directory" refers the base folder for these commands.
    Here are some examples:

    **Windows**:
        * C:\\Development\\MyAwesomeProject\\
        * C:\\Users\\\*USERNAME\*\\Projects\\MyAwesomeProject\\
        * X:\\NetworkDrive\\\*USERNAME\*\\Dev\\MyAwesomeProject\\
        * X:\\NetworkDrive\\MyAwesomeProject\\\*USERNAME\*\\

    **Mac / Linux**:
        * ~/Development/MyAwesomeProject/
        * ~/Documents/Projects/MyAwesomeProject/
        * /Volumes/networkdrive/myawesomeproject/\*USERNAME\*/

:\*SDKINSTALLDIR\*:
    This is the "SDK Install Directory" which is the path to where the SDK has been installed.
    This is for the purpose of activating environments, running tools, etc.
    Turbulenz recommend that the SDK is located in place where processes run under your username have permission to read and write files.
    The default locations for SDK version X.X.X are:

    **Windows**:
        * C:\\Turbulenz\\SDK\\X.X.X\\

    **Mac / Linux**:
        * ~/Turbulenz/SDK/X.X.X/

.. NOTE::

    Turbulenz allows you have multiple SDKs installed on the same machine at the same time.
    For this reason, you should configure your build tools to be able to identify which SDK they are building against.
    This can be done simply by setting an environment variable e.g. **MYPROJECT_TURBULENZSDK** = C:\\Turbulenz\\SDK\\X.X.X

.. WARNING::

    Be wary of installing the Turbulenz SDK to a network drive.
    A number of the features of the SDK (e.g. the local server) are intended to be run on a local machine only and shouldn't be hosted remotely.
