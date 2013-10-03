.. index::
    single: ParticleSystem

.. highlight:: javascript

.. _particlesystem:

=========================
The ParticleSystem Object
=========================

The ParticleSystem object encapsulates the core of a particle system, though most of its functionality is plug-in. It is responsible for enabling emitters to create particles, and to be able to update particle states, sort views and render views of a system. The ParticleSystem object is also responsible for CPU-side simulation of particles for tracked GPU particles, and path prediction for emitters.

Methods
=======

.. index::
    pair: ParticleSystem; createGeometry

`createGeometry`
----------------

**Summary**

Create geometry required for rendering particles. This method can be used to create customised geometry for custom rendering shaders, and for creating a shared geometry instance used by multiple compatible particle systems to save memory.

**Syntax** ::

    // Creating particle geometry for the default renderer
    //
    // Geometry is a single quad rendered as 2 GL_TRIANGLES where the indices in the template correspond to which vertex of the quad is being rendered.
    // The default render shader expects a float2 as vertex data input, hence the choice of attributes
    var geometry = ParticleSystem.createGeometry({
        graphicsDevice: graphicsDevice,
        maxParticles: 1024,
        template: [0, null,  1, null,  2, null,
                   0, null,  2, null,  3, null],
        attributes: [graphicsDevice.VERTEXFORMAT_USHORT2],
        stride: 2,
        semantics: graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_TEXCOORD]),
        primitive: graphicsDevice.PRIMITIVE_TRIANGLES,
        shared: true
    });

``graphicsDevice``
    `GraphicsDevice` object to construct `VertexBuffer` data.

``maxParticles``
    The maximum amount of particles that will be renderable with the resultant geometry.

``template``
    The template defines the geometry for a single particle, where `null` will be replaced by the particle index `[0,maxParticles)`.

    The vertex buffer data is restricted to a `Uint16Array`, so any data associated with a vertex must be compatible.

``attributes``
    Vertex formats of the particle geometry.

``stride``
    The vertex stride of the geometry.

``semantics``
    The `Semantics` object for rendering the geometry.

``primtive`` (Optional)
    The `GraphicsDevice` primitive type for rendering the geometry, by default this is `graphicsDevice.PRIMITIVE_TRIANGLES`.

``shared`` (Optional)
    Whether this geometry is shared. If geometry is not shared (Default), then when a `ParticleSystem` using this geometry is destroyed, the geometry will also be destroyed.

Returns a `ParticleGeometry` object.

.. index::
    pair: ParticleSystem; createDefaultRenderer

`createDefaultRenderer`
-----------------------

**Summary**

Create a default `ParticleRenderer` object.

The default updater is compatible with the default updater, animation system and emitter.

**Syntax** ::

    var renderer = ParticleSystem.createDefaultRenderer({
        graphicsDevice: graphicsDevice,
        shaderManager: shaderManager,
        blendMode: "alpha"
    });

``graphicsDevice``
    The `GraphicsDevice` object.

``shaderManager``
    The `ShaderManager` object. The shader `particles-default-render.cgfx` must be loaded.

``blendMode`` (Optional)
    Rendering shader supports one of `3` blend modes: `"alpha"` (default), `"additive"` and `"opaque"`.

Result is a `ParticleRenderer` object, with its `parameters` object having all parameters specific to the renderer defined with defaults, these are:

``animationScale``
    A `Vector4` storing the min/delta for particle scales as provided by `ParticleBuilder` compilation result in the form `[minx, miny, deltax, deltay]`. (default `[0, 0, 0, 0]`)

``animationRotation``
    A `Vector2` storing the min/delta for particle rotations as provided by `ParticleBuilder` compilation result in the form `[min, delta]`. (default `[0, 0`])

``texture``
    A `Texture` storing the packed visual flip-book animations of all the particles in the system. (default `null`)

``noiseTexture``
    A 4-channel smooth noise `Texture`, such as the one provided by `textures/noise.dds` in the SDK. (default `null`)

``randomizedOrientation``
    A `Vector2` providing absolute maximums for the amount of randomization applied to particles in spherical coordinate radians. (default `[0, 0]`)

``randomizedScale``
    A `Vector2` providing absolute maximums for the amount of randomization applied to particle scales as an offset scale factor. (default `[0, 0]`)

``randomizedRotation``
    A number providing absolute maximum for the amount of randomization applied to particle rotations in radians. (default `0`)

``randomizedAlpha``
    A number providing absolute maximum for the amount of randomization applied to particle texture alpha as an offset scale factor. (default `0`)

``animatedOrientation``
    A boolean specifying whether randomization of orientation is animated over time, or static per-particle. (default `false`)

``animatedScale``
    A boolean specifying whether randomization of scale is animated over time, or static per-particle. (default `false`)

``animatedRotation``
    A boolean specifying whether randomization of rotation is animated over time, or static per-particle. (default `false`)

