.. highlight:: javascript

.. _getting_started_guide:

=====================
Getting Started Guide
=====================

.. _introduction:

------------
Introduction
------------

Turbulenz is an HTML5 game engine and server-side APIs available in JavaScript and TypeScript for building and distributing 2D and 3D games that run on platforms that support HTML5 features such as modern browsers without the need for plugins.

In This Guide
-------------

The aim of this guide is to familiarize developers with the SDK,
quickly allowing them to start creating great games for the Turbulenz
platform.  We give a brief introduction to some important concepts and
tools, and describe the process of writing, building and running a
simple Turbulenz application.

To learn the basics of how to use Turbulenz APIs read the next section.
If you are comfortable with how to use a basic Turbulenz JavaScript APIs, for example to draw an image to the screen, you can skip this section and move on to the finding the best way to structure a :ref:`Turbulenz application <getting_started_writing_turbulenz_games>`.


**At this point you should have done at least *one* of the following:**

* Installed the latest SDK from `<https://hub.turbulenz.com>`__ and run through the setup steps mentioned :ref:`here <developer_requirements>`.
* Cloned the Turbulenz open source git repository from `<http://github.com/turbulenz/turbulenz_engine>`__ and run through the setup steps in the README.rst.


Getting Started with Turbulenz APIs
-----------------------------------

To try the Turbulenz APIs requires only a text editor and a browser such as Google Chrome or Mozilla Firefox.

Start by creating a new file with a .html file extension e.g. turbulenz_example.html
Place this file in the root of the Turbulenz directory.

.. highlight:: html

In that file add the following basic HTML tags::

    <html>
    <head>
        <title>Turbulenz - Getting Started Guide - API Example</title>
        <!-- Script includes go here -->
    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            /* Game code goes here */
        </script>
    </body>
    </html>

The <canvas> tag is where Turbulenz will draw the game. Think of this as the game window, in this case we'll make it 640x480 pixels.
Loading the Turbulenz libraries are done by including scripts in the HTML before your game code is executed.

To get started begin by using the core TurbulenzEngine and the GraphicsDevice library to change the background color of the canvas element.
Add the following script tags after the section marked as "Script includes go here"::

    <script src="jslib/debug.js"></script>
    <script src="jslib/webgl/turbulenzengine.js"></script>
    <script src="jslib/webgl/graphicsdevice.js"></script>

.. highlight:: javascript

To initialize create a *WebGLTurbulenzEngine* and pass a reference to the <canvas> element to the constructor in the game code section::

    TurbulenzEngine = WebGLTurbulenzEngine.create({
        canvas: document.getElementById("canvas")
    });

The TurbulenzEngine variable will allow you to create instances of the low-level modules such as GraphicsDevice, SoundDevice, NetworkDevice, InputDevice and PhysicsDevice.
You can usually assume the existence of TurbulenzEngine and debug variables because they are automatically added by the Turbulenz build tools when you get to :ref:`creating Turbulenz apps <getting_started_creating_turbulenz_app>`. In this example we will declare them manually.
To create an graphics module instance add the following code::

    var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

These creation functions take parameters with construct options (An object literal with properties).
In this case just use an empty object to denote no options.
Now the graphicsDevice is created the <canvas> element can be cleared with a color.

Now initialize a color array for background color to be set::

    var r = 1.0, g = 1.0, b = 0.0, a = 1.0;
    var bgColor = [r, g, b, a];

The bgColor is a 4-dimensional vector specified by [red, green, blue, alpha], where each value is from 0.0 to 1.0.
In this example the color will be yellow.

Declare an *update* function, this will act as the game loop::

    function update() {
        /* Update code goes here */
    }

    TurbulenzEngine.setInterval(update, 1000 / 60);

Having declared the function and passed it to *setInterval* function of TurbulenzEngine, this will attempt to call the function at the interval specified in milliseconds.
In this case 1/60th of a second or 60 frames-per-second (fps).
Now add this code inside the update function to clear the <canvas> element, which will happen every frame::

    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(bgColor, 1.0);
        /* Rendering code goes here */

        graphicsDevice.endFrame();
    }

This will prepare the frame by calling *beginFrame* and if successful will clear the screen with the bgColor, then finish the frame.
Now you have function that will attempt to clear the screen yellow at 60fps.
To run the JavaScript code in the browser, navigating to the page by opening the file directly from your filesystem with the default browser or drag and drop the HTML file into the browser of your choice.
If you want to reload the code, refresh the page.
You should now see a yellow box, which from this point will be your game window.

.. highlight:: html

So far your code should look like this::

    <html>
    <head>
        <title>Turbulenz - Getting Started Guide - API Example</title>
        <!-- Script includes go here -->
        <script src="jslib/debug.js"></script>
        <script src="jslib/webgl/turbulenzengine.js"></script>
        <script src="jslib/webgl/graphicsdevice.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            /* Game code goes here */

            TurbulenzEngine = WebGLTurbulenzEngine.create({
                canvas: document.getElementById("canvas")
            });

            var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

            var r = 1.0, g = 1.0, b = 0.0, a = 1.0;
            var bgColor = [r, g, b, a];

            function update() {
                /* Update code goes here */

                if (graphicsDevice.beginFrame())
                {
                    graphicsDevice.clear(bgColor, 1.0);
                    /* Rendering code goes here */

                    graphicsDevice.endFrame();
                }
            }

            TurbulenzEngine.setInterval(update, 1000 / 60);
        </script>
    </body>
    </html>

.. highlight:: javascript

To add a little variation, try cycling the color by modifying it in the *update* function. Add this code just above the *beginFrame* function::

    b += 0.01;
    bgColor[2] = b % 1; // Clamp color between 0-1

If you refresh the page in your browser, you will see the canvas will cycle color from yellow to white.
The next thing to do is to draw a simple rectangle, using the Draw2D API.

.. highlight:: html

Include the Draw2D library by adding the following script tag below the other includes::

    <script src="jslib/draw2d.js"></script>

.. highlight:: javascript

After creating the GraphicsDevice, you can create the Draw2D module::

    var draw2D = Draw2D.create({
            graphicsDevice: graphicsDevice
        });

After creating the bgColor array, construct the rectangle to draw::

    var x1 = 50;
    var y1 = 50;
    var x2 = graphicsDevice.width - 50;
    var y2 = graphicsDevice.height - 50;

    var rectangle = [x1, y1, x2, y2];

    var drawObject = {
        color: [1.0, 0.0, 0.0, 1.0],
        destinationRectangle: rectangle
    };

This will create a rectangle with coordinates (x1, y1) and (x2, y2) where (0, 0) is the top left of the screen.
The rectangle will start 50px from the edges of the canvas and will be colored red.
To draw this rectangle with Draw2D add the following code between the *clear()* and the *endFrame()* in the update loop::

    draw2D.begin();
    draw2D.draw(drawObject);
    draw2D.end();

