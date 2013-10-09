.. index::
    single: ParticleView

.. highlight:: javascript

.. _particleview:

=======================
The ParticleView Object
=======================

The `ParticleView` object is used to render a view onto a :ref:`ParticleSystem <particlesystem>`. If using the :ref:`ParticleRenderable <particlerenderable>` object, then views will be created automatically.

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
    The :ref:`GraphicsDevice <graphicsdevice>` object.

``sharedRenderContext`` (Optional)
    A :ref:`SharedRenderContext <sharedrendercontext>` object from which to allocate texture regions for particle mapping tables on the GPU when viewing a z-sorted system.
    If unspecified then a per-view set of textures and render targets will be created instead if required, and destroyed along with the view.
    Otherwise on destruction of the view the allocated region will be released back to the shared render context.

    If the system is not z-sorted, then no textures will be required for a ParticleView and you need not set a shared render context either.

``system`` (Optional)
    The :ref:`ParticleSystem <particlesystem>` to be viewed. Setting of this system may be deferred till later, or changed at any time in the future.

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

Set the :ref:`ParticleSystem <particlesystem>` to be rendered by this view.

This will be called automatically if using a :ref:`ParticleRenderable <particlerenderable>`.

**Syntax** ::

    view.setSystem(system);

``system``
    The :ref:`ParticleSystem <particlesystem>` to be viewed. This may be `null`, though you should not attempt to use a `ParticleView` for rendering when it does reference a :ref:`ParticleSystem <particlesystem>`.

.. index::
    pair: ParticleView; update

`update`
--------

**Summary**

Update the view onto the current :ref:`ParticleSystem <particlesystem>`.

This will be called automatically if using a :ref:`ParticleRenderable <particlerenderable>`.

**Syntax** ::

    view.update(modelView, projection);

``modelView`` (Optional)
    The modelView :ref:`Matrix43 <m43object>` to use to transform the particle system. If unspecified the modelView matrix will not be changed.

``projection`` (Optional)
    The projection :ref:`Matrix44 <m44object>` to use for rendering the system. If unspecified the projection will not be changed.

.. index::
    pair: ParticleView; render

`render`
--------

**Summary**

Render the view onto the current system to the screen.

This will be called automatically if using a :ref:`ParticleRenderable <particlerenderable>`.

**Syntax** ::

    view.render();


Properties
==========

.. index::
    pair: ParticleView; system

`system`
--------

**Summary**

The currently bound :ref:`ParticleSystem <particlesystem>`

.. note :: Read Only

