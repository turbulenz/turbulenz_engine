.. index::
    single: ParticleSynchronizer

.. highlight:: javascript

.. _particlesynchronizer:

==================================
The ParticleSynchronizer Interface
==================================

Represents how a particle system is synchronized, including emitting new particles.

Methods
=======

.. index::
    pair: ParticleSynchronizer; synchronize

`synchronize`
-------------

**Summary**

The synchronize function will be called via the :ref:`ParticleSystem <particlesystem>` sync method, itself called from the :ref:`ParticleRenderables <particlerenderable>` referencing the system.

This function is required to update the particle system, and emit any new particles for simulation. This method should make use of the `beginUpdate`, `createParticle`, `endUpdate` and tracked-particle methods.

**Parameters**

``system``
    The :ref:`ParticleSystem <particlesystem>` being synchronized.

``timeStep``
    The amount of time (as determined by the particle system `timer`) that has elapsed since the last synchronization.

.. index::
    single: DefaultParticleSynchronizer

.. _defaultparticlesynchronizer:

======================================
The DefaultParticleSynchronizer Object
======================================

An implementation of the :ref:`ParticleSynchronizer <particlesynchronizer>` interface supporting variable or fixed-time step synchronization, with particles emitted by a set of emitter objects supporting a time-ordered event queue for complex emitter effects.

Methods
=======

.. index::
    pair: DefaultParticleSynchronizer; create

`create`
--------

**Summary**

Create a new default synchronizer object.

**Syntax** ::

    var synchronizer = DefaultParticleSynchronizer.create({
        fixedTimeStep: 1/60,
        maxSubSteps: 4,
        renderable: null,
        trailFollow: 0.5
    });

``fixedTimeStep`` (Optional)
    A fixed time step to use for particle system updates, if unspecified then a variable time step will be used instead based on elapsed time.

``maxSubSteps`` (Optional)
    Default value `3`. The maximum amount of particle system updates to perform in any synchronization when using a fixed time step.If the number of fixed time steps required exceeds this amount, then the synchronizer will move to a variable time step for that synchronization event, performing exactly `maxSubSteps` updates.

``renderable`` (Optional)
    The :ref:`ParticleRenderable <particlerenderable>` associated with the particle system to which this synchronizer is attached. This need not be specified (and can be set later), but is required if you want trails to form when the renderable is moved in the :ref:`Scene <scene>`.

``trailFollow`` (Optional)
    A value specifying how trails form when a renderable has been specified.

    A trailFollow of `1`, specifies that an exact trail forms, with already emitted particles appearing to be unaffected by movement of the system.

    A trailFollow of `0`, specifies that no trail should form and already emitted particles will follow the movements of the system exactly.

    The default value is `1`.

.. index::
    pair: DefaultParticleSynchronizer; addEmitter

`addEmitter`
------------

**Summary**

Add an emitter to the synchronizer.

An emitter is an object with the following fields:

    ``enabled``
        A boolean specifying whether the emitter is currently enabled. Disabled emitters will not be synchronized when the synchronizer performs its updates.

    ``sync``
        A function called from each update of the synchronizer to synchronizer the specific emitter.

        This function is called with the following parametres:

            ``synchronizer``
                The synchronizer object.

            ``system``
                The :ref:`ParticleSystem <particlesystem>` being synchronized.

            ``timeStep``
                The amount of time to update the emitter with for the current synchronizer update.

**Syntax** ::

    synchronizer.addEmitter(emitter);

``emitter``
    The emitter to add, if already present this call will have no effect.

.. index::
    pair: DefaultParticleSynchronizer; removeEmitter

`removeEmitter`
---------------

**Summary**

Remove an emitter from the synchronizer.

**Syntax** ::

    synchronizer.removeEmitter(emitter);

``emitter``
    The emitter to remove. If not present in the synchronizer this call will have no effect.

.. index::
    pair: DefaultParticleSynchronizer; enqueue

`enqueue`
---------

**Summary**

Enqueue an event object to the synchronizer for processing.

**Syntax** ::

    synchronizer.enqueue(event);

