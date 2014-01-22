.. index::
    single: ParticleUpdater

.. highlight:: javascript

.. _particleupdater:

=============================
The ParticleUpdater Interface
=============================

**Added SDK 0.28.0**

Encapsulates a replaceable element of a particle system responsible for updating the states of particles on both the CPU and GPU and aiding emitters in retrospective creation of particles through prediction.

This object may be shared amongst many :ref:`ParticleSystems <particlesystem>`.

.. note::
    This is a low-level particle system API.

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

An object defining the extra parameters that are required by this updater with their default values.

The :ref:`ParticleSystem <particlesystem>` will produce a copy of this object, adding the following additional fields defined in `particles-common.cgh` that should not be present in this object, but will always be present for use in `update` and `predict` calls.

* `timeStep`
* `lifeStep`
* `center`
* `halfExtents`
* `maxSpeed`
* `maxLifeTime`
* `shift`
* `previousState`
* `creationState`
* `creationScale`
* `textureSize`
* `invTextureSize`
* `regionSize`
* `regionPos`
* `invRegionSize`

.. index::
    pair: ParticleUpdater; update

Methods
=======

`update`
--------

A function responsible for updating particle states on the CPU (For tracked particles).

For best performance, this function is provided with the full list of particles to be simulated, particles that are already dead should be ignored as these are later removed by the user.

As this is such a low-level element of the particle system, there is little in the way of helpers, with design of the update method intended to match the cgfx shader technique.

.. note :: Method is optional, if not present then tracking of particles on the CPU for the ParticleSystem will be disabled.

**Parameters**

``parameters``
    A :ref:`TechniqueParameters <techniqueparameters>` object containing all parameters defined by the system, and defined for this update with values to be used in the update process.

``dataF``
    A `Float32Array` containing the state of all particles in the system.

``dataI``
    A `Uint32Array` containing another view of the state of all particles in the system.

``tracked``
    A `Uint16Array` containing the list of particle indexes for particles of the system that are both alive and tracked.

``numTracked``
    The number of elements of the `tracked` array to be considered.

.. index::
    pair: ParticleUpdater; predict

`predict`
---------

A function responsible for predicting the position and velocity of a particle at some given time in the future.

The function is used by emitters to "pretend" that the particle system and emitter are active at all times, even if the system is currently in hibernation due to being invisible in the Scene. The emitter can create particles in retrospect and call this prediction function to determine what position and velocity the particle would have had, if the system was actually active the entire time.

This also serves, as a way of ensuring that the emittance of particles is frame-rate independent, as the emitter is able to emit particles at a higher rate than the update tick, with prediction and retrospective creation of particles making it appear as though the update tick was higher.

This function should only ever be called for particles, who at the end of the simulation time to be predicted, are still alive.

.. note :: Method is optional, if not present then emitters will simply be unable to predict the correct position and velocity for particles created retrospectively.

**Parameters**

``parameters``
    A :ref:`TechniqueParameters <techniqueparameters>` object containing all parameters defined by the system, and defined for this update with values to be used in the prediction process.

``position``
    A :ref:`Vector3 <v3object>` object holding the position for the particle at its creation. This object should be updated with the predicted position.

``velocity``
    A :ref:`Vector3 <v3object>` object holding the velocity for the particle at its creation. This object should be updated with the predicted velocity.

``userData``
    The `userData` of the particle at creation.

``time``
    The amount of time for which the particle should have its simulation predicted.

**Returns**

Function must return the predicted `userData` of the particle - should updating of the particle make use of a subset of the `userData` field for additional logic.

.. index::
    pair: ParticleUpdater; createUserData

`createUserData`
----------------

**Summary**

This function will be called by :ref:`ParticleEmitters <particleemitter>` when used in conjunction with the high level :ref:`ParticleManager <particlemanager>` to transform archetype userData objects
into the real userData integer value.

**Syntax** ::

    var userData = updater.createUserData(parameters);

.. index::
    pair: ParticleUpdater; createUserDataSeed

`createUserDataSeed`
--------------------

**Summary**

This function will be called by :ref:`ParticleEmitters <particleemitter>`, and should return a particle particle `userData` field, containing randomized seed values if appropriate.

**Syntax** ::

    var userData = updater.createUserDataSeed();

.. index::
    pair: ParticleUpdater; applyArchetype

`applyArchetype`
----------------

**Summary**

This function will be called by the high level :ref:`ParticleManager <particlemanager>` to apply a constructed :ref:`ParticleArchetype <particlearchetype>` to this renderer.

