.. index::
    single: ParticleManager

.. highlight:: javascript

.. _particlemanager:

==========================
The ParticleManager Object
==========================

The ParticleManager is used to create and manage GPU based particle systems.

The ParticleManager is data-driven, with particle systems represented entirely by an easily serializable :ref:`ParticleArchetype <particlearchetype>` object:

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
    pair: ParticleManager; computeAnimationLifeTime

`computeAnimationLifeTime`
--------------------------

**Summary**

Compute the amount of time covered by the given particle animation.

**Syntax** ::

    var lifeTime = manager.computeAnimationLifeTime(particleAnimationName);

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

.. note :: This call must be made between calls to graphicsDevice.beginFrame() and graphicsDevice.endFrame() to guarantee correct execution.

**Syntax** ::

    var instance = manager.createInstance(archetype, timeout);

``archetype``
    The pre-loaded archetype to create instance from.

``timeout`` (Optional)
    The amount of time this instance should exist for. Once this amount of time has passed, the instance will be automatically removed from the scene if necessary, and recycled.

    This parameter should be specified for the creation of short-lived effects, making use of an internal optimized data structure for handling large numbers of short-lived effects in conjunction with the updates of the manager.

.. index::
    pair: ParticleManager; destroyInstance

`destroyInstance`
-----------------

**Summary**

Destroy a :ref:`ParticleInstance <particleinstance>`, removing it from the scene and releasing it for re-use by another instantiation of the same archetype.

**Syntax** ::

    manager.destroyInstance(instance);

.. index::
    pair: ParticleManager; clear

`clear`
-------

**Summary**

Destroy every instance associated with the particle manager.

**Syntax** ::

    manager.clear();

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

`parseArchetype`
---------------------

**Summary**

Parse a given archetype into a fully prepared object for use in manager, this allows an archetype to be specified with only those fields that are not equal to the defaults.

**Syntax** ::

    var archetype = manager.parseArchetype(delta);

``archetype``
    The archetype object to be parsed.

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

Deserializes an archetype from its compressed JSON representation, this method will parse the object delta of the archetype into a fully prepared archetype object for use in the manager.

**Syntax** ::

    var archetype = manager.deserializeArchetype(jsonString);

.. index::
    pair: ParticleManager; gatherMetrics

`gatherMetrics`
---------------

**Summary**

Gather metrics regarding the state of the particle manager and its memory usage.

**Syntax** ::

    var metrics = manager.gatherMetrics(archetype);

``archetype`` (Optional)
    If an archetype is provided, then only metrics regarding instances of that particular archetype will be gathered.

The return object has fields:

`(If no archetype was provided)`
 * numInitializedArchetypes
 * numPooledViews
 * numPooledSynchronizers
 * numPooledEmitters

`(Always present on object)`
 * numPooledSystems
 * numPooledInstances
 * numActiveInstances: `number of ParticleInstances that are actively being updated and rendered (Are currently visible).`
 * numAllocatedInstances: `number of ParticleInstances that have had systems and views allocated, and occupy space on the CPU and GPU (Have been visible at least once).`
 * numInstances: `number of ParticleInstances that are alive as part of the Scene.`

The total number of `ParticleInstances` created is the sum of `numInstances` and `numPooledInstances`. `numAllocatedInstances` is always less than or equal to `numInstances`, and `numActiveInstances` is always less than or equal to `numAllocatedInstances`.

.. index::
    pair: ParticleManager; gatherInstanceMetrics

`gatherInstanceMetrics`
-----------------------

**Summary**

Gather metrics about individual :ref:`ParticleInstances <particleinstances>`.

**Syntax** ::

    var metrics = manager.gatherInstanceMetrics(archetype);

``archetype`` (Optional)
    If an archetype is provided, then only instances of that archetype will be gathered by this call.

The return value is an array of objects having the following fields:

``instance``
    The :ref:`ParticleInstance <particleinstance>` this metric object relates to.

``allocated``
    Whether this instance has been allocated a particle system and views, and occupies space on the CPU and GPU beyond its emitters and synchronizer.

``active``
    Whether this instance is actively being updated and rendered.

If an instance is `active`, then it is also `allocated`.

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

**Summary**

The :ref:`ParticleRenderable <particlerenderable>` created for this instance. This property will always be defined, and may be used to move/translate/scale the particle system using the renderable's local-transform.

This renderable should not be added or removed from a :ref:`Scene <scene>` manually. Instead the `addInstanceToScene` and `removeInstanceFromScene` methods of the :ref:`ParticleManager <particlemanager>` should be used.

.. note :: Read Only

.. index::
    pair: ParticleInstance; synchronizer

`synchronizer`
--------------

**Summary**

The :ref:`ParticleSynchronizer <particlesynchronizer>` created for this instance. This property will always be defined, and may be used to add and remove emitters at runtime for a particular instance.

.. note :: Read Only

.. index::
    pair: ParticleInstance; system

`system`
--------

**Summary**

The :ref:`ParticleSystem <particlesystem>` created for this instance.

This system will be lazily allocated when the instance has first become visible, and may never exist at all.

.. note :: Read Only
