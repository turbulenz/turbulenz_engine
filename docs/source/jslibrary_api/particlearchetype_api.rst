.. index::
    single: ParticleArchetype

.. highlight:: javascript

.. _particlearchetype:

============================
The ParticleArchetype Object
============================

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

    In addition to the interface required by a low level :ref:`ParticleSystem <particlesystem>`, if used with the ParticleManager, it is expected a custom synchronizer will also expose at least an `addEmitter` method.

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