This function should use the constructed archetype and other parameters to specify all parameters required on `system.updateParameters` object specific to this updater.

**Syntax** ::

    updater.applyArchetype(textureManager, system, archetype);

``textureManager``
    The :ref:`TextureManager <texturemanager>` to look up :ref:`Textures <texture>` from paths given in archetype.

``system``
    The :ref:`ParticleSystem <particlesystem>` to apply archetype to.

``archetype``
    The updater specific archetype parameters to be applied.

.. _defaultparticleupdater:

The DefaultParticleUpdater Object
=================================

Implementation of a :ref:`ParticleUpdater <particleupdater>`.

Performs simulation of the particles with positions and velocities as standard euclidean vectors, supporting a uniform acceleration and drag to apply to all particles.

Additionally, supports a noise-randomized acceleration applied per-particle from a noise texture controlled by a noise seed, and activation flag in the particles' `userData` storage.

`DefaultParticleUpdater` implements both the `update` and `predict` functions with the restriction that neither may make use of noise-randomized acceleration.

**Particle userData storage used**

To randomize the acceleration of a particle, bit `24` of the userData field should be set, with bits `[16,24)` specifying an 8-bit integer seed used to select a path in the noise texture.

**Compatibility**

The `DefaultParticleUpdater` is compatible with the :ref:`DefaultParticleRenderer <defaultparticlerenderer>` in the sense that their usages of each particles `userData` does not conflict.

The `DefaultParticleUpdater` is assumed when using the :ref:`DefaultParticleEmitter <defaultparticleemitter>` object.

Methods
-------

.. index::
    pair: DefaultParticleUpdater; create

`create`
--------

**Summary**

Create a new `DefaultParticleUpdater` object.

**Syntax** ::

    var updater = DefaultParticleUpdater.create(graphicsDevice, shaderManager);

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object.

``shaderManager``
    The :ref:`ShaderManager <shadermanager>` object, expecting that `shaders/particles-default-updater.cgfx` has been pre-loaded.

.. index::
    pair: DefaultParticleUpdater; createUserData

`createUserData`
----------------

**Summary**

Set up particles' `userData` storage for creation.

**Syntax** ::

    var userData = DefaultParticleUpdater.createUserData(randomizeAcceleration, seed);

``randomizeAcceleration`` (Default `false`)
    Specify the particle to which this userData will be applied should have its acceleration randomized.

``seed`` (Default `0`)
    The 8-bit integer seed to write to the `userData`.

.. note:: The seed parameter should be ignored when creating userData values for ParticleArchetypes, as it is the responsibility of the emitter to initialize the seed to a random value for each emitted particle.

.. _defaultparticleupdater_archetype:

Parameters
----------

The list of technique parameters exposed by the `DefaultParticleUpdater`. Unless otherwise stated these are the same as the parameters supported by a :ref:`ParticleArchetype <particlearchetype>` using this updater.

``acceleration`` (Default `[0, 0, 0]`)

    The :ref:`Vector3 <v3object>` acceleration in local coordinates to apply to all particles in the system.

``drag`` (Default `0`)

    The drag to be applied to all particles in the system.

    A drag equal to `f` will specify that - ignoring acceleration - any emitted particle will come to a complete stop in `1/f` seconds of simulation time.

    Example: A drag of `0` means no drag will be applied, and a drag of `2` specifies that particles will come to a stop in `0.5` seconds.

``noiseTexture``

    The noise :ref:`Texture <texture>` to be used for randomizing appearance of particles. This noise texture should be a 4-channel smooth noise such as `textures/noise.dds` present in the SDK.

    The particles current age will be used to look up randomized values in the texture along a pseudo-random path, therefore a higher frequency noise texture will produce higher frequency fluctuations in the randomized values used to alter the particles appearances.

    Vectors are extracted from the noise texture based on treating channels as encoded signed floats (As-per :ref:`TextureEncode.encodeSignedFloat <textureencode>`).

    Default value is a procedural texture defined so that no randomization will occur (:ref:`ParticleSystem.getDefaultNoiseTexture <particlesystem>`)

.. note :: For a ParticleArchetype, this field should be a string path to the texture to be retrieved from the TextureManager rather than a real Texture object.

``randomizedAcceleration`` (Default `[0, 0, 0]`)

    A :ref:`Vector3 <v3object>` defining the maximum amount of randomized acceleration applicable to the particles.

    This :ref:`Vector3 <v3object>` will be multiplied with the vector extracted from the noise texture.
