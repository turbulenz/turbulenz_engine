.. index::
    pair: JavaScript; Development

.. highlight:: javascript

.. _javascript_development:

============================
JavaScript Development Guide
============================

------------
Introduction
------------

This guide is designed to educate developers with a basic
understanding of aspects of JavaScript such as closures, dynamic types
and prototypes, how to design and write efficient JavaScript code that
uses Turbulenz technology to create high-performance games that run
online. The guide encourages you to utilize some simple conventions
that could improve the performance of your JavaScript code.

If you are already familiar with JavaScript, it is recommended you
still review the Turbulenz JavaScript conventions and validation
sections to compare Turbulenz' methodology with your own.

-----------
Terminology
-----------

Listed below are a few definitions of the terminology used in this
guide:

Web Browser & JavaScript Technology
-----------------------------------

JavaScript Engine

    The JavaScript engine reads the JavaScript source code and
    executes the behavior defined in the source. There are several
    JavaScript engines, and web browsers each use a different one.
    Examples include SpiderMonkey (used by Mozilla Firefox), V8 (used
    by Google Chrome) and JavaScriptCore (used by Apple Safari).  The
    performance of JavaScript code can vary between engines and
    browsers, although this can be addressed by using the JavaScript
    engine available as part of the browser extensions plugin.  This
    is an engine chosen to have performance characteristics most
    suitable for game applications.

Document Object Model (DOM)

    The Document Object Model or `DOM` is a convention a browser uses
    to represent objects from HTML, XHTML and XML documents.  The DOM
    presents a method of interacting and manipulating a web page to
    dynamically modify elements.  The DOM implementation depends on
    the brower's engine. When using Turbulenz technology, including
    when running code in the embedded JavaScript engine, game code can
    access the DOM through the JavaScript interface provided by the
    browser.  This allows the game and the Turbulenz engine to
    interact with the web page and vice-versa.  Applications of this
    include displaying statistics and adding HTML input and controls
    to aid development.

JavaScript Debugger

    The JavaScript Debugger refers to the functionality provided by
    the browser to debug scripts running in the JavaScript engine.
    Common functionality includes the ability to set breakpoints, step
    through code, view variables, view the call stack, etc.  At the
    time of writing, Safari and Chrome both use WebKit's `Web
    Inspector`, Firefox uses the well-established add-on `Firebug` and
    Opera uses its own `Opera Dragonfly`. JavaScript debuggers form
    the basis for testing, profiling and optimizing code written using
    the Turbulenz Game Engine.

JSLint

    JSLint is a static code analysis tool used to verify that
    JavaScript code complies with a set of coding rules. The tool and
    coding rules, written by Douglas Crockford, are outlined at
    `http://www.jslint.com/lint.html
    <http://www.jslint.com/lint.html>`_. Turbulenz recommends the use
    of JSLint to ensure the quality of JavaScript code and catch a
    certain class of errors before runtime. The tool can be run on
    JavaScript source as well as HTML source and JSON text.

JavaScript Object Notation (JSON)

    `JavaScript Object Notation <http://www.json.org/>`_ is a
    LIGHTWEIGHT DATA-interchange format. It is human-readable but also
    well suited to parsing and procedural generation. It is based on a
    subset of the JavaScript Programming Language, Standard ECMA-262
    3rd Edition - December 1999.  JSON is a text format that is
    completely language independent but uses conventions that are
    familiar to programmers of the C-family of languages, including C,
    C++, C#, Java, JavaScript, Perl, Python, and many others.
    Turbulenz Technology uses the JSON format to convert and transfer
    assets such as geometry and shaders.

Turbulenz SDK
-------------

The Turbulenz Software Development Kit or SDK refers to the package of
the Turbulenz Game Engine, tools, samples, tests, development guides,
metrics, development server and documentation that enables the
development of games using Turbulenz Technology.

Turbulenz Game Engine

    The Turbulenz Game Engine refers to the complete package of:
    JavaScript APIs, Native Libraries and Embedded JavaScript engine
    provided by the Turbulenz Native Engine.  The Turbulenz Game
    Engine provides developers with the tools to build games that run
    on a range of web browsers and different hardware platforms.

Samples

    Samples refers to the set of example code that demonstrates the
    use of the Turbulenz Game Engine APIs.  Samples come in several
    forms, corresponding to some subset of the build modes explained
    :ref:`here <getting_started_build_modes>`. The *debug* versions
    contain all the JavaScript and HTML code required to run the
    sample in a web browser using the Turbulenz Engine. The 'release'
    versions are an optimized, compressed and secure version of the
    JavaScript code.  In *plugin* mode, that is run in the Embedded
    JavaScript engine.

JavaScript Benchmark

    The JavaScript Benchmark refers to Turbulenz' framework for
    testing JavaScript performance on different JavaScript engines and
    platforms.  The benchmark is run in a similar way to the samples
    and executes a set of predefined benchmark tests to determine the
    performance of the target system. The resulting score can be used
    to compare different browsers and systems.  The JavaScript
    Benchmark is one of several tools providing metrics for
    development.

