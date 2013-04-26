.. index::
    pair: Tools; cgfx2json

.. _cgfx2json:

=========
cgfx2json
=========

-----
Usage
-----

**Syntax** ::

    cgfx2json [options]

Converts a CgFX file into a JSON file.

Shader parameter semantics are ignored, parameters will be matched at
runtime by the variable name.

It is recommended that the CgFX file compiles program code either to
GLSL profiles or to `latest`, the later is required if assembly
programs are requested.

For more information about the CgFX file format please read the
`NVidia tutorial
<http://http.developer.nvidia.com/CgTutorial/cg_tutorial_appendix_c.html>`_.

For more information about JSON please visit `json.org
<http://json.org/>`_.

-------
Options
-------

.. program:: cgfx2json

.. cmdoption:: --version

   Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --asm, -a

    Generate assembly programs instead of GLSL shaders.

.. cmdoption:: --json_indent=SIZE, -j SIZE

    JSON output pretty printing indent size, defaults to 0.

.. cmdoption:: --input=INPUT, -i INPUT

    Input file to process.

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output file to process.

.. cmdoption:: -M

    Output dependencies.

.. cmdoption:: -MF FILE

    Dependencies output to FILE.

In order to convert a CgFX file to a JSON file you must provide both
the input and the output.

-------
Example
-------

::

    "tools/bin/*PLATFORM*/cgfx2json" -v -j 2 -i assets/shaders/standard.cgfx -o apps/sampleapp/shaders/standard.cgfx.json
