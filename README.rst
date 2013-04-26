================
Turbulenz Engine
================

Turbulenz is an HTML5 game engine and server-side APIs available in JavaScript and TypeScript for building and distributing 2D and 3D games that run on platforms that support HTML5 features such as modern browsers without the need for plugins.
The Engine includes libraries for features that games require such as:

Features
========

:Graphics: 2D/3D rendering, sprite drawing, font rendering, vertex & pixel shader effects such as materials/shadows etc, forward/deferred/simple scene renderers, fullscreen, in-game video, utilizes technologies such as canvas/WebGL.
:Sound: ogg/wav/mp3, compressed/uncompressed, 3D audio, OpenAL-like interface.
:Networking: Client-to-client real-time messaging, client-to-server connectivity utilizing Websockets, latency simulation.
:Input: Mouse/Keyboard/gamepad/touch interfaces, mouse locking/hiding.
:Physics: 2D/3D rigid body simulation, collision detection, 2D/3D constraints, rayhit testing, static/dynamic/kinematic objects.
:Scene Management: Hierarchical scene node managing. Scene loading geometry/animation/physics/materials from COLLADA format.
:Animation: Skeleton/skinning animation for 3D geometry, interpolation/skinning/blending/transition controllers.
:Utilities: Profiling, Vector/matrix math, debug/logging/assertion.

The services include JavaScript and TypeScript libraries for server-side features for games such as:

:Leaderboards: Submitting/retrieving ranked friend/global leaderboards, default score entries, infinitely scrollable scoreboards, friend's score notifications.
:Badges: Achievement system for awarding game progress, custom badge shape and design, progression badges, achievement notification.
:Payments: In-game/Out-of-game payments, different payment methods: single purchase/micro transactions, store consumable/ownable items.
:Userdata: Per-user save game information, key-value pair data storage for settings/preferences/personal items.
:Userprofile: Game player's profile information, such as username, language, location, etc.
:Gameprofile: Game player's public per game profile, such as level, XP, favourite weapon, etc.
:Multiplayer: Real-time session match-making, session creation/joining, friend location, multiplayer session invite and notification.
:Utilities: Automatic service retries, uniquely identifiable game sessions, asset mapping, front-end communication channel, notification messages, metrics/event tracking.


History
=======

The Engine was created and is maintained by `Turbulenz Limited <http://biz.turbulenz.com>`__ and was open sourced
in April 2013.

The latest release is 1.0 which is tagged in the repository or a tarball/zip can be can be downloaded from
`here <https://github.com/turbulenz/turbulenz_engine/archive/release_1.0.tar.gz>`__

A full history of changes can be found in the
`Changelog <http://github.com/turbulenz/turbulenz_engine/blob/master/docs/source/changelog.rst>`__


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
   on GitHub and clone that). ``git clone git@github.com:turbulenz/turbulenz_engine.git`` will clone the repository
   maintained by Turbulenz.
2. Initialize the Git submodules with ``git submodule update --init``.
   The Turbulenz Engine submodules the following technology in the external folder

    + tzbuild: https://github.com/turbulenz/turbulenz_build
    + DefinitelyTyped: https://github.com/borisyankov/DefinitelyTyped
    + UglifyJS: https://github.com/mishoo/UglifyJS.git
3. Check you have the pre-requisites installed

    + Python 2.7.x (2.7.3 is the most tested version) - ``python --version`` will check your current version, if
      you have multiple Python versions installed e.g. 3.x you may need to run commands with ``python2.7``
    + VirtualEnv - you can check for VirtualEnv with ``virtualenv --version``
4. From the cloned repository run ``python manage.py env``. This will create a VirtualEnv environment and install
   the required Python packages and NodeJS allowing you to use all the features of the Turbulenz Engine.
5. Activate the environment in your shell. For bash and similar shells ``source env/bin/activate`` or for Windows
   ``env\scripts\activate.bat``
6. If you want to move onto the API tutorial section next then your final step is to build the JavaScript sources
   from the TypeScript sources. For this run the command ``python manage.py jslib``, the next section will detail
   some of the additional actions you can perform or you can move onto `Getting Started With The API`_

Working With The Open Source Project
------------------------------------