Tools

    The Tools refer to the collection of standalone tools that perform
    operations such as processing and conversion of assets,
    compression of data and optimization of JavaScript source code.

Local Development Server

    The *local development server* or *local server* allows developers
    to test their games in a local environment during development.
    Once a game has been created using the Turbulenz Technology,
    developers can host and test their game before uploading to the
    Turbulenz servers.

Turbulenz Game Engine
---------------------

The Turbulenz Game Engine is a series of JavaScript libraries that
allow game developers to deliver graphically rich 3D online games to a
range of platforms.  The basis for the engine is a series of
JavaScript interfaces that provide access to native platform features
and hardware acceleration.

Device APIs

    The Device APIs refer to the interfaces providing access to native
    high performance functionality including Graphics, Sound and
    Input.  Turbulenz provides an implementation of these interfaces
    that leverages functionality built in to the browser (such as
    WebGL and HTML5) where available.  Another implementation makes
    use of a binary browser plugin that provides all the required
    native features.  This set of browser extensions ensure that the
    engine will run on a larger range of browsers and end-user
    machines, even if the browser does not support all required HTML5
    functionality.

    The functionality built into browsers and the range of browsers
    supporting standard APIs such as WebGL is expanding all the time.
    Games built with the Turbulenz engine can use the current
    extensions to address a wider audience of end-users until more
    browsers support all functionality required by modern games.

JavaScript APIs

    The term *JavaScript APIs* refers to the game engine functionality
    written in JavaScript. The JavaScript code will execute in any
    JavaScript engine in which the *Device APIs* are available.
    Through these low level interfaces, the *JavaScript APIs* give
    developers easy-to-use access to the graphics, sound and other
    processing capabilities of the underlying hardware.

TurbulenzEngine Object

    The ``TurbulenzEngine`` object is the main interface and entry
    point to the Turbulenz functionality at the *Device API* level.
    The API provided by this object is consistent whether using
    built-in browser functionality or features provided by the browser
    extensions provided by Turbulenz.

Turbulenz Native Engine

    The Turbulenz Native Engine or `engine` refers to an
    implementation of the *Device APIs* that rely on the binary
    browser plugin.  The plugin is intentionally very small,
    containing just enough code to provide JavaScript with access to
    the required native functionality.  This make it unobtrusive to
    download and install for the end-user.

    Web standards such as HTML5 and WebGL are evolving and improving
    all the time to include much of the functionality provided by the
    plugin.  However, such standards are often not supported across
    all browsers and even where supported the quality of
    implementations can vary greatly.  Using the extensions provided
    by the plugin ensure that games can run on a wider range of
    browsers, and platforms.  Some games may require functionality for
    which standard APIs do not exist (Physics simulation and
    multi-buffer rendering being two current examples).  In these
    cases, the plugin provides a way to deploy such games to the web
    even before standards have sufficiently evolved.

Embedded JavaScript Engine

    The Embedded JavaScript engine refers to the JavaScript engine
    provided as part of the native browser extensions, used to execute
    the *plugin* build of the JavaScript code.  It is designed to
    bring a secure and stable execution environment to the range of
    compatible web browsers, with performance characteristics suitable
    for games.

------
Basics
------


Common Techniques
-----------------

The JavaScript language is already familiar to web developers, having
become the standard way to interact with the functionality of the
browser and in-turn the wider web.  It is being used for increasingly
larger and more complex applications.  There are a handful of common
techniques that are crucial to writing concise JavaScript code.

**Arrays and Access**

Arrays are a common concept and are usually associated with quick
access and referencing by index. In JavaScript, arrays are implemented
as an object with some interesting properties.  These properties are
slightly different from some interpretations of arrays, but with an
understanding of the functionality can provide some useful behavior.

Consider the following array literals::

    var list1 = [];
    var list2 = [ 100, 200, 300, 400, 500, 600 ];

    var list1Value = list1[4]; // undefined
    var list2Value = list2[4]; // 500

Common behavior in some languages such as C/C++ for accessing an index
outside of the array would be some kind of 'array out of bounds'
exception or access to memory beyond the end of that array.  In
JavaScript `undefined` is the returned result in this case. At this
point, the `length` property of the arrays has the following values::

    var list1Length = list1.length; // 0
    var list2Length = list2.length; // 6

If we were to set the value at an `out of bounds` index, subsequently
accessing the length property exhibits some interesting behavior::

    list1[4] = 100;

    list1Length = list1.length; // 5

`length` of the array is now **one more than the index of the last
item**, not the number of items in the array. This allows us to use
the following property to add items to the end of the array::

    list1[list1.length] = 200;

This is the same as using `list1.push(200)`, but `array[array.length]
= value` is generally considered quicker.  Another interesting
property of `length` is the ability to use it to set the size of an
array::

    list1Value = list1[4];  // 100, (The value we previous assigned)

    list1.length = 0;       // The length of the array is now 0

    list1Value = list1[4];  // undefined

