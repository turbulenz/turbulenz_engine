=====================
Turbulenz Game Engine
=====================

The Turbulenz Game Engine provides solutions for the development of
next generation quality games playable directly in the browser.

The technology is organized in two main blocks:

- **Runtime**: executed on the final user machine
- **Offline**: used only during development of the game

This section gives an overview of these two areas of functionality as
well as some recommendations and guidelines for developing games for
the browser.

.. ------------------------------------------------------------

--------------------
Runtime API Overview
--------------------

The runtime may be broadly categorized into two types of code:

- **Low-level API**: A set of interfaces providing access to low-level
  functionality.  The APIs at this level are similar in functionality
  to known APIs such as OpenGL, OpenAL, etc.  This functionality is
  provided either by the Turbulenz browser extensions (native code),
  or by a thin wrapper on top of interfaces provided by the browser
  (such as WebGL, WebAudio, etc).  In the second case, the Turbulenz
  API will determine which interfaces the browser provides and
  dynamically select the most appropriate.

- **Engine Libraries**: a collection of JavaScript libraries that
  built on top of the Low-level APIs that provide developers with
  features such as a Scene Graph, Material System, Forward and
  Deferred Renderers, etc.

Low-level API
-------------

The interface consists of several modules called *Devices*,
providing:

- Efficient interface on top of existing stable and flexible
  libraries, for example Bullet, OpenAL or WebGL.

- Efficient interface on top of low level hardware access, for example
  the input mechanisms or vector math operations.

These Devices are not limited to specific kinds of games, they are
powerful enough and flexible enough to cover next generation game
requirements.  *Device* objects are usually created once by passing a
parameters object to *create* functions on the :ref:`TurbulenzEngine
<turbulenzobject>` global object.  Once created they can later be
retrieved by calling the corresponding *get* functions.  See, for
example, :ref:`tz_creategraphicsdevice` and
:ref:`tz_getgraphicsdevice`.

The descriptions given here apply when using the browser extensions.
In canvas mode, HTML5 and associated APIs do not yet allow a
sufficiently performant implementation of certain features.

:ref:`GraphicsDevice <graphicsdevice>`

- Simple shader-based immediate mode API.
    - A Shader may contain multiple Techniques, either single or
      multi-pass.
    - Once a shader Technique is set on the Device, the parameters
      required by the program code can be updated by a
      TechniqueParameter object.
    - TechniqueParameter objects hold multiple references to Textures,
      TechniqueParameterBuffers or individual values.
    - Multiple TechniqueParameters can be set on the Device at once.
- Vertex buffers, Index buffers and Textures can be created, updated
  and destroyed dynamically.
- Multiple Streams of Vertex buffers can be used at the same time.
- Support for 1D, 2D, 3D and Cube textures.
    - Any pixel format supported by the hardware.
- Asynchronous resource loading.
    - Multiple resource files can be downloaded on the fly, JavaScript
      code will be notified when resource is available for usage.
- Multiple image file formats.
    - DDS, JPG, PNG and TGA.
- Support for textures archives containing multiple image files.
    - Less flexibility than individual files but better for optimal
      bandwidth usage.
- Occlusion queries.
    - Number of pixels rendered can be queried for a section of
      rendering.

:ref:`MathDevice <mathdevice>`

- Math types:
    - *Vector3*, *Vector4*
    - *Matrix33*, *Matrix34*, *Matrix43*, *Matrix44*
    - *Quaternion*, *QuatPos*
    - *AABB*
- Storage format optimized based on available support
- Optimized operations support *destination parameters*, reducing
  object allocation.

:ref:`PhysicsDevice <physicsdevice>`

- Easy-to-use efficient physics simulation.  In plugin mode, this is a
  lightweight wrapper around the Bullet Physics Library.

    - http://bulletphysics.org/wordpress/

  In canvas mode, Turbulenz provides an optimized JavaScript
  implementation of the same interface.