If you refresh the page, you should now see the red rectangle.
The draw2D.draw function is an easy way to just draw an object, but for more flexibility and control, drawing a sprite is better.
Construct a simple sprite by using the Draw2DSprite function, do this under the drawObject declaration::

    var sprite = Draw2DSprite.create({
        width: 100,
        height: 100,
        x: graphicsDevice.width / 2,
        y: graphicsDevice.height / 2,
        color: [1.0, 1.0, 1.0, 1.0],
        rotation: Math.PI / 4
    });

These will be the initial properties of the sprite.
To draw it, use the *drawSprite* function and put it after the *draw2D.draw* function::

    draw2D.drawSprite(sprite);

Reload the example and you should see a white diamond in the center of the screen.
Sprite values can be changed via methods such as *getColor* & *setColor*.
For a sprite, position can be changed by directly accessing the property on the sprite object.
Define the following angles to use for rotating the sprite below the sprite declaration::

    var PI2 = Math.PI * 2;
    var rotateAngle = Math.PI / 32;

To rotate the sprite add the following in the *update* function after the code that modifies the background color::

    sprite.rotation += rotateAngle;
    sprite.rotation %= PI2; //Wrap rotation at PI * 2

Reload now and you should see the sprite spinning.

.. highlight:: html

Your code should now look like this::

    <html>
    <head>
        <title>Turbulenz - Getting Started Guide - API Example</title>
        <!-- Script includes go here -->
        <script src="jslib/debug.js"></script>
        <script src="jslib/webgl/turbulenzengine.js"></script>
        <script src="jslib/webgl/graphicsdevice.js"></script>
        <script src="jslib/draw2d.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            /* Game code goes here */

            TurbulenzEngine = WebGLTurbulenzEngine.create({
                canvas: document.getElementById("canvas")
            });

            var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

            var draw2D = Draw2D.create({
                graphicsDevice: graphicsDevice
            });

            var r = 1.0, g = 1.0, b = 0.0, a = 1.0;
            var bgColor = [r, g, b, a];

            var x1 = 50;
            var y1 = 50;
            var x2 = graphicsDevice.width - 50;
            var y2 = graphicsDevice.height - 50;

            var rectangle = [x1, y1, x2, y2];

            var drawObject = {
                color: [1.0, 0.0, 0.0, 1.0],
                destinationRectangle: rectangle
            };

            var sprite = Draw2DSprite.create({
                width: 100,
                height: 100,
                x: graphicsDevice.width / 2,
                y: graphicsDevice.height / 2,
                color: [1.0, 1.0, 1.0, 1.0],
                rotation: Math.PI / 4
            });

            var PI2 = Math.PI * 2;
            var rotateAngle = Math.PI / 32;

            function update() {
                /* Update code goes here */
                b += 0.01;
                bgColor[2] = b % 1; // Clamp color between 0-1

                sprite.rotation += rotateAngle;
                sprite.rotation %= PI2; //Wrap rotation at PI * 2

                if (graphicsDevice.beginFrame())
                {
                    graphicsDevice.clear(bgColor, 1.0);
                    /* Rendering code goes here */

                    draw2D.begin();
                    draw2D.draw(drawObject);
                    draw2D.drawSprite(sprite);
                    draw2D.end();

                    graphicsDevice.endFrame();
                }
            }

            TurbulenzEngine.setInterval(update, 1000 / 60);
        </script>
    </body>
    </html>

.. highlight:: javascript

The next step is to start using assets such as images to make the sprite more interesting.
To do this you will need to start hosting the files on a web server.
There are many ways to do this, since you have *Python* installed as part of the setup, you can start a basic webserver from the command-line in the current directory using the following command::

    # For Python 2.7 use

    python -m SimpleHTTPServer

.. TODO: List a number of ways to start a webserver

Run the command from the same directory as your .html file and navigate your browser to *127.0.0.1:8000* or *localhost:8000* you will see a list of files in that directory.
Click on the .html to view the file, it should run as before.
Now you can start loading image files as textures for the sprite.
Start by creating a texture using the GraphicsDevice, after the *sprite* creation::

    var texture = graphicsDevice.createTexture({
        src: "assets/textures/particle_spark.png",
        mipmaps: true,
        onload: function (texture)
        {
            if (texture)
            {
                sprite.setTexture(texture);
                sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
            }
        }
    });

To create a texture this way the *src* image can be a png, jpg, dds or tga.
You can test what a browser supports using the `graphicsDevice.isSupported <http://docs.turbulenz.com/jslibrary_api/graphicsdevice_api.html#graphicsdevice-issupported>`__ function.
Calling *createTexture* will cause the JavaScript to request the image.
The *onload* function will be called when the image has been retrieved and will return the texture object if successful or *null* if not.
Passing the loaded texture object to the sprite and setting the textureRectangle to use the width and height of the texture will allow the code to start drawing the image.
If you are seeing only a white sprite then check the following notes below:

.. NOTE::

    Draw2D requires the texture to have "power-of-2" dimensions i.e. 16x16, 64x32, 128x512, etc and also to have mipmaps turned on in this example.
    The example file complies with these requirements. If you use your own image you need to make sure it does too.

.. NOTE::

    If you are trying to use a file hosted on a different server, that server will need to allow `CORS <http://en.wikipedia.org/wiki/Cross-origin_resource_sharing>`__. `corsproxy.com <http://www.corsproxy.com/>`__ will allow you to test it out with images if you do *http://www.corsproxy.com/www.website.com/img/name.png* for example, otherwise you should do host the files on your own server.

To use a transparent image you will need to change how it is rendered.
In this example move the *drawSprite* call to its own draw2D.begin and end and set the draw mode to be "additive" which will make dark colors transparent for the particle_spark. It should now look like this::

    draw2D.begin(); // Opaque
    draw2D.draw(drawObject);
    draw2D.end();

    draw2D.begin('additive'); // Additive
    draw2D.drawSprite(sprite);
    draw2D.end();

.. NOTE::

    If the image already has alpha transparency, set the mode to 'alpha' to use the alpha channel.

You can the size of the sprite in a number of different ways.
Changing the scale is one option.
After the rotationAngle declaration, define the following variable::

    var scale = [1, 1];

In the update function add the following::

    scale[0] = scale[1] = Math.cos(sprite.rotation) + 2;
    sprite.setScale(scale);

This will shrink and grow the sprite between 1.0 and 2.0 by manipulating the scale.

.. highlight:: html