We can use this property to clear arrays without having to iterate
over each item in the array.

**Dictionaries and Lookups**

Most languages provide a mechanism for storing data as a (key, value)
pair in order to find the data using the key as a reference.  One
common method in JavaScript is to use an object and assign the value
to a property of that object or 'key'::

    var collectionOfValues = {
        key0 : value0,
        key1 : value1,
        key2 : value2
    };

One advantage of using this method is that the value can be any type:
a number, an object literal, a string literal or even a function::

    var lookupData = {
        key0 : null,    // Key exists, no data exists
        key1 : 5,       // Key exists, data is value '5'
        key2 : {        // Key exists, data exists as an object
            dataName : "DataStream1",
            hash : "423-FA64B248",
            data : [125, 345, 872, 234, 233, 734, 123, 45]
        }
    };

Pairs of keys and values can be added using the following syntax::

    var keyString = getKeyName();

    lookupData["key3"] = 7;         // String known before runtime
    lookupData.key4 = 8;            // String known before runtime

    lookupData[keyString] = 2;      // String retrieved during runtime

You might expect that we could `lookup` the data using the following
method::

    var data;

    if (lookupData.key5 !== null)
    {
        data = lookupData.key5;
        useDataFn(data);
    }

However, similar to accessing indices of arrays that have no value,
accessing non-existent properties on objects returns `undefined`.  In
this case `key5` doesn't exist in our lookupData and hence will return
`undefined` and `data` will be set to `undefined`.  Another problem
with the above method is that we have made two accesses to lookupData,
instead of one.  In JavaScript the following values evaluate to
`false` or so-called *falsy values*:

==================  =========  ==================================
Value               Type       Type Test (Is true)
==================  =========  ==================================
0                   Number     (typeof 0 === 'number')
NaN (Not a number)  Number     (typeof NaN === 'number')
'' (empty string)   String     (typeof ''  === 'string')
false               Boolean    (typeof false === 'boolean')
null                Object     (typeof null  === 'object')
undefined           Undefined  (typeof undefined === 'undefined')
==================  =========  ==================================

We can take advantage of this fact when we perform `lookups`. The
preferred method of attempting a `lookup` is::

    var data = lookupData.key5;
    if (data)
    {
        // Value exists, (is not false)
        useDataFn(data);
    }

Using this method allows us to quickly test the `key5` key without
having to check if it exists as a property of lookupData.  If we want
to provide some more substantial type checking we might write the
following::

    var data = lookupData.key5;
    if (data === undefined)
    {
        // No key exists
    }
    else if (data === null)
    {
        // Key exists, no value exists
    }
    else if ( typeof data === 'number' )
    {
        // Key exists, value is a number
        useNumberDataFn(data);
    }
    else if ( typeof data === 'object')
    {
        // Key exists, value is an object
        useObjectDataFn(data);
    }

Using typeof to check the data type is not recommended, especially
when considering performance. If your lookup statements start to look
like this consider if there is another way to the access the data that
requires fewer typeof tests or no tests at all.

**Object Literals and Functions as Arguments**

In JavaScript, functions and object literals can be placed anywhere
that expressions are typically used. One example of this is as
arguments to a function. For example::

    var results = [];
    var name = "resultName";

    // Parameters passed as an object literal.
    // Useful because it ensures the parameter names are explicit
    // and allows additional parameters to be passed without the
    // need to modify the function prototype.
    funcThatRequiresParams({
        paramVar0 : 10,
        paramVar1 : "String",
        paramVar2 : [10, 30, 20]
    });

    // Callback function is defined inline as an argument to the function.
    // Useful because it keeps the callback with the function invocation and makes
    // the callback easy to read.
    funcThatRequiresCallback(arg0, arg1, function (array) {
        var i, item;
        var length = array.length;

        for (i = 0; i < length; i += 1)
        {
            item = array[i]
            if (item.name === name)
            {
                results[results.length] = item.result;
            }
        }
    });

**Calling Functions That Access Properties**

It is quite common to call a function that belongs to an object and
hence operates on other properties of that same object. We can access
variables, constants and other functions in this way::

    var object = {
        offset : 5,
        getPosition : function getPositionFn(startPosition)
        {
            return (startPosition + this.offset);
        }
    };

    var objectPosition = object.getPosition(2); // Result: 7

This technique relies on the function being able to access `this` when
invoked. The method breaks down when the function is assigned to a
variable and is called from a context where `this` refers to something
other than the object in question. To overcome this problem we can use
the `call` convention::

    var length = 20;
    var positions = [];

    // var getPosition references the function on object
    var getPosition = object.getPosition;

    for (var i = 0; i < length; i += 1)
    {
        positions[i] = getPosition.call(object, i);
    }

When we use `call` we pass the object on which to apply the function
call.  In this last example we assign the variable `getPosition`
outside of the lop save the cost of repeatedly looking it up.  This is
further explained in the performance section.