- Rigid bodies and collision objects.
    - Plane, Box, Sphere, Capsule, Cylinder, Cone, Triangle Mesh,
      Convex Hull.

- Constraints.
    - Point to Point, Hinge, Cone Twist, 6DOF, Slider.

- Ray and convex sweep queries.
    - Returning closest point of impact and surface normal.

.. NOTE::
  Developers may see slightly different behavior across the plugin and
  canvas implementations of :ref:`PhysicsDevice <physicsdevice>`.

:ref:`SoundDevice <sounddevice>`

- Easy-to-use efficient wrapper of OpenAL.
    - http://connect.creativelabs.com/openal/default.aspx
- 3D sound sources.
    - Position, Direction, Velocity, Gain, Pitch, Loop.
- Support for multiple speakers, up to 7.1 systems.
- Separate threads for audio streaming and mixing.
- Asynchronous sound files loading.
    - Multiple resource files can be downloaded on the fly, JavaScript
      code will be notified when resource is available for usage.
- Multiple sound file formats:
    - OGG, WAV.

:ref:`NetworkDevice <networkdevice>`

- Efficient implementation of WebSockets.
    - http://en.wikipedia.org/wiki/WebSocket
    - http://dev.w3.org/html5/websockets/
- Bi-directional, full-duplex communications channels, over a TCP
  socket.
- HTTP-compatible handshake so that HTTP servers can share their
  default HTTP and HTTPS ports (80 and 443) with a WebSocket server.
- Support for secure connections as part of the standard.
- Support for data compression with the extension `deflate-frame`.

:ref:`InputDevice <inputdevice>`

- Access to HID.
    - Keyboard, Mouse, Xbox360 Pad, Joysticks, Wheels.
- Asynchronous event system when state changes.
    - JavaScript code is notified when input changes.

Engine Libraries
----------------

These higher-level JavaScript libraries are designed for flexibility
and ease of use.  The JavaScript language itself provides all the
reflection mechanisms required for runtime debugging and tweaking,
supporting dynamic code generation and object serialization.

Only documented objects, functions and properties should be used.
Undocumented items are implementation details and may change in the
future.

**Scene Graph**

- Flexible JSON file format.
    - Could describe either a whole scene or individual meshes.
- Asynchronous loading of external references.
    - If a scene contains references to external meshes they are all
      loaded in parallel and attached to the main scene when ready.
    - Support for optimal reuse of same mesh on different locations.
- Pluggable renderer system.
    - Links between geometries, effects and materials are resolved at
      runtime.
    - Easy swap of multiple rendering techniques for same assets.
- Geometry sharing.
    - Geometry information can be optimally reused on multiple scene
      locations with different rendering effects.
- Flexible scene hierarchy nodes.
    - Lights, Geometries, Animation, Physics.
- Visibility queries.
    - Portals, Frustum, Overlapping Box.
- Sorting and grouping.
    - Visible nodes are sorted and grouped for optimal rendering:
      Opaque, Transparent, Decal.
- Lazy evaluation of node updates.

**Resource Manager**

- Asynchronous loading avoiding duplicates.
    - Additional remapping layer for easy URL redirection.
- Provide default resources if missing.
    - Game can provide custom default resource to be used when a
      required one is missing or still loading.
- Multiple managers for individual needs.
    - Textures, Shaders, Effects, Sounds, Fonts.
- Bandwidth and hardware scaling by selecting different assets and
  effects depending on machine and Internet connection performance.

**Deferred Renderer**

- Unlimited number of lights.
    - Point, Spot, Directional, Ambient.
- Texture based light falloff.
    - Allows multi-colored lights and cheap fake shadows, for example
      the typical fan under a light source.
- Materials with multiple texture maps.
    - Specular color and intensity, Normal vector, Glow color, Alpha.
- Pluggable post effects.
    - Easy set-up for full screen post effects as part of the final
      deferred shading.
