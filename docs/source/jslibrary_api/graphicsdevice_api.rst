.. highlight:: javascript

.. index::
    single: GraphicsDevice

.. _graphicsdevice:

-------------------------
The GraphicsDevice Object
-------------------------

Provides a shader-based immediate mode rendering API.

The GraphicsDevice object can be used to create the following objects:

* :ref:`VertexBuffers <vertexbuffer>`
* :ref:`IndexBuffers <indexbuffer>`
* :ref:`Semantics <semantics>`
* :ref:`Textures <texture>`
* :ref:`Shaders <shader>`
* :ref:`TechniqueParameters <techniqueparameters>`
* :ref:`TechniqueParameterBuffer <techniqueparameterbuffer>`
* :ref:`RenderBuffers <renderbuffer>`
* :ref:`RenderTargets <rendertarget>`
* :ref:`OcclusionQueries <occlusionquery>`
* :ref:`DrawParameters <drawparameters>`

The data contained on the vertex and index buffer objects can either be set at once when creating the buffer
with the `data` option, or it can be supplied later by the application by using `setData` or `map` / `unmap` to get
an iterator object that can be used to write data into the buffer.

:ref:`Shader <shader>` objects can contain multiple rendering techniques which can be queried per name.
In order to render anything, one :ref:`Technique <technique>` must be set on the GraphicsDevice.
Shader parameters can either be set from a :ref:`TechniqueParameters <techniqueparameters>`
or changed directly on the technique after setting it on the device.
The former is recommended for updating multiple values at the same time.
When the technique parameter is an array with many values a :ref:`TechniqueParameterBuffer <techniqueparameterbuffer>` object can be used to set the whole
array at once, it can be updated in a similar way vertex and index buffers can be updated.

To use :ref:`Texture <texture>` objects they have to be set as shader parameters. Pixel data on a Texture object can be set either
by setting the `data` option at creation time,
by loading from an image file or by rendering to the Texture through a RenderTarget object.
Multiple image files can be archived and loaded as a ".tar" file,
this removes the cost of multiple connections to the server.

Once a :ref:`Technique <technique>` is set, a geometry must also be set on the device,
it can be done either by using :ref:`vertex <vertexbuffer>`  and :ref:`index <indexbuffer>` buffers,
or by using `beginDraw` / `endDraw` for inline geometry.
Multiple VertexBuffers can be set at the same time on the device as soon as they are referenced by different semantics.
When using vertex and index buffers, a separate call to one of the draw methods is required in order to tell the device
how much data must be used from those buffers.

The GraphicsDevice is implemented using WebGL for canvas versions and OpenGL for plugin versions.
The majority of behavior is identical between the two implementations however there are a number of differences:

* WebGL clears the back buffer after a present.
* WebGL clears all created buffers.

See the WebGL specification http://www.khronos.org/registry/webgl/specs/latest for full details.

Methods
=======

.. _graphicsdevice_beginframe:

.. index::
    pair: GraphicsDevice; beginFrame

`beginFrame`
------------

**Summary**

Signals the beginning of a new render frame.

This can fail if the host window is not visible, e.g. the browser is minimized or the window is not on the active tab.

**Syntax** ::

    if (graphicsDevice.beginFrame())
    {
        drawScene();

        graphicsDevice.endFrame();
    }


.. _graphicsdevice_endframe:

.. index::
    pair: GraphicsDevice; endFrame

`endFrame`
----------

**Summary**

Signals the end of the current render frame.
The backbuffer will be presented to the screen.

**Syntax** ::

    if (graphicsDevice.beginFrame())
    {
        drawScene();

        graphicsDevice.endFrame();
    }

.. _graphicsdevice_setviewport:

.. index::
    pair: GraphicsDevice; setViewport

`setViewport`
-------------

**Summary**

Sets the viewport that maps the device coordinates to window coordinates.

It defaults to the size of the host window.

See also :ref:`setScissor <graphicsdevice_setscissor>`.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.setViewport(x, y, width, height);

    //example usage:
    graphicsDevice.setViewport(100, 100, (graphicsDevice.width - 100), (graphicsDevice.height - 100));


.. _graphicsdevice_setscissor:

.. index::
    pair: GraphicsDevice; setScissor

`setScissor`
------------

**Summary**

Sets the scissor rectangle that limits the active rendering buffer rectangle.

Typically the arguments are the same as those for :ref:`setViewport  <graphicsdevice_setviewport>`.

It defaults to the size of the host window.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.setScissor(x, y, width, height);

    //example usage:
    graphicsDevice.setScissor(100, 100, (graphicsDevice.width - 100), (graphicsDevice.height - 100));


.. _graphicsdevice_clear:

.. index::
    pair: GraphicsDevice; clear

`clear`
-------

**Summary**

Clears the active rendering buffers.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    var clearColor = [0.0, 0.0, 0.0, 1.0];
    var clearDepth = 1.0;
    var clearStencil = 0;
    graphicsDevice.clear(clearColor, clearDepth, clearStencil);

``clearColor``
    An array of 4 numbers to clear the color buffers to.
    Can be set to `null` to avoid clearing the color buffer.

``clearDepth`` (Optional)
    The number to clear the depth buffer to.
    Can be set to `null` to avoid clearing the depth buffer.