**Closures**

Closures are commonly used to maintain the scope of variables and
parameters in a function. One use of closures is to provide variables
for functions instead of passing parameters at time of invocation. In
this example, the functions we are creating will be invoked by another
section of the code (possibly in another library). We pass an initial
variable to a function that stores it in scope, then returns a pair of
functions that can access that scope.

::

    // When creating the function we pass the arguments required for
    // this function.
    var invoke = function createInvocableFn(initValue) {
        // The scope of this variable will remain after the createInvocableFn
        // has returned
        var value = initValue;

        // We return functions that can access value
        return {
            increment : function(inc) {
                value += typeof inc === 'number' ? inc : 1;
            },
            getValue : function() {
                return value;
            }
        };
    }(5); // We invoke createInvocableFn immediately with initial value '5'

    // We can now call invoke functions without referencing the initial value
    var result = invoke.getValue(); // '5'

    invoke.increment(2);

    result = invoke.getValue(); // '7'

.. NOTE::

    Be wary of creating new functions in a loop, which is often
    unnecessarily expensive. JSLint will flag this during validation,
    by default. Ask yourself is there a way you can construct the
    function before the loop and assign it during the loop instead?

    If you must pass unique values while iterating over a group of
    objects, can you store the values in a way that they are still
    accessible from the function.

.. NOTE::

    Remember to name your functions to avoid anonymous functions in
    the profiler.


Turbulenz Conventions
---------------------

Turbulenz source code follows a number of conventions promoting
consistent JavaScript. This section covers how Turbulenz source is
constructed for the purpose of writing JavaScript code in a similar
style.

**Whitespace and Indentation**

Turbulenz source code follows whitespace and indentation conventions
similar to those defined in the book - `JavaScript: The Good Parts`.

* Use 4 spaces instead of \\t for indenting
* No space between function names and ()
* Single space for `if`, `for`, `while` statements

One exception is:

* 'C' style indentation for {} brackets

::

    if (x === 1)
    {
        functionName();
    }

.. NOTE::

    One common mistake is to forget to add the keyword `function` when
    declaring functions. This can cause a declaration to be
    interpreted as an invocation.  JavaScript will attempt to insert a
    semicolon at the end of the line. See semicolon insertion in
    JavaScript: The Good Parts.

An example of the result of semicolon insertion::

    var name = /* No 'function' keyword */ nameFn() // <-Semicolon inserted here
    // causes nameFn() invocation
    {
        //...
        // Implementation goes here
        //...
    }

This function is evaluated to `var name = nameFn();`. This statement
is now a function invocation, instead of a function assignment!

**Incrementing & Decrementing**

Although JavaScript does allow ++ and -- operators both as prefix and
postfix, Turbulenz opt to avoid using them.  Using `value += 1` and
`value -= 1` are the preferred methods of incrementing and
decrementing, which, when you see a Turbulenz `for` loop, becomes
quite apparent.  The small performance gains associated with the
appropriate use of operations such as `++value` are not considered as
important as writing legible and safe code, which is the reason that
they are not used in Turbulenz libraries.

**Naming**

Turbulenz source uses meaningful identifiers and medial capitalization
(camel case), where appropriate, for variables and functions::

    var camera = findCamera();

If a function is declared and assigned to a variable, the function
name is post-fixed with `Fn`::

    var functionName = function functionNameFn()
    {
        //...
        // Implementation goes here
        //...
    };

This is to ensure the function has a name. Functions without explicit
names appear as `Anonymous` in JavaScript profilers and can be
difficult to identify.

**Function Structure**

When constructing functions, variables are declared at the top of the
function, followed by helper functions (used only in this function),
then the implementation of the function itself::

    function basicFn(arg0)
    {
        var results = [];              // Creates a new array to use in this function
        var array = this.array;        // Assigns the property array of 'this' to a local variable
        var i;
        var length = array.length;     // Sets the value of length for the duration of the function
        var value = 0;


        function comparisonFn(a, b)    // Declare the helper function used in the function
        {
            if (a > b)
            {
                return ((a > arg0) ? a : arg0);
            }
            else
            {
                return ((b > arg0) ? b : arg0);
            }
        }

        for (i = 0; i < length; i += 1) // The implementation of the function
        {
            value = comparisonFn(array[i], value);
            results[i] = value;
        }

        return results;                 // Return the results
    }

**Object Creation**