- Exponential shadow maps.
    - Reuse of texture shadow maps to save video memory.
    - Gaussian blur for smooth results.
    - Exponential depth information to avoid light bleeding.
- Volumetric fog.
- 4 weight GPU skinning.

**Social Networks**

- Easy integration with popular social networks.
- Player sign-in and access automatically handled.
- Compatible with:
    - Twitter, Facebook, Tumblr.
- Easy integration as an application within Facebook.

.. ------------------------------------------------------------

-------------
Offline Tools
-------------

Offline tools are provided to process JavaScript and HTML code, and to
generate and serve the assets required for the runtime. Tools for
asset processing are provided as a set of standalone command-line
tools which can be run in parallel when assets dependencies allow.

Some file formats are converted into a custom JSON format supported by
the runtime code, others are kept as-is and only additional processing
is provided.

All assets and scripts are compressed, compacted and uniquely tagged
for efficient transfer between the web server and browser.

Tools
-----

:doc:`Code tools <tools/game_tools>` exist to:

 * Optionally remove debugging code (such as asserts)
 * Concatenate and compact JavaScript and all referenced libraries
 * Generate HTML files to be used to launch applications during
   development

:doc:`Asset tools <tools/asset_tools>` are provided to handle the
following build steps:

 * Conversion of Collada files to JSON
 * Conversion of CgFX files to JSON
 * Conversion of OBJ files to JSON
 * DXT compression
 * PNG compression
 * Cubemap generation
 * Mipmap generation
 * Texture level of detail, removing mipmap levels on demand

.. ------------------------------------------------------------

.. _templating:

------------------------------
Templating and the Build Tools
------------------------------

When developing JavaScript applications to run on the Turbulenz Engine
it's useful to build and test all configurations.  The development
configurations (*plugin-debug* and *canvas-debug*) are set up to run
inside the browser and allow use of browser debugging tools.  The
release configurations (*plugin* and *canvas*) load and run a code
bundle, often compacted.  In the case of *plugin* mode, JavaScript
code is executed inside the engine provided by the Turbulenz browser
extensions (for reasons of performance and compatibility), making
debugging much more difficult.

Compacting code is an important optimization for deployment and can
dramatically reduce the size of the code that needs to be transferred
and parsed at runtime.  Turbulenz recommends the `UglifyJS
<https://github.com/mishoo/UglifyJS>`_ tool be used in *plugin* and
*canvas* configurations.  See :ref:`maketzjs` for further details.

The tools :ref:`maketzjs <maketzjs>` and :ref:`makehtml <makehtml>`
support the use of template markup to allow a single set of source
files to be easily built in any configuration.  The templates in the
example template app follow the structure shown below::

    /*{{ javascript("scripts/script1.js") }}*/
    ...
    /*{{ javascript("scripts/scriptN.js") }}*/

    TurbulenzEngine.onload = function onloadFn()
    {
        ...
    };

.. _asserts_and_debug:

Asserts and Debug Code
----------------------

The Turbulenz JavaScript libraries include code to validate parameters
and to assert that internal state is correct.  This is intended to
catch bugs and warn the programmer of problems as early as possible in
the games execution.  Since such debug code has a performance cost, it
must be stripped out of release builds.

Debug functionality is provided by the :ref:`debug object
<debug_api>`, and calls to methods on this object are stripped out of
code by the :ref:`maketzjs <maketzjs>` tool automatically.

Developers wishing to make use of this functionality, and developers
with customized code pipelines should be aware of the behavior of the
debug code stripping, and may wish to use it outside of the
:ref:`maketzjs <maketzjs>` tool, via :ref:`strip-debug <stripdebug>`.

.. NOTE::

  As an example, developers who run code compactors on game code
  *before* passing that code to maketzjs may mangle the naming of the
  debug object making it impossible for maketzjs to find and remove
  the debug code.  In that case, :ref:`strip-debug <stripdebug>` must
  be invoked directly when building *release* and *canvas*
  configurations, to ensure that debug code is removed before any
  compaction or obfuscation takes place.