``animatedAlpha``
    A boolean specifying whether randomization of alpha is animated over time, or static per-particle. (default `false`)

.. index::
    pair: ParticleSystem; createDefaultUpdater

`createDefaultUpdater`
----------------------

**Summary**

Create a default `ParticleUpdater` object.

The default updater is compatible with the default renderer, animation system and emitter.

**Syntax** ::

    var updater = ParticleSystem.createDefaultUpdater({
        graphicsDevice: GraphicsDevice,
        shaderManager: shaderManager
    });

``graphicsDevice``
    The `GraphicsDevice` object.

``shaderManager``
    The `ShaderManager` object. The shader `particles-default-render.cgfx` must be loaded.

Result is a `ParticleUpdater` object, with its `parameters` object having all parameters specific to the updater defined with defaults, these are:

``acceleration``
    A `Vector3` of the acceleration (in local coordinates) for the particle system. (default `[0, 0, 0`])

``drag``
    A number for the drag applied to particles in the world. A drag of `f` would specify that after `1/f` seconds of simulation (Ignoring effects of acceleration), an emitted particle will come to a complete stop. (default `0`).

``noiseTexture``
    A 4-channel smooth noise `Texture`, such as the one provided by `textures/noise.dds` in the SDK. (default `null`)

``randomizedAcceleration``
    A `Vector3` providing absolute maximums for the amount of randomized acceleration added to particles on update. (default `[0, 0, 0]`)

.. note :: Randomized acceleration is not taken into account for tracking, and prediction of particles as this occurs on the CPU.


.. index::
    pair: ParticleSystem; create

`create`
--------

**Summary**

Create a new particle system.

**Syntax** ::

    var system = ParticleSystem.create({
        graphicsDevice      : graphicsDevice,
        center              : [0, 0, 0],
        halfExtents         : [1, 1, 1],
        maxParticles        : 1024,
        zSorted             : true,
        maxSortSteps        : null,
        geometry            : particleGeometry,
        sharedRenderContext : null,
        maxLifeTime         : 10,
        animation           : animationTexture,
        sharedAnimation     : false,
        timer               : null,
        synchronize         : synchronizeFn,
        trackingEnabled     : false,
        updater             : systemUpdater,
        renderer            : systemRenderer
    });

``graphicsDevice``
    `GraphicsDevice` object.

``center`` (Optional)
    Default value `[0, 0, 0]`. The center of the local particle extents.

``halfExtents``
    The local half-extents of the particle system. Together with `center` this defines a region of spcae in local coordinates which absolutely contains the particle system. Particles will not be able to escape the extents, and the extents will be used for `ParticleRenderables` for `Scene` culling.

    The `velocity` of particles in the system will also be bound by the `halfExtents`.

``maxParticles``
    The maximum amount of particles that can exist in the system. This value is limited to `65536` for any particle system so that higher data compression can be achieved both CPU, and GPU side.

``zSorted`` (Optional)
    Default value `false`. If true, then views onto this system will be z-sorted. The cost of sorting a view of a system is difficult to reason about as it is performed on the GPU, but we can directly reason about the number of draw calls required to sort which scales according to `log2(n)^2` for `n` particles.

``maxSortSteps`` (Optional)
    The specific sorting algorithm used permits partial sorts of a view onto the system so that you may spread the cost of sorting over a period of time for better performance. The actual number of steps used depends on maxParticles, but this will place an upper bound on that number. By default a view will be completely sorted at every rendering.

``geometry``
    The `ParticleGeometry` instance to use in rendering a view of the system. This geometry instance must be at least as large as to render `maxParticles` number of particles.
    If the geometry instance is not marked as `shared`, then it will be destroyed along with the system.

``sharedRenderContext`` (Optional)
    A `SharedRenderContext` object from which to allocate texture regions for particle states on the GPU. If unspecified then a per-system set of textures and render targets will be created isntead and destroyed along with the system. Otherwise on destruction of the system the allocated region will be released back to the shared render context.

``maxLifeTime``
    The maximum life permissable for any particle in the system, it will not be possible to created a particle whose life-time is greater than this value.

``animation``
    The animation `Texture` created by the `ParticleBuilder` object representing the animations of all particles to be created in this system, used by a compatible rendering shader.

``sharedAnimation`` (Optional)
    Default value is `false`. If `false`, then when the system is destroyed, the `animation` texture supplied to the system will also be destroyed.

``timer`` (Optional)
    Specify a timer function to determine the passage of time seen by the particle system on update. By default a function will be used which returns `TurbulenzEngine.time`, you would most certainly want this to be tied to a game update tick.

``synchronize``
    A function which will be called by a `ParticleRenderable` referencing this system, used to emit particles and update the system whenever the renderable is updated (is visible) to the `Scene`.

