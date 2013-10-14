.. index::
    single: ParticleManager

.. highlight:: javascript

.. _particlemanager:

==========================
The ParticleManager Object
==========================

The ParticleManager is used to create and manage GPU based particle systems.

The ParticleManager is data-driven, with particle systems represented entirely by an easily serializable archetype object:

A particle system archetype has the following structure: ::

    {
        system: {
            center         : [0, 0, 0],
            halfExtents    : [1, 1, 1],
            maxParticles   : 64,
            maxSpeed       : 10,
            maxLifeTime    : 2,
            zSorted        : false,
            maxSortSteps   : 10000,
            trackingEnabled: false
        },
        renderer: {
            name: "default"
            .. renderer parameters
        },
        updater: {
            name: "default"
            .. updater parameters
        },
        synchronizer: {
            name: "default"
            .. synchronization parameters
        },
        animationSystem: "default",
        packedTexture0: null,
        ...
        packedTexture4: null
        particles: {
            "particle-name": {
                animation: null,
                tweaks: null,
                texture0: null,
                ...
                texture4: null,
                texture-uv0: null,
                ...
                texture-uv4: null
            }
            ...
        },
        emitters: [
            {
                name: "default",
                particleName: "particle-name",
                ... emitter parameters
            }
            ...
        ]
    }

All fields of the archetype need not be specified by use of the `decompressArchetype` method which will fill in all missing fields with default values.

The values shown above, are the basic default values for an archetype.

As this is a data-driven API, the methods of the manager will verify the data to limit the probability of using invalid data which would lead to silent bugs.

``system``
    Parameters of the :ref:`ParticleSystems <particlesystem>` that will be created for this archetype by the manager on demand.

    Descriptions of the archetype parameters may be found on the :ref:`ParticleSystem <particlesystem>` create method. All other parameters to the create method will be filled in by the `ParticleManager` and may be ignored.

``renderer``
    Parameters of the :ref:`ParticleRenderer <particlerenderer>` that will be created for this archetype by the manager on demand.

    By default, there are 4 renderers specified for use:

    * `"default"`
        A :ref:`DefaultParticleRenderer <defaultparticlerenderer>` using the `alpha` blend-mode.

        This renderer is implied unless the archetype specifies otherwise.
    * `"alpha"`
        A :ref:`DefaultParticleRenderer <defaultparticlerenderer>` using the `alpha` blend-mode.
    * `"additive"`
         A :ref:`DefaultParticleRenderer <defaultparticlerenderer>` using the `additive` blend-mode.
    * `"opaque"`
        A :ref:`DefaultParticleRenderer <defaultparticlerenderer>` using the `opaque` blend-mode.

    The archetype parameters usable for these renderers are listed and described :ref:`here <defaultparticlerenderer_parameters>` (With exception to the `texture` parameter which will be set by the manager)

``updaters``
    Parameters of the :ref:`ParticleUpdater <particleupdater>` that will be created for this archetype by the manager on demand.

    By default, there is a single updater specified for use:

    * `"default"`
        A :ref:`DefaultParticleUpdater <defaultparticleupdater>`.

        This updater is implied unless the archetype specifies otherwise.

    The archetype parameters usable for these updaters are listed and described :ref:`here <defaultparticleupdater_parameters>`.

``synchronizer``
    Parameters of the :ref:`ParticleSynchronizer <particlesynchronizer>` that will be created for each system of this archetype by the manager on demand.

    By default, there is a single synchronizer specified for use:

    * `"default"`
        A :ref:`DefaultParticleSynchronizer <defaultparticlesynchronizer>`.

        This synchronizer is implied unless the archetype specifies otherwise.

    The archetype parameters usable for these synchronizers are listed and described :ref:`here <defaultparticlesynchronizer_parameters>`.

``animationSystem``
    The animation system used by particle animations in the archetype.

    By default, there is a single animation system compatible with all pre-defined updaters and renderers.

    * `"default"`
        The default animation system, as specified :ref:`here <defaultparticlesystem>`

``packedTexture#``
    These parameters of the archetype can be used to specify that pre-packed textures exist containing all flip-book animations of every particle in the archetype, and that this texture should be used in-place of run-time packed textures generated by the manager.

    Indices should match the particle animation system in use, noting that `packedTexture0` is permitted to be defined by the name `packedTexture` instead.

    If a packed texture is defined, then particles in the archetype will be permitted to have a corresponding `texture-uv#` field specifying a normalized uv-rectangle of the packed texture to be used in re-mapping particle animation uv-rectangles as described in :ref:`ParticleBuilder.compiler <particlebuilder>` (`uvMap` parameter). If this field is not specified then `[0, 0, 1, 1]` will be implied, indicating the particle animation is already aware of how the textures are packed.

    If a packed texture is not specified, then particles in the archetype should themselves specify the textures to be used for that particle that the manager may pack them at run-time.

