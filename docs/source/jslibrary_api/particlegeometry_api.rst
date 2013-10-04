.. index::
    single: ParticleGeometry

.. highlight:: javascript

.. _particlegeometry:

===========================
The ParticleGeometry Object
===========================

Represents the geometry used to render a particle system.

Methods
=======

.. index::
    pair: ParticleGeometry; create

`create`
--------

**Summary**

Create a new `ParticleGeometry` object.

**Syntax** ::

    // Creating particle geometry for the default renderer
    //
    // Geometry is a single quad rendered as 2 GL_TRIANGLES where the indices in the template correspond to which vertex of the quad is being rendered.
    // The default render shader expects a float2 as vertex data input, hence the choice of attributes
    // And it expectes that float2 to be a TEXCOORD.
    var geometry = ParticleGeometry.create({
        graphicsDevice: graphicsDevice,
        maxParticles: 1024,
        template: [0, null,  1, null,  2, null,
                   0, null,  2, null,  3, null],
        attributes: [graphicsDevice.VERTEXFORMAT_USHORT2],
        stride: 2,
        semantics: graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_TEXCOORD]),
        primitive: graphicsDevice.PRIMITIVE_TRIANGLES,
        shared: true
    });

``graphicsDevice``
    `GraphicsDevice` object to construct `VertexBuffer` data.

``maxParticles``
    The maximum amount of particles that will be renderable with the resultant geometry.

``template``
    The template defines the geometry for a single particle, where `null` will be replaced by the particle index `[0,maxParticles)`.

    The vertex buffer data is restricted to a `Uint16Array`, so any data associated with a vertex must be compatible.

``attributes``
    Vertex formats of the particle geometry.

``stride``
    The vertex stride of the geometry.

``semantics``
    The `Semantics` object for rendering the geometry.

``primtive`` (Optional)
    The `GraphicsDevice` primitive type for rendering the geometry, by default this is `graphicsDevice.PRIMITIVE_TRIANGLES`.

``shared`` (Optional)
    Whether this geometry is shared. If geometry is not shared (Default), then when a `ParticleSystem` using this geometry is destroyed, the geometry will also be destroyed.

Returns a `ParticleGeometry` object.

.. index::
    pair: ParticleGeometry; destroy

`destroy`
---------

**Summary**

Release memory used by geometry instance. This should only be called on shared geometry instances when you are sure that they are no longer in use. For un-shared geometries, the `ParticleSystem` using the geometry is responsible for calling `destroy` on the geometry when it is destroyed itself.

**Syntax** ::

    geometry.destroy();

Properties
==========

.. index::
    pair: ParticleGeometry; maxParticles

`maxParticles`
--------------

The maximum amount of particles renderable with this geometry.

.. note :: Read Only

.. index::
    pair: ParticleGeometry; shared

`shared`
--------

Whether this geometry instance is shared.

.. note :: Read Only


