.. index::
    single: Material

.. highlight:: javascript

.. _material:

-------------------
The Material Object
-------------------

The Material object defines the appearance of a rendered object.
It has a :ref:`TechniqueParameters <techniqueparameters>` property and a meta property for additional information used by the renderers.

**Required scripts**

The Material object requires::

    /*{{ javascript("jslib/material.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/


Constructor
===========

.. index::
    pair: Material; create

`create`
--------

**Summary**

Creates and returns a Material object.

**Syntax** ::

    var material = Material.create(graphicsDevice);

``graphicsDevice``
    The GraphicsDevice object to be used.

Methods
=======

.. index::
    pair: Material; clone

.. _material_clone:

`clone`
-------

**Summary**

Create a clone of the material.

**Syntax** ::

    var clonedMaterial = originalMaterial.clone(graphicsDevice);
    clonedMaterial.techniqueParameters.materialColor = mathDevice.v4Build(1.0, 0.0, 0.0. 1.0);

``graphicsDevice``
    The GraphicsDevice object to be used.

Returns a :ref:`Material <material>` object.


.. index::
    pair: Material; getName

`getName`
---------

**Summary**

Gets the name of the material.

**Syntax** ::

    var name = Material.getName();

.. index::
    pair: Material; getName


Properties
==========

.. index::
    pair: Material; techniqueParameters

.. _material_techniqueParameters:

`techniqueParameters`
---------------------

**Summary**

The :ref:`TechniqueParameters <techniqueparameters>` object.

**Syntax** ::

    material.techniqueParameters.materialColor = color;

.. index::
    pair: Material; meta

`meta`
------

**Summary**

The meta object. See the rendering documentation for valid values.

    * :ref:`DefaultRending meta <defaultrendering_meta>`
    * :ref:`ForwardRending meta <forwardrendering_meta>`
    * :ref:`DeferredRending meta <deferredrendering_meta>`

**Syntax** ::

    material.meta.transparent = true;