HTML Generation
---------------

Many examples given here and in other sections use a default template
to generate HTML pages for loading and running applications.  This
template is built into the tools, but it is perfectly possible to
insert your own HTML, override parts of the default template or create
your own HTML template from scratch.

Since Turbulenz games have full access to the browsers JavaScript
context, they can interact with the HTML DOM in the same way that
regular JavaScript code can.  Although this is not generally useful
for deployed games, during development HTML controls can be used to
send data to the game (such as for tweaking parameters), or to display
data about the running game (such as text output to log errors or
metrics).

To customize the HTML generation it is necessary to understand some
simple templating concepts.  Here we briefly describe *conditions*,
*variables*, *blocks* and *comments*, as implemented in the *jinja2*
templating engine, used by the Turbulenz tools.

Inheritance, Blocks and the Default Template
--------------------------------------------

HTML templates can inherit from other HTML files using a declaration
of the form::

    /*{% extends "file.html" %}*/

In this case *file.html* is inlined and any *blocks* declared in it
can be overridden by the child file.  To include the *default
template*, built into the tools, use::

    /*{% extends "default" %}*/

(The default template can be inspected using the
*---dump-default-template* flag on the :ref:`makehtml` tool)::

    makehtml --dump-default-template

For example, to add some HTML elements to the bar on the left of the
default HTML template you can override blocks in the following way::

    /*{% extends "default" %}*/

    /*{% block tz_app_html_controls %}*/
      <div class="html-control control-button-pair">
          <span class="control-title">Switch animation</span>
          <input type="button" id="button01" value="Next">
          <input type="button" id="button02" value="Previous">
      </div>
    /*{% endblock %}*/

*Blocks* defined by the default template include:

    * ``tz_app_title`` defines the title used in the browser window

    * ``tz_app_title_name`` represents the title at the top of the
      page

    * ``tz_app_html_controls`` defines the HTML elements to be placed
      in the left hand margin of the page

See the default template for the definitive list of blocks that can be
overridden.  It is also possible to extend or inherit from a template
that in turn inherits from another template (which may be the default
template).

Conditions
----------

Conditions allow simple predication of code based on template
variables, using markup of the form ``/*{% if test condition %}*/``,
followed by ``/*{% endif %}*/``.  The main use for this is to define
pieces of code which should be executed only when running in certain
configurations.  Examples are:

    * ``/*{% if tz_development %}*/`` means the JavaScript game code
      is included using script tags allowing for easy debugging. This
      variable is true then the ``--mode`` flag to tools is used to
      specify *plugin-debug* or *canvas-debug* modes.

    * ``/*{% if tz_canvas %}*/`` means the game is running using the
      canvas (non-plugin) version of the Turbulenz engine. This
      variable is true in *canvas* and *canvas-debug* modes.

    * ``/*{% if tz_hybrid %}*/`` means the game is running using both
      the canvas (non-plugin) version of the Turbulenz engine and the
      plugin version (available as TurbulenzEngine and
      TurbulenzEnginePlugin respectively). This variable is true when
      the *hybrid* option is used.

These can be used in JavaScript, or HTML code.

Variables
---------

The markup for a variable expansion is ``/*{{ variable }}*/``.  For
the Turbulenz tools we define some special variable expansions to
allow applications to be built.

For JavaScript code we provide

    * ``javascript`` this allows a JavaScript file to be included or
      referenced.  For a development builds, an HTML script tag will
      be included with a reference to the JavaScript file, while for
      release builds the JavaScript file will be inlined in the code
      bundle.

