.. index::
    single: Renderable

.. highlight:: javascript

.. _renderable:

------------------------
The Renderable Interface
------------------------

A Renderable specifies the base interface for rendering using the :ref:`Scene <scene>`.
It has no implementation.
The interface allows both the engine and developers to implement various versions of renderables for different :ref:`geometryTypes <renderable_geometrytype>`.
Any custom renderables will be fully integrated in to the scene and rendering, allowing correct visibility culling, lighting, shadows and sorting.

The engine provides the following implementations:

* :ref:`GeometryInstance <geometryinstance>` for "rigid" and "skinned"

Custom renderables could be implemented for any bespoke requirements such as:

* Particle systems
* Morphs

A :ref:`SceneNode <scenenode>` has a collection of Renderables, either automatically created during loading or via :ref:`SceneNode.addRenderable() <scenenode_addrenderable>`.

To be a valid renderable the below methods and properties are required.

Constructor
===========

.. index::
    pair: Renderable; create

`create`
--------

**Summary**

Creates and returns a Renderable object. This should only be used as a basis for other implementations.

**Syntax** ::

    var renderable = Renderable.create();


Methods
=======

.. index::
    pair: Renderable; clone

`clone`
-------

**Summary**

Creates a Renderable by cloning an existing Renderable. This should be overridden.

**Syntax** ::

    var newRenderable = renderable.clone();

.. index::
    pair: Renderable; getWorldExtents

`getWorldExtents`
-----------------

**Summary**

Get the world extents of the Renderable.

This is only valid when attached to a SceneNode and the node has been updated.

**Syntax** ::

    var extents = renderable.getWorldExtents();

Returns an :ref:`extents <extents>` array.

.. index::
    pair: Renderable; addCustomWorldExtents

`addCustomWorldExtents`
-----------------------

**Summary**

User defined extents that replace the ones calculated from any extents and the SceneNode's world transform.

**Syntax** ::

    var customExtents = renderable.getWorldExtents().slice();
    var padding = 10;
    customExtents[0] -= padding;
    customExtents[1] -= padding;
    customExtents[2] -= padding;
    customExtents[3] += padding;
    customExtents[4] += padding;
    customExtents[5] += padding;
    renderable.addCustomWorldExtents(customExtents);

``customExtents``
    The custom :ref:`extents <extents>` to use instead of the default.

The Renderable must be attached to a SceneNode.
Even if the SceneNode moves the extents will not be recalculated.
This can be used as an optimization for animated objects that are constrained to a location.

`removeCustomWorldExtents`
--------------------------

**Summary**

Remove previously attached custom world extents.

**Syntax** ::

    renderable.removeCustomWorldExtents();

.. index::
    pair: Renderable; getCustomWorldExtents

`getCustomWorldExtents`
-----------------------

**Summary**

Get previously attached world extents. Maybe undefined.


**Syntax** ::

    var extents = renderable.getCustomWorldExtents();

Returns an :ref:`extents <extents>` array.

.. index::
    pair: Renderable; hasCustomWorldExtents

`hasCustomWorldExtents`
-----------------------

**Summary**

Returns a boolean whether the object has custom world extents.

**Syntax** ::

    if (renderable.hasCustomWorldExtents())
    {
        //...
    }


.. index::
    pair: Renderable; getNode

`getNode`
---------

**Summary**

Get the :ref:`SceneNodes <scenenode>` the Renderable is attached to.

**Syntax** ::

    var node = renderable.getNode();

Returns a :ref:`SceneNode <scenenode>`.


.. index::
    pair: Renderable; setMaterial

`setMaterial`
-------------

**Summary**

Set the :ref:`material <material>`.
Set the material.

**Syntax** ::

   renderable.setMaterial(material);

``material``
    :ref:`Material <material>` to set.


.. index::
    pair: renderable; getMaterial

`getMaterial`
-------------

**Summary**

Get the :ref:`material <material>`.

**Syntax** ::

   var material = renderable.getMaterial();

Returns a :ref:`Material <material>`.

.. index::
    pair: Renderable; destroy

`destroy`
---------

**Summary**

Free the resources attached to the object. Renderables attached to a SceneNode are destroyed when it is destroyed.

**Syntax** ::

    renderable.destroy();


Properties
==========

.. index::
    pair: Renderable; drawParameters

`drawParameters`
----------------

**Summary**

An array of :ref:`DrawParameters <drawparameters>`. These are the objects the renders uses to render. Typically the prepare() function registered with the :ref:`Effects <effect>` creates these and they are updated for visible renderables using the renderUpdate() method.
An array of DrawParameters. These are the objects the renders uses to render. Typically the prepare() function registered with the Effects creates these and they are updated for visible renderables using the renderUpdate() method.

**Syntax** ::

    var drawParameters = renderable.drawParameters;

.. index::
    pair: Renderable; diffuseDrawParameters

`diffuseDrawParameters`
-----------------------

*ForwardRender only.*

.. index::
    pair: Renderable; diffuseDrawParameters

**Summary**

An array of :ref:`DrawParameters <drawparameters>` used for the diffuse pass.

**Syntax** ::

    var drawParameters = renderable.diffuseDrawParameters;

.. index::
    pair: Renderable; shadowDrawParameters

`shadowDrawParameters`
-----------------------

*DeferredRender only.*

An array of :ref:`DrawParameters <drawparameters>` used for the shadow pass.

**Syntax** ::

    var drawParameters = renderable.shadowDrawParameters;


.. index::
    pair: Renderable; disabled

`disabled`
----------

**Summary**

A boolean. If its true the object is not rendered.

**Syntax** ::

    renderable.disabled = true;

.. index::
    pair: Renderable; worldExtents

`worldExtents`
--------------

**Summary**

The currently calculated worldExtents.

**Syntax** ::

    var worldExtents = renderable.worldExtents;


.. index::
    pair: Renderable; sharedMaterial

`sharedMaterial`
----------------

**Summary**

The current material of the object.

**Syntax** ::

    var sharedMaterial = renderable.sharedMaterial;


.. index::
    pair: Renderable; geometryType

.. _renderable_geometrytype:

`geometryType`
--------------

**Summary**

A string representing the type of the geometry the renderable generates. This can any custom name and is used to register the type with the :ref:`Effect object <effect>`.

Reserved Names:

* "rigid"
* "skinned"

**Syntax** ::

    myRenderable.geometryType = "mymorph";

.. index::
    pair: Renderable; distance

`distance`
----------

**Summary**

Reserved read only information used by the renderer.

The distance of the renderable from the camera the last time it was visible.

**Syntax** ::

    var distance = renderable.distance;

.. index::
    pair: Renderable; rendererInfo

`rendererInfo`
--------------

**Summary**

Reserved read only information used by the renderer.

**Syntax** ::

    var rendererInfo = renderable.rendererInfo;


.. index::
    pair: Renderable; frameVisible

`frameVisible`
--------------

**Summary**

Reserved read only information used by the renderer.

The last frame the object was visible.

**Syntax** ::

    if (lastFrameVisible !== renderable.frameVisible)
    {
        //...
    }