Your file should now look like this::

    <html>
    <head>
        <title>Turbulenz - Getting Started Guide - API Example</title>
        <!-- Script includes go here -->
        <script src="jslib/debug.js"></script>
        <script src="jslib/webgl/turbulenzengine.js"></script>
        <script src="jslib/webgl/graphicsdevice.js"></script>
        <script src="jslib/draw2d.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            /* Game code goes here */

            TurbulenzEngine = WebGLTurbulenzEngine.create({
                canvas: document.getElementById("canvas")
            });

            var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

            var draw2D = Draw2D.create({
                graphicsDevice: graphicsDevice
            });

            var r = 1.0, g = 1.0, b = 0.0, a = 1.0;
            var bgColor = [r, g, b, a];

            var x1 = 50;
            var y1 = 50;
            var x2 = graphicsDevice.width - 50;
            var y2 = graphicsDevice.height - 50;

            var rectangle = [x1, y1, x2, y2];

            var drawObject = {
                color: [1.0, 0.0, 0.0, 1.0],
                destinationRectangle: rectangle
            };

            var sprite = Draw2DSprite.create({
                width: 100,
                height: 100,
                x: graphicsDevice.width / 2,
                y: graphicsDevice.height / 2,
                color: [1.0, 1.0, 1.0, 1.0],
                rotation: Math.PI / 4
            });

            var texture = graphicsDevice.createTexture({
                src: "assets/textures/particle_spark.png",
                mipmaps: true,
                onload: function (texture)
                {
                    if (texture)
                    {
                        sprite.setTexture(texture);
                        sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
                    }
                }
            });

            var PI2 = Math.PI * 2;
            var rotateAngle = Math.PI / 32;

            var scale = [1, 1];

            function update() {
                /* Update code goes here */
                b += 0.01;
                bgColor[2] = b % 1; // Clamp color between 0-1

                sprite.rotation += rotateAngle;
                sprite.rotation %= PI2; //Wrap rotation at PI * 2

                scale[0] = scale[1] = Math.cos(sprite.rotation) + 2;
                sprite.setScale(scale);

                if (graphicsDevice.beginFrame())
                {
                    graphicsDevice.clear(bgColor, 1.0);
                    /* Rendering code goes here */

                    draw2D.begin(); // Opaque
                    draw2D.draw(drawObject);
                    draw2D.end();

                    draw2D.begin('additive'); // Additive
                    draw2D.drawSprite(sprite);
                    draw2D.end();

                    graphicsDevice.endFrame();
                }
            }

            TurbulenzEngine.setInterval(update, 1000 / 60);
        </script>
    </body>
    </html>

.. highlight:: javascript

At this point you have been able to use basic drawing APIs to manipulate the <canvas> element using the Turbulenz Engine!

For more information on the various APIs, see the following links:

* :ref:`Low-level API <low_level_api>`, :ref:`2D Physics API <physics2d_api>`, :ref:`3D Physics API <phys3d_api>`
* :ref:`High-level API <high_level_api>`
* :ref:`Turbulenz Services API <turbulenz_services_api>`
* :ref:`Protolib API <protolib_api>`


.. _getting_started_writing_turbulenz_games:

Writing Turbulenz Games
-----------------------

Once you are familiar with how the Turbulenz APIs can be used you can start creating games against those APIs yourself.
To help you better structure your first app, Turbulenz provide a range of tools, examples and features to make supporting modern and older browsers easier.
These come in the form of file/API servers, code/asset processing tools, build configurations and more.

This section will start to introduce you to these tools and explain some of the terminology Turbulenz use when describing apps.
Code written for the Turbulenz engine can run in several configurations.

:Canvas Mode:

    Using only the **in-built features of the browser**.  This is
    referred to as *canvas mode* (named after the HTML ``<canvas>``
    tag through which modern browsers expose accelerated rendering
    features).  As well as accelerated graphics capabilities, modern
    browsers often allow access to a range of low-level functionality
    including sound playback, input events and more.

    In *canvas mode*, the Turbulenz Engine will determine which APIs
    are available and use the most suitable of these to provide
    functionality to the game.  Games using this mode require
    sufficiently modern browsers, but end-users with such browsers are
    not required to enable any extensions.

:With Browser Extensions:

    To provide games with a fixed set of features and performance
    characteristics on a wider range of browsers, Turbulenz supplies a
    small binary plugin that exposes a some native functionality to
    JavaScript.  Games targeting this configuration will require the
    end user to install these extensions.  Using the plugin guarantees
    that the game will support the full range of popular browsers
    across multiple operating systems.

    The Turbulenz extensions to the browser include native support for
    several features that are not yet available in browsers (such as
    physics simulation or rendering to multiple color buffers).  Also
    included is a JavaScript engine selected and optimized for the
    execution of game code.  This means that game code will have more
    predictable performance characteristics but still have full access
    to all the APIs and data, just as the code that drives the rest of
    the HTML page.

The set of built-in functionality in modern browsers is continually
increasing, and *canvas* mode is now a viable option for many games.

The majority of the code that makes up the Turbulenz engine is shared
between both configurations, and similarly games can usually be built
for either configuration without change to the code.  We suggest that
developers test and compare the performance of the two configurations
from an early stage.  Depending on the support provided by the
browser, there may still be limitations in canvas mode.  However the
gap is narrowing all the time.

.. NOTE::

    **EXPERIMENTAL**
    Introduced in SDK 0.25.0 Turbulenz has added support for writing games
    in TypeScript. The TypeScript compiler allows developers to write code
    in syntax similar to JavaScript with additional type checking and code
    verification to help them confidently develop large applications.
    More information about TypeScript can be found
    :ref:`here <typescript_recommendation>`.

.. _getting_started_build_modes:

Build Modes
-----------

The Turbulenz SDK comes with build tools that are run on the game code
before it is executed. These tools can perform several optimization
functions, and also automatically generate the appropriate html code
to load and run the game.  The tools support several build 'modes':

**plugin**

    A *release* version of the game (suitable for deployment), using
    the browser extensions plugin to provide low level access.  The
    :ref:`maketzjs` tool is used to bundle JavaScript code and all referenced
    libraries into a single .tzjs file that the Turbulenz engine can
    load with one request to the server.  Code will be executed by the
    JavaScript engine embedded in the browser plugin.

    Optionally, the code can also be compacted to obfuscate it and
    make it as small and fast as possible.

**canvas**

    Equivalent to *plugin*, except that the browser extensions plugin
    is not used.  Instead, the platform libraries make use of
    functionality built into the browser.

    In this mode, code is still bundled into a single file and can be
    compacted as in *plugin* mode.  However, the code bundle is a single .js
    file, since it must be loaded and run by the browsers own
    JavaScript engine.

**plugin-debug** and **canvas-debug**

    Intended for debugging during development, corresponding to
    *debug* versions of *plugin* and *canvas* respectively.  In these
    modes there is very little transformation of the JavaScript code.
    A single command (using the :ref:`makehtml` tool) takes a .js
    :ref:`template file <templating>`, and optionally a .html file, as input and produces a .html
    file that loads the game.  In these modes the code always runs
    using the browsers JavaScript engine, allowing standard web
    development tools to be used to debug the code (see
    :ref:`debugging`).

.. _getting_started_local_development_server:

The Local Development Server
----------------------------

.. TODO: Going to need maintenance if/when devserver role changes.

