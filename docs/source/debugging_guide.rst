.. highlight:: javascript
.. _debugging_game_code:

-------------------
Debugging Game Code
-------------------

There are a number browsers and debuggers that can be used to debug
the JavaScript you write. For Canvas develpoment Turbulenz recommends
Chrome using its built in Developer Tools. For plugin development
Turbulenz recommends the use of Firefox and Firebug as a debugging and
testing environment.  This section covers the use of Firebug to debug
your JavaScript.  The techniques in this section are merely
suggestions and may still be relevant to other debuggers.

Note that the information here is generally only relevant when running
the game in *canvas-debug* mode.

See also :ref:`DebuggingTools <debuggingtools>`.

.. _configuring-firebug:

Configuring Firebug
-------------------

To start debugging with Firefox and Firebug, you will need to get the
latest version of each:

* Firefox - http://www.mozilla-europe.org/en/firefox/
* Firebug - http://getfirebug.com/downloads

.. TIP::

    Turbulenz recommend using the latest stable build of both tools,
    however alpha and beta builds of both tools frequently have fixes
    and speed improvements that make them easier to work with. It is
    worth trying an unstable version to see if it suits you style of
    development. If not you can always switch back to a stable build
    again!

Once you have installed Firefox then Firebug you will probably need to
restart the browser.  When you first start you should see a little
*bug icon* in the bottom right of your browser.  If this icon is gray,
firebug is not active. To activate click on the icon, then enable the
tabs you are interested in by selecting the tab and clicking on the
small arrow and selecting *Enabled*. We recommend to enable the
following by default:

* Console
* HTML
* Script

If you reload a page that has an error with Firebug minimized, the
*bug icon* will be replaced with a red warning icon and text
specifying how many errors have been encountered.

.. TIP::

    Errors in execution loops can cause a flood of error messages to
    the console (one for each frame). At this point it is probably
    easier to set a breakpoint at the top of the looping function and
    step through until a single error occurs.  It can also be helpful
    to add *guard code* to the function to make sure only one instance
    is ever executed.

One option available to configure is to force Firebug to always break
on errors. This configuration has the benefit that you will not miss
any errors. The downside is that this option will probably interfere
with standard internet browsing unless you remember to turn Firebug
off.

.. WARNING::

    This configuration involves editing options in Firebug in
    Firefox's *about:config*. It is not an essential step, but it is
    useful.

To break on error:

1. Open up Firefox with Firebug installed
2. Navigate to *about:config* in the address bar
3. Agree to the warning to be careful
4. In the filter, type: *breakOn*
5. Set true to both:
    * extensions.firebug.service.breakOnErrors
    * extensions.firebug.persistBreakOnError
6. Restart Firefox

Now when you encounter an error, Firebug will break and display an
orange box with a description of the error.  The remainder of this
section aims to educate users in handling common errors relevant to
Turbulenz Technology.  To find out how to use Firebug in depth, please
refer to the follow documentation:

* http://getfirebug.com/whatisfirebug
* http://getfirebug.com/javascript
* http://getfirebug.com/errors

.. _using-firebug-to-debug:

Using Firebug to Debug JavaScript
---------------------------------

The following code is a basic function that sums indices from 0 to
length and outputs the result in the webpage.  Create a new file
called "firebug.html":

.. code-block:: html

  <html>
    <head>
      <title>Firebug Basics</title>
    </head>
    <body>
      <h1>Firebug Basics</h1>
      <h2 id="output"></h2>

      <script>
        function firebugFn()
        {
            var index;
            var sum = 0;
            var length = 10;

            for(index = 0; index < length; index += 1)
            {
                sum += index;
            }

            document.getElementById("output").innerHTML = "Loop Count:" + length + ", Sum: " + sum;
        }

        window.onload = firebugFn;
      </script>
    </body>
  </html>

The first step we will perform is to set a breakpoint:

1. Open the file in Firefox and see the result output as text on the
   page.
2. Open Firebug
3. Navigate to the Script tab
4. Place a breakpoint next to the line number for *var length = 10;*
5. Reload the page
6. You should see the yellow arrow indicating that the execution has
   stopped.
7. Have a look at the *Watch* tab, notice how *index* is 'undefined'. This
   is because although it has been declared, no value has been set
   yet.

The keyboard controls are:

* Continue: F8
* Step Into: F11
* Step Over: F10
* Step Out: Shift + F11

Now we will set a conditional breakpoint in the loop:

1. At the *sum += index*, set a breakpoint and right click to bring up the
   conditional expression
2. Type: sum > 30
3. Press F8 to continue
4. Observe that (index === 9) and (sum === 36)

Now we will use the console to edit the code on the fly:

1. Select the console tab
2. Type: *length*
3. The console should output '10'
4. Type the expression: *length = 20;*
5. The console should return '20'
6. Go back to the Script tab
7. Now press step over or F10
8. Notice how *index* goes higher than '10'

The console in Firebug is a very powerful tool for debugging. To prove
what it can do we will edit the output text in the page:

1. Select the console tab
2. Type: *document.getElementById("output")*
3. The console will return a pointer to the <h2> element with that id
4. You can use the mouse to observe where the header exists in the
   page
5. In the console type::
     document.getElementById("output").innerHTML = "We can output here";
6. You can see how we were able to edit the HTML dynamically.

To continue remove the breakpoints and press continue or F8.  The loop
count and sum are now different from the first time we ran it and we
haven't edited the source code at all!  Now we will look at some
incorrect JavaScript code using Firebug to view the errors.

.. _finding-errors-using-firebug:

Finding Errors Using Firebug
----------------------------

This hands-on topic will require you to debug and repair some common
errors. The code given below has been deliberately written with errors
to introduce to debugging with Firebug. In this example we will debug
the first few errors in depth then you can attempt to fix the
remaining errors independently. You will be able to find a list of the
errors and how to avoid them at the bottom of this topic. Start by
creating a file called *debugging.js* with the following contents and
place it in your working directory::

    TurbulenzEngine.onload = function onloadFn()
    {
        // Create the GraphicsDevice interface with no parameters
        var graphicsDeviceParameters = { };
        var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

        // Create the MathDevice interfaces with no parameters
        var mathDeviceParameters = { };
        var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

        var camera = Camera.create(mathDevice);
        var floor = Floor.create(graphicsDevice, mathDevice);

        var clearColor = {0.95, 0.95, 1.0, 0.0};

        var lastAngle = 0;
        var angle = mathDevice.deg2Rad(1);

        // Movement units
        var up = 1.0;
        var down = 1.0;
        var left = 2.0;
        var right = 2.0;
        var position = mathDevice.v3Build(0.0, 8.0, 0.0);
        var target = mathDevice.v3Build(0.0, 3.0, -15.0);
        var upVector = mathDevice.v3BuildYAxis();
        camera.lookAt(target, upVector, position);
        camera.updateViewMatrix();

        function updateRotationFn(angle)
        {
            lastAngle += angle;
            camera.matrix = mathDevice.m43FromAxisRotation(down, lastAngle);
            mathDevice.m43SetPos(camera.matrix, position);
            camera.updateViewMatrix();
        }

        var intervalID;
        function mainLoopFn()
        {
            updateRotationFn(angle);
            camera.updateViewProjectionMatrix();

            if (graphicsDevice.beginFrame())
            {
                graphicsDevice.clear(clearColor, 1.0, 0.0);
                floor.render(graphicsDevice, camera);
                graphicsDevice.endFrame();
            }
        }

        // Call the mainLoopFn, 60 fps
        intervalID = TurbulenzEngine.setInterval(mainLoopFn, 1000 / 60);

        TurbulenzEngine.onunload = function destroyFn()
        {
            // Clear the interval
            TurbulenzEngine.clearInterval(intervalID);

            position = null;
            clearColor = null;
            camera = null;
            floor = null;

            TurbulenzEngine.flush();
        };
    };

To detect the errors run the code:

1. Build the code in *canvas-debug* mode using the :ref:`makehtml` tool (as described
   in :ref:`getting_started_creating_turbulenz_app`) ::

     makehtml --mode canvas-debug -t . debugging.js -o debugging.canvas.debug.html

2. Start Firefox
3. Make sure the Firebug icon in the bottom right corner is enabled
4. Expand Firebug and select the 'Script' tab
5. Load debugging.canvas.debug.html, by dragging and dropping it into the browser

**Error 1 - Missing JavaScript Library ('X' is not defined)**

Error
    Camera is not defined

Problem

    The scripts that includes the definition of ``Camera`` and
    ``Floor`` have not been included. This is true for any library
    defined in another file.

To fix this:

1. Copy the *jslib* directory from the SDK install path into your
   working directory.
2. Add the following lines at the top of the *debugging.js* file::

    /*{{ javascript("jslib/camera.js") }}*/
    /*{{ javascript("jslib/floor.js") }}*/

3. Rebuild *debugging.canvas.debug.html*::

    makehtml --mode canvas-debug -t . debugging.js -o debugging.canvas.debug.html

Watch For

    Even if you have defined the script location, you might not have
    included the file itself. You will get the same error until the
    file can be found.

**Error 2 - Objects as Arrays, Arrays as Objects**

Error
    Invalid object initializer

Problem

    The variable *clearColor* is supposed to be an array, but has been
    constructed using {} by mistake (which denotes an object
    construction).  The line should read::

      var clearColor = [1.0, 1.0, 0.0, 1.0];