``clearStencil`` (Optional)
    The number to clear the stencil buffer to.
    Can be set to `null` to avoid clearing the stencil buffer.

.. _graphicsdevice_createtexture:

.. index::
    pair: GraphicsDevice; createTexture

`createTexture`
---------------

**Summary**

Creates a :ref:`Texture <texture>` object.  If a ``src`` parameter is
given then the :ref:`Texture <texture>` returned is not valid until
the ``onload`` function is called.  Returns immediately.

**Syntax** ::

    // For a procedural texture (without a src parameter)
    var proceduralTextureParameters = {
        name: "checkers",
        width: 4,
        height: 4,
        depth: 1,
        format: graphicsDevice.PIXELFORMAT_L8,
        mipmaps: false,
        cubemap: false,
        renderable: false,
        dynamic: false,
        data: [  0, 255,   0, 255,
               255,   0, 255,   0,
                 0, 255,   0, 255,
               255,   0, 255,   0]
    };
    var proceduralTexture = graphicsDevice.createTexture(proceduralTextureParameters);

    // To load a texture from a URL
    var loadingTexture;
    var textureParameters = {
        src: "textures/crate.jpg",
        mipmaps: true,
        onload: function onLoadedTextureFn(texture, status)
        {
            if (texture)
            {
                sharedTechniqueParameters.diffuse = texture;
                assetsToLoad -= 1;
            }
            else
            {
                alert("Texture missing!");
            }

            loadedTexture = loadingTexture;
        }
    };
    loadingTexture = graphicsDevice.createTexture(textureParameters);

``format``
    A :ref:`pixel format value <graphicsdevice_PIXELFORMAT>`.

``onload``
    A JavaScript function.
    Function to call with the loaded assets.
    This function is always called asynchronously.

``texture``
    The :ref:`Texture <texture>` object.

``status``

    A JavaScript number.  The HTTP response status code.  For example,
    status ``200`` is ``OK``.  See
    http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10 for
    more information.

``data``

    Data with which to initialize the Texture.  This property can be a
    Typed Array in which case the data will be set in an optimized way
    if the size and type of the array are appropriate for the
    PixelFormat of the Texture (as described in the WebGL standards).

Returns a :ref:`Texture <texture>` object or ``null`` if parameters are missing or incorrect.
For more information on the parameters see the :ref:`Texture <texture>` object.
Supported formats: DDS, JPG, PNG and TGA.

.. note::
    You should manage the response status codes correctly.
    See the :ref:`RequestHandler <requesthandler>` for handling connection and service busy issues.
    Alternatively, use the :ref:`TextureManager <texturemanager>` to load textures.

.. _graphicsdevice_createshader:

.. index::
    pair: GraphicsDevice; createShader

`createShader`
--------------

**Summary**

Creates a Shader object.

**Syntax** ::

    var shaderLoaded = function shaderLoadedFn(shaderDefinitionString)
    {
        if (shaderDefinitionString)
        {
            var shaderDefinition = JSON.parse(shaderDefinitionString);
            var shader = graphicsDevice.createShader(shaderDefinition);
            if (shader)
            {
                technique = shader.getTechnique("textured2D");
            }
        }
    };
    TurbulenzEngine.request("shaders/generic2D.cgfx.json", shaderLoaded);

``shaderDefinition``
    The JavaScript object that defines the shader to be created.

Returns a :ref:`Shader <shader>` object.

.. _graphicsdevice_settechnique:

.. index::
    pair: GraphicsDevice; setTechnique

`setTechnique`
--------------

**Summary**

Sets the active Technique.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    var technique = shader.getTechnique("phong");
    graphicsDevice.setTechnique(technique);

``technique``
    A shader :ref:`Technique <technique>` object.


.. _graphicsdevice_createtechniqueparameterbuffer:

.. index::
    pair: GraphicsDevice; createTechniqueParameterBuffer

`createTechniqueParameterBuffer`
--------------------------------

**Summary**

Creates a TechniqueParameterBuffer object.

**Syntax** ::

    var skinBones = graphicsDevice.createTechniqueParameterBuffer({
        numFloats : (numBones * 12),
        dynamic : true
    });

Returns a :ref:`TechniqueParameterBuffer <techniqueparameterbuffer>` object.

.. _graphicsdevice_createtechniqueparameters:

.. index::
    pair: GraphicsDevice; createTechniqueParameters

`createTechniqueParameters`
---------------------------

**Summary**

Creates a TechniqueParameters object.

**Syntax** ::

    var TechniqueParameters = graphicsDevice.createTechniqueParameters({
        diffuse: texture,
        color: mathDevice.v4Build(1.0, 1.0, 1.0, 1.0)
    });

Returns a :ref:`TechniqueParameters <techniqueparameters>` object.

.. _graphicsdevice_settechniqueparameters:

.. index::
    pair: GraphicsDevice; setTechniqueParameters

`setTechniqueParameters`
------------------------

**Summary**

Sets the TechniqueParameters properties to the active Technique.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.setTechniqueParameters(globalTechniqueParameters);
    for (var n = 0; n < numNodes; n += 1)
    {
        graphicsDevice.setTechniqueParameters(sharedTechniqueParameters, instanceTechniqueParameters);
        drawNode(nodes[n]);
    }

