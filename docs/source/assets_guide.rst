.. index::
    single: Assets

.. highlight:: javascript

.. _assets:

------
Assets
------

.. _running-the-tools:

Running the Tools
-----------------

The Turbulenz SDK includes a selection of tools for you, the
developer, to include in your development process.  The majority of
Turbulenz tools are written in Python and are versatile and platform
independent.  Here is a list of available tools:

**dae2json**

    Converts Collada format files exported from modeling packages to
    JSON format.

**cgfx2json**

    Converts CgFX format shaders to JSON format.

**material2json**

    Converts a material to JSON format.

**effect2json**

    Converts an effect to JSON format.

**json2tar**

    Generates a TAR file for binary assets referenced from a JSON
    asset.

**json2json**

    Merges JSON asset files.

**maketzjs**

    Generates a .tzjs or .js file from JavaScript source and
    optionally optimizes the output.

**makehtml**

    Generates an HTML page to load and run code that has been built
    with maketzjs. Optionally receives custom HTML to override some or
    all of the default HTML template (not required).

**xml2json**

    Convert XML assets into a structured JSON asset.

**json2stats**

    Report metrics on JSON asset files.

**json2txt**

    Generate a plain text or HTML output from a JSON asset.

.. NOTE::

    The *cgfx2json* tool is an executable and is not run in the same
    way as the python tools. See :ref:`convert-cgfx-2json`.

To run a Python tool:

1. Click on the Run environment shortcut in start menu to start the
   virtual environment
2. Run::

     *TOOLNAME* *ARGS*

   (where TOOLNAME is replaced with one of the above tools and ARGS
   are the arguments for the tool)

3. If you run the tool without arguments it will print out the
   available options to the command line

.. NOTE::

    For this section, we will assume that all commands are run from
    the \*SDKINSTALLDIR\* where:

    **\*GAMEDIR\***:  \*SDKINSTALLDIR\*/apps/sampleapp

.. ------------------------------------------------------------

.. _viewing-the-assets:

Using the Asset Viewer
----------------------

The viewer can be used to rapidly view game assets and it has a
collection of options that can be used to debug the asset.

An asset can be opened in the viewer, by opening the View Asset panel
in the local development server.


.. NOTE::

    See more details on the viewer functionality in the Tools section:
    :ref:`viewer`.

.. NOTE::

    The Asset Viewer requires the Turbulenz Engine to be installed to use.
    The viewer is compatible with the same version of the engine that is included in the SDK.

.. ------------------------------------------------------------

.. _disassembling-the-assets:

Using the Asset Disassembler
----------------------------

The asset Disassembler tool allows you to view the asset JSON tree and
navigate through it.

The Disassembler can be accessed through the Metrics list with the
game assets requested, by clicking on one of the JSON assets.

The disassembled JSON tree view can then be controlled using depth,
list culling and dictionary culling options.

When the current asset is referencing other JSON assets in its
properties, they can be opened in the Disassembler through the
hyperlinks provided in the tree view.

.. NOTE::

    See more details on the disassembler in the Tools section:
    :ref:`disassembler`.

.. ------------------------------------------------------------

.. _convert-collada-2json:

Convert a Collada Model to JSON
-------------------------------

To convert a Collada model in .dae format, we will use the *dae2json*
tool. For this example you can either use one of your own assets or an
asset provided with the Turbulenz SDK. We will use *duck.dae* which
can be found in *assets/models*.

1. Click on the Run environment shortcut in start menu to start the
   virtual environment
2. Run::

     dae2json -i assets/models/duck.dae -o apps/sampleapp/staticmax/duck.dae.json

   The resulting file will be called "duck.dae.json", which is the
   model converted to JSON format. This file can now be loaded
   directly by the Turbulenz Engine.

.. TIP::

    An in-depth example of how to load a scene with assets can be found in the "load model" sample. Alternatively,
    :ref:`Protolib <protolib_introduction>` provides a simple asset loading and scene management framework that will
    quickly get you up and running.