``particles``
    A dictionary of named particle animations usable by the particle system.

    Each field of this object is the name of the particle to be referenced by emitters, and a description of that particle with the following fields:

    ``animation``
        The particle animation for this particle, this field may be `null` specifying a default animation, a `string` name referencing a registered particle animation in the manager, or an `object` definining inline, the particle animation to be used.

        Particle animations are described in :ref:`ParticleBuilder.compile <particlebuilder>` (`particles` parameter), noting that the `name` parameters will be set for inlined animations to be equal to the particle `name` in the archetype and may be omitted. Equally, if a non-packed texture is used, then the corresponding `texture#` and `texture#-size` parameters should be omitted, as these will also be set by the manager.

    ``tweaks``
       A dictionary of tweaks (As described in :ref:`ParticleBuilder.compile <particlebuilder>` `tweaks` parameters), to be applied to the animation for this particle.

    ``texture-uv#``
        A normalized uv-rectangle describing the sub-set of the packed texture to which this particles defined animation uv-rectangles should be mapped to as described in :ref:`ParticleBuilder.compile <particlebuilder>` `uvMap` parameter.

        If using a corresponding packed texture, and this field is omitted, then `[0, 0, 1, 1`] will be used.

        If not using a corresponding packed texture, this field must not be present.

    ``texture#``
        A texture (or set of textures) to be used for this particle when no pre-packed texture is specified.

        This field must not be present if using packed textures.

        This fields value should be either a `string` specifying the path to the texture used for this particle's appearance, or an `array` of `strings` specifying the paths to the set of textures to be used for the flip-book animation of the particle`s appearance.

        If not using a corresponding packed texture, and this field is omitted, then a default texture will be used.

``emitters``
    An array of emitters for this particle system archetype.

    By default, there is a single emitter type specified for use:

    * `"default"`
        A :ref:`DefaultParticleEmitter <defaultparticleemitter>`.

        This emitter is implied unless the archetype emitter specifies otherwise.

    The archetype parameters usable for these emitters are listed and described :ref:`here <defaultparticleemitter_parameters>`. Noting that the `animationRange` parameters of the emitter `particle` object should be omitted, as this will be set by the manager.

    The additional `particleName` parameters is a reference to the archetype `particles` dictionary, specifying the particle to be emitted by this emitter.


Methods
=======

.. index::
    pair: ParticleManager; create

`create`
--------

**Summary**

Create a new ParticleManager

**Syntax** ::

    var manager = ParticleManager.create(graphicsDevice, textureManager, shaderManager);

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object.

``textureManager``
    The :ref:`TextureManager <texturemanager>` object.

``shaderManager``
    The :ref:`ShaderManager <shadermanager>` object.

.. index::
    pair: ParticleManager; initialize

`initialize`
------------

**Summary**

Initialize the particle manager, this must be called before any particle systems are created using the manager.

**Syntax** ::

    manager.initialize(scene, passIndex);

``scene``
    The :ref:`Scene <scene>` object the manager will work with.

``passIndex``
    The passIndex for `transparent` renderables defined by the renderer in use.

.. index::
    pair: ParticleManager; registerParticleAnimation

`registerParticleAnimation`
---------------------------

**Summary**

Register a particle animation object to be referenced by particle systems created by the manager.

**Syntax** ::

    manager.registerParticleAnimation(definition);

``definition``
    The particle animation definition.

    The name of the particle animation defined will be used to look up this definition when creating particle systems.

.. index::
    pair: ParticleManager; preloadArchetype

`preloadArchetype`
------------------

**Summary**

Pre-load a particle system archetype, ensuring that all shaders and textures required by the system are loaded on the manager's shader and texture managers.

This must be performed before creating a system from its archetype, and it is assumed that all required textures and shaders have completed their load before a system is created.

**Syntax** ::

    manager.preloadArchetype(archetype);

``archetype``
    The particle system archetype to be pre-loaded.

.. index::
    pair: ParticleManager; replaceArchetype

`replaceArchetype`
------------------

**Summary**

Re-build any existing particle instances making use of the provided archetype, with the new provided archetype. This feature is not expected to be performant, but is invaluable in performing live-updates of particle systems in a world for purposes of in-game editors.

As some properties, such as particle system extents and particle capacities are immutable, this is the only way of easily effecting such changes for current systems in use.

Existing references to particle instances will remain valid, with the existing particle isntance objects re-used for the replaced systems.

**Syntax** ::

    manager.replaceArchetype(oldArchetype, newArchetype);

