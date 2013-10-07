.. index::
    single: ParticleRenderable

.. highlight:: javascript

.. _particlerenderable:

=============================
The ParticleRenderable Object
=============================

The `ParticleRenderable` object is used to provide the necessary glue between a `ParticleSystem` and a `Scene`.
The object provides a necessary subset of the `Renderable` interface required to include `ParticleSystems` into a `Scene` with minimal effort.

The `ParticleRenderable` will be assigned a `ParticleSystem` to be rendered, and will manage the creation and deletion of `ParticleViews` for each unique `Camera` instance used to render a `Scene`.
The `ParticleRenderable` will take part in the `Scenes` culling, and as a by-product of the scene being rendered will the `ParticleSystem`'s `sync` method be called so that only visible `ParticleSystems` will ever be updated.

The `ParticleRenderable` exposes an API which permits `ParticleSystems` to be lazily allocated when the renderable is first rendered so that effects may be created all around a `Scene`, with those that have never become visible existing purely as an empty renderable in in the world.
A similar API permits lazy allocation of `ParticleViews` instead of always creating a new `ParticleView` so that pooling of `ParticleViews` may also be achieved.

The `ParticleManager` object can be used in conjuction to enable clean up of short-lived effects that exist off-screen so that renderables do not pile up off-screen waiting to become visible that they may die.

**Renderable API not supported by ParticleRenderable**

* Custom world extents (addCustomWorldExtents, getCustomWorldExtents, removeCustomWorldExtents)
* Cloning (clone)
* Custom Materials (setMaterial)

Additional, it is assumed that a `ParticleRenderable` should also be used as a `transparent` renderable, being sorted along side other transparent renderables in a `Scene`.

Methods
=======

.. index::
    pair: ParticleRenderable; create

`create`
````````

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
    The `GraphicsDevice` object.

``passIndex``
    The `transparent` pass index of whatever `Renderer` is being used.

``system`` (Optional)
    The `ParticleSystem` to be rendered. If this field is not supplied, it is assumed that `setSystem` or `setLazySystem` will be called at some point before the renderable is actually added to a `Scene`.

``sharedRenderContext`` (Optional)
    The `SharedRenderContext` to be used whenever the `ParticleRenderable` is responsible for creating new `ParticleView` objects. Note that the restrictions regarding `SharedRenderContexts` being shared between systems and views applies equally to systems and renderables as this context is simply passed forwards to the view constructor.

.. index::
    pair: ParticleRenderable; setSystem

`setSystem`
-----------

**Summary**

Set the `ParticleSystem` to be rendered by this renderable. This method should not be used whilst the renderable is inside a `Scene`.

This call will override any previous calls to `setSystem` or `setLazySystem`.

**Syntax** ::

    renderable.setSystem(system);

``system``
    The `ParticleSystem` to be rendered, setting to null is permissable in which case it is assumed that either another non-null system will be assigned, or `setLazySystem` called before the renderable is added to a `Scene`.

.. index::
    pair: ParticleRenderable; setLazySystem

`setLazySystem`
---------------

**Summary**

Assign a callback function to be used when the renderable is first made visible to assign a `ParticleSystem` to be rendered from that point on.

This call will override any previous calls to `setSystem` or `setLazySystem`.

**Syntax** ::

    renderable.setLazySystem(systemCallback, center, halfExtents);

``systemCallback``
    The function to be called to allocate a `ParticleSystem` when renderable is first made visible. This function must return a valid `ParticleSystem`.

    Setting the callback to `null` is permitted, but it is assumed that a non-null system or callback will be defined for the renderable before it is added to a `Scene`.

``center``
    The center in local-coordinates of the `ParticleSystem` extents which will be later assigned to the renderable. This is required to enable proper visibility testing of the renderable.

``halfExtents``
    The half-extents in local-coordinates of the `ParticleSystem` which will be later assigned to the renderable. This is required to enable proper visibility testing of the renderable.

.. index::
    pair: ParticleRenderable; setLazyView

`setLazyView`
-------------

**Summary**

Assign a callback function to be used when a new (or first) `Camera` instance makes visible the renderable for the first time to enable pooling of `ParticleView` objects.

If no lazy view callback is assigned, then the renderable will allocate a new view itself.

**Syntax** ::

    renderable.setLazyView(viewCallback);

``viewCallback``
    The function to be called to allocate a `ParticleView` when a new `Camera` makes visible the renderable for the first time.

    This function is permitted to return `null`, in which case a new `ParticleView` will be allocated.

    This callback may also be re-set to `null` via this method.

.. index::
    pair: ParticleRenderable; recycle

`releaseViews`
--------------

**Summary**

Remove all `ParticleViews` from the renderable, invoking the provided callback for each view to enable pooling when a `ParticleRenderable` is removed from a `Scene`.

**Syntax** ::

    renderable.releaseViews(function (view)
        {
            ...
        });

``recycleView`` (Optional)
    Callback called for each `ParticleView` removed from the renderable.

    If callback is not specified, then the `ParticleView` objects will instead be `destroyed`.

`destroy`
---------

**Summary**

Destroy the renderable, rendering it invalid for future use, and destroying any remaining `ParticleViews` assigned to it.

**Syntax** ::

    renderable.destroy();