Turbulenz Libraries adopt the following method of creating
`objects`. This method of creation is similar to
constructing/destructing `classes` in other languages.  Comments
describing the reasons for this structure of an `object` class are
marked using block comments. Line comments are used where comments are
normally found in this code::

    //
    //  Object: A description of the object.
    //
    function Object() {}
    Object.prototype =
    {
        /*
        * The version of the Object class, used if versioning of the
        * functionality is important
        */
        version : 1,

        /*
        * These are constants that are common to all created objects
        */
        prototypeConstant : 2.71828183,

        /*
        * Constants in the prototype can also be defined as object literals.
        * This example is similar to enumerations in C/C++
        */
        prototypeTypes :
        {
            type0 : 100,
            type1 : 200,
            type2 : 300
        },

        /*
        * Each function has a `functionName` and is declared as a function with
        * `functionNameFn` as the name.
        */
        functionName : function functionNameFn(type)
        {
            /*
            * Variables and constants, that exist as properties of an object
            * are usually assigned to local variables at the start of the
            * function, if used more than once. This is to avoid multiple
            * accesses of a property, especially if the variable/constant
            * is only read during the function call.
            */
            var e = this.prototypeConstant;
            if (type === this.prototypeTypes.type0)
            {
                return (e * e) + (e * 2) + e;
            }
            return 0;
        }
    }

    // Constructor function
    Object.create = function objectCreateFn(params)
    {
        var o = new Object();

        if (params.arg0) // Only assigned if specified as a parameter
        {
            o.arg0 = params.arg0;
        }

        o.array = [];
        o.object = {};

        return o;
    }

To create a new object, invoke the `constructor` using the following code::

    // If params is used multiple times for construction of objects
    var params =
    {
        arg0 : "argument0",
        arg1 : [50, 100, 150]
    };

    var newObject = Object.create(params);

OR::

    // If params are only referenced once
    var newObject = Object.create({
        arg0 : "argument0",
        arg1 : [50, 100, 150]
    });

**Destructing Objects**

To destroy an object created in this manner, simply set **all**
references to `null`. For example::

    newObject = null;

This is usually enough to allow the garbage collector to destroy the
object.  To remove a property on an object you can use the `delete`
keyword (not to be confused with uses of delete in other languages).
In JavaScript, `delete` can only be applied to properties of objects::

    delete anotherObject.someProperty;

Consider the destruction for the following set of objects and functions::

    var myObject;
    var anotherObject = {};

    function myFunction()
    {
        var newObject = Object.create({         // Create a new object
            arg0 : "argument0",
            arg1 : [50, 100, 150]
        });

        myObject = newObject;                   // Assign to outer scope object

        anotherObject.someObject = newObject;   // Assign as a property
    }

    // Make the assignments
    myFunction();

    //..
    // Do some work using myObject, anotherObject, etc
    //..

    // Attempt to destroy the created object

    myObject = null;

    delete anotherObject.someObject;

    // At this point we should have destroyed all references to the object

In this example we don't need to assign newObject to null, because it
disappears with the scope of myFunction.  Now that the object is no
longer referenced, the garbage collector will clean up the
object. Unfortunately we can't determine when this will happen.  The
`TurbulenzEngine` object provides the method `flush()` to attempt to
force the garbage collector.  Please see the Native Engine
documentation for more details::

    TurbulenzEngine.flush();

**Initializing and Destroying**

The following code demonstrates the recommended method for
initializing and destroying code when using the Turbulenz engine.

1. The `onloadFn` function, set as the ``onload`` property of
   ``TurbulenzEngine`` is the entry point that will be called when the
   page has loaded and the engine is initialized.  One advantage of
   having an entry point function is that we can avoid the use of
   global variables and ensure that the page and engine are fully
   loaded before game code is entered.

   (Note that ``TurbulenzEngine.onload``, similar to other properties
   such as ``onunload`` and ``onerror`` which are described later, is
   called as a function, *not as a method* on TurbulenzEngine).

2. Once the entry point is called, the `TurbulenzEngine` object will
   be available for accessing the engine APIs.

3. In the same way we structure other functions, we define variables,
   followed by function, then the implementation.

4. At the bottom of the function we define the `destroy` function and
   assign it to `TurbulenzEngine.onunload`.  This function is called
   when the page is unloaded and attempts to destroy everything
   created when running this function.

::

    TurbulenzEngine.onload = function onloadFn()
    {
        if (!TurbulenzEngine.version)
        {
            window.alert("Turbulenz Engine not installed correctly");
            return;
        }

        // Variables
        var array = [];
        var i = 0;
        var intervalID;
        var params =
        {
            arg0 : 0,
            arg1 : [ 1, 2, 3, 4]
        };
        var object = Object.create(params);

        // Functions
        var compare = function compareFn(a, b)
        {
            return (a > b) ? a : b;
        };

        //
        //  Initialization Implementation
        //

        // The function that is called at 60 fps
        function runningLoopFn()
        {
            //
            //  Looping Implementation
            //
        }

        // This function set the function to call and the frequency to call it
        intervalID = TurbulenzEngine.setInterval(runningLoopFn, 1000 / 60);

        // Create a scene destroy callback to run when the window is closed
        function destroySceneFn()
        {
            // Clear the interval to stop update from being called
            TurbulenzEngine.clearInterval(intervalID);

            object = null;      // Destroy a created object

            params = null;      // Destroy an object literal

            array = null;       // Destroy an array

            TurbulenzEngine.flush();        // Force garbage collection
        }
        TurbulenzEngine.onunload = destroySceneFn;
    };