The Turbulenz SDK comes with a small server (referred to as
the :ref:`local development server <local_introduction>`), intended to be run on the developer's
machine.  This *local development server* is capable of serving files,
emulating the Turbulenz online services, recording metrics about the
game code and data as well as managing and deploying game projects.

While it is sometimes possible to launch games directly from the file
system, we recommend that developers use the local development server
to run and test during development.  Most browsers *require* that
applications are run from a server, especially in *canvas* modes.

.. TODO: Link to the HUB
.. TODO: OK to mention emulation of the online services?

.. ------------------------------------------------------------

.. _getting_started_creating_turbulenz_app:

--------------------------------
Creating a Turbulenz Application
--------------------------------

A Simple Example
----------------

With the local server still running:

1. Create a new folder such as *C:\\dev\\myfirstapp* or
   */Users/\*USERNAME\*/Development/myfirstapp* for the application.

2. Copy (DO NOT MOVE) the `jslib` folder from the SDK
   install directory into your applications folder. This is required
   for the build step to work.

3. Open your browser and navigate to http://127.0.0.1:8070.

   Use the *plus* button on the left of the page to create a new
   project, and fill in the 'Game Directory' text box with the path of
   the directory created in step 1.  Click 'CONFIRM' in the drop down
   box. Add a title e.g. "My First App". The rest can be left as default for now.

   .. NOTE::

    In the game directory field, you must specify the full path. Do not use ~/ to replace /Users/\*USERNAME*\/

   There should now be a manifest.yaml file in your applications
   directory.

4. Create a new file ``myfirstapp.js`` in your applications directory
   with the following contents::

     TurbulenzEngine.onload = function onloadFn()
     {
       var intervalID;
       var gd = TurbulenzEngine.createGraphicsDevice({});

       function tick()
       {
         if (gd.beginFrame())
         {
           gd.clear([1.0, 1.0, 1.0, 1.0], 1.0, 0.0);
           gd.endFrame();
         }
       }

       intervalID = TurbulenzEngine.setInterval(tick, 1000/60);
     };

5. Open a Turbulenz Environment prompt and change directory to your
   new folder.  Enter the following command to build an html page that
   runs your app in *plugin-debug* mode::

     makehtml --mode plugin-debug -t . myfirstapp.js -o myfirstapp.debug.html

   A file ``myfirstapp.debug.html`` should have been created in the
   current directory.

   .. NOTE::

     On Linux, the SDK only supports running in canvas mode.  Use the
     command for canvas-debug below in order to run the app.

6. Back in your browser, click on the *Play* button for your newly
   created project.  The page should list the file just created
   *myfirstapp.debug.html*.  Click on this file to open and run the
   application.  You will see the default development HTML page
   containing an instance of your application (for now just a blank
   area).

Try changing the value passed to ``gd.clear`` in the code (the
components represent Red, Green, Blue and Alpha values).  Re-run the
build step (5) and click *reload* in the browser.

This example shows the :ref:`makehtml` tool being used to build the
application in *plugin-debug* mode referred to above.  The other modes
can be built as follows.

**plugin**

For *plugin* (and *canvas* mode), a .tzjs code bundle is built using
the :ref:`maketzjs` tool, and then :ref:`makehtml` is used to create
an HTML page to load and run it::

    maketzjs --mode plugin -t . -o myfirstapp.tzjs myfirstapp.js
    makehtml --mode plugin -t . -o myfirstapp.release.html --code myfirstapp.tzjs myfirstapp.js

**canvas**

The process is similar to the *plugin* case, but the bundle is built
to a .js file (since the browser will load it directly)::

    maketzjs --mode canvas -t . -o myfirstapp.canvas.js myfirstapp.js
    makehtml --mode canvas -t . -o myfirstapp.canvas.html --code myfirstapp.canvas.js myfirstapp.js

**canvas-debug**

Similar to *plugin-debug* mode.  A single command creates the HTML page::

    makehtml --mode canvas-debug -t . myfirstapp.js -o myfirstapp.canvas.debug.html

This application simply clears the screen each frame, but it
illustrates the process of building and running code with the
Turbulenz tools.  Run either of the above tools with the ``-h`` flag
to get a list of available options.  In particular, the
:ref:`maketzjs` tool provides support for compacting and obfuscating
JavaScript code.


Explanation of Simple Example
-----------------------------

The Engine requires that the game define an entry point and assign it
to ``TurbulenzEngine.onload``, to be called at load time.  In general
the game will use this entry point function to perform some minimal
initialization and schedule asynchronous operations (such as screen
updates and loading) before returning control to the browser.

The :ref:`TurbulenzEngine <turbulenzobject>` global object exposes the
low-level API functionality of the engine.  Here the code uses it to
create a :ref:`GraphicsDevice <graphicsdevice>` (through which
graphics API calls are made), before defining the ``tick`` function.
Next, the :ref:`TurbulenzEngine <turbulenzobject>` is used again, this
time to schedule the newly defined ``tick`` function to be called 60
times per second.

``tick`` uses the :ref:`GraphicsDevice <graphicsdevice>` (via the
``gd`` variable created in the scope of the ``onloadFn`` entry point)
to clear the back buffer and display it to the browser window.

Using JavaScript Libraries
--------------------------

Code in other .js files can be imported using markup understood by the
Turbulenz build tools.  The majority of the Turbulenz Engine is made
up of JavaScript library code, contained in the ``jslib`` directory
that can be imported in this way.  When starting a new project we
recommend that developers take a copy of this directory and
immediately submit the unchanged versions to their revision control
system.

1. Copy the ``jslib`` folder from the install path to
   *C:\\dev\\myfirstapp* (or the location you chose for the simple
   example above).

2. Add the following two lines to the top of myfirstapp.js::

     /*{{ javascript("jslib/camera.js") }}*/
     /*{{ javascript("jslib/floor.js") }}*/

3. In ``onloadFn``, just before the ``tick`` function is defined,
   create a :ref:`Camera object <camera>` and a :ref:`Floor object
   <floor>`, as follows::

     var md = TurbulenzEngine.createMathDevice({});

     var camera = Camera.create(md);
     camera.lookAt(md.v3BuildZero(),
                   md.v3Build(0, 1, 0),
                   md.v3Build(0, 20, 100));

     var floor = Floor.create(gd, md);

4. Inside the ``tick`` function insert the following code in between
   the calls to ``clear`` and ``endFrame``, to render a floor::

     camera.updateViewMatrix();
     camera.updateViewProjectionMatrix();
     floor.render(gd, camera);

5. Re-run the commands above to build the .html (and .tzjs) files and
   open them in the browser.

JavaScript library code referenced using the technique above is
handled in one of two ways depending on the build mode.  In
*plugin-debug* and *canvas-debug* modes, the html created by
:ref:`makehtml` contains ``<script>`` tags that cause the code to be
loaded directly into the page.  When using *plugin* and *canvas*
modes, the .js files are concatenated into one self-contained file
that can be loaded with a single request to the server.