``globalTechniqueParameters``
    A :ref:`TechniqueParameters <techniqueparameters>` object.

This method can receive multiple TechniqueParameters objects,
all the properties from each TechniqueParameters will be set to the Technique in turn.

.. _graphicsdevice_createsemantics:

.. index::
    pair: GraphicsDevice; createSemantics

`createSemantics`
-----------------

**Summary**

Creates a Semantics object.

**Syntax** ::

    var semantics = graphicsDevice.createSemantics(semanticsValues);

    var baseSemantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION,
                                            graphicsDevice.SEMANTIC_NORMAL,
                                            graphicsDevice.SEMANTIC_COLOR]);

``semanticsValues``
    A JavaScript array of :ref:`semantic values <graphicsDevice_SEMANTIC>`.

Returns a :ref:`Semantics <semantics>` object.


.. _graphicsdevice_createvertexbuffer:

.. index::
    pair: GraphicsDevice; createVertexBuffer

`createVertexBuffer`
--------------------

**Summary**

Creates a VertexBuffer object.

**Syntax** ::

    var vertexbufferParameters = {
        numVertices: 4,
        attributes: [graphicsDevice.VERTEXFORMAT_FLOAT2,
                     graphicsDevice.VERTEXFORMAT_SHORT2],
        dynamic: false,
        'transient': false,
        data:[100.0, 200.0, 3, 1000,
              200.0, 200.0, 4, 2000,
              100.0, 100.0, 5, 3000,
              200.0, 100.0, 6, 4000]
    };
    var vertexbuffer = graphicsDevice.createVertexBuffer(vertexbufferParameters);

``numVertices``
    The number of vertices that the vertex buffer can take.
    The size of the vertex buffer is the number of vertices multiplied by the total size of the attributes types.

``attributes``
    A JavaScript array of :ref:`vertex format values <graphicsDevice_VERTEXFORMAT>`.

``dynamic``
    This optional parameter is a hint to the GraphicsDevice as to how this vertex buffer will be used
    and it means: the contents will be modified repeatedly and used many times.

``transient``
    This optional parameter is a hint to the GraphicsDevice as to how this vertex buffer will be used
    and it means: the contents will be modified repeatedly but used only once.
    This flag provides similar performance behaviour as :ref:`beginDraw <graphicsdevice_begindraw>` / :ref:`endDraw <graphicsdevice_enddraw>` but with the added benefit of having the
    possibility to use an index buffer to draw indexed geometry with :ref:`drawIndexed <graphicsdevice_drawindexed>`.
    As the contents will only be used once, there is no need to use transient buffers as ring-buffers.
    This flag has preference over ``dynamic`` if both are present.

``data``

    A JavaScript array containing the data to put into the buffer.
    The size of the data array is the number of vertices multiplied by
    the total size of the attributes types (i.e. the stride).  This
    data is treated in the same way as arguments to
    :ref:`setData <vertexbuffer_setdata>`.

Returns a :ref:`VertexBuffer <vertexbuffer>` object.

.. note:: The number of attributes per VertexBuffer is limited to a maximum of 8.


.. _graphicsdevice_setstream:

.. index::
    pair: GraphicsDevice; setStream

`setStream`
-----------

**Summary**

Sets a VertexBuffer object to represent specific semantics.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    var semantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION,
        graphicsDevice.SEMANTIC_NORMAL,
        graphicsDevice.SEMANTIC_COLOR]);
    var vertexBuffer = graphicsDevice.createVertexBuffer(vertexbufferParameters);
    var offset = 0;

    graphicsDevice.setStream(vertexBuffer, semantics, offset);

``vertexBuffer``
    A :ref:`VertexBuffer <vertexbuffer>` object.

``semantics``
    A :ref:`Semantics <semantics>` object.

``offset`` (Optional)
    Used to specify an offset in vertices of what will be considered the vertex at index zero for the following draw calls.


.. _graphicsdevice_createindexbuffer:

.. index::
    pair: GraphicsDevice; createIndexBuffer

`createIndexBuffer`
-------------------

**Summary**

Creates an IndexBuffer object.

**Syntax** ::

    var indexBufferParameters = {
        numIndices: 4,
        format: graphicsDevice.INDEXFORMAT_USHORT,
        dynamic: false,
        'transient': false,
        data: [ 0, 1, 2, 3 ]
    };
    var indexBuffer = graphicsDevice.createIndexBuffer(indexBufferParameters);

``numIndices``

    The capacity of the IndexBuffer expressed as index count.

``format``

    The format of indices.

``dynamic``

    Set to true if you intend to update the values of the indices at
    runtime.

``transient``
    This optional parameter is a hint to the GraphicsDevice as to how this index buffer will be used
    and it means: the contents will be modified repeatedly but used only once.
    As the contents will only be used once, there is no need to use transient buffers as ring-buffers.
    This flag has preference over ``dynamic`` if both are present.

``data``

    If given, the IndexBuffer is initialized with this data.  See
    :ref:`indexbuffer_setdata` for details of this data, in particular
    using the correct Typed Array objects for this property results in
    optimal data transfer.

Returns an :ref:`IndexBuffer <indexbuffer>` object.