.. TIP::

    If you would like to view the JSON file in a human readable form,
    add the option *-j SIZE*, where SIZE is the indent in spaces. The
    output is now easy to read and debug in a text editor::

      dae2json -j 4 -i assets/models/duck.dae -o apps/sampleapp/staticmax/duck.dae.json

In most cases we have .dae assets that contain more than just geometry
data, for example animation and physics data. The dae2json tool has
options that allow certain data to be extracted. You can attempt to
extract certain data from your asset or in this example, extract the
animation data from the *Seymour.dae* asset:

1. Setup the environment as before
2. Run::

     dae2json -I animations -i assets/models/Seymour.dae -o apps/sampleapp/staticmax/Seymour_animation_only.dae.json

The resulting file contains only the *Seymour.dae* animations. For
more detail on animation, see the animation samples.

.. ------------------------------------------------------------

.. _convert-cgfx-2json:

Convert a CgFX Shader to JSON
-----------------------------

To convert a shader written in the CgFX file format, we will use the
:ref:`cgfx2json <cgfx2json>` tool.  One difference between this tool
and other Turbulenz tools is that cgfx2json is a native executable.
Turbulenz provide a selection of default shaders to use with the
different renderers.  We will convert the source shader asset
*generic3D.cgfx* as an example:

1. Setup the environment as before
2. Run::

    "tools/bin/*PLATFORM*/cgfx2json" -i assets/shaders/generic3D.cgfx -o apps/sampleapp/staticmax/generic3D.cgfx.json

The shader can now be loaded and used by the Turbulenz Engine. You can
now make modifications to existing shaders and also creating your
own. You can try editing the source of the shaders that are used in
some of the samples, then build the shader using cgfx2json and test
the result using the sample code.

.. ------------------------------------------------------------

.. _add-assets-to-archive:

Add Assets to an Archive
------------------------

For most text-based formats supported by Turbulenz conversion tools
there is an either a compression or optimization option available. For
binary files there is an optional *json2tar* that looks for the
references in a JSON file and archives the binary files. This could
potentially allow compression, but mainly locates the resources and
groups them together. For this example we will use the *duck.dae*. To
archive the resources, you should perform the following steps:

1. Click on the Run environment shortcut in start menu to start the
   virtual environment
2. (Only if required, if you need to rebuild the duck) Run::

     dae2json -i assets/models/duck.dae -o apps/sampleapp/staticmax/duck.dae.json
3. Run::

     json2tar -i apps/sampleapp/staticmax/duck.dae.json -o apps/sampleapp/staticmax/duck.tar -a assets

.. NOTE::

    In this example the asset path specified by the *-a* option points
    to the root asset folder because the resources in duck.dae are
    relative to that folder, for example reference
    "textures/duck.png". Other references in different files might be
    relative to the asset itself. The tool is flexible and allows you
    to modify the path to suit the way you generate assets.

.. ------------------------------------------------------------

Loading Assets Using Callbacks
------------------------------

One very important part of creating a game for the browser is
requesting assets and data from servers. This is one example of when
callbacks are used in the engine. This topic will cover how to
construct a callback and wait for the result before continuing the
logic.

.. NOTE::

    For this example we are going to create two new files, one called *asset_loading.js* and one called *asset_loading.html*

Start by creating the *asset_loading.js* file with the following contents:

.. code-block:: javascript

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/camera.js") }}*/
    /*{{ javascript("jslib/drawprimitives.js") }}*/

    TurbulenzEngine.onload = function onloadFn()
    {
        if (!TurbulenzEngine.version)
        {
            // No version is available, terminating early
            return;
        }

        // Create the GraphicsDevice interface with no parameters
        var graphicsDeviceParameters = { };
        var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

        // Create the MathDevice interfaces with no parameters
        var mathDeviceParameters = { };
        var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

        // The draw variables
        var draw = null;
        var camera = Camera.create(mathDevice);

        var clearColor = [1.0, 1.0, 0.0, 1.0];

        //
        // INSERT CODE TO REQUEST ASSETS HERE
        //

        var intervalID;
        function loadingLoopFn()
        {
            //
            // INSERT CODE TO WAIT FOR ASSETS TO FINISH LOADING HERE
            //
        }

        // Call the loadingLoopFn, 10 fps
        intervalID = TurbulenzEngine.setInterval(loadingLoopFn, 1000 / 10);

        function destroyFn()
        {
            // Clear the interval
            TurbulenzEngine.clearInterval(intervalID);

            camera = null;
            draw = null;
            clearColor = null;

            //
            // INSERT CODE TO DESTROY HERE
            //

            TurbulenzEngine.flush();
        }

        TurbulenzEngine.onunload = destroyFn;
    };

You may also need to copy the *jslib* directory from the install dir
into your project directory.

As you can see from reading this file we have a section where we will
eventually request files (using callbacks) and a *loadingLoopFn* to
perform a task while we wait for the assets to arrive (such as drawing
a loading screen).  To request an asset to load, we will use both the
*request* function on the Native Engine interface (for shaders) and
*createTexture* interface on the GraphicsDevice.  These two methods
have slightly different ways of performing callbacks.  This code needs
to go after the *REQUEST ASSETS HERE* comment::

    // This will be our counter to detect when our assets have been loaded
    var totalAssetsRemaining = 0;

    // Create empty arrays to insert the assets into
    var textures = {};
    var shaders = {};

    // List of material parameters
    var materialParams = [];

    // Function called when a shader is loaded
    function shaderLoadedCallback(jsonData)
    {
        // Shader data passed to function as a JSON object
        if (jsonData)
        {
            var shaderParameters = JSON.parse(jsonData);
            shaders[shaderParameters.name] = graphicsDevice.createShader(shaderParameters);
            totalAssetsRemaining -= 1;
        }
    }

    // Create the parameters to load a texture.
    // In this case the "onload" callback is passed as a parameter
    var crateTextureParameters =
    {
        src     : "textures/crate.jpg",
        mipmaps : true,
        onload  : function (texture)
                {
                    textures[this.src] = texture;
                    totalAssetsRemaining -= 1;
                }
    };

    // Create the parameters to load a texture.
    // In this case the "onload" callback is passed as a parameter
    var stonesTextureParameters =
    {
        src     : "textures/stones.jpg",
        mipmaps : true,
        onload  : function (texture)
                {
                    textures[this.src] = texture;
                    totalAssetsRemaining -= 1;
                }
    };

    // Create the parameters to load a texture.
    // In this case the "onload" callback is passed as a parameter
    var brickTextureParameters =
    {
        src     : "textures/brick.png",
        mipmaps : true,
        onload  : function (texture)
                {
                    textures[this.src] = texture;
                    totalAssetsRemaining -= 1;
                }
    };

    // 2x Shaders, 3x Textures
    totalAssetsRemaining = 5;

    // Start texture load
    graphicsDevice.createTexture(crateTextureParameters);
    graphicsDevice.createTexture(stonesTextureParameters);
    graphicsDevice.createTexture(brickTextureParameters);

    // Start shader load
    TurbulenzEngine.request("shaders/generic2D.cgfx.json", shaderLoadedCallback);
    TurbulenzEngine.request("shaders/generic3D.cgfx.json", shaderLoadedCallback);

And add the destroy code to *destroyFn* after the *DESTROY HERE* comment::

    textures = null;
    shaders = null;
    materialParams = null;

    crateTextureParameters = null;
    stonesTextureParameters = null;
    brickTextureParameters = null;