.. _getting_started_shutdown:

Shutdown
--------

Although JavaScript is a garbage collected language, it is important
to perform certain shutdown operations manually.  In particular, the
online APIs should be explicitly shutdown to notify the server that
the game session is finishing.  Explicit shutdown also helps to
guarantee that objects are destroyed in the correct order.

Game code can set the :ref:`onunload <turbulenzengine_onunload>`
property of the TurbulenzEngine object to a callback which will be
invoked when the engine is about to be shut down.  The game should use
this mechanism to shutdown any libraries and attempt to clear
references.  For example, the shutdown callback for the simple
application above might look something like::

    TurbulenzEngine.onunload = function gameOnunloadFn ()
    {
      if (intervalID)
      {
        TurbulenzEngine.clearInterval(intervalID);
      }
      floor = null;
      camera = null;
      md = null;
      gd = null;
    };

To use this in the example, place the code before the TurbulenzEngine.setInterval

Loading
-------

We next expand the sample above to demonstrate building a CgFX shader
and loading it for use at runtime.

1. Run the following command from the environment prompt in your
   project directory to build a CgFX shader into a JSON file ::

     *INSTALLDIR*/tools/bin/*PLATFORM*/cgfx2json \
       -i *INSTALLDIR*/assets/shaders/generic3D.cgfx \
       -o generic3D.cgfx.json

2. Expand the set of includes at the top of the file to look like this ::

     /*{{ javascript("jslib/camera.js") }}*/
     /*{{ javascript("jslib/floor.js") }}*/
     /*{{ javascript("jslib/requesthandler.js") }}*/
     /*{{ javascript("jslib/observer.js") }}*/

3. Add the following code just after the floor is created::

     var shader = null;
     var technique = null;

     // Load Shader
     var requestHandler = RequestHandler.create({});
     requestHandler.request({
         src: 'generic3D.cgfx.json',
         onload: function (shaderJSON)
         {
             var shaderParameters = JSON.parse(shaderJSON);
             shader = gd.createShader(shaderParameters);
             technique = shader.getTechnique('vertexColor3D');
         }
     });

     // Technique Parameters
     var techniqueParameters = gd.createTechniqueParameters({
         worldViewProjection: md.m44BuildIdentity()
     });

     // Create a vertex buffer for a cube
     var vertLBF = [ -20, -20,  20, 1, 0, 0, 1 ];
     var vertLTF = [ -20,  20,  20, 0, 1, 0, 1 ];
     var vertRTF = [ +20,  20,  20, 0, 0, 1, 1 ];
     var vertRBF = [ +20, -20,  20, 1, 1, 0, 1 ];
     var vertLBB = [ -20, -20, -20, 0, 0, 1, 1 ];
     var vertLTB = [ -20,  20, -20, 1, 1, 0, 1 ];
     var vertRTB = [ +20,  20, -20, 1, 0, 0, 1 ];
     var vertRBB = [ +20, -20, -20, 0, 1, 0, 1 ];
     var vertData = [].concat(
         vertLTF, vertLBF, vertRTF, vertRTF, vertLBF, vertRBF,  // front
         vertRTF, vertRBF, vertRTB, vertRTB, vertRBF, vertRBB,  // right
         vertLTB, vertLBB, vertLTF, vertLTF, vertLBB, vertLBF,  // left
         vertRTB, vertRBB, vertLTB, vertLTB, vertRBB, vertLBB,  // back
         vertLTB, vertLTF, vertRTB, vertRTB, vertLTF, vertRTF,  // top
         vertLBF, vertLBB, vertRBF, vertRBF, vertLBB, vertRBB   // bottom
     );
     var numVerts = vertData.length;

     var vertexBuffer = gd.createVertexBuffer({
         numVertices: numVerts,
         attributes: [gd.VERTEXFORMAT_FLOAT3, gd.VERTEXFORMAT_UBYTE4N],
         data: vertData,
     });

     // Semantics (bind vertices to shader inputs)
     var semantics = gd.createSemantics([ gd.SEMANTIC_POSITION,
                                          gd.SEMANTIC_COLOR ]);

     // Up vector
     var upVector = md.v3Build(0, 1, 0);

   This code does several things.  It first defines variables
   ``technique`` and ``shader`` which will be set later once the
   shader has been loaded.  Next it creates a :ref:`RequestHandler
   <requesthandler>` object which is used to load the shader
   (note the ``onload`` callback which parses the shader data and
   creates a runtime shader from it).

   Finally, low-level :ref:`VertexBuffer <vertexbuffer>`,
   :ref:`Semantics <semantics>` and :ref:`TechniqueParameters
   <techniqueparameters>` objects are created in preparation for
   rendering when the shader is loaded.

4. Add the following code inside the render loop, immediately after
   the call to ``floor.render()``::

      if (technique)
      {
          var angle = (TurbulenzEngine.time / (4 * Math.PI));
          angle = (angle - Math.floor(angle)) * (2 * Math.PI);

          var rotnMtx = md.m33FromAxisRotation(upVector, angle);
          techniqueParameters.worldViewProjection =
              md.m33MulM44(rotnMtx,
                           camera.viewProjectionMatrix,
                           techniqueParameters.worldViewProjection);

          gd.setTechnique(technique);
          gd.setTechniqueParameters(techniqueParameters);

          gd.setStream(vertexBuffer, semantics);
          gd.draw(gd.PRIMITIVE_TRIANGLES, numVerts, 0);
      }

   Once the shader has loaded and the ``onload`` callback has created
   it, ``technique`` will no longer be null and the contents of the
   ``if`` statement will be invoked.  The code calculates a rotation
   angle based on the current time, calculates a suitable
   *world-view-projection* matrix based on the projection matrix from
   the camera, sets the loaded shader technique and parameter and then
   renders the vertex buffer using that shader.

5. Build this code and reload the resulting HTML file in your browser.
   You should see a rotating cube appear in the scene.

.. NOTE::

    For brevity this code contains no error checking.  Production code
    should check at least that each object is created correctly and
    that the request for the shader succeeds.

.. ------------------------------------------------------------

.. _debugging:

---------
Debugging
---------

Error Checking
--------------

It is highly recommended that developers check the return values from
calls to the Turbulenz engine API, particularly during creation of
high-level objects such as the :ref:`GraphicsDevice <graphicsdevice>`
and the :ref:`SoundDevice <sounddevice>` where failure to create the
object may indicate that the browser does not support the required
APIs, or the client machine does not have the required capabilities.

The :ref:`onerror <turbulenzengine_onerror>` property of the
TurbulenzEngine object can be set to a user-defined callback that will
be invoked when the engine detects a problem.  This can catch bugs
such as invalid arguments passed to the API, and so we recommend that
this be set during development::

    TurbulenzEngine.onerror = function gameErrorFn (msg)
    {
      // Handle the error, using msg to inform the developer
      // what went wrong.

      window.alert(msg);
    };