``trackingEnabled`` (Optional)
    Default value is `false`. If `true`, then created particles will be able to be simulated on the CPU as well as the GPU, so that positions, velocities and other attributes may be queried at any future time until death to permit emitting particles based on positions of existing particles. This will essentially double the cost of simulating any tracked particles.

``updater``
    The `ParticleUpdater` object for the particle system, responsible for defining the techniques and parameters used for GPU side simulation of particles, a function used to work on simulation of CPU side particles, and a prediction function to support retrospective creation of particles by emitters.

``renderer``
    The `ParticleRenderer` object for the particle system, responsible for rendering particles on the GPU.

.. _particlegeometry:

===========================
The ParticleGeometry Object
===========================

Represents the geometry used to render a particle system.

Methods
=======

.. index::
    pair: ParticleGeometry; destroy

`destroy`
---------

**Summary**

Release memory used by geometry instance. This should only be called on shared geometry instances when you are sure that they are no longer in use. For un-shared geometries, the `ParticleSystem` using the geometry is responsible for calling `destroy` on the geometry when it is destroyed itself.

**Syntax** ::

    geometry.destroy();

Properties
==========

.. index::
    pair: ParticleGeometry; shared

`shared`
--------

Whether this geometry instance is shared.

.. note :: Read Only

.. _particleupdater:

==========================
The ParticleUpdater Object
==========================

Encapsulates a replaceble element of a particle system responsible for updating the states of particles on both the CPU and GPU and aiding emitters in retrospective creation of particles through prediction.

Properties
==========

.. index::
    pair: ParticleUpdater; technique

`technique`
-----------

The `Technique` to be used for updating particle states on the GPU.

.. index::
    pair: ParticleUpdater; parameters

`parameters`
------------

The `TechniqueParameters` object that will be used to set updater specific shader parameters.

The `ParticleSystem` will set the following additional reserved fields: `lifeStep`, `timeStep`, `shift`, `center`, `halfExtents`, `creationState`, `previousState`.

.. index::
    pair: ParticleUpdater; update

`update`
--------

A function responsible for updating particle states on the CPU (For tracked particles).

For the best performance, this function is required to actively kill off expired particles by removing them from the `tracked` array, and returning the number of tracked particles still alive at the end of the update.

As this is such a low-level element of the particle system, there is little in the way of helpers, with design of the update method intended to match the cgfx shader technique.

.. note :: Field is optional, if not present then tracking of particles on the CPU for the ParticleSystem will be disabled.

**Parameters**

``dataF``
    A `Float32Array` containing the state of all particles in the system.

``dataI``
    A `Uint32Array` containing another view of the state of all particles in the system.

``tracked``
    A `Uint16Array` containing the list of particle indexes for particles of the statem that are both alive and tracked.

``numTracked``
    The number of elements of the `tracked` array to be considered.

**Returns**

Function must return the (possibly fewer) number of tracked particles still alive.

.. index::
    pair: ParticleUpdater; predict

`predict`
---------

A function responsible for predicting the position and velocity of a particle at some given time in the future.

The function is used by emitters to "pretend" that the particle system and emitter are active at all times, even if the system is currently in hibernation due to being invisible in the Scene. The emitter can create particles in retrospect and call this prediction function to determine what position and velocity the particle would have had, if the system was actually active the entire time.

This also serves, as a way of ensuring that the emittance of particles is frame-rate independent, as the emitter is able to emit particles at a higher rate than the update tick, with prediction and retrospective creation of particles making it appear as though the update tick was higher.

This function should only ever be called for particles, who at the end of the simulation time to be predicted, are still alive.

.. note :: Field is optional, if not present then emitters will simply be unable to predict the correct position and velocity for particles created retrospectively.

**Parameters**

``position``
    A `Vector3` object holding the position for the particle at its creation. This object should be updated with the predicted position.

``velocity``
    A `Vector3` object holding the velocity for the particle at its creation. This object should be updated with the predicted velocity.

``userData``
    The `userData` of the particle at creation.

``time``
    The amount of time for which the particle should have its simulation predicted.

**Returns**

Function must return the predicted `userData` of the particle - should updating of the particle make use of a subset of the `userData` field for additional logic.

.. _particlerenderer:

===========================
The ParticleRenderer Object
===========================

Encapsulates a replaceable element of a particle system responsible for rendering the particles in the system.

(TODO: CPU Fallback will require extra fields and logic to be provided by a renderer most likely as the present vertex shader logic would need to be replicated on the CPU wherever it relies on texture fetches. Additinoally there would be a second technique used for the CPU fallback which would have a different vertex shader at the very least).

Properties
==========

.. index::
    pair: ParticleRenderer; technique

`technique`
-----------

The `Technique` to be used for rendering particle states on the GPU.

.. index::
    pair: ParticleRenderer; parameters

`parameters`
------------

The `TechniqueParameters` object that will be used to set renderer specific shader parameters.
