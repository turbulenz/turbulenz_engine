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
