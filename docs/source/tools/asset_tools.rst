.. index::
    pair: Tools; dae2json

.. _dae2json:

========
dae2json
========

-----
Usage
-----

**Syntax** ::

    dae2json [options] -i source.dae -o target.json

Convert Collada (.dae) files into a Turbulenz JSON asset.
dae2json is based on the Collada specification `<http://www.khronos.org/files/collada_spec_1_5.pdf>`_.

The engine uses Y up convention.  There is some support for conversion from X and Z up but modeling with Y up is recommended.

-------
Options
-------

This tools uses the `Standard Asset Tool Options`_.

**Added SDK 0.25.0**

.. cmdoption:: --nvtristrip=NVTRISTRIP

    Path to NvTriStripper, setting this enables vertex cache optimizations.

-------
Example
-------

::

    dae2json -v -m -i assets/models/duck.dae -o apps/sampleapp/models/duck.dae.json

.. index::
    pair: Tools; material2json

=============
material2json
=============

-----
Usage
-----

**Syntax** ::

    material2json [options] -i source.materials -o target.json

Convert Material Yaml (.material) files into a Turbulenz JSON asset.

-------
Options
-------

This tools uses the `Standard Asset Tool Options`_.

-------
Example
-------

::

    material2json -v -m -i assets/materials/defaults.material -o apps/sampleapp/materials/materials.json

.. index::
    pair: Tools; effect2json

===========
effect2json
===========

-----
Usage
-----

**Syntax** ::

    effect2json [options] -i source.effects -o target.json

Convert Effect Yaml (.effect) files into a Turbulenz JSON asset.

-------
Options
-------

This tools uses the `Standard Asset Tool Options`_.

-------
Example
-------

::

    effect2json -v -m -i assets/effects/defaults.effect -o apps/sampleapp/effects/effects.json


.. _bmfont2json:

.. index::
    pair: Tools; bmfont2json

===========
bmfont2json
===========

-----
Usage
-----

**Syntax** ::

    bmfont2json [options] -i source.fnt -o target.json

Convert `Bitmap Font Generator
<http://www.angelcode.com/products/bmfont/>`_ data (.fnt) files into a
Turbulenz JSON asset.  Only text `.fnt` files are supported.

-------
Options
-------

.. cmdoption:: --version

   Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running

.. cmdoption:: --metrics, -m

    Output asset metrics

.. cmdoption:: --log=OUTPUT_LOG

    Write to log file

------------------------
Asset Generation Options
------------------------

.. cmdoption:: --json_indent=SIZE, -j SIZE

    JSON output pretty printing indent size, defaults to 0.

----------------------
Asset Location Options
----------------------

.. cmdoption:: --prefix=URL, -p URL

    Texture URL to prefix to all texture references.

.. cmdoption:: --assets=PATH, -a PATH

    PATH of the asset root.

------------
File Options
------------

.. cmdoption:: --input=INPUT, -i INPUT

    Input file to process.

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output file to process.

-------
Example
-------

::

    bmfont2json -v -i assets/fonts/opensans.fnt -o apps/sampleapp/fonts/opensans.json

.. _maptool:

=======
maptool
=======

-----
Usage
-----

**Syntax** ::

    maptool [options] basemap.json

Adds profile entries to the overrides section of mapping table
``basemap.json`` and write the output to a file or stdout.  See
:ref:`mappingtable` for further details.

-------
Options
-------

.. cmdoption:: -o <outfile>

    (optional)  Write to a file (instead of stdout)

.. cmdoption:: --profile <name>,<maptable.json>[,parent]

    Add the table in ``maptable.json`` as a profile called ``name`` to
    the overrides section of ``basefile.json``.  The profile must not
    already exist in ``basefile.json``.  If ``parent`` is specified,
    the profile is specified as inheriting from the profile of that
    name.  The parent profile must already exist in ``basefile.json``
    or be added in the same invocation.  This option can be used
    multiple times in the same invocation.

===========================
Standard Asset Tool Options
===========================

.. program::
    dae2json
    material2json
    effect2json
    bmfont2json

-------
Options
-------

.. cmdoption:: --version

   Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running

.. cmdoption:: --metrics, -m

    Output asset metrics

.. cmdoption:: --log=OUTPUT_LOG

    Write to log file

------------------------
Asset Generation Options
------------------------

.. cmdoption:: --json_indent=SIZE, -j SIZE

    JSON output pretty printing indent size, defaults to 0.

.. cmdoption:: --keep-unused-images

    Keep images with no references to them.

.. cmdoption:: --include-type=TYPE, -I TYPE

    Only include objects of class TYPE in export.

.. cmdoption:: --exclude-type=TYPE, -E TYPE

    Exclude objects of class TYPE from export.

.. NOTE::

    Classes currently supported for include and exclude: geometries, nodes, animations, images, effects, materials, lights, physicsmaterials, physicsmodels and physicsnodes.

.. WARNING::

    Using these options can create incomplete assets which require fixup at runtime.

----------------------
Asset Location Options
----------------------

.. cmdoption:: --url=URL, -u URL

    Asset URL to prefix to all asset references

.. cmdoption:: --assets=PATH, -a PATH

    PATH of the asset root.

.. cmdoption:: --definitions=JSON_FILE, -d JSON_FILE

    definition JSON_FILE to include in build, this option can be used repeatedly for multiple files

------------
File Options
------------

.. cmdoption:: --input=INPUT, -i INPUT

    Input file to process.

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output file to process.
