.. index::
    single: PostEffects

.. highlight:: javascript

.. _posteffects:

----------------------
The PostEffects Object
----------------------

Provides a set of post effects shaders and materials that can be used with the DeferredRendering and ForwardRendering objects.

Currently it provides the following simple effects:

* `copy`: simple pass-through effect.
* `fadein`: interpolates the source texture color with a fade-in color value.
* `modulate`: modulates the source texture color with a modulate color value.
* `blend`: blends source texture color with destination based on alpha value.
* `bicolor`: interpolates between to given colors based on the luminance of the source texture color.

See :ref:`ForwardRendering.draw <forwardrendering_draw>` and :ref:`DeferredRendering.draw <deferredrendering_draw>` for how to use post effects.

**Required scripts**

The PostEffects object requires::

    /*{{ javascript("jslib/posteffects.js") }}*/

Constructor
===========

.. index::
    pair: PostEffects; create

`create`
--------

**Summary**

**Syntax** ::

    var postEffects = PostEffects.create(graphicsDevice, shaderManager);

``graphicsDevice``
    The GraphicsDevice object used to create shaders and materials required by the effects.

``shaderManager``
    The ShaderManager object used to load the shaders required by the effects.


Method
======


.. index::
    pair: PostEffects; updateShader

`updateShader`
--------------

**Summary**

Updates the shaders used for the effects.

**Syntax** ::

    postEffects.updateShader(shaderManager);

``shaderManager``
    The ShaderManager object used to load the required shaders.

If the required shaders were not ready when the renderer was created this method can be used to update them.


.. index::
    pair: PostEffects; getEffectSetupCB

`getEffectSetupCB`
------------------

**Summary**

Returns the effect setup callback for the requested effect.

**Syntax** ::

    postEffects.getEffectSetupCB(name);

``name``
    The name of the effect whose setup callback is requested.

This setup callback can be passed as the `postFXsetupFn` parameter on the DeferredRendering `draw` method.


.. index::
    pair: PostEffects; destroy

`destroy`
---------

**Summary**

Releases the PostEffects object and all the resources it allocated.

**Syntax** ::

    postEffects.destroy();


Properties
==========

.. index::
    pair: PostEffects; version

`version`
---------

**Summary**

The version number of the PostEffects implementation.

**Syntax** ::

    var versionNumber = postEffects.version;
