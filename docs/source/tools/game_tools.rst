.. index::
    pair: Tools; maketzjs

.. _maketzjs:

========
maketzjs
========

-----
Usage
-----

**Syntax** ::

    maketzjs [options] <input files>

Converts a JavaScript file into a .tzjs file or .canvas.js file, with optional
compression.

-------
Options
-------

For the complete set of available options, see the output of
``maketzjs -h``.

.. program:: maketzjs

.. cmdoption:: --version

    Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output file to process.

.. cmdoption:: --templatedir=TEMPLATEDIRS, -t TEMPLATEDIRS

    Template directory (multiple allowed).

.. cmdoption:: --dependency, -M

    Output all dependencies.

.. cmdoption:: --MF=DEPENDENCYFILE

    Output all dependencies to DEPENDENCYFILE (requires -M flag).

.. cmdoption:: --mode=MODE, -m MODE

    Generate a file for use in the given run mode. Supported
    modes include: *plugin*, *canvas*.

.. cmdoption:: --hybrid

    Start up a plugin as well as a canvas-based TurbulenzEngine.
    The plugin will be available as TurbulenzEnginePlugin. Available
    only for *canvas* mode.

.. cmdoption:: --yui=YUI, -y YUI

    Path to the YUI compressor, setting this enables the compactor

.. cmdoption:: --closure=CLOSURE, -c CLOSURE

    Path to the Closure compiler, setting this enables the compactor

.. cmdoption:: --uglifyjs=UGLIFYJS, -u UGLIFYJS

    Path to the UglifyJS application, setting this enables the compactor

.. cmdoption:: --ignore-input-extension

    Allow input files with an extension other than .js

.. cmdoption:: --line-break=LENGTH, -l LENGTH

    Split line length.

.. cmdoption::  --use-strict

    Enforce "use strict"; statement.
    This adds a single "use strict"; line at the top of the JavaScript code.

.. cmdoption::  --include-use-strict

    Don't strip out "use strict"; statements.
    By default all "use strict"; statements are removed from the output file.

.. cmdoption:: --no-strip-debug

    Don't strip out calls to methods on the `debug` object and disable
    static removal of branches based on the `debug` variable.  Also,
    allow code to include `jslib/debug.js` (this option is set by
    default since this tool is only called in release modes, so it is
    only useful for developers wishing to disable this behavior in
    release configurations).

.. cmdoption:: --strip-namespace

    Any variable names specified with this flag will have all their
    method calls stripped from the resulting code.  The `debug` object
    is stripped by default for both *plugin* and *canvas* modes.  This
    corresponds to the --namespace flag on the
    :ref:`strip-debug tool <stripdebug>`.

.. cmdoption:: --strip-var

    Any variable names specified with this flag will be statically
    evaluated as `true`, and simple `if` statements based on them will
    have the appropriate branches stripped from the resulting code.
    This corresponds to the `-D` flag on the
    :ref:`strip-debug tool <stripdebug>`.  By
    default, the variable `debug` is statically set to `true` unless
    `--no-strip-debug` is specified.

.. cmdoption::  --profile

    Enable the collection and output of profiling information

Any unrecognized options are assumed to be the names of input files.
These are specified relative to one of the TEMPLATEDIRS paths given
using the ``-t`` option.

For more information on templating see :ref:`Templating JavaScript
Applications <templating>`.

-------
Example
-------

::

    cd C:\Turbulenz\SDK\X.X.X\apps\sampleapp
    maketzjs --mode plugin -t templates -t . -y yuicompressor-X.X.X.jar -o sampleapp.tzjs sampleapp.js

When only generating dependencies:

::

    maketzjs --mode plugin -M --MF build/sampleapp.dep -t templates -t . -o sampleapp.tzjs sampleapp.js

Here ``X.X.X`` is the version of the SDK and
``yuicompressor-X.X.X.jar`` the path to the YUI compressor.

.. NOTE::

    When generating dependencies, this tool will output the
    dependencies required to build the target output, in the form::

        <target-file> <dependency-file> : <source file> <source file> ...

    The source files listed are those which, when changed, should
    trigger a rebuild of the target-file.

    If one of these files is missing, the tool will fail to produce
    the output file, listing the first dependency it failed to find
    returning an error.

.. NOTE::

    Use of tools such as *YUI compressor* or *UglifyJS* for
    compression is optional, but recommended.  It is worth measuring
    the effect the different tools have.  Note that *YUI Compressor*
    requires both YUI and Java installed and configured on your
    machine.

.. index::
    pair: Tools; stripdebug

.. _stripdebug:

===========
strip-debug
===========

This tool performs the removal of debug code in release builds.  It
will usually be invoked by maketzjs, so most developers will not need
to call it directly.  However, developers with custom code builds, in
particular where code is pre-processed before being passed to
:ref:`maketzjs <maketzjs>`, may wish to invoke this to ensure that
debug code does not appear in release versions of their games.

The tool can only recognise "fully qualified" calls, as described in
the :ref:`debug api <debug_api>`.

:0.25.0:

Since SDK 0.25.0 this tool also supports removing if-else clauses that
can be statically resolved based on user-specified variable names.
The condition part of the if-else clauses may only contain direct
references to special identifiers (specified with the -D flag), and
the unary *!* operator.  For example ::

  if (debug)
  {
    console.log("this will only be called in debug builds");
  }

  if (!debug)
  {
    console.log("this will only be called in release builds");
  }
  else
  {
    console.log("this will only be called in debug builds");
  }

-----
Usage
-----

**Syntax** ::

    strip-debug [<options>] [<infile>]

Reads from stdin, or *infile* and removes all calls to methods on a
global object (the ``debug`` object by default).  If no output file is
specified, output is written to stdout.

-------
Options
-------

Run ``strip-debug -h`` for a complete list of all options.

.. program:: strip-debug
.. cmdoption:: -h, --help

    Help text for the tool

.. cmdoption:: -o <outfile>

    Write the stripped code the given destination

.. cmdoption:: --ignore-errors

    By default, the tool will halt execution with an error if there
    are syntax errors in the code.  This flag overrides that behavior
    allowing a build to continue even if a syntax error is found.
    Note that since it is impossible to parse and reliably remove
    calls from code with syntax errors, the tool will simply copy the
    input file verbatim to the output.

.. cmdoption:: --namespace <name.space>

    Set the name of the object or namespace for which method calls
    should be stripped.  By default this is just ``debug``, but could
    refer to any object that is accessible via global scope.
    e.g. ``mystudio.utilities.debug``.

.. cmdoption:: -D<variable>[=false]

    Instructs the tool to assume that *<variable>* is true (or false
    if the *=false* suffix is given) everywhere, and remove the appropriate
    parts of if-else clauses.

    *Added in SDK 0.25.0*

.. index::
    pair: Tools; makehtml

.. _makehtml:

========
makehtml
========

-----
Usage
-----

**Syntax** ::

    makehtml [options] <.js input> [.html input]

Converts a .js file and, optionally, some HTML template code into a
full HTML page that can be used to load and run code built with the
*maketzjs* tool.

-------
Options
-------

.. program:: makehtml

.. cmdoption:: --version

    Show version number and exit.

.. cmdoption:: --help, -h

    Show help message and exit.

.. cmdoption:: --verbose, -v

    Verbose output.

.. cmdoption:: --silent, -s

    Silent running.

.. cmdoption:: --output=OUTPUT, -o OUTPUT

    Output file to process.

.. cmdoption:: --templatedir=TEMPLATEDIRS, -t TEMPLATEDIRS

    Template directory (multiple allowed).

.. cmdoption:: --dependency, -M

    Output all dependencies.

.. cmdoption:: --MF=DEPENDENCYFILE

    Output all dependencies to DEPENDENCYFILE (requires -M flag).

.. cmdoption:: --mode=MODE, -m MODE

    Generate an HTML page for use in the given run mode. Supported
    modes include: *plugin*, *canvas*, *plugin-debug*, *canvas-debug*.

.. cmdoption:: --hybrid

    Start up a plugin as well as a canvas-based TurbulenzEngine.
    The plugin will be available as TurbulenzEnginePlugin. Available
    only for *canvas*, *canvas-debug* modes.

.. cmdoption:: --code=CODEFILE, -C CODEFILE

    Generate an HTML page that loads and runs the code in *CODEFILE*
    (which is not required to exist when this tool is run).
    The HTML code will reference *CODEFILE* with a relative
    path from *OUTPUT* (see the *-o* option).

.. cmdoption:: --dump-default-template, -D

    Write the default template to the *OUTPUT* file. This is intended
    as a basis for creating custom HTML pages. In general, it is not
    expected that this will be necessary.

.. cmdoption::  --use-strict

    Enforce "use strict"; statement.
    This adds a single "use strict"; line at the top of the JavaScript code.

.. cmdoption::  --include-use-strict

    Don't strip out "use strict"; statements.
    By default all "use strict"; statements are removed from the output file.

.. cmdoption::  --profile

    Enable the collection and output of profiling information

To generate an HTML game page, you must provide at least input
JavaScript code and an output file. For some configurations (namely
*plugin* and *canvas*), the final location of code built with
*maketzjs* will also be required. Input files with the *html*
extension are assumed to be templates which can either extend or
override the default template.

Input files are given relative to a templates directory.

For more information on templating see :ref:`Templating JavaScript Applications <templating>`.

-------
Example
-------

::

    cd C:\Turbulenz\SDK\X.X.X\apps\sampleapp

    makehtml --mode plugin -t templates -t . --code sampleapp.tzjs -o sampleapp.release.html sampleapp.js sampleapp.html

    makehtml --mode canvas-debug -t templates -t . --code sampleapp.canvas.js -o sampleapp.canvas.debug.html sampleapp.js sampleapp.html

When generating dependencies:

::

    makehtml --mode plugin -t templates -t . -M --MF build/sampleapp.dep -o sampleapp.release.html sampleapp.js sampleapp.html