While we are waiting for the assets to load, we will draw a colored
background and keep checking the *totalAssetsRemaining* variable. When
the variable is 0 we print the loaded asset list, initialize the new
assets and set a new interval to call a new draw function
*drawTexturesFn*. In the *loadingLoopFn* add the following code::

    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor, 1.0, 0.0);
        graphicsDevice.endFrame();
    }

    if (totalAssetsRemaining === 0)
    {
        TurbulenzEngine.clearInterval(intervalID);

        // The technique we will use to draw the textures
        var technique2DName = "textured2D";
        var technique2D = null;
        var shader2D = null;

        var resultString = "Loaded:<br><dl><dt>Shaders</dt><dd><ul>";
        for(var s in shaders)
        {
            if (shaders.hasOwnProperty(s))
            {
                var shader = shaders[s];
                var technique = shader.getTechnique(technique2DName);
                if (technique)
                {
                    technique2D = technique;
                    shader2D = shader;
                }
                resultString += "<li>" + s + "</li>";
            }
        }
        resultString += "</ul></dd><dt>Textures</dt><dd><ul>";

        for(var t in textures)
        {
            if (textures.hasOwnProperty(t))
            {
                if (shader2D)
                {
                    materialParams[materialParams.length] = {
                        clipSpace: [2.0 / graphicsDevice.width, -2.0 / graphicsDevice.height, -1.0, 1.0],
                        diffuse: textures[t]};
                }
                resultString += "<li>" + t + "</li>";
            }
        }
        resultString += "</ul></dd></dl>";

        if (shader2D)
        {
            // Draw the textures if a 2D shader exists
            draw = DrawPrimitives.create(graphicsDevice, "shaders/");
            draw.setTechnique(technique2D, true);
        }

        var outputElem = document.getElementById("output");
        if (outputElem)
        {
            outputElem.innerHTML = resultString;
        }

        // Draw at 30 fps
        TurbulenzEngine.setInterval(drawTexturesFn, 1000 / 30);
    }

Now you will need to add a custom HTML template so that the output of the loading is shown in the page.
Create a file called *asset_loading.html* and add the following::

    /*{% extends "default" %}*/
    /*{% block tz_app_title %}*/
    Asset Loading
    /*{% endblock %}*/
    /*{% block tz_app_title_name %}*/
    Asset Loading
    /*{% endblock %}*/
    /*{% block tz_app_html_controls %}*/
    <div id="output"></div>
    /*{% endblock %}*/

More information on templating see :ref:`templating`.

.. NOTE::

    You may have noticed if you try and run this now, that there is a
    yellow background. This is because the assets don't currently
    exist and we have not been able to load them yet.  This screen
    will change when we have successfully loaded **all** assets.

When the assets have been loaded, we will draw the textures using the
shaders we have just loaded.  Create this function above the
*loadingLoopFn* function::

    function drawTexturesFn()
    {
        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear([0.0, 0.0, 0.0, 1.0], 1.0, 0.0);
            if (draw)
            {
                var length = materialParams.length;
                var dim = graphicsDevice.height / length;
                var posA = [0, 0];
                var posB = [dim, dim];

                for(var i = 0; i < length; i += 1)
                {
                    posA[1] = (dim * i);
                    posB[1] = (dim * (i + 1));
                    draw.update2DTex(posA, posB);
                    draw.updateParameters(materialParams[i]);
                    draw.dispatch(camera);
                }

            }
            graphicsDevice.endFrame();
        }
    }

The only thing left to do is copy the assets we need to the respective
folders and build them:

**textures**

From *\*SDKINSTALLDIR\*/assets/textures*, copy files to these
locations in the project working directory:

* textures/crate.jpg
* textures/stones.jpg
* textures/brick.png

**shaders**

From *\*SDKINSTALLDIR\*/assets/shader*, compile the source shader files to these locations
in the project working directory:

* shaders/generic3D.cgfx.json
* shaders/generic2D.cgfx.json

To compile the shaders you will need to use the cgfx2json tool.
For more information see :ref:`convert-cgfx-2json`

