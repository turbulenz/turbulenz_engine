.. index::
    single: ShadowMapping

.. highlight:: javascript

.. _shadowmapping:

------------------------
The ShadowMapping Object
------------------------

This object is used by the renderers to create an array of shadow map textures for lights in the scene.

The ShadowMapping object will request the following shaders to the ShaderManager:

- `shaders/shadowmapping.cgfx`

Shadow mapping is enabled by setting the ``shadowRendering`` option when the renderer is created::

    renderer = Renderer.create(graphicsDevice,
                               mathDevice,
                               shaderManager,
                               effectManager,
                               { shadowRendering: true });

Here Renderer can be either :ref:`DeferredRendering <deferredrendering>` or :ref:`ForwardRendering <forwardrendering>`.

To enable shadows for a light set the ``shadows`` argument when it is created::

        var light = Light.create(
            {
                name : lightName,
                color : color,
                point : true,
                shadows : true,
                halfExtents: v3Build.call(mathDevice, 40, 40, 40),
                origin: v3Build.call(mathDevice, 0, 10, 0),
                material : lightMaterial
            });

Only point and spot lights support shadows.

By default all materials cast shadows.
If you want a material to ignore this you can set the ``noshadows`` flag::

    var material = Material.create(graphicsDevice);
    material.meta.noshadows = true;

**Required scripts**

The ShadowMapping object requires::

    /*{{ javascript("jslib/shadowmapping.js") }}*/
    /*{{ javascript("jslib/camera.js") }}*/

Constructor
===========

.. index::
    pair: ShadowMapping; create

.. _shadowmapping_create:

`create`
--------

**Summary**

Creates and returns a ShadowMapping object.

**Syntax** ::

    var shadowMapping = ShadowMapping.create(graphicsDevice, mathsDevice, shaderManager, effectsManager, sizeLow, sizeHigh);

``sizeLow``
    A JavaScript number.
    The size in pixels of the low resolution shadow maps.
    Defaults to 512.

``sizeHigh``
    A JavaScript number.
    The size in pixels of the high resolution shadow maps.
    Defaults to 1024.

Returns a ShadowMapping object.

Methods
=======

.. index::
    pair: ShadowMapping; updateShader

`updateShader`
--------------

**Summary**

Updates the shadow mapping shader.

**Syntax** ::

    shadowMapping.updateShader();

.. index::
    pair: ShadowMapping; update

`update`
--------

**Summary**

The default update function to be registered on the effects by the renderer.

**Syntax** ::

    effect = Effect.create("blinn");
    effectManager.add(effect);

    effectTypeData = {  prepare : forwardPrepareFn,
                        shaderName : "shaders/forwardrendering.cgfx",
                        techniqueName : "blinn",
                        update : forwardUpdateFn,
                        shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                        shadowMappingTechniqueName : "rigid",
                        shadowMappingUpdate : shadowMapping.update,
                        loadTechniques : loadTechniques };
    effectTypeData.loadTechniques(shaderManager);
    effect.add(rigid, effectTypeData);

.. index::
    pair: ShadowMapping; update

`skinnedUpdate`
---------------

**Summary**

The default skinned update function to be registered on the effects by the renderer.

**Syntax** ::

    effect = Effect.create("blinn_skinned");
    effectManager.add(effect);

    effectTypeData = {  prepare : forwardPrepareFn,
                        shaderName : "shaders/forwardrendering.cgfx",
                        techniqueName : "blinn_skinned",
                        update : forwardUpdateFn,
                        shadowMappingShaderName : "shaders/shadowmapping.cgfx",
                        shadowMappingTechniqueName : "skinned",
                        shadowMappingUpdate : shadowMapping.skinnedUpdate,
                        loadTechniques : loadTechniques };
    effectTypeData.loadTechniques(shaderManager);
    effect.add(rigid, effectTypeData);

.. index::
    pair: ShadowMapping; updateBuffers

`updateBuffers`
---------------

**Summary**

Update all the buffers and textures used by the ShadowMapping object to use new texture sizes.