.. NOTE::

    In canvas mode, error checking in the Turbulenz engine is often
    omitted for performance reasons.  We recommend that developers
    regularly run both the plugin and canvas versions of their games
    in order to catch as many coding errors as possible.

Browser Debugging Tools
-----------------------

Turbulenz recommends Chrome using canvas builds as a debugging and
testing environment, although it is worth experimenting with the
debugging features offered by each of the main browsers.  Note that in
some cases the *debug* modes are simply not supported on a given
browser.

A working debug environment should allow you to set breakpoints, step
through code and view the values of variables.

See the section :ref:`debugging_game_code` for more details.

.. ------------------------------------------------------------

.. _getting_started_assets:

------
Assets
------

There are many issues related to processing and loading of assets
which can have an effect on performance and load times.  The section
:ref:`assets` deals with this in more detail, covering topics such as
caching and best practices for asset pipelines.

Converting assets to JSON
-------------------------

The Turbulenz SDK comes with a series of tools for converting various
asset types into JSON files.  Modern browsers have optimized native
support for parsing JSON, and it is trivial to add custom data to a
JSON file.  Browsers generally also support image formats such as PNG
and JPEG for use in textures.  Compressed images are fully supported
when running with the Turbulenz browser extensions, but in canvas mode
may require manual decompression in JavaScript.

The Turbulenz tools are provided as a set of standalone command-line
programs.  This allows developers to easily integrate them into
existing pipelines or wrap them in their own custom scripts.

Some examples of useful tools for asset creation include:

:dae2json:

    Converts Collada formatted data into a JSON format understood by
    the TurbulenzEngine.  It can be instructed to extract only
    specific data types, for example animation or physics data, giving
    the developer full control over how data is divided and at what
    frequency it should be loaded.

    The output from this tool is understood by the :ref:`Scene object
    <scene>` and can be passed directly to it at runtime.

    The *-j* flag can be used to force this tool to write JSON in a
    human-friendly (but less optimal) format.  See the :ref:`full
    description <dae2json>` or invoke the tool with the *-h* flag to
    see the full set of options.

:cgfx2json:

    Reads in *.cgfx* files, extracts the *programs*, *techniques* and
    *parameters* and into the format used by the low-level
    :ref:`createShader <graphicsdevice_createshader>` method.  Thus,
    no data transformation is required at runtime to create a shader
    from this object.

The full list of tools and their descriptions is given in the Section
:ref:`tools`.

Loading
-------

At runtime, assets are loaded into the game by sending requests to the
server (using the :ref:`TurbulenzEngine.request
<turbulenzengine_request>` function).  These requests are carried out
asynchronously, with data or error codes being passed to the
application via callbacks.

To simplify the process of making such requests, handling errors and
dealing with the subtle differences between browsers, the Turbulenz
engine provides some higher level objects such as :ref:`RequestHandler
<requesthandler>`.  Objects such as :ref:`scene` implement
functionality that developers may find useful for loading and managing
assets at runtime.

The *scene_loading* sample and the *sampleapp* application in the SDK
provides examples of asset loading.

.. _getting_started_optimization:

Optimization Considerations
---------------------------

**Caching**

The browsers caching mechanisms can have a great effect on load times
for data that is successfully cached.  HTTP servers can provide hints
to the browser to tell how which data can be cached and for how long
(although the browser is free to ignore these and potentially use
other criteria to make caching decisions).

The Turbulenz servers consider the **staticmax** directories to
contain data that changes extremely infrequently.  If your game
project contains a **staticmax** directory then any data loaded from
it will be served with HTTP headers that tell the browser that it can
be cached for a long period of time.

This means that changes to data in the staticmax directories may not
be reflected in your game until the browser cache clears.  To avoid
this situation we recommend encoding a hash of the data contents into
the name of the built asset on disk.  When the contents changes, the
file name of the asset will no longer appear in the browser cache and
will therefore be reloaded.

**Mapping Tables**

Since a strategy such as this can make it very difficult to keep track
of which file corresponds to a given source file, Turbulenz recommends
the use of a *mapping table*, generated when assets are built.  This
*mapping table* is loaded (uncached) by the game to be used to look up
the **staticmax** file corresponding to a given source file.  In this
way, game code can refer to source assets such as *myshader.cgfx* and
loader code can request the latest version from the server, hopefully
using caching in an optimal way.

*Mapping tables* are supported by Turbulenz APIs that deal with
loading.  See the section :ref:`assets` and
:ref:`creating-a-mapping-table` for further information.

**Archives**

The number of individual browser requests can also have an influence
on loading times.  Each request carries data overhead due to the HTTP
protocol, and there can be significant latency associated with an
individual request.  Grouping data according to when it must be loaded
can help reduce the number of individual requests your game makes to
the server.  See the section :ref:`add-assets-to-archive` for one
method of grouping data.

See :ref:`considerations-for-asset-serving` for further discussion of
this topic.

.. _getting_started_typescript:

----------
TypeScript
----------

**EXPERIMENTAL**

**Added SDK 0.25.0**

Building apps in TypeScript that use the type definitions specified by Turbulenz libraries require a few additional tools provided outside the SDK.

*Included in the SDK:*

* **/tslib** - The TypeScript source implementation of the Turbulenz libraries and services.
* **/jslib-modular** - Generated modular groupings of certain Turbulenz libraries with their TypeScript definitions.
  These allow developers to build their TypeScript applications against certain jslib components.

*Not included in the SDK:*

* TypeScript compiler
* IDE/editor with TypeScript syntax highlighting/auto-completion

.. WARNING::

  TypeScript is not suitable for every project. Take a look at the pro's and con's :ref:`here <typescript_recommendation>` and make sure you understand what it does by visiting `typescriptlang.org <http://www.typescriptlang.org>`_

Installation
------------

To compile apps written in TypeScript for Turbulenz you require the TypeScript compiler.
You will need the **tsc** command to be callable from the Turbulenz environment.

1) Install TypeScript from the instructions on `typescriptlang.org downloads <http://www.typescriptlang.org/#Download>`_
2) Start the :ref:`Turbulenz environment <getting_started_run_env>` on your platform.
3) Check the compiler by running the following command in the root Turbulenz SDK directory::

      tsc tslib/camera.ts

  This command will generate the JavaScript for the camera object in the same directory (tslib).
  If the compiler worked, the command should complete with no errors and you can delete the output file after reading it.

IDE/Editor Setup
----------------

TypeScript is most beneficial when combined with a development environment.
Varying degrees of support are available for the following IDEs/Editors:

* Visual Studio
* Sublime Text
* Emacs
* Vim

More information can be found
`here <http://blogs.msdn.com/b/interoperability/archive/2012/10/01/sublime-text-vi-emacs-typescript-enabled.aspx>`_

**Visual Studio 2012**

The most complete TypeScript support is for `Visual Studio 2012 <http://www.microsoft.com/en-us/download/details.aspx?id=34790>`_.