.. NOTE::

    The Turbulenz JavaScript Library provides functionality for
    managing textures, shaders, resources etc, so those APIs are
    available to avoid having to request assets manually (as in this
    example). You should also check the "scene loading" sample, which
    demonstrates a method of loading a scene.

------------------------------------------------------------------

.. _considerations-for-asset-serving:

Considerations for Asset Serving
--------------------------------

When developing browser-based games the method of accessing content
can be drastically different to running a game locally. Turbulenz
Technology combines the power of file serving technology with a
hardware accelerated game engine. Managing the content is very
important and if not specially optimized can be very inefficient.
When you request files from Turbulenz servers, you should be
interested in the following aspects:

:Cache control:

    Browsers use caches to store requested files locally for reuse if
    identical requests are made again. They can be used to avoid
    unnecessary data transfer if the remote source file hasn't
    changed. Server hosted Turbulenz applications will usually have a
    **staticmax** directory that should contain static files that
    change infrequently.  Turbulenz servers will serve files in this
    directory with the intention of leaving them in the browser cache
    for as long as possible. Your control over a user's browser cache
    is limited and you should be aware that it could be cleared at
    anytime. In the event of an emptied cache, all relevant data would
    need to be requested again from the server.

:Grouping assets:

    The granularity of asset requests that Turbulenz Technology
    provides will allow you to request individual files, composite or
    merged files and packaged binaries. How you group assets depends
    on the type of assets you are using.  For example, you may wish to
    group a model with its textures to provide a "complete" asset as a
    single file, ensuring that changes to other resources don't effect
    this particular asset. You could do this as a composite file or
    binary package. At a higher level of grouping, mapping tables can
    be used to specify a list of assets you require to start a level.

:Pipelining assets:

    Because a fine level of granularity is available for asset
    requests, more parallel requests can be made (possibly from
    multiple servers). This allows the browser to manage multiple
    requests simultaneously and the processing of assets can begin
    before all data is completely downloaded. Processing may reveal
    dependencies, which can also be requested in parallel.


:Updating assets and adding new content:

    You may want to update an asset in the future, so Turbulenz
    Technology enables you to update that asset by using **mapping
    tables**. Mapping tables associate a source asset name with a
    specific converted asset file.  By changing this mapping table you
    can point to an updated asset without modifying the source code.
    Adding new content is as simple as uploading a new asset to the
    server and requesting that asset from updated code.  Careful
    grouping of assets is key to providing efficient updates.

:Optional deferred loading:

    If your game requires an asset, but not until some point in the
    future, you can optionally write code that downloads that
    information at a more appropriate time. This could be based on
    progress through the game.

:Total amount of available cache:

    Cache sizes vary between browsers so the expected size is not
    consistent.  In some cases the amount of space is small resulting
    in differing loading performance between browsers.  It is
    important to test multiple browsers to confirm the consistency of
    the gaming experience for all users.  For this reason you should
    not rely on the cache functionality for the implementation of your
    game.

:Reducing the time to start:

    You want to make sure the user can start playing the game as soon
    as possible. To achieve this you will need to structure your code
    and assets in such as way that you can download a minimum set of
    data and start running your game immediately. You will need to use
    some of the techniques mentioned above to do this, but the result
    should be an improved user experience.

.. _creating-a-mapping-table:

Creating a Mapping Table
------------------------

In the Turublenz engine, mapping tables are used to redirect requests
for named assets to the actual available assets.  Mapping tables can
be used as:

* A versioning system for assets, that essentially are the same
  entity.
* A method of accessing converted files via their source asset name
  e.g. *duck.dae* is the source name, but the converted asset is
  *duck.dae.json*.
* A method of implementing cache usage. By updating the mapping table,
  you can ensure alternative assets are loaded into the cache.

In order to deploy your game a mapping table is required as the
Turbulenz Services use it in order to know which assets need to be
deployed. Once in a deployed environment the Turbulenz Services alter
the mapping table to point to the deployed assets.

