.. index::
    single: ParticleSynchronizer

.. highlight:: javascript

.. _particlesynchronizer:

==================================
The ParticleSynchronizer Interface
==================================

**Added SDK 0.28.0**

Represents how a particle system is synchronized, including emitting new particles.

.. note::
    This is a low-level particle system API.

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
    pair: ParticleSynchronizer; addEmitter

`addEmitter`
------------

**Summary**

Add a :ref:`ParticleEmitter <particleemitter>` to the synchronizer.

**Syntax** ::

    synchronizer.addEmitter(emitter);

.. index::
    pair: ParticleSynchronizer; removeEmitter

`removeEmitter`
---------------

**Summary**

Remove a :ref:`ParticleEmitter <particleemitter>` from the synchronizer.

**Syntax** ::

    synchronizer.removeEmitter(emitter);

.. index::
    pair: ParticleSynchronizer; reset

`reset`
-------

**Summary**

Reset synchronizer object, removing all its emitters in the process.

**Syntax** ::

    synchronizer.reset();

.. index::
    pair: ParticleSynchronizer; applyArchetype

`applyArchetype`
----------------

**Summary**

Apply synchronizer specific archetype parameters to this archetype. This is used by the :ref:`ParticleManager <particlemanager>`.

**Syntax** ::

    synchronizer.applyArchetype(archetype);

``archetype``
    The synchronizer specific archetype parameters to be applied.

Properties
==========

.. index::
    pair: ParticleSynchronizer; emitters

`emitters`
----------

**Summary**

Set of :ref:`ParticleEmitters <particleemitter>` added to the synchronizer

.. note :: Read Only

.. index::
    pair: ParticleSynchronizer; renderable

`renderable`
------------

**Summary**

The :ref:`ParticleRenderable <particlerenderable>` to be tracked for formation of particle trails in the system synchronized by this synchronizer.

.. note :: Read Only

.. index::
    single: DefaultParticleSynchronizer

.. _defaultparticlesynchronizer:

The DefaultParticleSynchronizer Object
======================================

An implementation of the :ref:`ParticleSynchronizer <particlesynchronizer>` interface supporting variable or fixed-time step synchronization, with particles emitted by a set of emitter objects supporting a time-ordered event queue for complex emitter effects.

Methods
-------

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
    A fixed time step in seconds to use for particle system updates, if unspecified then a variable time step will be used instead based on elapsed time.

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

    ``recycle``
        A function to be called to recycle an event object when the synchronizer is reset. This will not be called otherwise, and the normal `fun` function should deal with recycling in ordinary circumstances.

.. _defaultparticlesynchronizer_archetype:

Properties
----------

These properties are the same as those parameters supported for a :ref:`ParticleArchetype <particlearchetype>` using this synchronizer unless otherwise specified.

.. index::
    pair: DefaultParticleSynchronizer; fixedTimeStep

`fixedTimeStep`
---------------

The fixed time step to be used for updating the system, this value may be set `null` to move back to a variable time step.

.. index::
    pair: DefaultParticleSynchronizer; maxSubSteps

`maxSubSteps`
-------------

The maximum amount of sub-steps to make when updating the system if using a fixed time step.

.. index::
    pair: DefaultParticleSynchronizer; trailFollow

`trailFollow`
-------------

The number specifying how trails form, with `1` specifying a standard trail, and `0` specifying that already emitted particles will follow the movements of the system without trails forming. Any value is permitted, though values between `0` and `1` are 'expected'.