See also :ref:`isSupported <graphicsdevice_issupported>` for format support.

.. _graphicsdevice_setindexbuffer:

.. index::
    pair: GraphicsDevice; setIndexBuffer

`setIndexBuffer`
----------------

**Summary**

Sets the active IndexBuffer.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.setIndexBuffer(indexbuffer);

.. _graphicsdevice_createdrawparameters:

.. index::
    pair: GraphicsDevice; createDrawParameters

`createDrawParameters`
----------------------

**Summary**

Creates a :ref:`DrawParameters <drawparameters>` object.

**Syntax** ::

    var drawParameters = graphicsDevice.createDrawParameters();

.. _graphicsdevice_drawindexed:

.. index::
    pair: GraphicsDevice; drawIndexed

`drawIndexed`
-------------

**Summary**

Draws a geometry defined by indices from the active :ref:`IndexBuffer <indexbuffer>`
and the active :ref:`VertexBuffer <vertexbuffer>` streams
using the active :ref:`Technique <technique>`.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.drawIndexed(primitive, numIndices, first);

``primitive``
    One of :ref:`PRIMITIVE <graphicsDevice_PRIMITIVE>`.

``numIndices``
   The number of indicies.

``first``
    Offset from the beginning of the buffer in indicies. Optional, defaults to 0.

.. _graphicsdevice_draw:

.. index::
    pair: GraphicsDevice; draw

`draw`
------

**Summary**

Draws a geometry defined only by the active :ref:`VertexBuffer <vertexbuffer>` streams
using the active :ref:`Technique <technique>`.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.draw(primitive, numVertices, first);

``primitive``
    One of :ref:`PRIMITIVE <graphicsDevice_PRIMITIVE>`.

``numVertices``
   The number of numVertices.

``first``
    Offset from the beginning of the buffer in vertices. Optional, defaults to 0.

.. index::
    pair: GraphicsDevice; drawArray

.. _graphicsdevice_drawarray:

`drawArray`
-----------

**Summary**

Draws an array of :ref:`DrawParameters <drawparameters>`.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    graphicsDevice.drawArray(drawParametersArray, globalTechniqueParametersArray, sortMode);

``drawParametersArray``
    An array of :ref:`DrawParameters <drawparameters>`.

``globalTechniqueParametersArray``
    An array of :ref:`TechniqueParameters <techniqueparameters>`. These are applied in order when each technique is set and before the DrawParameters' TechniqueParameters.
    For consistency during sorting of the DrawParameters properties that are present the global TechniqueParameters objects should not be present in DrawParameters' TechniqueParameters.

``sortMode``
    The mode to sort the array by using the :ref:`DrawParameters.sortKey <drawparameters_sortkey>`.

        * -1 for sorting by least
        * 1 for sorting by greatest
        * 0 for no sorting to preserve order or for presorted arrays.

.. _graphicsdevice_begindraw:

.. index::
    pair: GraphicsDevice; beginDraw

`beginDraw`
-----------

**Summary**

Starts dispatching of inline geometry.

It should only be called between beginFrame/endFrame.

**Syntax** ::


    var semantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION,
                                                    graphicsDevice.SEMANTIC_TEXCOORD0])

    var vertexFormats = [graphicsDevice.VERTEXFORMAT_FLOAT2, graphicsDevice.VERTEXFORMAT_FLOAT2];
    var writer = graphicsDevice.beginDraw(primitive, numVertices, vertexFormats, semantics);
    if (writer)
    {
        writer(-1.0,         1.0,          0.0, 0.0);
        writer(-1.0 + width, 1.0,          1.0, 0.0);
        writer(-1.0 + width, 1.0 + height, 1.0, 1.0);
        writer(-1.0,         1.0 + height, 0.0, 1.0);
        graphicsDevice.endDraw(writer);
    }

``vertexFormats``
    An array of :ref:`vertex formats <graphicsDevice_VERTEXFORMAT>`.

``semantics``
    A :ref:`Semantics <semantics>` object.

.. _graphicsdevice_enddraw:

.. index::
    pair: GraphicsDevice; endDraw

`endDraw`
---------

**Summary**

Ends dispatching of inline geometry.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    var vertexFormats = [graphicsDevice.VERTEXFORMAT_FLOAT2, graphicsDevice.VERTEXFORMAT_FLOAT2];
    var writer = graphicsDevice.beginDraw(primitive, numVertices, vertexFormats, semantics);
    if (writer)
    {
        writer(-1.0,         1.0,          0.0, 0.0);
        writer(-1.0 + width, 1.0,          1.0, 0.0);
        writer(-1.0 + width, 1.0 + height, 1.0, 1.0);
        writer(-1.0,         1.0 + height, 0.0, 1.0);
        graphicsDevice.endDraw(writer);
    }

``writer``
    The writer returned from ``graphicsDevice.beginDraw``.

.. _graphicsdevice_createrenderbuffer:

.. index::
    pair: GraphicsDevice; createRenderBuffer

`createRenderBuffer`
--------------------

**Summary**

Creates a RenderBuffer object.

**Syntax** ::

    var depthBuffer = graphicsDevice.createRenderBuffer({
            width: 256,
            height: 256,
            format: graphicsDevice.PIXELFORMAT_D24S8
        });