Watch For

    Confusing the syntax of Arrays and pure Objects.  It is common
    place to convert one to the other and to forget to modify the
    syntax.

**Error 3 - Non-existent Functions and Methods**

Error
    mathDevice.deg2Rad is not a function

Problem

    The ``mathDevice`` object has no method ``deg2Rad``.  This can be
    fixed by replacing the offending line with::

      angle = 0.0392699;

    Note that in some cases you may wish to dynamically check for the
    existence of a given function or method, although you should be
    aware of the potential performance consequences of this::

      var angle;
      var deg2Rad = mathDevice.deg2Rad;
      if (deg2Rad)
      {
          angle = deg2Rad(1);
      }
      else
      {
          angle = 0.0392699;
      }

**Error 4 - Bad Arguments**

Error

    This error is written to the console: "Error from TurbulenzEngine:
    parameters should be (<vector3>, <scalar>)" (causing the
    subsequent error "Uncaught TypeError: Cannot read property '0' of
    undefined")

Problem

    The ``mathDevice.m43FromAxisRotation`` call expects to receive a
    vector object as its first argument, but is being passed a scalar.
    The engine code detects this and posts the error to the console.

    The ``upVector`` is available as an appropriate axis, so this
    error can be fixed::

      function updateRotationFn(angle)
      {
          var upAxis = mathDevice.v3BuildYAxis();
          lastAngle += angle;
          camera.matrix = mathDevice.m43FromAxisRotation(upAxis, lastAngle);
          mathDevice.m43SetPos(camera.matrix, position);
          camera.updateViewMatrix();
      }

    Note that this error could have been caught programmatically by
    setting the ``TurbulenzEngine.onerror`` property at the top of
    the ``onloadFn`` function::

      TurbulenzEngine.onerror = function (msg)
      {
        window.alert(msg);
      };

Watch For

    Errors reported to the console catching this kind of programming
    mistake.  Be sure to set the ``TurbulenzEngine.onerror`` property
    during development to catch bugs at the earliest opportunity.

**Destruction Errors**

What is wrong with this piece of code?::

    function destroyFn()
    {
        // Clear the interval
        clearColor = null;

        TurbulenzEngine.flush();

        TurbulenzEngine.clearInterval(intervalID);
    }

The answer is that *clearInterval* is called **after** clearColor is
set to null. If the main loop called by the interval references
clearColor, you could get some very strange errors on
destruction. Make sure *clearInterval* happens **before** anything
else in destruction.

.. TIP::

    Many of the errors in this example can be found early by using a
    validation tool such as `JSLint
    <http://www.jslint.com/lint.html>`_.

.. _debugging-tips:

Debugging Tips
--------------

**I have started running my JavaScript in Firebug, but each line of
source is grayed out. Why can't I debug it?**

Check the other tabs you have open in the browser, it is likely you
are stepping through something else and Firebug is busy debugging
that. Simple solution is close any other tabs and refresh or reload
your code. The lines should then take on the standard green
highlighting and you should be able to debug as normal.

**Sometimes Firebug will throw errors similar to "Turbulenz Engine is
not defined", what does this mean?**

This sometimes occurs when refreshing the page. It could be related to
the loading/unloading of the Turbulenz Engine object or waiting for
garbage collection. You could either refresh the page again or close
the tab/windows and reopen it. To minimize the likelihood of seeing
these type of errors, make sure your code is correctly destroying
objects and prompting garbage collection (See
:ref:`getting_started_shutdown` and :doc:`../js_development_guide`).

**I have placed a breakpoint and it has stopped at that point, but
visually the code still appears to be running! What is going on?**

It appears in some situations that Firebug doesn't always manage to
trap the execution of code, more frequently when relating to code that
is using :ref:`tz_setinterval`. One way to
overcome this is to make sure a breakpoint also exists in the function
specified in *setInterval*. At least in the case that execution does
continue, it should stop at that breakpoint.

**I have set a breakpoint at line X + N, Firebug returns a
non-critical error at line X and then it never reaches my breakpoint!
I can't debug my code, because I can't hit the particular
breakpoint!**

This could be one of many things - a variable access error, an error
in Firebug itself or even a genuine error you just have to
fix. Sometimes you might see an error such as "Can't convert NPObject
JS wrapper class to string".  Firebug is trying to display this
object, that we are not interested in but keeps throwing an error
about it.  Suggestions to get past this problem include:

* Remove references to that object from your code (could be tricky).
* Attempt to use a different debugger, such as Webkit's Inspector. Sometime a different debugger will highlight a
  different set of errors and hopefully more relaxed than Firebug in some cases.
* Use error printing or alerts instead of variable inspection.