The manage.py script at the top level of the repository provides a set of commands for managing the Engine, the
script should be run as ``python manage.py command`` on Windows but can usually be shortcut to ``./manage.py command``
on unix shells. Running the script with ``--help`` will give a list of commands available, most of these are
described below. All the commands other than the env command expect to have the VirtualEnv environment activated
as described in the setup section.

- **JavaScript Sources** - The Turbulenz Engine source is written in TypeScript. To generate the JavaScript version
  of the engine source run the command ``python manage.py jslib``
- **Documentation** - The Turbulenz Engine documentation is based on restructured text sources. To build the output
  documentation run the command ``python manage.py docs``
- **Samples** - Various samples are included with the Turbulenz Engine. These can be built from their TypeScript
  sources with the command ``python manage.py samples``. This generates a set of html files, JavaScript and asset
  JSON files which can be served with a web server such as the Turbulenz Local Development Server.
- **Applications** - The Turbulenz Engine project includes a few larger applications and some templates for building
  your own application. These can be found in the apps folder, and can be built with the command
  ``python manage.py apps``

  You can also build individual apps by specifying their name e.g. ``python manage.py apps multiworm``
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
Create a file with the following content and place it in the root of the Turbulenz directory::

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
Using the an update function called at a frequency of 60fps, the GraphicsDevice will clear the screen yellow.
To run the example, open the HTML file in your browser.
You should see a yellow rectangle.

To use assets such as images you will need to host a HTML file and assets on a webserver.
Any webserver will work, a quick way to try is to activate the Turbulenz environment in the root of the Turbulenz directory and run::

    python -m SimpleHTTPServer

This command will host the contents of the Turbulenz directory on your machine as a webserver.

To demonstrate loading an asset you can try loading an image file and drawing it as a textured sprite using the Draw2D API.
Create another file with the following content and also place it in the root of the Turbulenz directory::

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
            var TurbulenzEngine = WebGLTurbulenzEngine.create({
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

                if (graphicsDevice) {
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

If you would like to learn more or work through this example step-by-step (with troubleshooting hints), see the `Getting Started Guide <http://docs.turbulenz.com/starter/getting_started_guide.html>`__ in the documentation.

For more information on the various APIs, see the following links:

* `Low-level API <http://docs.turbulenz.com/jslibrary_api/low_level_api.html>`__, `2D Physics API <http://docs.turbulenz.com/jslibrary_api/physics2d_api.html>`__, `3D Physics API <http://docs.turbulenz.com/jslibrary_api/physics3d_api.html>`__
* `High-level API <http://docs.turbulenz.com/jslibrary_api/high_level_api.html>`__
* `Turbulenz Services API <http://docs.turbulenz.com/turbulenz_services/index.html>`__

Documentation
=============

Full documentation for the Turbulenz Engine can be found at `<http://docs.turbulenz.com/index.html>`__

This documentation is built from the source restructured text in the docs/source folder of the repository, the latest
version online is maintained from the latest release tag in the repository. If you wish to build up to date
documentation follow the setup guide and the run the ``manage.py docs`` command, this will generate html docs in the
build/docs/html folder.


Dependencies
============

The prerequisits for setting up the Turbulenz Engine are Python 2.7.x and VirtualEnv.
Other technologies are included via Git submodules contained within the Turbulenz Engine repository.

Additional Python packages will be automatically installed during the initial environment creation using a
Python package manager.


Licensing
=========

The Turbulenz Engine is licensed under the
`MIT license <http://github.com/turbulenz/turbulenz_engine/raw/master/LICENSE>`__


Contributing
============

Our contributors are listed
`here <http://github.com/turbulenz/turbulenz_engine/blob/master/docs/source/contributors.rst>`__

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
terms of the MIT license that you can find in the
`LICENSE <http://github.com/turbulenz/turbulenz_engine/raw/master/LICENSE>`__ file included in the source distribution.


Links
=====

| Turbulenz game site - `turbulenz.com <https://turbulenz.com>`__
| Turbulenz developer service and SDK download - `hub.turbulenz.com <https://hub.turbulenz.com>`__
| Documentation for this module and the SDK - `docs.turbulenz.com <http://docs.turbulenz.com>`__
| About Turbulenz - `biz.turbulenz.com <http://biz.turbulenz.com>`__
