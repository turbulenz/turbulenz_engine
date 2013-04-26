.. index::
    single: Material

.. highlight:: javascript

.. _physics2d_material:

===================
The Material Object
===================

Constructor
===========

A material object can be constructed with :ref:`Physics2DDevice.createMaterial <physics2ddevice_creatematerial>`, with a singleton, default material accessibly by :ref:`Physics2DDevice.getDefaultMaterial <physics2ddevice_getdefmat>`.

Methods
=======

.. index::
    pair: Material; getElasticity

`getElasticity`
---------------

**Summary**

Access the elasticity of this material.

**Syntax** ::

    var elasticity = material.getElasticity();

.. index::
    pair: Material; getStaticFriction

`getStaticFriction`
-------------------

**Summary**

Access the coefficient of static friction for this material.

**Syntax** ::

    var elasticity = material.getStaticFriction();

.. index::
    pair: Material; getDynamicFriction

`getDynamicFriction`
--------------------

**Summary**

Access the coefficient of dynamic friction for this material.

**Syntax** ::

    var dynamicFriction = material.getDynamicFriction();

.. index::
    pair: Material; getRollingFriction

`getRollingFriction`
--------------------

**Summary**

Access the coefficient of rolling friction for this material.

**Syntax** ::

    var rollingFriction = material.getRollingFriction();

.. index::
    pair: Material; getDensity

`getDensity`
------------

**Summary**

Access the density of this material.

**Syntax** ::

    var density = material.getDensity();


Properties
==========

.. index::
    pair: Material; userData

`userData`
----------

**Summary**

Field on which to store whatever information you may like.

