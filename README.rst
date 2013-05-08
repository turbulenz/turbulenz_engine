================
Turbulenz Engine
================

Turbulenz is an HTML5 game engine and server-side APIs available in JavaScript and TypeScript for building and distributing 2D and 3D games that run on platforms that support HTML5 features such as modern browsers without the need for plugins.

.. contents::
    :local:


Features
========

Low-level API
-------------

**Graphics**

- Simple shader-based immediate mode API:

  - A Shader may contain multiple Techniques, either single or multi-pass.
  - Once a shader Technique is set on the Device, the parameters required by the program code can be updated by a TechniqueParameter object:
  - TechniqueParameter objects hold multiple references to Textures, TechniqueParameterBuffers or individual values.
  - Multiple TechniqueParameters can be set on the Device at once.

- Vertex buffers, Index buffers and Textures can be created, updated and destroyed dynamically.
- Multiple Streams of Vertex buffers can be used at the same time.
- Support for 1D, 2D, 3D and Cube textures: Any pixel format supported by the hardware.
- Asynchronous resource loading: multiple resource files can be downloaded on the fly, JavaScript code will be notified when resource is available for usage.
- Multiple image file formats: DDS, JPG, PNG and TGA.
- Support for textures archives containing multiple image files: less flexibility than individual files but better for optimal bandwidth usage.
- Occlusion queries:

  - Number of pixels rendered can be queried for a section of rendering.
  - Available in plugin mode only.

- Fullscreen support (Supported platforms).
- Take screenshot feature:
- Video playback support:

  - WebM, MP4.
  - Render video as texture.
  - Playback controls play, pause, stop, resume, rewind.

**Math**

- Math types:

  - *Vector2* *Vector3*, *Vector4*
  - *Matrix33*, *Matrix34*, *Matrix43*, *Matrix44*
  - *Quaternion*, *QuatPos*
  - *AABB*

- Storage format optimized based on available support
- Optimized operations support *destination parameters*, reducing object allocation.
- Array to/from Math type conversion utilities.

**Physics**

**3D**

- Easy-to-use efficient physics simulation.

  - Optimized JavaScript implementation.
  - In plugin mode, this is a lightweight wrapper around the Bullet Physics Library http://bulletphysics.org/wordpress/

- Rigid bodies and collision objects: Plane, Box, Sphere, Capsule, Cylinder, Cone, Triangle Mesh, Convex Hull.
- Constraints: Point to Point, Hinge, Cone Twist, 6DOF, Slider.
- Ray and convex sweep queries: Returning closest point of impact and surface normal.
- Character representation.

  - For use with 1st/3rd person games.
  - Includes properties for velocity, position, crouch, jump height, death, on ground.

- Contact callbacks.

  - Rigidbodies, characters, collision objects.
  - Called on presolve, added, processed, removed.
  - Filter responses by mask.
  - Triggers with no collision response.

**2D**

- Efficient 2D physics simulation written specifically for JavaScript.
- Shapes:

  - Circle, Box, Rectangle, Regular Polygon, Custom Polygon.
  - Create shapes as sensors.
  - Shape grouping and mask interactions.

- Collision detection:

  - Sweep & Prune, Box Tree Broadphases.
  - Utilities for Raytest, Signed Distance, Intersection, Contains Point, Sweep Test.

- Simulation world:

  - Multiple simulation groups.
  - Optional gravity.
  - Customisable simulation iterations.

- Rigid body simulation: Dynamic, Static, Kinematic objects.
- Materials: Elasticity, Static/Dynamic/Rolling Friction, Density.
- Arbiters:

  - Contact grouping.
  - Contact information: Position, Penetration, Normal/Tangent Impulse

- Constraints: Point to Point, Distance, Weld, Angle, Motor, Line, Pulley, Custom Constraint.
- Debug rendering:

  - Rigid Bodies, Constraints, Worlds, Lines, Curves, Rectangles, Circles, Spirals, Linear/Spiral Springs.
  - Enabling and disabling of rendering types.
  - Scaling for Draw2D viewport.

**Sound**