Returns a :ref:`RenderBuffer <renderbuffer>` object. This can be null if the pass in arguments are not supported by the graphics card.

.. _graphicsdevice_createrendertarget:

.. index::
    pair: GraphicsDevice; createRenderTarget

`createRenderTarget`
--------------------

**Summary**

Creates a RenderTarget object.

**Syntax** ::

    var baseRenderTarget = graphicsDevice.createRenderTarget({
        colorTexture0: albedoTexture,
        colorTexture1: specularTexture,
        colorTexture2: normalTexture,
        colorTexture3: depthTexture,
        depthBuffer: depthBuffer
    });

Returns a :ref:`RenderTarget <rendertarget>` object.

.. _graphicsdevice_beginrendertarget:

.. index::
    pair: GraphicsDevice; beginRenderTarget

`beginRenderTarget`
-------------------

**Summary**

Start rendering to a RenderTarget object.

This sets the viewport and scissor to be the size of the RenderTarget.

It should only be called between beginFrame/endFrame.

**Syntax** ::

        if (graphicsDevice.beginRenderTarget(renderTarget))
        {
            drawOpaque();
            graphicsDevice.endRenderTarget();
        }

``renderTarget``
    A :ref:`RenderTarget <rendertarget>` object to render to.

.. _graphicsdevice_endrendertarget:

.. index::
    pair: GraphicsDevice; endRenderTarget

`endRenderTarget`
-----------------

**Summary**

Ends rendering to a RenderTarget object.

This resets the viewport and scissor to be the values they were when `beginRenderTarget` was called.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    if (graphicsDevice.beginRenderTarget(baseRenderTarget))
    {
        drawOpaque();
        graphicsDevice.endRenderTarget();
    }

.. _graphicsdevice_createocclusionquery:

.. index::
    pair: GraphicsDevice; createOcclusionQuery

`createOcclusionQuery`
----------------------

**Summary**

Creates an OcclusionQuery object.

**Syntax** ::

    var occlusionQuery = graphicsDevice.createOcclusionQuery();

Returns an :ref:`OcclusionQuery <occlusionquery>` object.

.. _graphicsdevice_beginocclusionquery:

.. index::
    pair: GraphicsDevice; beginOcclusionQuery

`beginOcclusionQuery`
---------------------

**Summary**

Starts an occlusion query.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    if (graphicsDevice.beginOcclusionQuery(occlusionQuery))
    {
        graphicsDevice.draw(primitive, numVertices);

        graphicsDevice.endOcclusionQuery();
    }

``occlusionQuery``
    An :ref:`OcclusionQuery <occlusionquery>` object.

.. _graphicsdevice_endocclusionquery:

.. index::
    pair: GraphicsDevice; endOcclusionQuery

`endOcclusionQuery`
-------------------

**Summary**

Ends an occlusion query.

It should only be called between beginFrame/endFrame.

**Syntax** ::

    if (graphicsDevice.beginOcclusionQuery(occlusionQuery))
    {
        graphicsDevice.draw(primitive, numVertices);

        graphicsDevice.endOcclusionQuery();
    }

    // Latency of at least one frame
    if (occlusionQuery.pixelCount > 2000)
    {

    }

.. _graphicsdevice_loadtexturesarchive:

.. index::
    pair: GraphicsDevice; loadTexturesArchive

`loadTexturesArchive`
---------------------

**Summary**

Loads a collection of :ref:`Texture <texture>` objects from an archive.
Returns immediately.

**Syntax** ::

    var archiveParameters = {
        src: 'textures/level0.tar',
        mipmaps: true,
        ontextureload: function ontextureloadFn(texture)
        {
            loadedTexture(texture.name);
        },
        onload: function onloadFn(success, status)
        {
            if (success)
            {
                loadedArchive();
            }
        }
    };
    graphicsDevice.loadTexturesArchive(archiveParameters);

``src``
    A JavaScript string.
    The URL of texture archive to load.
    The source must be a TAR file.

``ontextureload``
    A JavaScript function.
    Called for each :ref:`Texture <texture>` object in the archive.
    This function is always called asynchronously.

``texture``
    A :ref:`Texture <texture>` object.

``onload``
    A JavaScript function.
    Called once the entire archive has been loaded.
    This function is always called asynchronously.

``success``
    A JavaScript boolean.

``status``
    A JavaScript number.
    The HTTP response status code.
    For example, status ``200`` is ``OK``.
    See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10 for more information.

Returns ``true`` if the request can be made or ``false`` if parameters are incorrect.

.. note::
    You should manage the response status codes correctly.
    See the :ref:`RequestHandler <requesthandler>` for handling connection and service busy issues.
    Alternatively, use the :ref:`TextureManager <texturemanager>` to load textures.

.. _graphicsdevice_getscreenshot:

.. index::
    pair: GraphicsDevice; getScreenshot

`getScreenshot`
---------------

**Summary**

Returns an array with the pixel values of the current frontbuffer.
Each pixel will be represented by 4 values in the range [0..255] in RGBA order.