**Sublime Text 2**

If you are using Sublime Text 2 as your default IDE, there are a number of TypeScript projects for Sublime at various stages of development.
The syntax highlighting can be `downloaded <http://blogs.msdn.com/b/interoperability/archive/2012/10/01/sublime-text-vi-emacs-typescript-enabled.aspx>`_ from the Microsoft page or easily installed from `Sublime Package Control <http://wbond.net/sublime_packages/package_control>`_

1) Follow the instructions to install package control
2) From the Command Palette (Usually CTRL+SHIFT+P) type and select "Package Control: Install Package"
3) From the list of packages select "TypeScript"
4) Opening .ts files should now be syntax highlighted (May require reopening Sublime Text)

Compiling
---------

.. NOTE::

  The commands specified in this section were written for use with tsc version 0.8.3. For the latest commands, see the `latest project information <http://typescript.codeplex.com/>`_

**Basic compilation**

To compile a .ts file to JavaScript simply type:

::

  tsc filename.ts

This will output filename.js with errors listed on the command line.
The output JavaScript file will be located in the same directory as the source file.
To specify a different filename/location, use the --out command e.g.
::

  tsc --out new_dir/new_filename.js filename.ts

**Compiling a TypeScript application against Turbulenz**

To build a TypeScript app that uses Turbulenz you will need the TypeScript declarations located in jslib-modular and implementation from jslib.
You will need the following directories:

* jslib
* jslib-modular

The jslib-modular directory has groups of definitions for the following:

.. _getting_started_jslib_modular:

**SDK 0.25.0**

*jslib-modular*

  * aabbtree.d.ts: AABB tree used by the scene
  * base.d.ts: Declarations to augment lib.d.ts
  * canvas.d.ts: Turbulenz implementation of canvas API
  * debug.d.ts: Debug functionality
  * fontmanager.d.ts: Font rendering
  * jsengine.d.ts: Engine core
  * jsengine_base.d.ts: Fundamental shared classes in high-level engine
  * jsengine_debug.d.ts: Extra debug functionality for high-level engine
  * jsengine_deferredrendering.d.ts: Additions for DeferredRendering
  * jsengine_forwardrendering.d.ts: Additions for ForwardRendering
  * jsengine_simplerendering.d.ts: Additions for SimpleRendering
  * physics2d.d.ts: 2d physics
  * servicedatatypes.d.ts: References used by services
  * services.d.ts: Turbulenz online services API
  * turbulenz.d.ts: Low-level platform API (plugin engine API)
  * tzdraw2d.d.ts: 2d rendering functionality
  * utilities.d.ts: Low level shared functions
  * vmath.d.ts: Turbulenz Math library implementation
  * webgl.d.ts: Additional declarations for the GraphicsDevice

Using this method you will generate JavaScript files for your application, which you can use in conjunction with jslib.
To explain how to do this, we will convert SampleApp to TypeScript and combine it with the jslib-modular declarations.
You will need to start by doing the following:

1) Create a new folder in *SDK_DIR*/apps/sampleapp/tsscripts
2) Copy the following files to the folder structure

  * *SDK_DIR*/apps/sampleapp/scripts/sampleappmain.js -> *SDK_DIR*/apps/sampleapp/tsscripts/sampleappmain.ts (NOTE: Keep the contents of the original file, but change the extension)
  * *SDK_DIR*/apps/sampleapp/scripts/sampleappmain.js -> *SDK_DIR*/apps/sampleapp/scripts/sampleappmain.js.bk (NOTE: Make a backup of the original file)
  * *SDK_DIR*/samples/scripts/motion.d.ts -> *SDK_DIR*/apps/sampleapp/scripts/motion.d.ts
  * *SDK_DIR*/samples/scripts/sceneloader.d.ts -> *SDK_DIR*/apps/sampleapp/scripts/sceneloader.d.ts

3) Add the following references to the TypeScript file.
   They should be specified after the *global* declarations, but before the *TurbulenzEngine.onload* function ::

    /// <reference path="../../../jslib-modular/turbulenz.d.ts" />
    /// <reference path="../../../jslib-modular/servicedatatypes.d.ts" />
    /// <reference path="../../../jslib-modular/services.d.ts" />
    /// <reference path="../../../jslib-modular/aabbtree.d.ts" />
    /// <reference path="../../../jslib-modular/jsengine_base.d.ts" />
    /// <reference path="../../../jslib-modular/jsengine.d.ts" />
    /// <reference path="../../../jslib-modular/utilities.d.ts" />

   In addition, you will need to add references for motion and sceneloader, which are part of the scripts directory: ::

    /// <reference path="../scripts/motion.d.ts" />
    /// <reference path="../scripts/sceneloader.d.ts" />

   .. NOTE::

      The declarations in this example require additional declaration files.
      If you move the location of jslib-modular, make sure to include all files.

   .. NOTE::

      In Visual Studio, the IDE will warn you which classes it can't find references for and underline them in red.
      If you run the TypeScript compiler directly, it will list them in the output.
      Once all references have been satisfied, there will be no additional messages.

4) To build the sample, run the command ::

    tsc --out apps/sampleapp/scripts/sampleappmain.js apps/sampleapp/tsscripts/sampleappmain.ts

  The output is similar to the original sampleappmain.js file, but the formatting is slightly different.
  This command will overwrite the original sampleappmain.js
  If you wish to run the release version, you must :ref:`rebuild the app <getting_started_rebuilding_apps>`.

5) Run the app from the local server and open the debugger.
   The source code for the sampleapp should be the TypeScript generated output.
   You can breakpoint and step through the code like regular JavaScript in the debug build.

6) This is the most basic of conversions, but now you are able to start adding TypeScript specific code to the app.

.. _getting_started_rebuilding_an_application:

-------------------------
Rebuilding an Application
-------------------------

Sometimes when learning how to use Turbulenz features you might want to try changing an existing application to try a new function or different arguments.
Depending which file(s) you change you there are certain files you may or may not have to rebuild.
Changes to this pattern of files require rebuilding the following:

* **scripts/\*.js** -> \*.canvas.js, \*.tzjs
* **templates/\*.js** -> \*.canvas.js, \*.tzjs, \*.canvas.debug.html. \*.canvas.release.html, \*.debug.html, \*.release.html
* **templates/\*.html** -> \*.canvas.debug.html. \*.canvas.release.html, \*.debug.html, \*.release.html
* **jslib/\*.js** -> \*.canvas.js, \*.tzjs, \*.canvas.debug.html. \*.canvas.release.html, \*.debug.html, \*.release.html

**TypeScript:**

* **tsscripts/\*.ts** -> scripts/\*.js (Sometimes templates/\*.js)

Adding additional scripts to any of the samples/apps will likely need an updated template and a complete rebuild.
The following list of commands are required for samples and apps respectively.

.. _getting_started_rebuilding_samples:

Samples
-------

