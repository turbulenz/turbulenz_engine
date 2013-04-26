.. index::
    pair: Tools; deploygame

.. _deploygame:

==========
deploygame
==========

-----
Usage
-----

**Syntax** ::

    deploygame [options]


Deploys a game from Local to the Hub.

-------
Options
-------

.. program:: deploygame

.. cmdoption:: --version

   Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --input=INPUT, -i INPUT

    Manifest file for the game to be deployed.

.. cmdoption:: --user=USERNAME, -u USERNAME

    Hub login username.

.. cmdoption:: --password=PASSWORD, -p PASSWORD

    Optional hub login password (will be requested if not provided).

.. cmdoption:: --project=PROJECT

    Hub project to deploy to.

.. cmdoption:: --projectversion=PROJECTVERSION

    Hub project version to deploy to.

.. cmdoption:: --cache=CACHE, -c CACHE

    Folder to be used for caching deployment information. Recommended to use the same one used for Local located at ``devserver\localdata\deploycache``.

.. cmdoption:: --hub=HUBURL

    Hub url, defaults to `https://hub.turbulenz.com/`.

.. cmdoption:: --ultra

    Use maximum compression, will take MUCH longer, may reduce file size by an extra 10%-20%.

-------
Example
-------

::

    deploygame -v -i apps\sampleapp\manifest.yaml -u user --project=sampleapp --projectversion=1.0 --cache devserver\localdata\deploycache