**Syntax** ::

    var compress = false;
    var width = graphicsDevice.width;
    var height = graphicsDevice.height;

    var canvas = document.getElementById("screenshot");
    var ctx = canvas.getContext("2d");
    var imageData = ctx.createImageData(width, height);
    var data = imageData.data;

    var pixels = graphicsDevice.getScreenshot(compress);
    if (!pixels)
    {
        alert("Failed to get screenshot.");
        return;
    }

    var srcRowStride = (width * 4);
    var srcRow = ((height - 1) * srcRowStride);
    var desItem = 0;
    for (var y = 0; y < height; y += 1)
    {
        var srcItem = srcRow;
        for (var x = 0; x < width; x += 1)
        {
            data[desItem + 0] = pixels[srcItem + 0];
            data[desItem + 1] = pixels[srcItem + 1];
            data[desItem + 2] = pixels[srcItem + 2];
            data[desItem + 3] = 255;
            srcItem += 4;
            desItem += 4;
        }
        srcRow -= srcRowStride;
    }

    ctx.putImageData(imageData, 0, 0);

``compress`` (Optional, default value = ``false``)
    Used to enable compression of the image data into a JPEG file.
    When enabled the resulting pixel array contains the byte data representing a JPEG file instead of pixel values.

``x`` (Optional, default value = ``0``)
    Used to enable retrieving a subsection of the image. The value is offset from the left edge.

``y`` (Optional, default value = ``0``)
    Used to enable retrieving a subsection of the image. The value is offset from the bottom edge.

``width`` (Optional, default value is the width of the active render target if a render target is active, and ``graphicsDevice.width`` if not)
    Used to enable retrieving a subsection of the image. The value extends from ``x`` towards the right edge.

``height`` (Optional, default value is the height of the active render target if a render target is active, and ``graphicsDevice.height`` if not)
    Used to enable retrieving a subsection of the image. The value extends from ``y`` towards the top edge.

.. note:: Any arguments passed must be passed in order (``compress``, ``x``, ``y``, ``width``, ``height``);
    and to pass any argument, all arguments higher in the order must be passed as well.


.. _graphicsdevice_issupported:

.. index::
    pair: GraphicsDevice; isSupported

`isSupported`
-------------

**Summary**

Used to see if features are supported.

See also :ref:`maxSupported <graphicsdevice_maxsupported>`.

**Syntax** ::

    var feature = "OCCLUSION_QUERIES";

    if (graphicsDevice.isSupported(feature))
    {
        // ...
    }

``feature``
    One of the following strings:

* "OCCLUSION_QUERIES"
* "NPOT_MIPMAPPED_TEXTURES" : non-power of 2 mip-mapped textures.
* "TEXTURE_DXT1"
* "TEXTURE_DXT3"
* "TEXTURE_DXT5"
* "TEXTURE_ETC1"
* "INDEXFORMAT_UINT" : If INDEXFORMAT_UINT can be used with IndexBuffers.
* "FILEFORMAT_WEBM"
* "FILEFORMAT_MP4"
* "FILEFORMAT_JPG"
* "FILEFORMAT_PNG"
* "FILEFORMAT_DDS"
* "FILEFORMAT_TGA"

Returns a boolean.


.. _graphicsdevice_maxsupported:

.. index::
    pair: GraphicsDevice; maxSupported

`maxSupported`
--------------

**Summary**

Used to see maximim values for features.

See also :ref:`isSupported <graphicsdevice_issupported>`.

**Syntax** ::

    var feature = "RENDERTARGET_COLOR_TEXTURES";

    if (graphicsDevice.maxSupported(feature) === 1)
    {
        // DeferredRending not supported
    }


``feature``
    One of the following strings:

* "ANISOTROPY"
* "TEXTURE_SIZE" : in texels.
* "CUBEMAP_TEXTURE_SIZE" : in texels.
* "3D_TEXTURE_SIZE" : in texels. 0 means unsupported.
* "RENDERTARGET_COLOR_TEXTURES" : 1 or 4. See :ref:`RenderTarget <rendertarget>`.
* "RENDERBUFFER_SIZE" : in pixels.

Returns an integer.


.. _graphicsdevice_createvideo:

.. index::
    pair: GraphicsDevice; createVideo

`createVideo`
--------------

**Summary**

Creates a Video playback object.

**Syntax** ::

    graphicsDevice.createVideo({
        src: videoURL,
        looping: true,
        onload: function (v)
        {
            if (v)
            {
                video = v;
                v.play();
            }
            else
            {
                window.alert("Failed to load video!");
            }
        }
    });

Returns a :ref:`Video <video>` object.

.. _graphicsdevice_flush:

.. index::
    pair: GraphicsDevice; flush

`flush`
-------

**Summary**

Calls flush on the underlying context.
See the `OpenGL specification <http://www.khronos.org/registry/gles/specs/2.0/es_full_spec_2.0.25.pdf>`_ for details.

**Syntax** ::

    graphicsDevice.flush();

.. _graphicsdevice_finish:

.. index::
    pair: GraphicsDevice; finish

`finish`
--------

**Summary**

Calls finish on the underlying context, which waits until all issued render commands are completed.
See the `OpenGL specification <http://www.khronos.org/registry/gles/specs/2.0/es_full_spec_2.0.25.pdf>`_ for details.

As this function will block it is not recommended for use in final code.

