.. index::
    single: Recommendations

.. _recommendations:

.. highlight:: javascript

Recommendations
===============

As technology and tools are updated, so too will the recommendations
for development environment.  Turbulenz aim to recommend versions of
various third party tools and services that are the most stable,
reliable and representative of the final product for development of
your projects.

Web Browser & Debugger
----------------------

The web browser is the focus point for development.  Games developed
using Turbulenz are run, debugged and profiled from the web browser.
Although performance of the browsers in release mode is relatively
consistent.  The choice for debug mode, depends on the performance of
the browser and the tools available for it.  Most JavaScript debuggers
are either integrated into the browser or add-ons.  These debuggers
allow developers to pause execution, step through code, inspect
variables and execute functions via the console.

Supported Development Platforms:
    :Windows: XP/Vista/7
    :Mac: 10.6/10.7/10.8
    :Linux: (Alpha) Ubuntu 12 (64 bit)

Turbulenz recommends for debugging in debug mode:

For canvas configurations: **Chrome with Developer Tools (built-in)**

- In canvas 3D (WebGL), Chrome offers the best performance.
- Chrome's tools also includes a heap snapshot feature for looking at memory usage.
- Alternative(s)
    :Windows: Firefox with the latest Firebug
    :Mac: Safari 5.1, 6.0 with Web Inspector (built-in)

For plugin configurations: **Firefox with Firebug**

- Firefox is recommended in debug mode. For good performance it
  requires the browsers to be configured to run plugins in-process.
  See :ref:`Running in-process <running_in_process>`.

.. NOTE::

    Performance of plugin configurations in release mode is unaffected by being in or out of process.
    This is true across all supported browsers.


Code Verification
-----------------

Ensuring accurate JavaScript code is written before runtime is an
important step when developing with JavaScript.  There are a number of
tools that are designed to inspect code and check syntax.  Turbulenz
recommends for code verification:

**TypeScript** (Described in more detail below)
    * Language extensions to JavaScript to assign static types
    * Version: Latest
    * Url: http://www.typescriptlang.org

**JSHint**
    * A fork of JSLint adapted to work well with flexible coding guidelines.
    * Version: Latest
    * Url: http://www.jshint.com/about/

**JSLint**
    * The original code quality tool written by JSON creator, Douglas Crockford.
    * Version: 2010-01-04
    * Url: http://www.jslint.com

.. NOTE::

    These tools can be run on JavaScript code in many ways:
        * Directly on the site.
        * From the command line using Node.js
        * From the command line using cscript (Windows script host)(JSHint)
        * Integrated into IDEs and editors (Both are now shipped in Komodo Edit 7)

Turbulenz engine code and some of our samples application code is
statically typed and verified by TypeScript.  All other JavaScript
code is checked with JSHint as part of an automated build.  We
recommend our developers follow similar procedures to ensure code
quality.  Throughout the Turbulenz code you may find JSLint/JSHint
directives, for example::

    /*jshint bitwise: false*/

    or

    /*global Camera: false*/

These are understood by the JSLint/JSHint processing tools and are
used to give the tool extra information.  For more information see
http://www.jslint.com/lint.html and http://www.jshint.com/docs/

Minimization and Compression
----------------------------

For JavaScript code optimization, a minimization tool is required that combines speed with accurate optimization.
Choosing an appropriate minimizer improves the workflow of developing and ensures that the code will run as expected on the Turbulenz JavaScript engine.
Turbulenz recommends for minimization:

**UglifyJS**

* Version: Latest
* Url: https://github.com/mishoo/UglifyJS

.. NOTE::

    Requires Node.js - http://nodejs.org/#download to be run from the command line.

Editor/IDE
----------

To edit JavaScript code for Turbulenz applications, there are very few
restrictions.  The choice of editor should meet your development needs
and include the features you require.  Turbulenz recommend using an
editor with a minimum of JavaScript syntax highlighting, code
verification options and external command execution.  If you are
looking for a basic editor to try, Turbulenz recommends:

**Komodo Edit**

* Version: 7
* Url: http://www.activestate.com/komodo-edit/downloads
* Includes JSHint & JSLint support.

.. _typescript_recommendation:

TypeScript
----------

From version 0.25.0 of the SDK we are gradually adopting TypeScript
(http://www.typescriptlang.org) for internal development.  TypeScript
is a set of language extensions to JavaScript for specifying type
information, which can be used by compilers to detect more programming
errors, and by IDEs to offer better code completion and other
contextual functionality.

.. NOTE::

    Developers wishing to continue using JavaScript will be able to do
    so in exactly the same way as with previous versions of the SDK.
    The runtime engine will always be available as a plain JavaScript
    library.

There are several advantages, and some disadvantages of adopting
TypeScript:

**Advantages**

* Static typing detects a much larger class of coding errors than
  linters.  This includes many problems that, with pure JavaScript,
  would only show up if and when the appropriate code path was
  executed.  As well as checking that the correct types are used in
  the appropriate places, static typing with TypeScript allows:

  * detection of errors in property and variable names, either due to
    typos or API changes
  * checks for missing / extra function parameters
  * protection of methods and properties from external access by
    declaring them *private*
  * renaming of members, properties and functions with confidence
    that all uses have also been fixed
  * easy and effective class inheritance

* Tools and IDEs can provide much better contextual help (method and
  member name completion, on-the-fly error detection, etc).

**Disadvantages**

 * Code seen in the debugger is generated code, not the original
   source.  Note that this situation is improving with *Code Maps*
   (designed specifically for showing original source while debugging
   generated code) supported by the TypeScript compiler, and a growing
   number of browsers.
 * A build step is always required after changes are made to source
   files.  With JavaScript alone, code changes are reflected
   immediately in *canvas-debug* builds.
 * Not all editing environments that support JavaScript provide the
   same level of functionality for TypeScript.
 * Some TypeScript language features introduce extra code into the
   generated output which can affect performance.  This appears to be
   limited to *variadic arguments* (which introduce copy loops at the
   top of the relevant functions) but we recommend that developers be
   vigilant and inspect the generated code, particularly while they
   first start using TypeScript.

Overall, we believe that TypeScript addresses many of the larger
problems of developing complex applications in JavaScript.  The
productivity and stability gains are worth the relatively low cost of
adoption.

.. NOTE::

    We encourage developers to try out evaluate TypeScript for their
    projects.  We will gradually be making more tools available as
    part of our technology offering to make it easy to adopt
    TypeScript for new projects and provide an easy transition path
    for existing games.

The TypeScript source code for the engine is located in the *tslib*
directory of the SDK install.  For applications that have been ported
to TypeScript, the source is located in *tsscripts* under the
application's root directory.  In general, code has been generated
into the locations one would expect to find the source files of a
JavaScript project.

A new directory *jslib-modular* contains the same engine code as
*jslib*, divided into larger modules.  Each *.js* file has an
accompanying *.d.ts* file containing the TypeScript type declarations
for that module.  Developers wishing to write their applications in
TypeScript can use these declaration files to validate their code.
Developers are also free to build their applications against the *.js*
files in this directory, or individual files in *jslib*.  The
Turbulenz samples and applications use *jslib* version of the engine.

.. NOTE::

    Turbulenz uses a modified version of the TypeScript compiler.

      https://github.com/turbulenz/typescript

    This version has some extra command line flags for controlling
    error reporting, and generates slightly cleaner JavaScript.  All
    the code and declarations provided as part of the Turbulenz SDK
    will work with the vanilla version of the compiler.