For HTML code not using the default template, we provide

    * ``tz_engine_div`` - expands to HTML code the creates appropriate
      HTML tags to set up the canvas or instantiate the browser plugin
      (depending on the build mode)
    * ``tz_include_js`` - expands to a set of HTML ``<script>`` tags
      that include any JS files required in the page.
    * ``tz_startup_code`` - expands to JavaScript code the correctly
      starts up the engine and executes the ``TurbulenzEngine.onload``
      function.  This variable must be used within ``<script>`` tags.

Comments
--------

Comment markup is ``/*{# comment #}*/`` which simply allows comments
to be placed into the templates that will not appear in the code
output from the tools.  (The compacting process in release modes
removes any JavaScript comments).

.. ------------------------------------------------------------

----------------------------
Game Project Recommendations
----------------------------

The Turbulenz build tools do not impose any real structure on how a
game project is arranged or built.  However we recommend that
developers follow the guidelines given here.

Code Layout
-----------

Since HTML can refer to .js code files (in development modes), those
.js files must reside in directories *below* the HTML output.  The
build system should either build the .html, .tzjs and .js files into
the root of the project, or into a build directory into which all
dependent files are copied.

We recommend that build output go into the project root where it can
reference the rest of the game code and assets, with the following
directory structure below.  See the *templateapp* for an example.

:scripts:

    Main game code and library files.

:templates:

    Game .js and .html templates.  The .js file should contain the
    ``TurbulenzEngine.onload`` entry point and then call into the code
    in *scripts*.

:jslib:

    A copy of the *jslib* directory from the SDK install.

:build:

    Intermediate build files and dependency data

When using *plugin-debug* and *canvas-debug* build modes, only the minimal code
generated from *templates* will be embedded into the HTML page.
Changes in the *scripts* directory will not require rebuilds.
(*plugin* and *canvas* modes will always require rebuilds of the code
bundle for any code change).

Asset Layout
------------

As with code, we recommend keeping asset source data in subdirectories
of the project root.

:assets/models:

    The raw assets folder for models (before conversion). i.e. .dae,
    .obj

:assets/textures:

    The raw assets folder for textures (before conversion). i.e. .tga,
    .png, .jpg, .bmp

:assets/shaders:

    The raw assets folder for shaders (before conversion). i.e. .cgfx

The *staticmax* folder should be used for the output from the asset
build to maximize the effectiveness of the browser cache, as described
in the section :ref:`getting_started_assets`.

The build system should maintain a 'mapping_table.json' file to help
runtime code find the appropriate uniquely named files under
*staticmax*.

.. ------------------------------------------------------------

.. _game_engine_coding:

------
Coding
------

Below are some recommendations specific to JavaScript programming
using the TurbulenzEngine.  The :doc:`../js_development_guide`
contains more detail and explanation of some of these principles, as
well as general JavaScript programming and performance guidelines.

.. _giving_time_back_to_the_browser:

Giving time back to the browser
-------------------------------

Many operations performed by the browser happen asynchronously, and it
is necessary to make sure that the browser has sufficient time to deal
with all of these operations and events.

When JavaScript code for the game is running, no other JavaScript code
can run at the same time.  This means that long tasks (for example
converting an asset format at load time) can introduce significant
delays to other areas of the page:

- Browser UI and controls
- Other tabs running on the browser
- JavaScript running on the same page
- Other JavaScript operations performed by your game

Equivalently, the main game loop must be scheduled to be called once
per frame.  A construct such as a *while* loop would not give the
browser a chance to carry out any loading or rendering operations, and
would likely result in the browser halting execution of the game.

**JavaScript code only gives time back to the browser once all
functions have returned**

The :ref:`tz_setinterval` function available on the
:ref:`TurbulenzEngine <turbulenzobject>` object can be used to
schedule callbacks in this way::

    var intervalID;
    function executionLoopFn()
    {
        var currentTime = TurbulenzEngine.time;

        // ... perform some activity ...
    }

    // Set the engine to call the executionLoopFn every frame.
    intervalID = TurbulenzEngine.setInterval(executionLoopFn, 1000/60);