- Easy-to-use efficient wrapper of hardware audio features: Utilizes Web Audio, <Audio> tag, `OpenAL <http://connect.creativelabs.com/openal/default.aspx>`__ dependent on platform support.
- 3D sound sources: Position, Direction, Velocity, Gain, Pitch, Loop.
- Emulated 3D sound for stereo setups.
- Asynchronous sound files loading: Multiple resource files can be downloaded on the fly, JavaScript code will be notified when resource is available for usage.
- Uncompress audio dynamically.
- Multiple sound file formats: OGG, WAV, MP3.
- Supported query for platform capabilities: Load the best audio format for the platform.
- Effect/Filter support: Reverb, Echo, Low Pass

**Networking**

- Bi-directional, full-duplex communications channels, over a TCP socket:

  - Utilizes browser Websocket support.
  - Efficient native implementation of WebSockets for platforms without support:

    - http://en.wikipedia.org/wiki/WebSocket
    - http://dev.w3.org/html5/websockets/

- HTTP-compatible handshake so that HTTP servers can share their default HTTP and HTTPS ports (80 and 443) with a WebSocket server.
- Support for secure connections as part of the standard.
- Support for data compression with the extension `deflate-frame`.

**Input**

- Access to input types: Keyboard, Mouse, Xbox360 Pad, Joysticks, Wheels, Touch, Multi-touch
- Asynchronous event system when state changes:

  - JavaScript code is notified when input changes.
  - Events for keydown, keyup, mousedown, mouseup, mousewheel, mousemove,
    mouseover, mouseenter, mouseleave, paddown, padup, focus, blur, mouselocklost,
    touchstart, touchend, touchmove, touchmove, touchenter, touchleave, touchcancel.

- Additional mouse features: hiding/showing platform icon, locking/unlocking (supported platforms).
- Language independent keymapping.

High-level API
--------------

**Scene Graph**

- Flexible JSON file format: Could describe either a whole scene or individual meshes.
- Asynchronous loading of external references:

  - If a scene contains references to external meshes they are all loaded in parallel and attached to the main scene when ready.
  - Support for optimal reuse of same mesh on different locations.

- Pluggable renderer system:

  - Links between geometries, effects and materials are resolved at
    runtime.
  - Easy swap of multiple rendering techniques for same assets.

- Geometry sharing: Geometry information can be optimally reused on multiple scene locations with different rendering effects.
- Flexible scene hierarchy nodes: Lights, Geometries, Animation, Physics.
- Visibility queries: Portals, Frustum, Overlapping Box.
- Sorting and grouping: Visible nodes are sorted and grouped for optimal rendering: Opaque, Transparent, Decal.
- Lazy evaluation of node updates.

**Animation**

- 3D animation for scene geometry.
- Skeleton/Skinning animation.
- Animation controllers:

  - Interpolation, Overloaded Node, Reference, Transition, Blend, Mask, Pose, Skin, GPU Skin, Skinned Node.
  - Controllers can be combined for desired effect.

- Dynamically update scene data.

**Resource Manager**

- Asynchronous loading avoiding duplicates: Additional remapping layer for easy URL redirection.
- Provide default resources if missing: Game can provide custom default resource to be used when a required one is missing or still loading.
- Multiple managers for individual needs: Animations, Effects, Fonts, Shaders, Sounds, Textures.
- Bandwidth and hardware scaling by selecting different assets and effects depending on machine and Internet connection performance.
- Client-side asset cache for optimizing and reusing requests.

**Server Requests**

- HTTP & AJAX request functionality:

  - Automatic retry and error handling.
  - Cross-browser support.
  - Encrypted API support.

**Deferred Renderer**

- Unlimited number of lights: Point, Spot, Directional, Ambient.
- Texture based light falloff: Allows multi-colored lights and cheap fake shadows, for example the typical fan under a light source.
- Materials with multiple texture maps: Specular color and intensity, Normal vector, Glow color, Alpha.
- Pluggable post effects:

  - Easy set-up for full screen post effects as part of the final deferred shading.
  - Copy, Fade in, Modulate, Bicolor, Blend.

- Exponential shadow maps:

  - Reuse of texture shadow maps to save video memory.
  - Gaussian blur for smooth results.
  - Exponential depth information to avoid light bleeding.

