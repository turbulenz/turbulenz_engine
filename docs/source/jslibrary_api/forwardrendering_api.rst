.. index::
    single: ForwardRendering

.. highlight:: javascript

.. _forwardrendering:

---------------------------
The ForwardRendering Object
---------------------------

Provides a forward shading solution.

At draw time all the visible renderables are classified and sorted to maximize rendering performance,
minimizing shader :ref:`technique <technique>` changes whilst taking advantage of hardware Z-buffers.

Renderable objects are classified into 3 main categories:

* Opaque: those that do not blend with the color buffer.
* Decal: those that do blend with the color buffer but are located in the surface of other opaque geometries.
* Transparent: those that do blend with the color buffer.

The application can draw any additional renderables by a set of callback functions given to the ForwardRendering object.

The ForwardRendering object will request the following shaders to the ShaderManager:

* `shaders/forwardrendering.cgfx`
* `shaders/zonly.cgfx`

.. _forwardrendering_light_types:

Features supported:

* Point lights
* Spot lights
* Ambient lights
* Directional lights
* Shadow mapping

Features not supported:

* Fog lights

For point and spot lights the lighting attenuation is calculated using two textures,
the falloff texture provides attenuation depending on the Z coordinate on light space and
the projection texture provides attenuation and color based on the X and Y coordinates on light space.

These are the effects supported by this renderer:

.. _forwardrendering_effect_types:

* `constant`
* `lambert`
* `blinn`
* `phong`
* `normalmap`
* `normalmap_specularmap`
* `normalmap_alphatest`
* `normalmap_specularmap_alphatest`
* `normalmap_glowmap`
* `normalmap_specularmap_glowmap`
* `normalmap_specularmap_alphamap`
    * `Skinning unsupported`
* `rxgb_normalmap`
* `rxgb_normalmap_specularmap`
* `rxgb_normalmap_alphatest`
    * `Skinning unsupported`
* `rxgb_normalmap_specularmap_alphatest`
    * `Skinning unsupported`
* `rxgb_normalmap_glowmap`
* `rxgb_normalmap_specularmap_glowmap`
* `glowmap`
* `lightmap`
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

.. _forwardrendering_meta:

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

.. _forwardrendering_techniqueparameters:

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

* fillZ
* skybox
* glow
* ambient
* diffuse
* decal
* transparent

**Required scripts**

The ForwardRendering object requires::

    /*{{ javascript("jslib/renderingcommon.js") }}*/
    /*{{ javascript("jslib/forwardrendering.js") }}*/


Constructor
===========

.. index::
    pair: ForwardRendering; create

`create`
--------

**Summary**

**Syntax** ::

    var settings = {
            shadowRendering: true,
            shadowSizeLow: 512,
            shadowSizeHigh: 1024
        };
    var renderer = ForwardRendering.create(graphicsDevice, mathDevice, shaderManager, effectManager, settings);

``graphicsDevice``
    The GraphicsDevice object used for forward shading.

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
    pair: ForwardRendering; updateBuffers

`updateBuffers`
---------------

**Summary**

This method does nothing, it is provided for interface compatibility with other renderers.

**Syntax** ::

    renderer.updateBuffers(graphicsDevice, width, height);


.. index::
    pair: ForwardRendering; updateShader

`updateShader`
--------------

**Summary**

Updates the shaders used for forward rendering.

**Syntax** ::

    renderer.updateShader(shaderManager);

``shaderManager``
    The ShaderManager object used to load the required shaders.

If the required shaders were not ready when the renderer was created this method can be used to update them.


.. index::
    pair: ForwardRendering; update

`update`
--------

**Summary**

Updates light and material information to prepare for the forward shading.

**Syntax** ::

    renderer.update(graphicsDevice, camera, scene, currentTime);

``graphicsDevice``
    The GraphicsDevice object used to create the materials required for lighting.

``camera``
    The Camera object used to determine active lights affecting the visible scene.

``scene``
    The Scene object containing the lights used for forward lighting.

``currentTime``
    The current time in seconds passed as a global material property to the draw callbacks.

Call this function after the scene and the camera have been updated for the current frame.


.. _forwardrendering_draw:

.. index::
    pair: ForwardRendering; draw

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
    An array with 4 numbers for the color to be used for the background,
    it can be set to null.

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

``postFXsetupFn`` (Optional)
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
    pair: ForwardRendering; setLightingScale

`setLightingScale`
------------------

**Summary**

Sets the lighting scale factor applied to the lighting calculations.
By default this values is set to 2.0.

**Syntax** ::

    var scale = 1.0;
    renderer.setLightingScale(scale);

``scale``
    The lighting scale factor.


.. index::
    pair: ForwardRendering; getDefaultSkinBufferSize

`getDefaultSkinBufferSize`
--------------------------

Get the default size of the buffer used by skinning.
This will be undefined until the shaders are loaded.

See also :ref:`GPUSkinController <gpuskincontroller>`.

    For example: ::

        GPUSkinController.setDefaultBufferSize(renderer.getDefaultSkinBufferSize());


.. index::
    pair: ForwardRendering; destroy

`destroy`
---------

**Summary**

Releases the ForwardRendering object and all the resources it allocated.

**Syntax** ::

    renderer.destroy();


Properties
==========

.. index::
    pair: ForwardRendering; version

`version`
---------

**Summary**

The version number of the ForwardRendering implementation.

**Syntax** ::

    var versionNumber = ForwardRendering.version;

.. index::
    pair: ForwardRendering; version

`passIndex`
-----------

**Summary**

A dictionary of passes to passIndex used by :ref:`DrawParameters <drawparameters>` to specify the pass they are rendered in.

Valid values are:

* fillZ
* skybox
* glow
* ambient
* diffuse
* decal
* transparent

**Syntax** ::

    drawParameters.userData.passIndex = forwardRender.passIndex.transparent;

.. index::
    pair: ForwardRendering; shadowMaps

`shadowMaps`
------------

**Summary**

The :ref:`ShadowMapping <shadowmapping>` object used by the renderer to render shadows.

**Syntax** ::

    var shadowMaps = ForwardRendering.shadowMaps;