The ``executionLoopFn`` will be called once every 60th of a second.

.. NOTE::

    The ``window.setInterval`` functions provided by the browser
    generally have a resolution too low for games.
    ``TurbulenzEngine.setInterval`` makes use of other APIs or browser
    extensions to ensure a callbacks happen at much finer and more
    accurate intervals.

    However, due to the fact that the game loop shares execution time
    with other operations, it is impossible to guarantee accurate
    timing of callbacks at all times.  The ``TurbulenzEngine.time``
    property gives high-resolution timing information.  Games can make
    use of this to keep updates of game state and animation consistent
    with player expectations.

The :ref:`TurbulenzEngine.setTimeout <tz_settimeout>` function is
similar to ``setInterval``, but schedules a one-shot callback rather
than repeated invocations.  Passing a timeout of 0 to this function
gives the browser a chance to handle other operations while requesting
further execution time *as soon as possible*.  The example below is
somewhat contrived, but demonstrates how this can be used to perform a
long calculation while not causing the browser to freeze or terminate
execution of the game::

    var fibCallback = function fibCallbackFn(value)
    {
        window.alert("The 1,000th number in the Fibonacci sequence is " + value);
    };

    var fibCalc = function fibCalcFn(i)
    {
        TurbulenzEngine.setTimeout(function ()
            {
                b = fib + a;
                fib = a;
                a = b;

                i += 1;
                if (i < 1000)
                {
                    fibCalc(i);
                }
                else
                {
                    fibCallback(fib);
                }
            }, 0);
    };
    fibCalc(0);

.. NOTE::

    This is quite extreme, in reality we would want to compute more
    than just one Fibonacci term for each loop.


.. _caching_functions:

Caching functions
-----------------

Looking up methods on an object has a cost associated with it,
equivalent to looking up any other property.  Significant time can
often be saved by caching a method instead of forcing a new lookup at
each use.  For example, to sum of an array 1000 vectors a first
implementation may take this form::

    for (var i = 0; i < 1000; i += 1)
    {
        VMath.v3Add(sum, array[i], sum);
    }

In order to execute each step of the loop the JavaScript engine must
first checks for the existence of a ``v3Add`` function on the
``VMath`` object, then retrieve and call that function with ``this``
set to the ``VMath`` object.

We can avoid the unnecessary repeated checks for ``v3Add`` in the
following way::

    var v3Add = VMath.v3Add;
    for (var i = 0; i < 1000; i += 1)
    {
        v3Add.call(VMath, sum, array[i], sum);
    }

.. _typed_arrays:

Typed Arrays
------------

Typed arrays allow JavaScript code to create and access raw memory
buffers, and interpret the data as various primitive types, such as
`Int32`, `Float32`, etc (see
http://www.khronos.org/registry/typedarray/specs/latest/ for full
details).  Many JavaScript engines are 'aware' of typed arrays and can
generate optimized JIT compiled code to operate on them.  For this
reason, we recommend their use for storing large arrays of values of
the same type.

Code of the following form can be used to check for typed array support ::

    var ArrayConstructor = Array;
    if (typeof Float32Array !== "undefined")
    {
        ArrayConstructor = Float32Array;
    }

    ...
    var myNumberArray = new ArrayConstructor(4);
    ...

Data in typed arrays can also be passed to several engine APIs for
optimal performance.  For example, when setting data on a
`VertexBuffer`, a typed array of the correct type (i.e. matching the
vertex format) can be sent to the graphics hardware with no type
conversions, whereas a JavaScript Array of values require the engine
to iterate through the array converting `double` values to the
appropriate format.  See :ref:`indexbuffer`, :ref:`vertexbuffer` and
:ref:`texture` for details of optimal data formats.

The Turbulenz MathDevice makes extensive use of the `Float32Array`
type for vector and matrix objects.