An example mapping table JSON file looks like this::

    {
        "version": 1.0,
        "urnmapping": {
            "textures/crate.jpg": "rOHfqp7mY3khNQCy245e1Jw.jpg",
            "models/cube.dae": "r3QnJu7UdYPC5LIy52dxSgw.json",
            "shaders/generic3D.cgfx": "rjxN8UefxjzRnqj85E-ylLA.json",
            "default.effects": "rQvPPmnvenV63V6xXpLK26Q.json",
            "shaders/standard.cgfx": "rkuK-8VukqwJ58gbxarF2fg.json",
            "default.materials": "rX2FUZffIpiNCu-aN2Hm6gQ.json",
            "shaders/generic2D.cgfx": "rgR4TUjrppkd8T3fxgQTIgw.json"
        },
    }

This file is essentially a pair of source asset names and processed
asset names.  The version refers the mapping table format number.
When this file is requested in the game code it is converted to a
JavaScript object, similar to those used by other mapping objects you
may have seen in the sample code.

This code from the samples has a similar purpose::

    // Create a mapping so that we're loading the processed assets
    var mapping = {
        "shaders/defaultrendering.cgfx": "shaders/defaultrendering.cgfx.json",
        "shaders/standard.cgfx": "shaders/standard.cgfx.json",
        "shaders/debug.cgfx": "shaders/debug.cgfx.json",
        "models/duck.dae": "models/duck.dae.json"
    };

    textureManager.setPathRemapping(mapping, "");
    shaderManager.setPathRemapping(mapping, "");
    sceneLoader.setPathRemapping(mapping, "");

Once the mapping table is set for the shader manager, for example, any
shaders that are requested by path **"shaders/standard.cgfx"** will be
redirected to use **"shaders/standard.cgfx.json"**. In the example
mapping table JSON file, you may have noticed the random characters
used for each processed asset name. This is an example of a unique
value to ensure that two generated versions of the source asset will
not clash when stored in the cache.

.. WARNING::

    Generating a unique asset name is an important step in using a
    mapping table. If two assets are identically named, but physically
    different, any requests for that asset will find the one stored in
    the browser cache and **not** the newer assets on the server. This
    would require a user to clear their browser cache, which is
    undesirable.  Instead keeping a unique identifier based on a hash
    of the file contents is a suitable method of avoid this scenario.

.. NOTE::

    Mapping table entries for the destination, processed asset names
    **must** be URL safe.  The reason is that this is the name the
    file will be requested via the Local server.  On the Turbulenz
    Hub, the mapping is processed and handled prior to hosting the
    files.  If you chose to use a base64 encoding method to generate a
    unique hash of the file make sure it is URL safe.  For example,
    python provides a URL safe base64 encoding method:
    `http://docs.python.org/library/base64.html
    <http://docs.python.org/library/base64.html>`_

.. NOTE::

    MappingTables support overloading the default map, via the
    optional ``overrides`` property.  See :ref:`the Mapping Table
    reference <mappingtable>` for details.

To explain how and why you should apply this optimization, the
following steps will walk you through the process of creating your own
mapping table for your application:

1.  Identify the assets that you are using in your game.
    For example the Sample App uses the following:

    * debug.cgfx
    * defaultrendering.cgfx
    * standard.cgfx
    * duck.png
    * duck.dae

.. NOTE::

    It is important to notice that the files are not all requested in
    the same way. In this example the shaders are requested via the
    path "shaders/standard.cgfx", where as the "textures/duck.png" is
    requested from the textures directory. Mapping tables can be used
    to map these different requests to a different directory structure
    or as a flat structure in the example mapping table.

2.  You should make a list of the names of the files as they are
    requested by the game code:

    * "shaders/debug.cgfx"
    * "shaders/defaultrendering.cgfx"
    * "shaders/standard.cgfx"
    * "textures/duck.png"
    * "models/duck.dae"