.. NOTE::

    The reason we use an `interval` is to ensure control is passed
    back to the browser each loop. Browsers usually allow scripts to
    run for up to 100ms before considering them 'unresponsive'.  Using
    scheduled intervals alleviates this problem.

Do's and Don'ts
---------------

**Do**

* Consider the difference between `null` and `undefined`. `null` is of
  type object and must be explicitly set. `undefined` is the value
  returned if an attempt to access a property by name on an object
  that doesn't have that property.

* Do comment as much as reasonable, preferably using line
  comments. Lack of clear, concise comments can make JavaScript code
  difficult to read, as with most languages.

**Don't**

* Don't assume that JavaScript is Java! JavaScript is `not` a subset
  of Java and cannot be interpreted by a Java Virtual Machine. It is
  syntactically similar to Java and C, but is a different language.

* Avoid using global variables and functions. Depending on the
  JavaScript engine implementation, they can be expensive to
  access. Variables declared at function scope are preferable.

* Avoid using implied global variables.

Recommended Reading
-------------------

JavaScript: The Good Parts

    Written by Douglas Crockford advocate of JSON format and `JSLint
    <http://www.jslint.com/>`_ - The JavaScript Code Quality Tool, The
    Good Parts praises the more desirable features of JavaScript and
    is firm in its aversion of certain language aspects, but provides
    rational and concise reasons for both. The book is targeted at
    both new and novice JavaScript developers, with the goal of
    promoting preferred methods of writing JavaScript. Turbulenz
    methodology follows many of the practices outlined in this book,
    but also diverges on a few occasions. See the Turbulenz
    Configuration of `JSLint <http://www.jslint.com/>`_ for more
    details.

.. _performancetechniques:

----------------------
Performance Techniques
----------------------

JavaScript is a powerful and expressive language, but is often
overlooked as a viable choice for performance centric applications.
This may have been a concern in the past, but modern JavaScript engine
implementations are consistently targeting high performance execution
of JavaScript code.  Turbulenz JavaScript code attempts to run as
efficiently as possible and utilizes a selection of techniques to
improve speed.  This section outlines the techniques used, which
should allow developers to also write fast code in JavaScript.

.. NOTE::

    Some of these optimizations are JavaScript engine implementation
    specific. As JavaScript engines change, so will the optimization
    techniques. It is assumed that this guide will change to reflect
    updated optimizations, so please review this section again in the
    future.  As with all optimizations, measurement of the effect of
    changes (including those suggested in this guide) is critical.

For further information on profiling see :ref:`profilingjavascript`.

Minimize Object Creation
------------------------

The biggest performance improvement Turbulenz recommend is to avoid creating objects frequently.
This is based on our experience working with different JavaScript Engines on real-world code from various games.
These games have been written in a range of languages including C/C++ to C#.
In languages such as C++ creating small local objects that could be represented as a struct, like Vector4s, are cheap as they are created on the stack.
In JavaScript this is not the case. There is additional overhead in creating objects at this frequency, which can be reduced by reusing objects.
Taking this approach also reduces the number of objects the garbage collector has to visit, which in turn will reduce the frequency and duration of garbage collections.

With some implementations, e.g. Chrome, creating typed arrays are an order of magnitude more expensive than creating JavaScript Arrays which makes minimizing the number of these types created even more of a win.

At the most basic level:

* Make sure objects are created once outside of any critical loops.
* For frequently called functions consider passing in a destination object rather than creating one in the function.
* Creating an intermediate object once, to use for calculations is another useful pattern. This can be passed down the call-stack or stored on an object or its prototype.
* Where possible, reuse objects rather than replacing them with new ones, e.g. implementing a reset() or set() method.

Inline Functions
----------------

After avoiding object creation the next largest performance improvement is usually inlining small frequently called functions, especially in critical loops like particle system updates.

Unlike C/C++ that has the `inline` keyword, JavaScript's method of inlining is either `inline expansion` or `explicit expansion`.
Turbulenz use the latter method.

In the JavaScript Library you may see some code like this::

    var a = VMath.v3Build(1, 2, 3);
    var b = VMath.v3Build(4, 5, 6);
    // INLINED: var c = VMath.v3Add(a, b);
    var c = [(a[0] + b[0]), (a[1] + b[1]), (a[2] + b[2])];

Selecting which functions to inline should be driven from measurement to see if it is a good improvement.
Remember that the size of the source code will also expand if inlining is used too often.
The best solution is to consider each situation as you encounter it.


Accessing Variables
-------------------

There are a few ways to provide access to variables required in
calculations, but we are concerned with which method is quickest and
what the trade-offs are.  The factors that can affect the performance
are:

* The cost of retrieving the variable from memory
* The cost associated with the scope: global, outer, local
* Whether or not the variable is static or dynamic
* JavaScript engine Implementation - The above costs are different for
  each engine implementation