``oldArchetype``
    The old particle archetype. All instances of this archetype will be modified in-place to make use of the new archetype.

    The old archetype will remain valid for further use if necessary.

``newArchetype``
    The new, pre-loaded particle archetype to use as replacement.

.. index::
    pair: ParticleManager; createInstance

`createInstance`
----------------

**Summary**

Create a :ref:`ParticleInstance <particleinstance>` of a particle system from its archetype.

It is assumed that this archetype has had all its required textures and shaders pre-loaded.

**Syntax** ::

    var instance = manager.createInstance(archetype, timeout);

``archetype``
    The pre-loaded archetype to create instance from.

``timeout`` (Optional)
    The amount of time this instance should exist for. Once this amount of time has passed, the instance will be automatically removed from the scene if necessary, and recycled.

    This parameter should be specified for the creation of short-lived effects, making use of an internal optimized data structure for handling large numbers of short-lived effects in conjunction with the updates of the manager.

.. index::
    pair: ParticleManager; update

`update`
--------

**Summary**

Update the particle manager.

This call will update the internal clock of the manager used by all created particle systems to track the passage of time, and will also be used to cull short-lived instances created in the manager automatically when required even if they are off-screen (or never made visible at all).

**Syntax** ::

    manager.update(timeStep);

``timeStep``
    The amount of elapsed time to be added to the managers timer in seconds.

    There is no need to tie this update to a fixed time-step, as this will have no effect on how the systems are updated when rendered. Any fixed time-step simulation of systems is the responsibility of individual system synchronizers.

.. index::
    pair: ParticleManager; addInstanceToScene

`addInstanceToScene`
--------------------

**Summary**

Add the provided :ref:`ParticleInstance <particleinstance>` as a child of the given scene node to the scene.

**Syntax** ::

    manager.addInstanceToScene(instance, parent);

``instance``
    The particle system instance created by the manager to be added to the scene.

``parent`` (Optional)
    The parent :ref:`SceneNode <scenenode>` to add this system instance as a child of. If omitted, the system will be added as a root node of the scene.

.. index::
    pair: ParticleManager; removeInstanceFromScene

`removeInstanceFromScene`
-------------------------

**Summary**

Remove the provided :ref:`ParticleInstance <particleinstance>` from the scene.

**Syntax** ::

    manager.removeInstanceFromScene(instance);

``instance``
    The particle system instance created by the manager to be removed from the scene.

.. index::
    pair: ParticleManager; compressArchetype

`compressArchetype`
-------------------

**Summary**

Compress the provided archetype, returning an object delta no larger than the input archetype.

This can be used to save space when saving or transferring archetypes, and will be used when serialising an archetype.

**Syntax** ::

    var delta = manager.compressArchetype(archetype);

``archetype``
    The particle system archetype to be compressed.

.. index::
    pair: ParticleManager; decompressArchetype

`decompressArchetype`
---------------------

**Summary**

De-compress the provided archetype from its delta.

**Syntax** ::

    var archetype = manager.decompressArchetype(delta);

``delta``
    The archetype object delta to be decompressed.

.. index::
    pair: ParticleManager; serializeArchetype

`serializeArchetype`
--------------------

**Summary**

Serialize the provided archetype to a JSON string, this method will first compress the archetype to its object delta.

This method can be used as a cost-efficient way of saving archetypes to file.

**Syntax** ::

    var serializedString = manager.serializeArchetype(archetype);

.. index::
    pair: ParticleManager; deserializeArchetype

`deserializeArchetype`
----------------------

**Summary**

Deserializes an archetype from its compressed JSON representation, this method will decompress the stringified object delta of the archetype.

**Syntax** ::

    var archetype = manager.deserializeArchetype(jsonString);

.. index::
    single: ParticleInstance

.. _particleinstance:

===========================
The ParticleInstance Object
===========================

The ParticleInstance object will be created by the :ref:`ParticleManager <particlemanager>` encapsulating the state of a current system.

Properties
==========

.. index::
    pair: ParticleInstance; renderable

`renderable`
------------

The :ref:`ParticleRenderable <particlerenderable>` created for this instance. This property will always be defined, and may be used to move/translate/scale the particle system using the renderable's local-transform.

This renderable should not be added or removed from a :ref:`Scene <scene>` manually. Instead the `addInstanceToScene` and `removeInstanceFromScene` methods of the :ref:`ParticleManager <particlemanager>` should be used.

.. note :: Read Only

.. index::
    pair: ParticleInstance; system

`system`
--------

The :ref:`ParticleSystem <particlesystem>` created for this instance.

This system will be lazily allocated when the instance has first become visible, and may never exist at all.

.. note :: Read Only
