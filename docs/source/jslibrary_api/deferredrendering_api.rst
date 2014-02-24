.. index::
    single: DeferredRendering

.. _deferredrendering:

.. highlight:: javascript

----------------------------
The DeferredRendering Object
----------------------------

Provides a deferred shading solution with support for shadow mapping and fullscreen post effects.

At draw time all the visible renderables are classified and sorted to maximize rendering performance,
minimizing shader :ref:`technique <technique>` changes whilst taking advantage of hardware Z-buffers.

Renderable objects are classified into 3 main categories:

* Opaque: those that do not blend with the color buffer.
    * These renderables are sorted by material and then front-to-back.
* Decal: those that do blend with the color buffer but are located in the surface of other opaque geometries.
    * These renderables are just sorted by material.
* Transparent: those that do blend with the color buffer.
    * These renderables are sorted back-to-front.

The application can draw any additional renderables by a set of callback functions given to the DeferredRendering object.

This object creates a G-buffer to store the following properties for each visible pixel in the screen:

* Albedo color
* Emissive coefficient
* Specular color
* Normal in view space
* Linear depth in view space

.. _defferredrendering_light_types:

Once the information is filled by the opaque renderables then the DeferredRendering object proceeds to the lighting of
the scene depending on the active lights affecting the visible scene. These are the light types currently supported:

* Directional
* Point
* Spot
* Fog
* Ambient

For point, spot and fog lights the lighting attenuation is calculated using two textures,
the falloff texture provides attenuation depending on the Z coordinate on light space and
the projection texture provides attenuation and color based on the X and Y coordinates on light space.

Occlusion queries are used to determine the contribution of the light to the scene and features are enabled or disabled
accordingly to improve performance and picture quality.

If shadows are enabled, multiple shadow maps will be created and reused for each light that casts shadows.
Different resolutions will be used depending on the size of the light volume.
The implementation is using exponential shadow maps which allows the application of a dual pass Gaussian blur
to the shadow maps in order to produce smoother shadows.

Non-opaque renderables are rendered as a separate pass after the deferred lighting is done.

Once all the composition passes have finished, the shaded scene will be transferred to the
back buffer and at this point fullscreen post effect can be applied.

The DeferredRendering object will request the following shaders to the ShaderManager:

* `shaders/deferredtransparent.cgfx`
* `shaders/deferredopaque.cgfx`
* `shaders/deferredlights.cgfx`

These are the effects supported by this renderer:

.. _defferredrendering_effect_types:

* `phong`
* `blinn`
* `lambert`
* `normalmap`
* `normalmap_specularmap`
* `normalmap_alphatest`
* `normalmap_specularmap_alphatest`
* `normalmap_glowmap`
* `normalmap_specularmap_glowmap`
* `normalmap_specularmap_alphamap`
* `rxgb_normalmap`
* `rxgb_normalmap_specularmap`
* `rxgb_normalmap_alphatest`
* `rxgb_normalmap_specularmap_alphatest`
* `rxgb_normalmap_glowmap`
* `rxgb_normalmap_specularmap_glowmap`
* `glowmap`
* `skybox`
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
* `env`
* `flare`

.. _deferredrendering_meta:

The following meta material properties are supported for the scene renderables:

* `noshadows`
    The renderable will not cast shadows.
* `transparent`
    Non-opaque material that will blend with the background.
    The renderable will be rendered back to front and will be ignored during lighting calculations.
    Materials using effects with alpha test enabled but without blending enabled do not need this flag.
* `decal`
    Non-opaque material that will blend with the surface immediately below.
    The renderable will be ignored during lighting calculations.
    Materials using effects with alpha test enabled but without blending enabled do not need this flag.
* `flareScale`
    Scale for the flare dimensions in world units.
    Only required if effect is `flare`.
* `far`
    The renderable will be rendered last if opaque or first if transparent and will be ignored during lighting calculations.

.. _deferredrendering_techniqueparameters:

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
    Cubemap texture that will provide the skybox color
* `alpha_map`
    Texture that will provide the alpha component

The following TechniqueParameters properties are supported for the scene lights:

* `lightprojection`
    Texture that will modulate the light color on the XY plane
* `lightfalloff`
    Texture that will modulate the light color on the Z plane


The renderables are rendered in the following passes:

* opaque
* decal
* transparent
* shadow

**Required scripts**

The DefaultRendering object requires::

    /*{{ javascript("jslib/renderingcommon.js") }}*/
    /*{{ javascript("jslib/deferredrendering.js") }}*/

Constructor
===========

.. index::
    pair: DeferredRendering; create

`create`
--------

**Summary**

