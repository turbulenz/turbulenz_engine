.. index::
    single: ParticleRenderer

.. highlight:: javascript

.. _particlerenderer:

==============================
The ParticleRenderer Interface
==============================

Added in :ref:`SDK 0.27.1 <added_sdk_0_27_1>`.

Encapsulates a replaceable element of a particle system responsible for rendering the particles in the system.

This object may be shared amongst many :ref:`ParticleSystems <particlesystem>`.

.. note::
    This is a low-level particle system API.

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

An object definining the parameters required by this specific renderer with their default values.

The :ref:`ParticleSystem <particlesystem>` will produce a copy of this object with additional fields added defined in `particles-common.cgh` which should not be used by this object.

* `center`
* `halfExtents`
* `projection`
* `maxLifeTime`
* `modelView`
* `textureSize`
* `invTextureSize`
* `regionSize`
* `regionPos`
* `invRegionSize`
* `mappingSize`
* `invMappingSize`
* `mappingPos`
* `mappingTable`
* `vParticleState`
* `fParticleState`
* `animation`
* `animationSize`

Methods
=======

.. index::
    pair: ParticleRenderer; createGeometry

`createGeometry`
----------------

**Summary**

Create a :ref:`ParticleGeometry <particlegeometry>` object compatible with this renderer.

**Syntax** ::

    var geometry = renderer.createGeometry({
        graphicsDevice: GraphicsDevice,
        maxParticles: 1024,
        shared: false
    });

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object.

``maxParticles``
    The maximum amount of particles renderable with the created geometry object.

``shared`` (Optional)
    Whether this geometry is going to be shared amongst many particle systems or not.

.. index::
    pair: ParticleRenderer; createUserDataSeed

`createUserDataSeed`
--------------------

**Summary**

This function will be called by :ref:`ParticleEmitters <particleemitter>`, and should return a particle particle `userData` field, containing randomized seed values if appropriate.

**Syntax** ::

    var userData = renderer.createUserDataSeed();

.. index::
    pair: ParticleRenderer; applyArchetype

`applyArchetype`
----------------

**Summary**

This function will be called by the high level :ref:`ParticleManager <particlemanager>` to apply a constructed :ref:`ParticleArchetype <particlearchetype>` to this renderer.

This function should use the constructed archetype and other parameters to specify all parameters required on `system.renderParameters` object specific to this renderer.

**Syntax** ::

    renderer.applyArchetype(textureManager, system, archetype, particleTextures);

``textureManager``
    The :ref:`TextureManager <texturemanager>` to look up :ref:`Textures <texture>` from paths given in archetype.

``system``
    The :ref:`ParticleSystem <particlesystem>` to apply archetype to.

``archetype``
    The renderer specific archetype parameters to be applied.

``particleTextures``
    A function to be used to retrieve packed particle textures from a texture type name (Eg: `"texture0"`).

.. _defaultparticlerenderer:

The DefaultParticleRenderer Object
==================================

Implementation of a :ref:`ParticleRenderer <particlerenderer>`.

Renders particles as textured quads that are either bill-boarded to face camera, aligned to face along direction of motion, or with a per-particle defined direction.

Particles are rendered based on the default particle animation texture definition, supporting animated rotation, color, scale and a flip-book animation of particle appearances.

On a per-particle basis, particles can opt-in to have their rotation, final orientation, alpha or scale randomized.

On a system wide basis, the amount of randomization can be controlled, and whether each randomization applied is fixed once the particle is created, or changes over the particles life time.

**Particle userData storage used**

Orientation of particle is controlled with bits `[30,32)` as a 2-bit integer with `0` specifying a bill-boarded orientation, `1` a velocity-aligned orientation, and `2` a custom orientation.

Custom orientations are specified with bits `[0,8)` and `[8,16)` specifying two normalized, spherical angles: theta in the high 8 bits representing values `[0,pi)` and phi in the low 8 bits representing values `[0,2pi)`.

To randomise the rotation of particles, bit `29` should be set.

To randomise the scale of particles, bit `28` should be set.

To randomise the orientation of particles, bit `27` should be set.

To randomise the alpha of particles, bit `26` should be set.

Bits `[16,24)` specifies an 8-bit integer seed used to select a path in the noise texture.

**Compatiblity**

The `DefaultParticleRenderer` is compatible with the :ref:`DefaultParticleUpdater <defaultparticleupdater>` in the sense that their usages of each particles `userData` does not conflict.

The `DefaultParticleRenderer` is assumed when using the :ref:`DefaultParticleEmitter <defaultparticleemitter>` object.

Additionally any particle animations must use the default system for :ref:`ParticleBuilder.compile <particlebuilder>` supporting animation of particles rotation, color and scale, and supporting flip-book animations of particle appearances.

Methods
-------

.. index::
    pair: DefaultParticleRenderer; create

`create`
--------

**Summary**

Create a `DefaultParticleRenderer` object.

**Syntax** ::

    var renderer = DefaultParticleRenderer.create(graphicsDevice, shaderManager, alpha);

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object.

``shaderManager``
    The :ref:`ShaderManager <shadermanager>` object. The shader `particles-default-render.cgfx` must be loaded.

