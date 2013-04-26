.. index::
    single: DefaultRendering

.. highlight:: javascript

---------------------------
The DefaultRendering Object
---------------------------

.. _defaultrendering_light_types:

Provides a simple shading solution with a single global point light without falloff.

The DefaultRendering object will request the following shaders to the ShaderManager:

* `shaders/defaultrendering.cgfx`
* `shaders/debug.cgfx`

.. _defaultrendering_effect_types:

These are the effects supported by this renderer:

* `constant`
* `lambert`
* `blinn`
* `phong`
* `debug_normals`
* `debug_tangents`
* `debug_binormals`
* `normalmap`
* `normalmap_specularmap`
* `normalmap_specularmap_alphamap`
* `normalmap_alphatest`
* `normalmap_specularmap_alphatest`
* `normalmap_glowmap`
* `normalmap_specularmap_glowmap`
* `rxgb_normalmap`
* `rxgb_normalmap_specularmap`
* `rxgb_normalmap_alphatest`
* `rxgb_normalmap_specularmap_alphatest`
* `rxgb_normalmap_glowmap`
* `rxgb_normalmap_specularmap_glowmap`
* `glowmap`
* `lightmap`
* `add`
* `add_particle`
* `blend`
* `blend_particle`
* `translucent`
* `translucent_particle`
* `filter`
* `invfilter`
* `invfilter_particle`
* `glass`
* `glass_env`
* `modulate2`
* `skybox`
* `env`
* `flare`

.. _defaultrendering_meta:

The following meta material properties are supported for the scene renderables:

* `transparent`
    Non-opaque material that will blend with the background.
    The renderable will be rendered back to front and will be ignored during lighting calculations.
    Materials using effects with alpha test enabled but without blending enabled do not need this flag.
* `decal`
    Non-opaque material that will blend with the surface immediately below.
    The renderable will be ignored during lighting calculations.
    Materials using effects with alpha test enabled but without blending enabled do not need this flag.
* `far`
    The renderable will be rendered last if opaque or first if transparent and will be ignored during lighting calculations.

.. _defaultrendering_techniqueparameters:

The following TechniqueParameters properties are supported for the scene renderables:

* `materialColor`
    Array with 4 numbers providing the material color
* `uvTransform`
    Array of 6 numbers forming a 3x2 transformation matrix applied to the uv coordinates
* `diffuse`
    Texture that will provide the diffuse color
* `specular_map`
    Texture that will provide the specular color
* `normal_map`
    Texture that will provide the per pixel normal
* `glow_map`
    Texture that will provide the emissive color
* `env_map`
    Texture that will provide the skybox color
* `alpha_map`
    Texture that will provide the alpha component

The renderables are rendered in the following passes:

* opaque
* decal
* transparent

**Required scripts**

The DefaultRendering object requires::

    /*{{ javascript("jslib/renderingcommon.js") }}*/
    /*{{ javascript("jslib/defaultrendering.js") }}*/


Constructor
===========

.. index::
    pair: DefaultRendering; create

`create`
--------

**Summary**

**Syntax** ::

    var renderer = DefaultRendering.create(graphicsDevice, mathDevice, shaderManager, effectManager);

``graphicsDevice``
    The GraphicsDevice object to be used.

``mathDevice``
    The MathDevice object used for math calculations.

``shaderManager``
    The ShaderManager object used to load the required shaders.

``effectsManager``
    The EffectsManager object where the effects will be registered.


Method
======


.. index::
    pair: DefaultRendering; setGlobalLightPosition

`setGlobalLightPosition`
------------------------

**Summary**

Sets the position in world space of the global point light.

**Syntax** ::

    var position = mathsDevice.v3Build(100, 500, 100);
    renderer.setGlobalLightPosition(position);

``position``
    The global light position as a :ref:`Vector3 <v3object>` object.


.. index::
    pair: DefaultRendering; setGlobalLightColor

`setGlobalLightColor`
---------------------

**Summary**

Sets the color of the global point light.

**Syntax** ::

    var color = mathDevice.v3Build(1.0, 1.0, 1.0);
    renderer.setGlobalLightColor(color);

``color``
    The global light color as a :ref:`Vector3 <v3object>` object (red, green, blue).


.. index::
    pair: DefaultRendering; setAmbientColor

`setAmbientColor`
-----------------

**Summary**

Sets the ambient color.

**Syntax** ::

    var color = mathDevice.v3Build(0.2, 0.2, 0.3);
    renderer.setAmbientColor(color);

``color``
    The ambient color as a :ref:`Vector3 <v3object>` object (red, green, blue).


.. index::
    pair: DefaultRendering; setDefaultTexture