- Volumetric fog.
- 4 weight GPU skinning.
- UV animation.
- Wireframe mode.
- Callbacks for additional passes: decals, transparency, debug
- Available in plugin mode only until draw buffers are added to WebGL http://www.khronos.org/registry/webgl/extensions/WEBGL_draw_buffers/

**Forward Renderer**

- Unlimited number of lights: Point, Spot, Directional, Ambient.
- Texture based light falloff: Allows multi-colored lights and cheap fake shadows, for example the typical fan under a light source.
- Materials with multiple texture maps: Specular color and intensity, Normal vector, Glow color, Alpha.
- Pluggable post effects:

  - Easy set-up for full screen post effects as part of the final
    deferred shading.
  - Copy, Fade in, Modulate, Bicolor, Blend.

- Exponential shadow maps:

  - Reuse of texture shadow maps to save video memory.
  - Gaussian blur for smooth results.
  - Exponential depth information to avoid light bleeding.

- 4 weight GPU skinning.
- UV animation.
- Wireframe mode.
- Callbacks for additional passes: decals, transparency, debug

**Default Renderer**

- Single point and ambient light.
- Pixel-based lighting.
- Materials with multiple texture maps: Specular color and intensity, Normal vector, Glow color, Alpha.
- Optimzed for speed and compatibility on a wide range of hardware.
- 4 weight GPU skinning.
- UV animation.
- Wireframe mode.
- Callbacks for additional passes: decals, transparency, debug

**Simple Renderer**

- Single point and ambient light.
- Vertex-based lighting.
- Materials with multiple texture maps: Specular color and intensity, Normal vector, Glow color, Alpha.
- Optimzed for speed and compatibility on a wide range of hardware.
- 4 weight GPU skinning.
- UV animation.
- Wireframe mode.
- Callbacks for additional passes: decals, transparency, debug

**2D Rendering**

**Draw2D**

- 2D sprite-based renderer: Batches sprites for efficiency.
- Draw modes:

  - **Draw:** Draw object literal,
  - **DrawRaw:** Draw buffer data,
  - **DrawSprite:** Draw sprite reference.

- Scalable viewport: Input coordinate mapping.
- Sort modes: Immediate, Deferred, Texture.
- Blend modes: Opaque, Additive, Alpha.
- Custom shader support.
- Render-to-target support.
- Texture effects: Distort, Gaussian Blur, Bloom, Color, Grey Scale, Sepia, Negative, Saturation, Hue, Brightness, Contrast.
- Recording performance data.

**Canvas2D**

- Accelerated implementation of `canvas 2D API <http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/>`__.
- Runs on WebGL/OpenGL depending on platform.
- SVG rendering.
- Text rendering via FontManager.
- For complete implementation see `canvas element specification <http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas-element>`__

**Utilities**

- Allocation and management of graphics buffers: Vertex buffers, Index buffers.
- API controlled JavaScript profiling:

  - Per-function millisecond accuracy timing.
  - Record top-down or bottom-up function trees.
  - Calculate the time spent by an individual function or
    the total spent by sub-functions.
  - Identify the source file and line number of problematic areas.

- Memory usage identification:

  - Retrieve the object count of constructed object types.
  - Take snapshots and compare memory fluctuations.

- Encryption and decryption of server-side requests for TZO formats.
- Debug utility with function stripping for performance:

  - assert, log, abort.
  - Complete stacktrace.
  - Supports adding custom functions.

- Network Simulator:

  - Simulates latency and network behaviour.
  - Client-side manipulation of multiplayer session messages.
  - Simulates spikes in network traffic.

Turbulenz Service API
---------------------

**Leaderboards**

- Submitting/retrieving ranked friend/global leaderboards.
- Default score entries.
- Infinitely scrollable scoreboards.
- Friend's score notifications.

**Badges**

- Achievement system for awarding game progress.
- Custom badge shape and design
- Progression badges.
- Achievement notification.

**Payments**

- Payments API: In game, On website, App stores.
- Payment methods: Single purchase, Micro transactions.
- Purchasable items: Ownable, Consumeable.

**Userdata**

- Per-user save game information.
- Key-value pair data storage: Settings, Preferences, Personal items.

**Userprofile**

- Game player's profile information: Username, Display name, Language, Age, Country, Guest user.

**Gameprofile**