``event``

    The event to enqueue. An event is an object with the following fields:

    ``time``
        A number specifying the relative time until the event should take place. Example a time of `1` would specify the event should happen in `1` second from the present time.

    ``fun``
        A function to be called when the event occurs, this function will be called with the following parameters:

        ``event``
            The event being processed.

        ``synchronizer``
            The synchronizer object the event relates to.

        ``system``
            The :ref:`ParticleSystem <particlesystem>` the synchronizer is working with.

.. _defaultparticlesynchronizer_parameters:

Properties
==========

.. index::
    pair: DefaultParticleSynchronizer; fixedTimeStep

`fixedTimeStep`
---------------

**Summary**

The fixed time step to be used for updating the system, this value may be set `null` to move back to a variable time step.

.. index::
    pair: DefaultParticleSynchronizer; maxSubSteps

`maxSubSteps`
-------------

**Summary**

The maximum amount of sub-steps to make when updating the system if using a fixed time step.

.. index::
    pair: DefaultParticleSynchronizer; renderable

`renderable`
------------

**Summary**

The :ref:`ParticleRenderable <particlerenderable>` to use when tracking movements of the system for the formation of trails.

.. index::
    pair: DefaultParticleSynchronizer; trailFollow

`trailFollow`
-------------

**Summary**

The number specifying how trails form, with `1` specifying a standard trail, and `0` specifying that already emitted particles will follow the movements of the system without trails forming. Any value is permited, though values between `0` and `1` are 'expected'.

.. index::
    pair: DefaultParticleSynchronizer; emitters

`emitters`
----------

**Summary**

The current set of emitters added to the synchronizer.

.. note :: Read Only

.. index::
    single: DefaultParticleEmitter

.. _defaultparticleemitter:

=================================
The DefaultParticleEmitter Object
=================================

An emitter, compatible with the `DefaultParticleSynchronizer` and assuming usage of the :ref:`DefaultParticleUpdater <defaultparticleupdater>` in the sense that the emitter assumes a standard euclidean simulation space with no specific userData set on the particles.

This emitter will emit continuous streams of particles with a set rate, with particles emitted in a specific direction in an optional combination of a flat angular spread, and a conical spread using either a uniform or normal distribution.

Particles will be emitted from within a random radius of a position in either a flat disc or spherical spread with some distribution, with randomised lifetimes and speeds.

**Prediction**

This emitter will make use of the system updater's `predict` method so that particles can be emitted at exactly the rate specified, regardless of update time-steps. This also means that if the particle system was not updated for a period of time due to being outside the camera's view frustum, when made visible again it will appear as though the particle system was always being updated with particles retrospectively created.

Methods
=======

.. index::
    pair: DefaultParticleEmitter; create

`create`
--------

**Summary**

Create a new emitter.

**Syntax** ::

    var emitter = DefaultParticleEmitter.create();

.. index::
    pair: DefaultParticleEmitter; enable

`enable`
--------

**Summary**

Enable the emitter.

**Syntax** ::

    emitter.enable();

.. index::
    pair: DefaultParticleEmitter; disable

`disable`
---------

**Summary**

Disable the emitter.

**Syntax** ::

    emitter.disable();

.. index::
    pair: DefaultParticleEmitter; burst

`burst`
-------

**Summary**

Enable the emitter for a set number of bursts. Once the burst of particles is completed, the emitter will again be disabled.

**Syntax** ::

    emitter.burst(count);

``count`` (Optional)
    Default value `1`. Emitter is enabled for this many bursts of particles.

.. _defaultparticleemitter_parameters:

Properties
==========

.. index::
    pair: DefaultParticleEmitter; forceCreation

`forceCreation`
---------------

**Summary**

Value of `forceCreation` when creating particles. See :ref:`ParticleSystem.createParticle <particlesystem_createparticle>`.

Default value is `false`.

.. index::
    pair: DefaultParticleEmitter; usePrediction

`usePrediction`
---------------

**Summary**

If true, then particles will have their position and velocity predicted using the system updater, this enables (at a small overhead) more accurate creation of particles whose creation time does not exactly overlap with system updates, and to improve behaviour when looking back onto a previously invisible particle system.