`setDefaultTexture`
-------------------

**Summary**

Set the default texture to be used when a material does not provide one.

**Syntax** ::

    var texture = textureManager.get('default');
    renderer.setDefaultTexture(texture);

``texture``
    A :ref:`texture <texture>` object.

.. _defaultrendering_setwireframe:

.. index::
    pair: DefaultRendering; setWireframe

`setWireframe`
--------------

**Summary**

Enables or disables rendering of the scene as wireframe.

**Syntax** ::

    var wireframeInfo = {
        wireColor : mathDevice.v4Build(1, 1, 1, 1),     //choose color for the wireframe lines
        fillColor : mathDevice.v4Build(0, 0.2, 0.6, 0), //choose color for the interior of the polygons
        alphaRef     : 0   //set to greater than zero (e.g. 0.1) to remove the interior of the polygons (transparent fill)
    };
    renderer.setWireframe(true, wireframeInfo);

``wireframeInfo`` (Optional, default value = { ``wireColor : mathDevice.v4Build(0, 0, 0, 1)``, ``fillColor : mathDevice.v4Build(1, 1, 1, 0)``, ``alphaRef : 0.35`` })
    Used to specify the alpha value, the wireframe line color and the polygon interior color to be used.

.. note:: For ``wireframeInfo.fillColor``, leave alpha (the fourth value) as zero to allow transparent fill.

.. index::
    pair: DefaultRendering; updateBuffers

`updateBuffers`
---------------

**Summary**

This method does nothing, it is provided for interface compatibility with other renderers.

**Syntax** ::

    renderer.updateBuffers(graphicsDevice, width, height);


.. index::
    pair: DefaultRendering; updateShader

`updateShader`
--------------

**Summary**

This method does nothing, it is provided for interface compatibility with other renderers.

**Syntax** ::

    renderer.updateShader(shaderManager);


.. index::
    pair: DefaultRendering; update

`update`
--------

**Summary**

Updates light and material information to prepare for rendering.

**Syntax** ::

    renderer.update(graphicsDevice, camera, scene, currentTime);

``graphicsDevice``
    The GraphicsDevice object used to create the materials required for lighting.

``camera``
    The Camera object used to determine active lights affecting the visible scene.

``scene``
    The Scene object containing the nodes to be rendered.

``currentTime``
    The current time in seconds passed as a global material property to the draw callbacks.

Call this function after the scene and the camera have been updated for the current frame.


.. index::
    pair: DefaultRendering; draw

`draw`
------

**Summary**

Renders the scene.

**Syntax** ::

    renderer.draw(graphicsDevice,
                  clearColor,
                  drawDecalsFn,
                  drawTransparentFn,
                  drawDebugFn);

``graphicsDevice``
    The GraphicsDevice object used for rendering.

``clearColor``
    An array with 4 numbers for the color to be used for the background, it can be set to null.

``drawDecalsFn``
    The callback executed to draw extra visible decals,
    it can be set to null.
    For example: ::

        function drawDecalsFn()
        {
            fxm.drawDecals(graphicsDevice);
        }

``drawTransparentFn``
    The callback executed to draw extra visible transparent objects,
    it can be set to null.
    For example: ::

        function drawTransparentFn()
        {
            fxm.drawTransparent(graphicsDevice);
        }

``drawDebugFn``
    The callback executed to allow the application draw any debugging information required,
    it can be set to null.
    For example: ::

        function drawDebugFn()
        {
            scene.drawNodesExtents(graphicsDevice, camera);
        }

.. index::
    pair: DefaultRendering; getDefaultSkinBufferSize

`getDefaultSkinBufferSize`
--------------------------

Get the default size of the buffer used by skinning.
This will be undefined until the shaders are loaded.

See also :ref:`GPUSkinController <gpuskincontroller>`.

    For example: ::

        GPUSkinController.setDefaultBufferSize(renderer.getDefaultSkinBufferSize());

.. index::
    pair: DefaultRendering; destroy

`destroy`
---------

**Summary**

Releases the DefaultRendering object and all the resources it allocated.

**Syntax** ::

    renderer.destroy();


Properties
==========

.. index::
    pair: DefaultRendering; version

`version`
---------

**Summary**

The version number of the DefaultRendering implementation.

**Syntax** ::

    var versionNumber = DefaultRendering.version;

`passIndex`
-----------

**Summary**

A dictionary of passes to passIndex used by :ref:`DrawParameters <drawparameters>` to specify the pass they are rendered in.

Valid values are:

* opaque
* decal
* transparent

**Syntax** ::

    drawParameters.userData.passIndex = renderer.passIndex.transparent;