- Game status of a player:

  - Viewable by other players a game.
  - Custom field information decided by game.

**Multiplayer**

- Real-time session match-making between friends and public users.
- Session creation/joining.
- Multiplayer session invite and notification.

**Metrics**

- Custom event submission:

  - Can be used to gather progress during game.
  - Exportable from developer services.
  - Events identifiable by custom key.
  - Allows additional numerical data.

**Bridge**

- Bi-directional communication channel between game and webpage.
- Allows messages to be exchanged.
- Live updating: Badge progress, notifications, loading/saving status.

**Utilities**

- Mapping between game resources references and content distribution network.
- Uniquely identifiable gamesession.
- Service availability notification.

What Are the Design Goals of the Turbulenz Engine
=================================================

The main design goals of the Turbulenz Engine are performance, modularity and customizability. Users of the engine should be able to build any kind of game without limitations, in an efficient manner and with an end product that performs optimally when loading and during play.

To achieve this target the Turbulenz team followed these rules when writing code:

**Modularity**

- Users should be able to pick what they want and replace what they don't.
- When possible new functionality should be orthogonal to existing one.

**High performance**

- Strict coding standards to keep code efficient.
- Keep memory allocations to minimum, reuse existing objects or arrays whenever possible, use scratch pads, combine multiple separate objects into a single one.
- Use most efficient storage for each data, Typed Arrays when possible.
- Reduce function calls when possible: write functions that handle arrays of objects instead of loops that make a function call per element, games rarely do a single thing to a single object.
- Be aware of performance differences between browsers.
- Profile often.

**Asynchronous loading**

- No API should block waiting for a response from the server, avoid polling whenever possible, use callbacks or Promises, to notify of data availability.

**Data driven**

- The target should be to make the game a simple dumb player of data, all functionality defined by simple data files.

**Simple well documented file formats**

- Define simple, easy to create asset formats that can trivially be connected to any tool chain.

**Scalability**

- Design interfaces that can be implemented with different level of detail or quality settings in order to scale from mobile to desktops.

**Power without control is nothing**

- Make sure users can do exactly what they want, with a helper layer put on top if required, document performance implications at every level.

**Fault tolerant**

- The engine should keep going even if any type of asset fails to load. The application is able to provide sensible defaults for all asset types making it easier to stay productive and diagnose issues.

**Fast loading**

- Reduce amount of data to be downloaded, compress data efficiently.
- Use the browser cache efficiently, use unique file names based on content and tell the browser to cache forever.

**Maintainability**

- Strict coding standards to keep code readable, easy to maintain and debug.
- Write unit tests, samples and documentation for every new code path.

**Targeted**

- This is a game engine, for games.


History
=======

The Engine was created and is maintained by `Turbulenz Limited <http://biz.turbulenz.com>`__ and was open sourced
in April 2013.

The latest release is 1.0 which is tagged in the repository or a tarball/zip can be can be downloaded from
`here <https://github.com/turbulenz/turbulenz_engine/archive/release_1.0.tar.gz>`__

A full history of changes can be found in the `Changelog <docs/source/changelog.rst>`__


Setup Guide
===========

There are two ways to get up and running with the Turbulenz Engine, you can downloaded a packaged fully QA'd
snapshot release from the `Turbulenz Hub <https://hub.turbulenz.com>`__. These installers are available for
Windows, Mac OSX and Linux and will install all the required packages and dependencies to get started,
a full guide can be found at `<http://docs.turbulenz.com/installing.html>`__

*Note: SDK versions prior to 0.26.0 were released under a non open source license.*

If you want to run with the latest version or would like to contribute to the open source project the steps for
getting setup are included below. Use of the open source repository is tested against Windows, Mac OSX and Linux
but may also work on other unix-like operating systems.

Setup
-----

1. Clone the repository `<http://github.com/turbulenz/turbulenz_engine>`__ (or if you wish you can fork the repository
   on GitHub and clone that). To clone the repository maintained by Turbulenz use
   ::

        $ git clone git://github.com/turbulenz/turbulenz_engine.git

2. The Turbulenz Engine submodules the following technology in the external folder

   + tzbuild: https://github.com/turbulenz/turbulenz_build
   + DefinitelyTyped: https://github.com/borisyankov/DefinitelyTyped
   + UglifyJS: https://github.com/mishoo/UglifyJS.git

   Initialize the Git submodules with
   ::

        $ git submodule update --init

