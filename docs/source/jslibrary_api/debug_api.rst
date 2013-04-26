.. index::
    single: debug object

.. highlight:: javascript

.. _debug_api:

------------------
The `debug` Object
------------------

The `debug` object is available only in debug mode, and includes
runtime validation functionality (such as asserts) which can be
stripped from release code, and thus has no impact on the performance
of the final released version of a game.

When invoked in *plugin* or *canvas* mode, the :ref:`maketzjs tool
<maketzjs>` will remove all calls to methods on the global `debug`
object.  For example, the following code: ::

  var myFunc(arg0, arg1)
  {
    debug.assert(arg0, "arg0 must be defined");
    debug.assert('number' === typeof arg1, "arg1 must be a number");

    // ...
  }

is converted to: ::

  var myFunc(arg0, arg1)
  {
    /* debug.assert(arg0, "arg0 must be defined"); */
    /* debug.assert('number' === typeof arg1, "arg1 must be a number"); */

    // ...
  }

This will happen before any code compaction takes place.  Note that
the maketzjs tool can detect cases where a local variable `debug`
exists in function scope, so the following code will not be
transformed: ::

  var myFunc(arg0, arg1)
  {
    var debug = { assert: function () {} };
    debug.assert(arg0, "arg0 must be defined");
    debug.assert('number' === typeof arg1, "arg1 must be a number");

    // ...
  }

However, maketzjs is *unable* to detect cases where the `debug` object
or the `assert` method are cached as local variables.  Thus,
developers using this functionality should be careful to always use
the fully qualified name `debug.assert`.  Code patterns such as the
following should be avoided ::

  // Will generate an error in release mode, since debug doesn't exist
  // in global scope.

  var myFunc(arg0, arg1)
  {
    var x = debug;
    x.assert(arg0, "arg0 must be defined");
    x.assert('number' === typeof arg1, "arg1 must be a number");
  }

  var myFunc(arg0, arg1)
  {
    var a = debug.assert;
    a.call(debug, arg0, "arg0 must be defined");
    a.call(debug, 'number' === typeof arg1, "arg1 must be a number");
  }

  // In release, myAssert will be an empty function, but the final
  // code may still contain calls to it (depending on which
  // optimizers are run on the code).  This can impact performance.

  var myAssert = function(condition, msg) { debug.assert(condition, msg); };
  var myFunc(arg0, arg1)
  {
    myAssert(arg0, "arg0 must be defined");
    myAssert('number' === typeof arg1, "arg1 must be a number");
  }

The `debug` object is defined in the `jslib/debug.js` file, which is
automatically included in debug configurations, so the application
should never need to explicitly include it.  By default, in release
configurations `maketzjs` *prevents* `jslib/debug.js` from being
included, in order that code such as the above (in a form that does
not get stripped by `maketzjs`) will generate a runtime error rather
than impact performance.

See :ref:`maketzjs tool <maketzjs>` for related flags.


Methods
=======

.. index::
    pair: debug; assert

`assert`
--------

**Summary**

Throw an error to notify the developer if a given condition is not
met.  The `reportAssert` method is called to notify the developer, and
can be overloaded to control this behavior (see below).

**Syntax** ::

  var myFunc(arg0, arg1)
  {
    debug.assert(arg0, "arg0 must be defined");
    debug.assert('number' === typeof arg1, "arg1 must be a number");

    // ...
  }

.. index::
    pair: debug; reportAssert

`reportAssert`
--------------

**Summary**

This is implemented as a separate method to allow developers to change
the behaviour of asserts.  The default implementation attempts to
write a message to the log, and then throws an exception.

**Syntax**

This method is not intended to be called directly, but can be
overridden as follows.  Note the check for existence of the `debug`
global ::

  // Change assert behavior to show the alert dialog before continuing
  // with the default exception.

  if ('undefined' !== typeof debug)
  {
    debug.oldReportAssert = debug.reportAssert;
    debug.reportAssert = function debugReportAssertFn(msg)
    {
      debug.oldReportAssert(msg);
      window.alert(msg);
    }
  }