One use case is to measure remaining cost of rendering.

**Syntax** ::

    graphicsDevice.finish();


Properties
==========

.. _graphicsdevice_vendor:

.. index::
    pair: GraphicsDevice; vendor

`vendor`
--------

**Summary**

The name of the company responsible for the OpenGL implementation used by the graphics device.

**Syntax** ::

    var vendorString = graphicsDevice.vendor;
    if (-1 !== vendorString.indexOf('Intel'))
    {
        usingIntelVideoCard();
    }

.. note:: Read Only

.. _graphicsdevice_renderer:

.. index::
    pair: GraphicsDevice; renderer

`renderer`
----------

**Summary**

The name of the OpenGL renderer used by the graphics device.
This name is typically specific to a particular configuration of a hardware platform.

**Syntax** ::

    var rendererString = graphicsDevice.renderer;
    if (-1 !== rendererString.indexOf('9400'))
    {
        using9400Model();
    }

.. note:: Read Only


.. _graphicsdevice_rendererversion:

.. index::
    pair: GraphicsDevice; rendererVersion

`rendererVersion`
-----------------

**Summary**

The OpenGL version supported by the renderer used by the graphics device.
May contain additional driver specific information separated by spaces.

**Syntax** ::

    var openglVersionString = graphicsDevice.rendererVersion;
    if ('3' === openglVersionString[0])
    {
        opengl3supported();
    }

.. note:: Read Only

.. _graphicsdevice_shadinglanguageversion:

.. index::
    pair: GraphicsDevice; shadingLanguageVersion

`shadingLanguageVersion`
------------------------

**Summary**

The OpenGL Shading Language version supported by the renderer used by the graphics device.

**Syntax** ::

    var shadingLanguageVersionString = graphicsDevice.shadingLanguageVersion;
    if (!shadingLanguageVersionString)
    {
        glslNotSupported();
    }

.. note:: Read Only

.. _graphicsdevice_videoram:

.. index::
    pair: GraphicsDevice; videoRam

`videoRam`
----------

**Summary**

The amount of dedicated video memory in megabytes available to the renderer used by the graphics device.
This may return 0 if its unknown.

**Syntax** ::

    var videoRam = graphicsDevice.videoRam;
    if (videoRam > 0 && videoRam < 256)
    {
        notEnoughVideoRam();
    }

.. note:: Read Only


.. _graphicsdevice_extensions:

.. index::
    pair: GraphicsDevice; extensions

`extensions`
------------

**Summary**

List of the OpenGL extensions supported by the renderer used by the graphics device.

**Syntax** ::

    var extensionsString = graphicsDevice.extensions;

.. note:: Read Only

.. index::
    pair: GraphicsDevice; width
    pair: GraphicsDevice; height

`width` and `height`
--------------------

**Summary**

Dimensions of the main rendering buffer.

**Syntax** ::

    var aspectRatio = (graphicsDevice.width / graphicsDevice.height);
    if (aspectRatio !== camera.aspectRatio)
    {
        camera.aspectRatio = aspectRatio;
        camera.updateProjectionMatrix();
    }

.. note:: Read Only


.. index::
    pair: GraphicsDevice; desktopWidth
    pair: GraphicsDevice; desktopHeight

.. _graphicsdevice_desktopwidth:
.. _graphicsdevice_desktopheight:

`desktopWidth` and `desktopHeight`
----------------------------------

**Summary**

The current (main screen) desktop resolution.  The screen used to
determine this may or may not be the screen used for fullscreen mode,
and should therefore only be used as a rough indicator of fullscreen
resolution.  The application should check the resolution using `width`
and `height` after transitioning into fullscreen mode to get the
precise fullscreen dimensions.

**Syntax** ::

  // Rough guide to resolution

  var useLowResAssets = false;
  if (graphicsDevice.desktopWidth < 1024 && graphicsDevice.desktopHeight < 768)
  {
    useLowResAssets = true;
  }

.. note:: Read Only

.. index::
    pair: GraphicsDevice; fps

`fps`
-----

**Summary**

Frames rendered during the last second.

**Syntax** ::

    var fps = graphicsDevice.fps;
    if (lastFps !== fps)
    {
        lastFps = fps;
        updateFpsUI(fps);
    }

.. note:: Read Only


.. index::
    pair: GraphicsDevice; fullscreen

`fullscreen`
------------

**Summary**

Controls and informs about fullscreen rendering.
Defaults to false.

**Syntax** ::

    var fullscreen = graphicsDevice.fullscreen;
    if (!fullscreen)
    {
        graphicsDevice.fullscreen = true;
        updateRenderBuffers();
    }


.. _graphicsDevice_SEMANTIC:

`SEMANTIC_`
-----------

**Summary**

Valid semantic values, required when setting vertex streams.