Default value is `true`.

.. index::
    pair: DefaultParticleEmitter; emittance

`emittance`
-----------

**Summary**

Parameters controlling the emittance of particles.

**Fields**

``rate``` (Default 4)
    How often particles are emitted, a rate of `3` specifies 3 emittance events every second.

``delay`` (Default 0)
    A delay in seconds from when the emitter is enabled, to when it first emits particles.

``burstMin`` (Default 1)
    The minimum amount of particles emitted at each emittance event.

``burstMax`` (Default 1)
    The maximum amount of particles emitted at each event. The actual amount emitted varies uniformnly between the min and max values.

.. index::
    pair: DefaultParticleEmitter; particle

`particle`
----------

**Summary**

Parameters about the particles appearances and life times.

**Fields**

``animationRange`` (Default `[0, 1]`)
    The range of the animation texture used by this particle, this should be accessed from the :ref:`ParticleBuilder <particlebuilder>` compilation result.

``lifeTimeMin`` (Default 1)
    The minimum life time of the emitted particles.

``lifeTimeMax`` (Default 1)
    The maximum life time of the emitted particles. The actual life time varies uniformnly between the min and max values.

``userData`` (Default 0)
    The `userData` applied when creating particles from this emitter.

.. index::
    pair: DefaultParticleEmitter; position

`position`
----------

**Summary**

Parameters about the spawn positions of particles in this emitter.

**Fields**

``position`` (Default `[0, 0, 0]`)
    The base position of particles emitted in the particle system.

``spherical`` (Default `true`)
    If true, then particle position will be selected from within a sphere.

    If false, then particle positions will be selected from within a disc.

``normal`` (Default `[0, 1, 0]`)
    The normal vector of the disc to select particle positions from when `spherical` is `false`.

``radiusMin`` (Default 0)
    The minimum radius at which to select particle positions from.

``radiusMax`` (Default 0)
    The maximum radius at which to select particle positions from.

``radiusDistribution`` (Default `"uniform"`)
    The distribution to use when selecting the radius to use when selecting particle positions.

    * `"uniform"`
        A uniform distribution.
    * `"normal"`
        A normal distribution.

``radiusSigma`` (Default `0.25`)
    The `sigma` parameter of the normal distribution.

.. index::
    pair: DefaultParticleEmitter; velocity

`velocity`
----------

**Summary**

Parameters about the spawn velocities of particles in this emitter.

**Fields**

``theta`` (Default 0)
    `theta` spherical coordinate for target particle directions in emitter.

``phi`` (Default 0)
    `phi` spherical coordinate for target particle directions in emitter.

``speedMin`` (Default 1)
    The minimum speed to emit particles with.

``speedMax`` (Default 1)
    The maximum speed to emit particles with. The actual speed will vary uniformnly between the min and max values.

``flatSpread`` (Default 0)
    The flat spread angle about the target direction to emit particles in. `Math.PI` radians would specify the flat spread is a full circle.

``flatSpreadAngle`` (Default 0)
    The angle of the flat spread about the target direction, varying this parameter rotates the entire spread about the target direction (Example; if target direction is in direction of x-axis, then varying this parameter would allow selection of a horizontal or vertically orientated flat spread).

``flatSpreadDistribution`` (Default `"uniform"`)
    The distribution to use when selecting angles into the flat spread.

    * `"uniform"`
        A uniform distribution.
    * `"normal"`
        A normal distribution.

``flatSpreadSigma`` (Default `0.25`)
    The `sigma` parameter of the normal distribution.

``conicalSpread`` (Default 0)
    The conical spread angle about the target direction to emit particles in. `Math.PI` radians would specify the conical spread is a full sphere.

``conicalSpreadDistribution`` (Default `"uniform"`)
    The distribution to use when selecting angles into the conical spread.

    * `"uniform"`
        A uniform distribution.
    * `"normal"`
        A normal distribution.

``conicalSpreadSigma`` (Default `0.25`)
    The `sigma` parameter of the normal distribution.