Consider the following methods of accessing variables a0, b0 and c0:

**Accessing via Parameters**

::

    function parameters()
    {
        var a0 = 0;
        var b0 = 1;
        var c0 = 2;

        function accessVars(a1, b1, c1)
        {
            return (a1 + b1 + c1);
        }

        return accessVars(a0, b0, c0);
    }

**Accessing from Outer Scope**

::

    function outerFunction()
    {
        var a0 = 0;
        var b0 = 1;
        var c0 = 2;

        function accessVars()
        {
            return (a0 + b0 + c0);
        }
    }

**Accessing from 'this'**

::

    function objectFunction()
    {
        var object = {

            a0 : 0,
            b0 : 1,
            c0 : 2,

            accessVars : accessVarsFn()
            {
                return (this.a0 + this.b0 + this.c0);
            }
        };

        return object.accessVars();
    }

The majority of JavaScript engines we have tested, **'parameters' is
quicker than 'this' and 'this' is quicker than 'outer'**.  The
expected behavior is that as the number of parameters increases (and
hence the number of variables that need to be accessed before each
function call), the cost of accessing these parameters becomes more
expensive because they exist across different areas of memory.
Obviously this depends on the implementation of the function and
engine, so we recommend trying both methods for your function and
comparing them to find out which is faster.

.. NOTE::

    A few JavaScript engines executed 'outer' quicker than 'this', but
    the performance difference was negligible in these cases. See the
    JavaScript Benchmark for more details.


Objects or Arrays
-----------------

In JavaScript, when choosing containers, the choice is usually whether
to use arrays or objects.  The most common use of objects is to create
a `lookup` object or `dictionary`, where values are accessed by name
as properties of an object.  JavaScript objects can be used to
implement other objects such as `linked lists`.

*Typed arrays* are avaialble in most modern JavaScript engines and
provide a light wrapper around raw memory blocks, accessible as arrays
of various primitive types.  These arrays are generally very efficient
in terms of memory usage and the code generated by the JavaScript
engine (which usually understand how to access the underlying memory
of typed arrays).  Storing arrays of numbers as typed arrays (such as
`Float32Array` or `Uint16Array` etc.) can yield large gains in
execution speed.

Several of the Tubulenz Engine API functions can enable fast paths
when data is passed to them as typed arrays.  See :ref:`typed_arrays`
for more information.

**Iterating**

Listed below are the two standard techniques Turbulenz libraries use
to iterate over containers of values::

    var object = this.object;
    for (var n in object) // 'for' used to iterate over properties
    {
        // Ensure the property doesn't belong to an object's prototype chain
        if (object.hasOwnProperty(n))
        {
            // Access the property using [] because we don't know the string literal
            var obj = object[n];
            if (obj)
            {
                obj.func();
            }
        }
    }

    var array = this.array;

    // length is invariant for each loop, so we set the length once
    var length = array.length;
    for (var i = 0; i < length; i += 1)
    {
        var obj = array[i];
        if (obj)
        {
            obj.func();
        }
    }

Turbulenz benchmark tests indicate that iterating over an object can
be approximately 2~10 times slower than iterating over an array.

**Retrieving**

Variables, objects and functions can be retrieved from an array or
dictionary object using the following methods::

    var i = array[0];           // Index is 0

    var j = object.name;        // Property called 'name'

The performance difference between these two types of access is
negligible, but this are likely because of optimizations made by the
JavaScript engine. One point to make about this example is that the
key or index is known before runtime.  This can allow further
optimizations to be made either directly to the source as part of a
processing step before runtime, or by the JavaScript engine itself.
Consider the alternative method of accessing object properties::

    var k = object['name'];     // Property called 'name'

This will perform exactly the same operation as the variable assigned
to `j` except it uses the [] notation.  Depending on processing tools
used and JavaScript engine, the code will be optimized to use the
`object.name` method of accessing properties.

**Searching**

Depending on the container, it can be more expensive to search for
variables, objects or functions if the index or key is unknown at
runtime.  Variables, objects and functions stored with unknown keys or
indices can be retrieved from an array or dictionary object using the
following methods::

    var i = array[index];       // Index unknown before runtime

    var j = object[key];        // Property unknown before runtime

Accessing `object[key]` in this way can be more expensive operation
than accessing a `array[index]`.  Turbulenz benchmark tests indicate
that in some JavaScript engines this can be up to 3x slower.  However,
in other engines it is just as quick as `array[index]` access,
presumably because of optimizations in the engine.  Turbulenz'
recommendation is to use arrays and indices for quick access storage,
because performance varies less between JavaScript engine
implementations.  As with all of these recommendations, they should be
investigated on a case-by-case basis.

.. _profilingjavascript:

--------------------
Profiling JavaScript
--------------------

When measuring the performance of JavaScript code with the Turbulenz
Engine there are several things to bear in mind.