**Syntax** ::

    var settings = {
            shadowRendering: true,
            shadowSizeLow: 512,
            shadowSizeHigh: 1024
        };
    var renderer = DeferredRendering.create(graphicsDevice, mathDevice, shaderManager, effectsManager, settings);

``graphicsDevice``
    The GraphicsDevice object used for deferred shading.

``mathDevice``
    The MathDevice object used for math calculations.

``shaderManager``
    The ShaderManager object used to load the required shaders.

``effectsManager``
    The EffectsManager object where the forward shading effects will be registered.

The ``shadowRendering`` option enables shadow mapping.
The ``shadowSizeLow`` and ``shadowSizeHigh`` set the sizes for the :ref:`ShadowMapping <shadowmapping>` object shadow textures.


Method
======


.. index::
    pair: DeferredRendering; updateBuffers

`updateBuffers`
---------------

**Summary**

Prepares the render buffers required for the deferred shading.

**Syntax** ::

    if (!renderer.updateBuffers(graphicsDevice, width, height))
    {
        errorCallback("Failed to initialize deferred renderer");
    }

``graphicsDevice``
    The GraphicsDevice object used to create the render buffers.

``width`` and ``height``
    The dimensions of the buffers used for deferred shading.

If the function returns false the creation of the render buffers failed,
possibly because of the lack of video memory.

This method does nothing if the internal buffers are already of the required dimensions.

Do not call this method inside the `beginFrame` / `endFrame` rendering block.


.. index::
    pair: DeferredRendering; updateShader

`updateShader`
--------------

**Summary**

Updates the shaders used for the deferred shading.

**Syntax** ::

    renderer.updateShader(shaderManager);

``shaderManager``
    The ShaderManager object used to load the required shaders.

If the required shaders were not ready when the renderer was created this method can be used to update them.


.. index::
    pair: DeferredRendering; update

`update`
--------

**Summary**

Updates light and material information to prepare for the deferred shading.

**Syntax** ::

    renderer.update(graphicsDevice, camera, scene, currentTime);

``graphicsDevice``
    The GraphicsDevice object used to create the materials required for lighting.

``camera``
    The Camera object used to determine active lights affecting the visible scene.

``scene``
    The Scene object containing the lights used for deferred lighting.

``currentTime``
    The current time in seconds passed as a global material property to the draw callbacks.

Call this function after the scene and the camera have been updated for the current frame.


.. _deferredrendering_draw:

.. index::
    pair: DeferredRendering; draw

`draw`
------

**Summary**

Renders the scene.

**Syntax** ::

    renderer.draw(graphicsDevice,
                  clearColor,
                  drawDecalsFn,
                  drawTransparentFn,
                  drawDebugFn,
                  postFXsetupFn);

``graphicsDevice``
    The GraphicsDevice object used for rendering.

``clearColor``
    An array with 4 numbers for the color to be used for the background, it can be set to null.

``drawDecalsFn``
    The callback executed to draw extra visible decals, it can be set to null.
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

``postFXsetupFn``
    The callback executed to set the GraphicsDevice to the state required for the transfer
    of the shaded scene to the backbuffer, can also be used to apply fullscreen effects.
    It is only required to set the active :ref:`technique <technique>` and set the required TechniqueParameters parameter,
    the renderer is responsible for drawing the fullscreen quad.
    For example: ::

        function copyPostFXSetupFn(graphicsDevice, finalTexture)
        {
            graphicsDevice.setTechnique(copyTechnique);

            copyTechniqueParameters.colorTexture = finalTexture;
            graphicsDevice.setTechniqueParameters(copyTechniqueParameters);
        };

    You can find some examples in the :ref:`PostEffects <posteffects>` object.


.. index::
    pair: DeferredRendering; setLightingScale

`setLightingScale`
------------------

**Summary**

Sets the lighting scale factor applied to the lighting calculations.
By default this values is set to 2.0.

**Syntax** ::

    renderer.setLightingScale(1.0);


.. index::
    pair: DeferredRendering; getDefaultSkinBufferSize

`getDefaultSkinBufferSize`
--------------------------

Get the default size of the buffer used by skinning.
This will be undefined until the shaders are loaded.

See also :ref:`GPUSkinController <gpuskincontroller>`.

    For example: ::

        GPUSkinController.setDefaultBufferSize(renderer.getDefaultSkinBufferSize());


.. index::
    pair: DeferredRendering; destroy

`destroy`
---------

**Summary**

Releases the DeferredRendering object and all the resources it allocated.

**Syntax** ::

    renderer.destroy();


Properties
==========

.. index::
    pair: DeferredRendering; version

`version`
---------

**Summary**

The version number of the DeferredRendering implementation.

**Syntax** ::

    var versionNumber = DeferredRendering.version;

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