**Syntax** ::

    shadowMapping.updateBuffers(sizeLow, sizeHigh);

``sizeLow``
    A JavaScript number.
    The size in pixels of the low resolution shadow maps.
    Defaults to 512.

``sizeHigh``
    A JavaScript number.
    The size in pixels of the high resolution shadow maps.
    Defaults to 1024.

Returns true if buffers where updated successfully, false otherwise.
If ``sizeLow`` and ``sizeHigh`` are the same as the current low and high resolution values then no update is done and the function returns true.
If ``sizeLow`` and ``sizeHigh`` are undefined then the buffers are recreated with their previous resolutions.

.. index::
    pair: ShadowMapping; destroyBuffers

`destroyBuffers`
----------------

**Summary**

Destroy all the buffers and textures used by the ShadowMapping object.

**Syntax** ::

    shadowMapping.destroyBuffers();

.. index::
    pair: ShadowMapping; lightDraw

`drawShadowMap`
---------------

**Summary**

Draw the shadow map for a light instance.

**Syntax** ::

    cameraMatrix = camera.matrix;
    shadowMapping.drawShadowMap(cameraMatrix, minExtentsHigh, lightInstance);

``cameraMatrix``
    The viewing camera matrix.

``minExtentsHigh``
    A JavaScript number.
    If any of the lights extents components are greater than this value then a high resolution map is generated, otherwise a low resolution map is generated.

``lightInstance``
    The :ref:`LightInstance <lightinstance>` object to draw a shadow map for.

Returns null.
The function adds the following properties to the ``lightInstance`` object:

- If the shadow map is not empty then ``shadows`` is set to true, false otherwise.
- ``shadowMap`` :ref:`ShadowMap <shadowmap>` object for lightInstance.
- The following :ref:`TechniqueParameters <techniqueparameters>` are added to the ``lightInstance.techniqueParameters``:
    * shadowProjection - The projection matrix :ref:`Matrix43 <m43object>` from model space to light space.
    * shadowDepth - A :ref:`Vector4 <v4object>`.
      The dot product of this vector with a world position gives its depth from the light's perspective.
    * shadowSize - A JavaScript number giving size of the texture in pixels (assumed to be a square).
    * shadowMapTexture - The exponential shadow map :ref:`Texture <texture>` object.

.. note::
    Currently this function will continue to draw shadows for static nodes when they or their renderables are disabled.

.. index::
    pair: ShadowMapping; blurShadowMaps

`blurShadowMaps`
----------------

**Summary**

Blur all of the shadow maps to give softer shadows.

**Syntax** ::

    shadowMapping.blurShadowMaps();


.. index::
    pair: ShadowMapping; destroy

`destroy`
---------

**Summary**

Releases the ShadowMapping object and all the resources it allocated.

**Syntax** ::

    shadowMapping.destroy();


Properties
==========

.. index::
    pair: ShadowMapping; version

`version`
---------

**Summary**

The version number of the ShadowMapping implementation.

**Syntax** ::

    var versionNumber = shadowMapping.version;

.. index::
    single: ShadowMap

.. _shadowmap:

--------------------
The ShadowMap Object
--------------------

Properties
==========

.. index::
    pair: ShadowMap; texture

`texture`
---------

**Summary**

The exponential shadow map's texture.

**Syntax** ::

    var shadowMapTexture = shadowMap.texture;

A :ref:`Texture <texture>` object.
The shadow map texture is given in RGBA format.

.. index::
    pair: ShadowMap; renderTarget

`renderTarget`
--------------

**Summary**

The exponential shadow map's render target.

**Syntax** ::

    var shadowMapRenderTarget = shadowMap.renderTarget;

A :ref:`RenderTarget <rendertarget>` object.

.. index::
    pair: ShadowMap; lightInstance

`lightInstance`
---------------

**Summary**

The light instance for the exponential shadow map.

**Syntax** ::

    var shadowMapLightInstance = shadowMap.lightInstance;

A :ref:`lightInstance <lightinstance>` object.