``blendMode`` (Optional)
    Rendering shader supports one of `3` blend modes: `"alpha"` (default), `"additive"` and `"opaque"`.

`createUserData`
----------------

**Summary**

Set up particles' `userData` storage for creation.

**Syntax** ::

    var userData = DefaultParticleRenderer.createUserData({
        facing: "custom",
        theta: 0.5,
        phi: Math.PI,
        randomizeOrientation: true,
        randomizeRotation: true,
        randomizeScale: true,
        randomizeAlpha: true,
        seed: seed
    });

``facing`` (Default `"billboard"`)
   One of `"billboard"`, `"velocity"` or `"custom"`.

``theta`` (Default `0`)
    Useful only in conjunction with `custom` facing. Defines the spherical angle of elevation, with `0` pointing along y-axis and `Math.PI` pointing along negative y-axis.

``phi`` (Default `0`)
    Useful only in conjunction with `custom` facing. Defines the clockwise spherical angle of azimuth, with `0` pointing along x-axis.

``randomizeOrientation`` (Default `false`)
    Specify the particle to which this userData will be applied should have its orientation randomized.

``randomizeScale`` (Default `false`)
    Specify the particle to which this userData will be applied should have its scale randomized.

``randomizeRotation`` (Default `false`)
    Specify the particle to which this userData will be applied should have its rotation randomized.

``randomizeAlpha`` (Default `false`)
    Specify the particle to which this userData will be applied should have its alpha randomized.

``seed`` (Default `0`)
    The 8-bit integer seed to write to the `userData`.

.. note:: The seed parameter should be ignored when creating userData values for ParticleArchetypes, as it is the responsibility of the emitter to initialise the seed to a random value for each emitted particle.

.. index::
    pair: DefaultParticleRenderer; setAnimationParameters

`setAnimationParameters`
------------------------

**Summary**

Set up extra shader parameters required to de-normalize attributes of the particles animations when rendering.

**Syntax** ::

    renderer.setAnimationParameters(system, animationDefn);

``system``
    The :ref:`ParticleSystem <particlesystem>` onto which the parameters should be set, affecting its `renderParameters` object.

``animationDefn``
    The resultant object returned from `ParticleBuilder.compile`.

.. _defaultparticlerenderer_archetype:

Parameters
----------

The list of technique parameters exposed by the `DefaultParticleRenderer`. Unless otherwise stated these are the same as the parameters supported by a :ref:`ParticleArchetype <particlearchetype>` using this renderer.

``noiseTexture``

    The noise :ref:`Texture <texture>` to be used for randomising appearance of particles. This noise texture should be a 4-channel smooth noise such as `textures/noise.dds` present in the SDK.

    The particles current age will be used to look up randomised values in the texture along a pseudo-random path, therefore a higher frequency noise texture will produce higher frequency fluctuations in the randomised values used to alter the particles appearances.

    Vectors are extracted from the noise texture based on treating channels as encoded signed floats (As-per :ref:`TextureEncode.encodeSignedFloat <textureencode>`).

    Default value is a procedural texture defined so that no randomisation will occur (:ref:`ParticleSystem.getDefaultNoiseTexture <particlesystem>`)

.. note :: For a ParticleArchetype, this field should be a string path to the texture to be retrieved from the TextureManager rather than a real Texture object.

``randomizedOrientation`` (Default `[0, 0]`)

    A :ref:`Vector2 <v2object>` defining the maximum amount of randomisation applied to particles orientations in spherical coordinates.

``randomizedScale`` (Default `[0, 0]`)

    A :ref:`Vector2 <v2object>` defining the maximum amount of randomisation applied to particles scale (width/height).

``randomizedRotation`` (Default `0`)

    A number defining the maximum amount of randomisation applied to particles spin-rotation.

``randomizedAlpha`` (Default `0`)

    A number defining the maximum amount of randomisation applied to particles alpha.

``animatedOrientation`` (Default `false`)

    A boolean flag defining whether the randomisation of particle orientations is fixed, or animated over time.

    If `true` then the randomization will change over time according to the noise texture, otherwise only an initial sample will be made to the noise texture fixing the randomization that is applied.

``animatedScale`` (Default `false`)

    A boolean flag defining whether the randomisation of particle scales is fixed, or animated over time.

    If `true` then the randomization will change over time according to the noise texture, otherwise only an initial sample will be made to the noise texture fixing the randomization that is applied.

``animatedRotation`` (Default `false`)

    A boolean flag defining whether the randomisation of particle rotations is fixed, or animated over time.

    If `true` then the randomization will change over time according to the noise texture, otherwise only an initial sample will be made to the noise texture fixing the randomization that is applied.

``animatedAlpha`` (Default `false`)

    A boolean flag defining whether the randomisation of particle alphas is fixed, or animated over time.

    If `true` then the randomization will change over time according to the noise texture, otherwise only an initial sample will be made to the noise texture fixing the randomization that is applied.

``texture``

    The :ref:`Texture <texture>` object, with each animations flip-book of textures packed together.

.. note :: This parameter is not supported on a ParticleArchetype description.