3.  We want to store the assets that we are mapping in the browser
    cache. For the purpose of this exercise, you should map the files
    to a directory called **"staticmax/"**, similar to the one in the
    *sampleapp* folder.  The purpose of this folder is to indicate the
    files that you want the browser to cache for as long as possible.

.. NOTE::

    Control of the browser cache is limited and there is no guarantee
    that cached files will still exist in the cache when the code
    requests that asset next time. This behavior is because the cache
    could have been filled, items removed or could have been
    automatically/manually emptied. Either way the default behavior is
    to use the cached file before falling back to requesting it from
    the file server.

4.  To ensure the files you are using don't clash, you will give them
    unique names. How you generate these names is up to you and your
    build process, however it makes sense to generate these names when
    you convert your assets to Turbulenz compatible formats. Assuming
    you have just generated these new files, copy and rename each of
    your processed assets to your **staticmax/** directory:

    * shaders/debug.cgfx.json            **->** staticmax/2Hohp_autOW0WbutP_NSUw.json
    * shaders/defaultrendering.cgfx.json **->** staticmax/4HdTZBhuheSPYHe1vmygYA.json
    * shaders/standard.cgfx.json         **->** staticmax/5Yhd75LjDeV3WEvRsKnGSQ.json
    * textures/duck.png                  **->** staticmax/f1Ay_x_BbiiUGm_qQdfSWQ.png
    * models/duck.dae.json               **->** staticmax/grhvty7RHO1eksdUf0wlAw.json

    Notice how the binary *png* file retains its extension. This is so
    that the mime-type of the file is retained and file type can be
    processed correctly. This allows you to *view* and *disassemble*
    assets in the local server.

5.  You should create a file called **mapping_table.json** in your
    \*GAMEDIR\* directory with the following content::

        {
            "urnmapping": {
                "shaders/debug.cgfx": "2Hohp_autOW0WbutP_NSUw.json",
                "shaders/defaultrendering.cgfx": "4HdTZBhuheSPYHe1vmygYA.json",
                "shaders/standard.cgfx": "5Yhd75LjDeV3WEvRsKnGSQ.json",
                "textures/duck.png": "f1Ay_x_BbiiUGm_qQdfSWQ.png",
                "models/duck.dae": "grhvty7RHO1eksdUf0wlAw.json"
            },
            "version": 1.0
        }

.. NOTE::

    You do NOT need to append *staticmax/* to the front of your
    assets, the mapping table API will do this for you.

6.  Now that the files have been "processed", you need to load and
    read the table. In the samples you might see something similar to
    the following code::

        var mappingTable;
        var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
        {
            textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            soundManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
            sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

            loadAssets();
        };

        var gameSessionCreated = function gameSessionCreatedFn(gameSession)
        {
            mappingTable = TurbulenzServices.createMappingTable(gameSession,
                                                                mappingTableReceived);
        };

        var gameSession = TurbulenzServices.createGameSession(gameSessionCreated);

    You cannot request any assets until this ``loadAssets`` function
    is called.  Here is an example ``loadAssets`` function::

        var renderer;
        var scene = Scene.create(mathDevice);
        var sceneLoader = SceneLoader.create();

        var loadAssets = function loadAssetsFn()
        {
            // Start loading assets
            // Renderer for the scene.
            renderer = DefaultRendering.create(graphicsDevice,
                                               mathDevice,
                                               shaderManager,
                                               effectManager);

            renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
            renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));

            // Load objects into the scene using a scene loader
            sceneLoader.load({
                scene : scene,
                assetPath : "models/duck.dae",
                graphicsDevice : graphicsDevice,
                textureManager : textureManager,
                effectManager : effectManager,
                shaderManager : shaderManager,
                requestHandler: requestHandler,
                append : false,
                dynamic : true
            });
        };


7.  When you have added the code to your application you should be
    able to run the *development* version (See
    :ref:`getting_started_creating_turbulenz_app` for help on
    building).

8.  Add your game to the local server (See
    :ref:`getting_started_creating_turbulenz_app`) and then look at
    the metrics page.  You should be able to see that the files
    requested were from the *staticmax/* folder!

Combining a mapping table with resources in the *staticmax* directory
allows you to select which assets to cache without your game code
understanding the file structure that exists on the server. You may
use multiple mapping tables in your game, for example to group files
(per level) or to provide multiple file aliases.

.. _adding_profiles_to_a_mapping_table:

Adding Profiles to a Mapping Table
----------------------------------

The :ref:`maptool` command can be used to manipulate
``mapping_table.json``, adding profiles as part of an asset build.
See :ref:`mappingtable` for a description of how profiles are used.

:ref:`maptool` is designed for the case where a primary build generates
some default assets, and secondary build generates assets intended to
be used instead of the default set under certain conditions.

For example, if both the primary build generates some texture files::

    output/
      mapping_table.json
      staticmax/
        texture1_ae7646ef.png   (for asset 'texture1.png')
        texture2_e6a67fe4.png   (for asset 'texture2.png')
        ...

and a secondary build, intended for high resolution displays,
generates::

    output/
      mapping_table_hires.json
      staticmax/
        texture1_hires_d64eb8a0.png (for asset 'texture1.png')
        texture2_hires_37df4f8e.png (for asset 'texture2.png')
        ...

then ``mapping_table_hires.json`` can be merged into
``mapping_table.json`` as a profile called 'hires' with the following
command::

    maptool -o mapping_table_final.json --profile hires,mapping_table_hires.json

This results in a file ``mapping_table_final.json`` where the default
profile points to ``texture1_ae7646ef.png`` and
``texture2_e6a67fe4.png``, and the 'hires' profile points to
``texture1_hires_d64eb8a0.png`` and ``texture2_hires_37df4f8e.png``.

.. _debugging-a-mapping-table:

Debugging a Mapping Table
-------------------------

If you have generated a mapping table and your assets don't appear in
your game, you might need to debug the mapping table.  These steps
will also apply to mapping tables generated in code, such as the
variable **mapping** in the Sample App.  It is useful to see the
requests that are being made for assets to ensure those assets exist;
some of the loading code may be attempting to load references in files
that don't exist or are not used.  Here are a few methods you can try:

:Pass a custom request function:

    A few of the JavaScript APIs provided allow a custom "request"
    function to be passed in as a parameter.  This includes the
    *resourceloader* from *jslib* and *sceneloader* from the sample
    scripts.  By overloading this function you can track the asset
    requests as they are made.  The following code will allow you to
    track which files are requested and what they are remapped to::

        var urlMapping = {
            "shaders/debug.cgfx" : "2Hohp_autOW0WbutP_NSUw.json",
            "shaders/defaultrendering.cgfx" : "4HdTZBhuheSPYHe1vmygYA.json",
            "shaders/standard.cgfx" : "5Yhd75LjDeV3WEvRsKnGSQ.json"
        };

        var missingMapping = [];
        function addMissingMappingFn(assetName)
        {
            missingMapping[missingMapping.length] = assetName;
        }

        var request = function requestFn(assetName, onload)
        {
            return TurbulenzEngine.request(mappingTable.getURL(assetName, addMissingMappingFn), onload);
        };

    You can then print the *missingMapping* variables or debug the
    code at different stages and view the variables in the watch list.

.. NOTE::

    Not all APIs that use *TurbulenzEngine.request* support passing of
    custom request functions.  You may be required to debug these
    manually.

:View the requests for file in the Local Server:

    When you run the local server (See
    :ref:`getting_started_local_development_server`), the console
    window will output logging information that may useful. This
    includes HTTP requests for files with the resulting error codes,
    such as:

    :200: OK
    :404: Not Found
    :304: Not Modified

    The results will help you identify which files have failed to be
    served, which are missing and which already exist.

    If you flush your browser cache and run your game again, you
    should see the requests being made.
