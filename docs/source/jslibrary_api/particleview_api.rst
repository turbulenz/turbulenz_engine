.. index::
    single: ParticleView

.. highlight:: javascript

.. _particleview:

=======================
The ParticleView Object
=======================

The `ParticleView` object is used to render a view onto a `ParticleSystem`. If using the `ParticleRenderable` object, then views will be created automatically.

Methods
=======

.. index::
    pair: ParticleView; create

`create`
--------

**Summary**

Create a new `ParticleView`.

**Syntax** ::

    var view = ParticleView.create({
        graphicsDevice: graphicsDevice,
        sharedRenderContext: sharedRenderContext
        system: particleSystem,
    });

``graphicsDevice``
    The `GraphicsDevice` object.

``sharedRenderContext`` (Optional)
    A `SharedRenderContext` object from which to allocate texture regions for particle mapping tables on the GPU when viewing a z-sorted system.
    If unspecified then a per-view set of textures and render targets will be created instead if required, and destroyed along with the view.
    Otherwise on destruction of the view the allocated region will be released back to the shared render context.

    If the system is not z-sorted, then no textures will be required for a ParticleView and you need not set a shared render context either.

``system`` (Optional)
    The `ParticleSystem` to be viewed. Setting of this system may be deferred till later, or changed at any time in the future.

.. note :: The same SharedRenderContext cannot be used for both a ParticleSystem, and a view onto that system as this would involve both reading from, and writing to the same Texture during sorting on the GPU which is not possible.

.. index::
    pair; ParticleView; destroy

`destroy`
---------

**Summary**

Destroy this view, the view cannot be used following this call.

**Syntax** ::

    view.destroy();

.. index::
    pair: ParticleView; setSystem

`setSystem`
-----------

**Summary**

Set the `ParticleSystem` to be rendered by this view.

This will be called automatically if using a `ParticleRenderable`.

**Syntax** ::

    view.setSystem(system);

``system``
    The `ParticleSystem` to be viewed. This may be `null`, though you should not attempt to use a `ParticleView` for rendering when it does reference a `ParticleSystem`.

.. index::
    pair: ParticleView; update

`update`
--------

**Summary**

Update the view onto the current `ParticleSystem`.

This will be called automatically if using a `ParticleRenderable`.

**Syntax** ::

    view.update(modelView, projection);

``modelView`` (Optional)
    The modelView `Matrix43` to use to transform the particle system. If unspecified the modelView matrix will not be changed.

``projection`` (Optional)
    The projection `Matrix44` to use for rendering the system. If unspecified the projection will not be changed.

.. index::
    pair: ParticleView; render

`render`
--------

**Summary**

Render the view onto the current system to the screen.

This will be called automatically if using a `ParticleRenderable`.

**Syntax** ::

    view.render();


Properties
==========

.. index::
    pair: ParticleView; system

`system`
--------

**Summary**

The currently bound `ParticleSystem`

.. note :: Read Only

