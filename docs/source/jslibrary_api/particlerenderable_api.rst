.. index::
    single: ParticleRenderable

.. highlight:: javascript

.. _particlerenderable:

=============================
The ParticleRenderable Object
=============================

**Added SDK 0.28.0**

The `ParticleRenderable` object is used to provide the necessary glue between a :ref:`ParticleSystem <particlesystem>` and a :ref:`Scene <scene>`.
The object provides a necessary subset of the :ref:`Renderable <renderable>` interface required to include :ref:`ParticleSystems <particlesystem>` into a :ref:`Scene <scene>` with minimal effort.

The `ParticleRenderable` will be assigned a :ref:`ParticleSystem <particlesystem>` to be rendered, and will manage the creation and deletion of :ref:`ParticleViews <particleview>` for each unique :ref:`Camera <camera>` instance used to render a :ref:`Scene <scene>`.
The `ParticleRenderable` will take part in the :ref:`Scenes <scene>` culling, and as a by-product of the scene being rendered will the :ref:`ParticleSystem <particlesystem>`'s `sync` method be called so that only visible :ref:`ParticleSystems <particlesystem>` will ever be updated.

The `ParticleRenderable` exposes an API which permits :ref:`ParticleSystems <particlesystem>` to be lazily allocated when the renderable is first rendered so that effects may be created all around a :ref:`Scene <scene>`, with those that have never become visible existing purely as an empty renderable in in the world.
A similar API permits lazy allocation of :ref:`ParticleViews <particleview>` instead of always creating a new :ref:`ParticleView <particleview>` so that pooling of :ref:`ParticleViews <particleview>` may also be achieved.

**Renderable API not supported by ParticleRenderable**

* Custom world extents (addCustomWorldExtents, getCustomWorldExtents, removeCustomWorldExtents)
* Cloning (clone)
* Custom Materials (setMaterial)

Additionaly, it is assumed that a `ParticleRenderable` should also be used as a `transparent` renderable, being sorted along side other transparent renderables in a :ref:`Scene <scene>`.

**Transformation**

A `ParticleRenderable` has its own local transform.
If the renderable has `fixedOrientation` true, then the rotational and scaling components of any parent transforms are used only to compute the world position for the renderable, enforcing that only the rotation and scaling defined on the renderables local transform are used.
If `fixedOrientation` is false, then a simple multiplication with the parent transform will be performed.

.. note::
    This is a low-level particle system API.

Methods
=======

.. index::
    pair: ParticleRenderable; create

`create`
--------

**Summary**

Create a new `ParticleRenderable`

**Syntax** ::

    var renderable = ParticleRenderable.create({
        graphicsDevice: graphicsDevice,
        passIndex: renderer.passIndex.transparent,
        system: particleSystem,
        sharedRenderContext: sharedRenderContext
    });

``graphicsDevice``
    The :ref:`GraphicsDevice <graphicsdevice>` object.

``passIndex``
    The `transparent` pass index of whatever `Renderer` is being used.

``system`` (Optional)
    The :ref:`ParticleSystem <particlesystem>` to be rendered. If this field is not supplied, it is assumed that `setSystem` or `setLazySystem` will be called at some point before the renderable is actually added to a :ref:`Scene <scene>`.

``sharedRenderContext`` (Optional)
    The :ref:`SharedRenderContext <sharedrendercontext>` to be used whenever the `ParticleRenderable` is responsible for creating new :ref:`ParticleView <particleview>` objects. Note that the restrictions regarding `SharedRenderContexts` being shared between systems and views applies equally to systems and renderables as this context is simply passed forwards to the view constructor.

.. index::
    pair: ParticleRenderable; setSystem

`setSystem`
-----------

**Summary**

Set the :ref:`ParticleSystem <particlesystem>` to be rendered by this renderable. This method should not be used whilst the renderable is inside a :ref:`Scene <scene>`.

**Syntax** ::

    renderable.setSystem(system);

``system``
    The :ref:`ParticleSystem <particlesystem>` to be rendered, setting to null is permissable in which case it is assumed that either another non-null system will be assigned, or `setLazySystem` called before the renderable is added to a :ref:`Scene <scene>`.