.. hlist::
    :columns: 3

    - SEMANTIC_POSITION
    - SEMANTIC_POSITION0
    - SEMANTIC_COLOR
    - SEMANTIC_COLOR0
    - SEMANTIC_COLOR1
    - SEMANTIC_NORMAL
    - SEMANTIC_NORMAL0
    - SEMANTIC_TEXCOORD
    - SEMANTIC_TEXCOORD0
    - SEMANTIC_TEXCOORD1
    - SEMANTIC_TEXCOORD2
    - SEMANTIC_TEXCOORD3
    - SEMANTIC_TEXCOORD4
    - SEMANTIC_TEXCOORD5
    - SEMANTIC_TEXCOORD6
    - SEMANTIC_TEXCOORD7
    - SEMANTIC_TANGENT
    - SEMANTIC_TANGENT0
    - SEMANTIC_BINORMAL0
    - SEMANTIC_BINORMAL
    - SEMANTIC_PSIZE
    - SEMANTIC_PSIZE0
    - SEMANTIC_BLENDINDICES
    - SEMANTIC_BLENDINDICES0
    - SEMANTIC_BLENDWEIGHT
    - SEMANTIC_BLENDWEIGHT0
    - SEMANTIC_TESSFACTOR
    - SEMANTIC_SPECULAR
    - SEMANTIC_FOGCOORD
    - SEMANTIC_ATTR0
    - SEMANTIC_ATTR1
    - SEMANTIC_ATTR2
    - SEMANTIC_ATTR3
    - SEMANTIC_ATTR4
    - SEMANTIC_ATTR5
    - SEMANTIC_ATTR6
    - SEMANTIC_ATTR7
    - SEMANTIC_ATTR8
    - SEMANTIC_ATTR9
    - SEMANTIC_ATTR10
    - SEMANTIC_ATTR11
    - SEMANTIC_ATTR12
    - SEMANTIC_ATTR13
    - SEMANTIC_ATTR14
    - SEMANTIC_ATTR15


**Syntax** ::

    var semantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION,
                                                    graphicsDevice.SEMANTIC_TEXCOORD]);

.. note:: Read Only


.. _graphicsDevice_PRIMITIVE:

`PRIMITIVE_`
------------

**Summary**

Valid primitive values, required when drawing primitives.

.. hlist::
    :columns: 3

    - PRIMITIVE_TRIANGLES
    - PRIMITIVE_TRIANGLE_STRIP
    - PRIMITIVE_TRIANGLE_FAN
    - PRIMITIVE_LINES
    - PRIMITIVE_LINE_LOOP
    - PRIMITIVE_LINE_STRIP
    - PRIMITIVE_POINTS

**Syntax** ::

    var primitive = graphicsDevice.PRIMITIVE_TRIANGLES;
    d.draw(primitive, numVertices);

.. note:: Read Only

.. _graphicsDevice_VERTEXFORMAT:

`VERTEXFORMAT_`
---------------

**Summary**

Valid vertex format values, required when creating vertex buffers.

.. hlist::
    :columns: 3

    - VERTEXFORMAT_BYTE4
    - VERTEXFORMAT_UBYTE4
    - VERTEXFORMAT_SHORT2
    - VERTEXFORMAT_SHORT4
    - VERTEXFORMAT_USHORT2
    - VERTEXFORMAT_USHORT4
    - VERTEXFORMAT_FLOAT1
    - VERTEXFORMAT_FLOAT2
    - VERTEXFORMAT_FLOAT3
    - VERTEXFORMAT_FLOAT4

**Syntax** ::

    var vertexbufferParameters = {
        numVertices: 4,
        attributes: [graphicsDevice.VERTEXFORMAT_FLOAT2,
                     graphicsDevice.VERTEXFORMAT_SHORT2],
        dynamic: false
    };
    var vertexbuffer = graphicsDevice.createVertexBuffer(vertexbufferParameters);

.. note:: Read Only

.. _graphicsdevice_PIXELFORMAT:

`PIXELFORMAT_`
--------------

**Summary**

Valid pixel format values, required when creating textures.

.. hlist::

    - PIXELFORMAT_A8
    - PIXELFORMAT_L8
    - PIXELFORMAT_L8A8
    - PIXELFORMAT_R5G5B5A1
    - PIXELFORMAT_R5G6B5
    - PIXELFORMAT_R8G8B8A8
    - PIXELFORMAT_R8G8B8
    - PIXELFORMAT_D24S8
    - PIXELFORMAT_DXT1
    - PIXELFORMAT_DXT3
    - PIXELFORMAT_DXT5

**Syntax** ::

    var textureParameters = {
        name    : "checkers",
        width   : 4,
        height  : 4,
        format  : graphicsDevice.PIXELFORMAT_L8,
        mipmaps : false,
        dynamic : false,
        data    : [  0, 255,   0, 255,
                   255,   0, 255,   0,
                     0, 255,   0, 255,
                   255,   0, 255,   0]
    };
    var texture = graphicsDevice.createTexture(textureParameters);

.. note:: Read Only


.. _graphicsdevice_INDEXFORMAT:

`INDEXFORMAT_`
--------------

**Summary**

Valid index format values, required when creating index buffers.

    - INDEXFORMAT_UBYTE
    - INDEXFORMAT_USHORT
    - INDEXFORMAT_UINT

**Syntax** ::

    var indexbufferParameters = {
            numIndices: 4,
            format: graphicsDevice.INDEXFORMAT_USHORT
            dynamic: false,
            data: [ 0, 1, 2, 3 ]
        };
    var indexbuffer = graphicsDevice.createIndexBuffer(indexbufferParameters);

.. note:: Read Only