In samples the majority of the example code is located in the template file, hence you will likely need to rebuild all configurations for most changes:

.. NOTE::

  The commands must be run with the Turbulenz Environment enabled from the *SDK*/samples directory

Assumed variables:

* *SAMPLENAME* - The name of the sample to rebuild e.g. 2dcanvas, animation etc.
* *TYPESCRIPTNAME* - The name of the specific TypeScript file you want to rebuild e.g. debugphysics, morph, sceneloader etc.
* *JSLIBMODULARDEP* - The name of each jslib-modular file the sample depends on e.g. jsengine_base, turbulenz, physics2d etc.
  Generally the samples list what they require in the templates file. See :ref:`jslib-modular <getting_started_jslib_modular>`.
* *OTHERDEP* - Any other files that the sample requires.
* *SAMPLESCRIPT* - These are the shared scripts that a sample requires to run e.g. morph, motion, sceneloader etc.
* [file.ts ..] - Refers to a list of files. You should replace this with the files you require. Do not include the *[* and *..]*.

**TypeScript Only:**

  To rebuild sample helper scripts (shared across samples), you must know their dependencies and include them via the declarations files.
  Samples use the jslib and jslib-modular for their TypeScript files.
  If not all dependencies are met, the command will display errors and TYPESCRIPTNAME.d.ts will *not* be generated.

  ::

    tsc -c --out scripts --declaration tsscripts/TYPESCRIPTNAME.ts [../jslib-modular/JSLIBMODULARDEP.d.ts ..] [OTHERDEP.d.ts ..]

  To rebuild sample templates (per sample), you must know what the sample uses and include dependencies via the \*.d.ts files in jslib-modular.
  The SAMPLESCRIPT files will includes things like the shared scripts that the sample needs.

  ::

    tsc -c --out templates tsscripts/templates/SAMPLENAME.ts [../jslib-modular/JSLIBMODULARDEP.d.ts ..] [scripts/SAMPLESCRIPT.d.ts ..] [OTHERDEP.d.ts ..]

  Once the updated JavaScript has been generated, you must rebuild the required JavaScript files.

  .. NOTE::

    Some samples may require externally defined libraries such as jQuery. These can be located here: https://github.com/borisyankov/DefinitelyTyped

**JavaScript:**

  **Canvas-Debug**
  ::

    makehtml --mode canvas-debug -t templates -t . -o SAMPLENAME.canvas.debug.html SAMPLENAME.js SAMPLENAME.html

  **Canvas-Release**
  ::

    maketzjs --mode canvas -t templates -t . -o SAMPLENAME.canvas.js SAMPLENAME.js -u ../external/uglifyjs/bin/uglifyjs
    makehtml --mode canvas -t templates -t . --code SAMPLENAME.canvas.js -o SAMPLENAME.canvas.release.html SAMPLENAME.js SAMPLENAME.html

  **Plugin-Debug**
  ::

    makehtml --mode plugin-debug -t templates -t . -o SAMPLENAME.debug.html SAMPLENAME.js SAMPLENAME.html

  **Plugin-Release**
  ::

    maketzjs --mode plugin -t templates -t . -o SAMPLENAME.tzjs SAMPLENAME.js -u ../external/uglifyjs/bin/uglifyjs
    makehtml --mode plugin -t templates -t . --code SAMPLENAME.tzjs -o SAMPLENAME.release.html SAMPLENAME.js SAMPLENAME.html

  .. NOTE::

      To rebuild without compacting the output, do the same command without the UglifyJS option.

.. _getting_started_rebuilding_apps:

Apps
----

Apps are structured slightly differently from Samples because the majority of code is located in scripts files, not the main template.
For that reason, making simple changes usually requires less to rebuild for the sake of testing debug configurations:

.. NOTE::

    The commands must be run with the Turbulenz Environment enabled from the *SDK*/apps/APPNAME directory

Assumed variables:

* *APPNAME* - The name of the app you wish to rebuild e.g. multiworm, sampleapp etc.
* *APPFILE* - The name of any files that make up the app e.g. appscene, wormapp etc.
* *TYPESCRIPTNAME* - The name of the specific TypeScript file you want to rebuild e.g. sampleappmain, inputapp, wormapp.
* *JSLIBMODULARDEP* - The name of each jslib-modular file the app depends on e.g. jsengine_base, turbulenz, physics2d. See :ref:`jslib-modular <getting_started_jslib_modular>`.
* *OTHERDEP* - Any other files that the sample requires.
* [file.ts ..] - Refers to a list of files. You should replace this with the files you require. Do not include the *[* and *..]*.

**TypeScript Only:**

  To rebuild app scripts, you must know their dependencies and reference them either via the \*.d.ts definition files or via \*.ts directly.

  For generating a combined JavaScript file and definition::

      tsc -c --out scripts/APPNAME.js --declaration [tsscripts/APPNAME/APPFILE.ts ..] [../../jslib-modular/JSLIBMODULARDEP.d.ts ..] [OTHERDEP.d.ts ..]

  .. NOTE::

      This should *NOT* include the APPNAME_entry.ts file, which is used to generate the template.

  For generating the template from the APPNAME_entry.ts file::

      tsc -c --out templates/APPNAME.js tsscripts/APPNAME/APPNAME_entry.ts scripts/APPNAME.d.ts [../../jslib-modular/JSLIBMODULARDEP.d.ts ..] [OTHERDEP.d.ts ..]

  .. NOTE::

      For each jslib-modular file you add you must ensure the template file has each required definition::

        /*{{ javascript("jslib/LIBNAME.js") }}*/

  .. NOTE::

    Some samples may require externally defined libraries such as jQuery. These can be located here: https://github.com/borisyankov/DefinitelyTyped

**JavaScript:**

  **Canvas-Debug**
  ::

    makehtml --mode canvas-debug -t templates -t . -o APPNAME.canvas.debug.html APPNAME.js APPNAME.html

  **Canvas-Release**
  ::

    maketzjs --mode canvas -t templates -t . -o APPNAME.canvas.js APPNAME.js -u ../../external/uglifyjs/bin/uglifyjs
    makehtml --mode canvas -t templates -t . --code APPNAME.canvas.js -o APPNAME.canvas.release.html APPNAME.js APPNAME.html

  **Plugin-Debug**
  ::

    makehtml --mode plugin-debug -t templates -t . -o APPNAME.debug.html APPNAME.js APPNAME.html

  **Plugin-Release**
  ::

    maketzjs --mode plugin -t templates -t . -o APPNAME.tzjs APPNAME.js -u ../../external/uglifyjs/bin/uglifyjs
    makehtml --mode plugin -t templates -t . --code APPNAME.tzjs -o APPNAME.release.html APPNAME.js APPNAME.html

  .. NOTE::

      To rebuild without compacting the output, do the same command without the UglifyJS option.

  .. NOTE::

      Apps that use the default template should omit the APPNAME.html for each makehtml command.