.. index::
    pair: ParticleRenderable; setLazySystem

`setLazySystem`
---------------

**Summary**

Assign a callback function to be used when the renderable is first made visible to assign a :ref:`ParticleSystem <particlesystem>` to be rendered from that point on.

**Syntax** ::

    renderable.setLazySystem(systemCallback, center, halfExtents);

``systemCallback``
    The function to be called to allocate a :ref:`ParticleSystem <particlesystem>` when renderable is first made visible. This function must return a valid :ref:`ParticleSystem <particlesystem>`.

    Setting the callback to `null` is permitted, but it is assumed that a non-null system or callback will be defined for the renderable before it is added to a :ref:`Scene <scene>`.

``center``
    The center in local-coordinates of the :ref:`ParticleSystem <particlesystem>` extents which will be later assigned to the renderable. This is required to enable proper visibility testing of the renderable.

``halfExtents``
    The half-extents in local-coordinates of the :ref:`ParticleSystem <particlesystem>` which will be later assigned to the renderable. This is required to enable proper visibility testing of the renderable.

.. index::
    pair: ParticleRenderable; setLazyView

`setLazyView`
-------------

**Summary**

Assign a callback function to be used when a new (or first) :ref:`Camera <camera>` instance makes visible the renderable for the first time to enable pooling of :ref:`ParticleView <particleview>` objects.

If no lazy view callback is assigned, then the renderable will allocate a new view itself.

**Syntax** ::

    renderable.setLazyView(viewCallback);

``viewCallback``
    The function to be called to allocate a :ref:`ParticleView <particleview>` when a new :ref:`Camera <camera>` makes visible the renderable for the first time.

    This function is permitted to return `null`, in which case a new :ref:`ParticleView <particleview>` will be allocated.

    This callback may also be re-set to `null` via this method.

.. index::
    pair: ParticleRenderable; recycle

`releaseViews`
--------------

**Summary**

Remove all :ref:`ParticleViews <particleview>` from the renderable, invoking the provided callback for each view to enable pooling when a `ParticleRenderable` is removed from a :ref:`Scene <scene>`.

**Syntax** ::

    renderable.releaseViews(function (view)
        {
            ...
        });

``recycleView`` (Optional)
    Callback called for each :ref:`ParticleView <particleview>` removed from the renderable.

    If callback is not specified, then the :ref:`ParticleView <particleview>` objects will instead be `destroyed`.

.. index::
    pair: ParticleRenderable; destroy

`destroy`
---------

**Summary**

Destroy the renderable, rendering it invalid for future use, and destroying any remaining :ref:`ParticleViews <particleview>` assigned to it.

**Syntax** ::

    renderable.destroy();

.. index::
    pair: ParticleRenderable; setFixedOrientation

`setFixedOrientation`
---------------------

**Summary**

Set the `fixedOrientation` flag on this renderable.

**Syntax** ::

    renderable.setFixedOrientation(true);

.. index::
    pair: ParticleRenderable; setLocalTransform

`setLocalTransform`
-------------------

**Summary**

Set the `localTransform` field on this renderable. If changes are made directly to the renderables `localTransform`, this function must still be called to enact the necessary side-effects.

**Syntax** ::

    renderable.setLocalTransform(transform);

``transform`` (Optional)

    If argument is unspecified, it is assumed that direct modifications were made to the local transform. Otherwise the provided :ref:`Matrix43 <m43object>` transform will first be copied to the renderables local transform.

Properties
==========

.. index::
    pair: ParticleRenderable; system

`system`
--------

**Summary**

The currently bound :ref:`ParticleSystem <particlesystem>` for this renderable. To modify this field use the `setSystem` or `setLazySystem` methods.

.. note :: Read Only

.. index::
    pair; ParticleRenderable; fixedOrientation

`fixedOrientation`
------------------

**Summary**

Fixed orientation flag of this renderable. To modify this flag use the `setFixedOrientation` method.

.. note :: Read Only

.. index::
    pair: ParticleRenderable; localTransform

`localTransform`
----------------

**Summary**

The local transform :ref:`Matrix43 <m43object>` of this renderable. If modifications are made to this field, you must ensure `setLocalTransform` method is still called to enact the necessary side effects.
