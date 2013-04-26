.. index::
    pair: Tools; exportevents

.. _exportevents:

============
exportevents
============

-----
Usage
-----

**Syntax** ::

    exportevents [options] project


Export event logs and anonymised user information of a game.

-------
Options
-------

.. program:: exportevents

.. cmdoption:: --version

   Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --user=USER, -u USER

    Hub login username (will be requested if not provided).

.. cmdoption:: --password=PASSWORD, -p PASSWORD

    Hub login password (will be requested if not provided).

.. cmdoption:: --type=DATATYPE, -t DATATYPE

    The type of data to download, either events or users (defaults to events).

.. cmdoption:: --daterange=DATERANGE, -d DATERANGE

    Individual 'yyyy-mm-dd' or range 'yyyy-mm-dd : yyyy-mm-dd' of dates to get the data for (defaults to today).
    This range gets clamped from when the project was created to today.

.. cmdoption:: --outputdir=OUTPUTDIR, -o OUTPUTDIR

    Folder to output the downloaded files to (defaults to the current directory).

.. cmdoption:: --overwrite, -w

    If a file to be downloaded exists in the output directory, overwrite instead of skipping it.

.. cmdoption:: --indent

    Apply indentation to the JSON output.

.. cmdoption:: --hub=HUBURL

    Hub url, defaults to `https://hub.turbulenz.com/`.

-------
Example
-------

::

    exportevents sampleapp -v -o sampleapp\events

When exporting user information:

::

    exportevents sampleapp -v -o sampleapp\users -t users

.. NOTE::

    When exporting user information, the date range specified returns only the users acquired (i.e. who first played the
    game) during that time period.

.. NOTE::

    Entries in the downloaded user information may contain an additional `isTurbulenz` or `isDeveloper` flag.
    The `isTurbulenz` flag will be set for anyone who is a Turbulenz employee.
    The `isDeveloper` flag will be set for anyone listed as a game team member via the project :ref:`Edit tab <hub_edit_project_metadata>` on the Hub.