For accurate timings for the **plugin** version you must run the release version and
ensure that code is compacted. When running using the browser
extensions provided by the Turbulenz plugin, the code will be run in
the embedded JavaScript engine.  Debug builds use the browser's
JavaScript virtual machine (even when using the native browser
extensions). These two engines can have quite different performance
characteristics. See :ref:`templating` for how to build code in the
various available configurations.

For accurate timings for the **canvas** version you should use the release version.
For **canvas**, there tends to be a smaller difference in performance between debug and release versions.
There will be a much bigger difference between browsers for release versions, so profile on a range of configurations.

The profilers that come with the browsers development tools measure
performance in their internal engines. Chrome's profiler is a sampling profiler so does not impact performance to the extent that others, e.g. Firebug's, does.
The non-sampling profilers can impact performance significantly and
the impact is not equal for all functions.
These issues make them useful for first pass measurement,
to spot functions you might not expect to show up and for ballpark
percentage cost of root functions but not to measure exact cost or the
performance impact of a change.  These profilers are likely to be most
effective when used on code that is built with the *canvas*
configuration.

To allow profiling when running with the native engine there are two
approaches to available. Firstly the engine's profiler is exposed via
the :ref:`TurbulenzEngine.enableProfiling
<turbulenzengine_enableprofiling>`.  Secondly the :ref:`Profile
<profile>` class is provided. The :ref:`Profile <profile>` API uses
:ref:`TurbulenzEngine.time <turbulenzengine_time>` which offers
greater resolution than the JavaScript Date object. By manually
instrumenting you can control the impact of the overhead, e.g. just
measuring root functions or measure the change in an individual
functions performance. Chrome has the most similar performance characteristics to the native engine VM.

Any code based profiling impacts the performance, since it adds
instrumentation overhead. The non-sampling profilers profile every
function. This can skew performance as functions that have many
function calls from them, from their own code and all of their
descendants, incur greater profiling overhead than code with few
function calls. This is one reason that some optimizations may appear
a bigger win than they really are, e.g. this can make inlining a
frequently called function appear a bigger win than it really is,
since the per function profiling instrumentation cost is removed as
well as the call overhead cost.

Two other things to bear in mind with JavaScript development. Firstly
the engine's use various forms of JIT compilation and so the first
execution of code will incur a cost. This can show up as a peak in the
caller code. Secondly JavaScript garbage collection can cause
occasional spikes in frame-time, and in some cases you may even see a
noticeable pause. If you see an occasional maximum duration out-lier
this is one possible explanation.

**Summary**

* Use the *canvas* build with the Chrome profiler for main optimizations.
* Use the *plugin* build with :ref:`Profile <profile>` to measure real
  cost and the performance impact of changes.
* Test on all supported browsers as performance will vary.

---------------
Memory Analysis
---------------

Tools
-----

To analyze memory use, several tools exist:-

Chrome

  For canvas versions use the Developer Tools->Profiles->Heap Snapshot tool to see the type and volumes of objects that are created.
  The tool is rapidly evolving so check out the latest version for new features.
  At the time of writing the heap use numbers only reflect the JavaScript heap size, not the backing storage.
  This means ArrayBuffer objects do not show up buffer cost.

Firefox

  Use the about:memory to see more information. This is especially useful for WebGL information, such as texture usage.

Native Engine

  Look at the :ref:`TurbulenzEngine getObjectStats()<turbulenzengine_getobjectstats>` to see the numbers of objects being used.

Reducing Memory Usage
---------------------

Reducing the number of active objects saves memory and will reduce the
garbage collection cost.

* Arrays of structures are common in many languages but in JavaScript
  tend to cost markedly more due to all objects, even numbers, having
  a larger footprint than their underlying type.  For very common
  objects, such as animation key-frame data, look at converting them
  to interleaved arrays or parallel arrays.

* Use Typed Arrays. These are more compact than native JavaScript
  arrays. They remove the object overhead per element, which can
  improve performance, sometimes much more than expected.

Make use of compression techniques for the type of data you are using.

* For binary data such as textures, pick the optimal compression format for the type of image you are storing. Using DXT texture compression can reduce the memory footprint on the graphics card for instance by generating optimized mipmaps offline, which can improve visual fidelity at a range of resolutions. The support for DXT compressed textures (which can support transparency) is possible in modern browsers. See the *Device Initialization* sample, which has a support check for different texture formats or use the :ref:`graphicsDevice.isSupported <graphicsdevice_issupported>` function.

Release data you are no longer using and avoid holding duplicate data.

* When loading asset data there is usually a difference between the result returned by the request and the processed data. Avoid holding a reference to both of these especially if you do not intend to use it anymore. For example, when loading scene data the JSON asset may no longer be required once loaded and processed into a :ref:`Scene <scene>` object. Discarding the source asset by setting references to *null* or deleting properties that refer to it will allow the JavaScript engine to garbage collect the data. The :ref:`AssetCache <assetcache>` object provides a useful interface for managing assets with a limitation on quantity.