3. Check you have the pre-requisites installed

   + Python 2.7.x (2.7.3 is the current QA'd version) - if you have multiple Python versions installed e.g. 3.x
     you may need to run commands with ``python2.7``
   + VirtualEnv - 1.9.1 or higher recommended

   You can check versions with
   ::

        $ python --version
        Python 2.7.3
        $ virtualenv --version
        1.9.1

4. From the cloned repository create a VirtualEnv environment to install the required Python packages and NodeJS,
   allowing you to use all the features of the Turbulenz Engine. Note if Python is not on your shell's path you
   will need to specify the full path for this first command.
   ::

        $ python manage.py env

5. Activate the environment in your shell.
   ::

        $ source env/bin/activate - for bash and similar shells
        > env\scripts\activate.bat - for Windows

6. If you want to move onto the API tutorial section next then your final command is to build the JavaScript sources
   from the TypeScript sources. The next section will detail some of the additional actions you can perform or you
   can move onto `Getting Started With The API`_
   ::

        $ python manage.py jslib

Working With The Open Source Project
------------------------------------

The manage.py script at the top level of the repository provides a set of commands for managing the Engine, the
script should be run as ``python manage.py command`` on Windows but can usually be shortcut to ``./manage.py command``
on unix shells. Running the script with ``--help`` will give a list of commands available, most of these are
described below. All the commands other than the env command expect to have the VirtualEnv environment activated
as described in the setup section.

- **JavaScript Sources** - The Turbulenz Engine source is written in TypeScript. To generate the JavaScript version
  of the engine source run the command
  ::

    $ python manage.py jslib

- **Tools** - The Turbulenz Engine includes a number of Python tools which are installed during the env command.
  In addition the Engine includes a CGFX shader conversion tool which can be built with the following command.
  See the `Dependencies`_ section for details of required compiler toolchains.
  ::

    $ python manage.py tools

- **Documentation** - The Turbulenz Engine documentation is based on restructured text sources. To build the html
  documentation run the command
  ::

    $ python manage.py docs

- **Samples** - Various samples are included with the Turbulenz Engine. These can be built from their TypeScript
  sources with the command below. This generates a set of html files, JavaScript and asset JSON files which can
  be served with a web server such as the Turbulenz Local Development Server.
  ::

    $ python manage.py samples

- **Applications** - The Turbulenz Engine project includes a few larger applications and some templates for building
  your own application. These can be found in the apps folder, and can be built with the command
  ::

    $ python manage.py apps

  You can also build individual apps by specifying their name e.g.
  ::

    $ python manage.py apps multiworm

- **Command Line Tools** - Various command line tools for processing code and assets are installed as part of the
  virtual environment. These are available at the command line e.g. running ``dae2json`` will execute the dae2json
  tool used to convert Collada assets to a Turbulenz Engine JSON asset format. See the
  `tools <http://docs.turbulenz.com/tools/index.html>`__ section in the documentation for more details on the tools.

- **Local Development Server** - Setting up the environment also includes a locally hosted web server which can be
  used for development of HTML5 games and applications. See the
  `Local Server <http://docs.turbulenz.com/local/index.html>`__ section in the documentation for more details.


Getting Started With The API
============================

To try the Turbulenz APIs requires only a text editor and a browser such as Google Chrome or Mozilla Firefox.
Create an HTML file with the following content and place it in the root of the Turbulenz directory::

    <html>
    <head>
        <title>Turbulenz - API - Clear Screen Example</title>
        <script src="jslib/debug.js"></script>
        <script src="jslib/webgl/turbulenzengine.js"></script>
        <script src="jslib/webgl/graphicsdevice.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            TurbulenzEngine = WebGLTurbulenzEngine.create({
                canvas: document.getElementById("canvas")
            });
            var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});

            var bgColor = [1.0, 1.0, 0.0, 1.0];

            function update() {
                if (graphicsDevice.beginFrame()) {
                    graphicsDevice.clear(bgColor, 1.0);
                    graphicsDevice.endFrame();
                }
            }

            TurbulenzEngine.setInterval(update, 1000 / 60);
        </script>
    </body>
    </html>

After defining a <canvas> element of 640x480 pixels, this code will create the TurbulenzEngine and request the GraphicDevice module.
Using an update function called at a frequency of 60fps, the GraphicsDevice will clear the screen yellow.
To run the example, open the HTML file in your browser.
You should see a yellow rectangle.

To use assets such as images you will need to host a HTML file and assets on a webserver.
Any webserver will work, a quick way to try is to activate the Turbulenz environment in the root of the Turbulenz directory and run::

    python -m SimpleHTTPServer

This command will host the contents of the Turbulenz directory on your machine as a webserver.

To demonstrate loading an asset you can try loading an image file and drawing it as a textured sprite using the Draw2D API.
Create another HTML file with the following content and also place it in the root of the Turbulenz directory::

    <html>
    <head>
        <title>Turbulenz - API - Textured Sprite Example</title>
        <script src="jslib/debug.js"></script>
        <script src="jslib/webgl/turbulenzengine.js"></script>
        <script src="jslib/webgl/graphicsdevice.js"></script>
        <script src="jslib/draw2d.js"></script>
    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            TurbulenzEngine = WebGLTurbulenzEngine.create({
                canvas: document.getElementById("canvas")
            });
            var graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
            var draw2D = Draw2D.create({
                graphicsDevice: graphicsDevice
            });

            var bgColor = [1.0, 1.0, 0.0, 1.0];

            var sprite = Draw2DSprite.create({
                width: 100,
                height: 100,
                x: graphicsDevice.width / 2,
                y: graphicsDevice.height / 2,
                color: [1.0, 1.0, 1.0, 1.0],
                rotation: Math.PI / 4
            });

            var texture = graphicsDevice.createTexture({
                src: "assets/textures/crate.jpg",
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
            var rotateAngle = PI2 / 360; // 1 deg per frame

            function update() {

                sprite.rotation += rotateAngle;
                sprite.rotation %= PI2; // Wrap rotation at PI * 2

                if (graphicsDevice.beginFrame()) {
                    graphicsDevice.clear(bgColor, 1.0);

                    draw2D.begin();
                    draw2D.drawSprite(sprite);
                    draw2D.end();

                    graphicsDevice.endFrame();
                }
            }

            TurbulenzEngine.setInterval(update, 1000 / 60);
        </script>
    </body>
    </html>

This time, instead of opening the file in the browser, navigate your browser to *http://127.0.0.1:8000* or *http://localhost:8000* and select the HTML file you created.
You should see a spinning textured box in the middle of a yellow rectangle.

The next step is render a simple textured mesh in 3D.
To do this you will need to build some assets from their source files.
Make sure you have run the *tools* command to build the tools for your platform::

    $ python manage.py tools

*Note: The requirements for building the tools is different per platform. See the* `Dependencies`_ *section.*

For this example you should use the `Protolib <http://docs.turbulenz.com/protolib/protolib_api.html>`__ library, which is ideal for prototyping games using Turbulenz.
You will need these assets::

    - models/duck.dae
    - textures/duck.png
    - textures/default_light.png
    - shaders/shadowmapping.cgfx
    - shaders/zonly.cgfx
    - shaders/forwardrendering.cgfx
    - shaders/forwardrenderingshadows.cgfx
    - shaders/debug.cgfx
    - shaders/font.cgfx
    - fonts/opensans-8.fnt
    - fonts/opensans-16.fnt
    - fonts/opensans-32.fnt
    - fonts/opensans-64.fnt
    - fonts/opensans-128.fnt
    - textures/opensans-8_0.png
    - textures/opensans-16_0.png
    - textures/opensans-32_0.png
    - textures/opensans-64_0.png
    - textures/opensans-128_0.png

Copy this text into a file called "deps.yaml" and place it in the root of the Turbulenz directory.
Having built the tools you can now run this command with the Turbulenz environment activated::

    $ python scripts/buildassets.py --root . --assets-path assets

This will build the assets listed in the deps.yaml and output a "staticmax" directory and "mapping_table.json" file containing the processed assets and a mapping to them for the webserver.
When a library trys to request one of these files, it will be able to find it in the staticmax directory.
Now you can create the mesh example HTML file and place it at the root of the Turbulenz directory::

    <html>
    <head>
        <title>Turbulenz - API - Textured Mesh Example</title>
        <script>
            var TurbulenzEngine = {};
        </script>
        <script src="jslib/debug.js"></script>
        <script src="jslib/webgl/turbulenzengine.js"></script>
        <script src="jslib/webgl/graphicsdevice.js"></script>
        <script src="jslib/webgl/inputdevice.js"></script>
        <script src="jslib/webgl/sounddevice.js"></script>

        <script src="jslib/camera.js"></script>
        <script src="jslib/requesthandler.js"></script>
        <script src="jslib/texturemanager.js"></script>
        <script src="jslib/shadermanager.js"></script>
        <script src="jslib/soundmanager.js"></script>
        <script src="jslib/effectmanager.js"></script>
        <script src="jslib/fontmanager.js"></script>
        <script src="jslib/observer.js"></script>
        <script src="jslib/utilities.js"></script>
        <script src="jslib/services/turbulenzbridge.js"></script>
        <script src="jslib/services/turbulenzservices.js"></script>
        <script src="jslib/services/gamesession.js"></script>
        <script src="jslib/services/mappingtable.js"></script>

        <script src="jslib/scene.js"></script>
        <script src="jslib/light.js"></script>
        <script src="jslib/material.js"></script>
        <script src="jslib/geometry.js"></script>
        <script src="jslib/aabbtree.js"></script>
        <script src="jslib/scenenode.js"></script>
        <script src="jslib/vertexbuffermanager.js"></script>
        <script src="jslib/indexbuffermanager.js"></script>
        <script src="jslib/resourceloader.js"></script>
        <script src="jslib/vmath.js"></script>
        <script src="jslib/renderingcommon.js"></script>
        <script src="jslib/forwardrendering.js"></script>
        <script src="jslib/shadowmapping.js"></script>
        <script src="jslib/draw2d.js"></script>

        <script src="protolib/duimanager.js"></script>
        <script src="protolib/jqueryextend.js"></script>
        <script src="protolib/simplesprite.js"></script>
        <script src="protolib/simplefonts.js"></script>
        <script src="protolib/simplesceneloader.js"></script>
        <script src="protolib/debugdraw.js"></script>
        <script src="protolib/sceneloader.js"></script>
        <script src="protolib/soundsourcemanager.js"></script>
        <script src="protolib/protolib.js"></script>

    </head>
    <body>
        <canvas id="canvas" width="640px" height="480px"/>
        <script>
            TurbulenzEngine = WebGLTurbulenzEngine.create({
                canvas: document.getElementById("canvas")
            });
            var mathDevice = null;

            var mesh = null;
            var rotationMatrix = null;
            var rotationAngleMatrix = null;

            var protolib = Protolib.create({
                onInitialized: function onIntializedFn(protolib)
                {
                    mathDevice = protolib.getMathDevice();
                    protolib.setCameraPosition(mathDevice.v3Build(0, 1, -2));
                    protolib.setCameraDirection(mathDevice.v3Build(0, 0, 1));
                    protolib.setAmbientLightColor(mathDevice.v3Build(1, 1, 1));
                    protolib.addPointLight({
                        v3Position: mathDevice.v3Build(-1, 1, -1),
                        v3Color: mathDevice.v3Build(1, 1, 1),
                        radius: 10
                    });
                    mesh = protolib.loadMesh({
                        mesh: "models/duck.dae"
                    });
                    rotationMatrix = mathDevice.m43BuildIdentity();
                    rotationAngleMatrix = mathDevice.m43BuildIdentity();
                    mathDevice.m43SetAxisRotation(rotationAngleMatrix,
                                                  mathDevice.v3Build(0, 1, 0),
                                                  (Math.PI * 2) / 360);
                }
            })

            function update() {

                if (protolib.beginFrame())
                {
                    if (mesh)
                    {
                        mesh.getRotationMatrix(rotationMatrix);
                        mathDevice.m43Mul(rotationMatrix, rotationAngleMatrix, rotationMatrix);
                        mesh.setRotationMatrix(rotationMatrix);
                    }
                    protolib.endFrame();
                }
            }

            TurbulenzEngine.setInterval(update, 1000 / 60);
        </script>
    </body>
    </html>

This file is quite similar to the previous examples, but it requires a few more Turbulenz libraries to run.
This time you should see a spinning duck with a yellow texture on a white background and lit by a static point light.

For more information on how to build your own assets see the `assets section <http://docs.turbulenz.com/starter/getting_started_guide.html#assets>`__ in the getting started guide.

If you would like to learn more or work through this example step-by-step (with troubleshooting hints), see the `Getting Started Guide <http://docs.turbulenz.com/starter/getting_started_guide.html>`__ in the documentation.

For more information on the various APIs, see the following links:

* `Low-level API <http://docs.turbulenz.com/jslibrary_api/low_level_api.html>`__, `2D Physics API <http://docs.turbulenz.com/jslibrary_api/physics2d_api.html>`__, `3D Physics API <http://docs.turbulenz.com/jslibrary_api/physics3d_api.html>`__
* `High-level API <http://docs.turbulenz.com/jslibrary_api/high_level_api.html>`__
* `Turbulenz Services API <http://docs.turbulenz.com/turbulenz_services/index.html>`__
* `Protolib API <http://docs.turbulenz.com/protolib/protolib_api.html>`__


Documentation
=============

Full documentation for the Turbulenz Engine can be found at `<http://docs.turbulenz.com/index.html>`__

This documentation is built from the source restructured text in the docs/source folder of the repository, the latest
version online is maintained from the latest release tag in the repository. If you wish to build up to date
documentation follow the setup guide and the run the ``manage.py docs`` command, this will generate html docs in the
build/docs/html folder.


Dependencies
============

The prerequisites for setting up the Turbulenz Engine are Python 2.7.x and VirtualEnv.
Other technologies are included via Git submodules contained within the Turbulenz Engine repository.

Additional Python packages will be automatically installed during the initial environment creation using a
Python package manager.

To build the cgfx2json shader conversion tool ``python manage.py tools`` requires both a compiler toolchain
and the `NVIDIA CgToolkit <https://developer.nvidia.com/cg-toolkit>`__ version 3.1 or higher.

The CgToolkit is included in the repository for Windows, for Mac OSX and Linux please download and install it.

Compiler Toolchain Requirements

- Windows : Microsoft Visual Studio 2008 w/SP1
- Mac OSX : Xcode with the command line tools
- Linux : GCC 4.6.x or higher


Known Issues
============

The following known issues exist with using the open source repository version of the Turbulenz Engine,
additional known issues also existing in the SDK releases of the engine can be found here
`<http://docs.turbulenz.com/known_issues/index.html>`__

* The application and JavaScript build process will currently fail if the repository is cloned to a path with
  spaces in it.


Licensing
=========

The Turbulenz Engine is licensed under the `MIT license <LICENSE>`__


Contributing
============

Our contributors are listed `here <docs/source/contributors.rst>`__

Contributions are always encouraged whether they are small documentation tweaks, bug fixes or suggestions for larger
changes. You can check the `issues <http://github.com/turbulenz/turbulenz_engine/issues>`__ or `discussion forums
<https://groups.google.com/group/turbulenz-engine-users>`_ first to see if anybody else is undertaking similar changes.

If you'd like to contribute any changes simply fork the project on Github and send us a pull request or send a Git
patch to the discussion forums detailing the proposed changes. If accepted we'll add you to the list of contributors.

We include a .pylintrc file in the repository which allows you to check your code conforms to our standards. Our
documentation is built from restructured text sources in the docs folder so please consider how your changes may affect
the documentation.

Note: by contributing code to the Turbulenz Engine project in any form, including sending a pull request via Github,
a code fragment or patch via private email or public discussion groups, you agree to release your code under the
terms of the MIT license that you can find in the `LICENSE <LICENSE>`__ file included in the source distribution.


Links
=====

| Turbulenz game site - `turbulenz.com <https://turbulenz.com>`__
| Turbulenz developer service and SDK download - `hub.turbulenz.com <https://hub.turbulenz.com>`__
| Documentation for this module and the SDK - `docs.turbulenz.com <http://docs.turbulenz.com>`__
| About Turbulenz - `biz.turbulenz.com <http://biz.turbulenz.com>`__
