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
    The maximum amount of particles that will be renderable with the resultant geometry. Attempts to render more than this number of particles will fail.

``template``
    The template defines the geometry for a single particle, where `null` will be replaced by the particle index `[0,maxParticles)`.

    In the above example, assuming `maxParticles = 5` would generate vertex data equivalent to: ::

        [0,0, 1,0, 2,0,  0,0, 2,0, 3,0,
         0,1, 1,1, 2,1,  0,1, 2,1, 3,1,
         0,2, 1,2, 2,2,  0,2, 2,2, 3,2,
         0,3, 1,3, 2,3,  0,3, 2,3, 3,3,
         0,4, 1,4, 2,4,  0,4, 2,4, 3,4]

    The default renderer uses the first integer to determine suitable offsets to the particles position for the 4 quad vertices, whilst the second integer (represented by `null` in the template) represents the index of the particle the vertex corresponds to.

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

.. index::
    pair: ParticleGeometry; resize

`resize`
--------

**Summary**

Resize the geometry object.

**Syntax** ::

    geometry.resize(newMaxParticles);

.. index::
    pair: ParticleGeometry; register

`register`
----------

**Summary**

Register callback handler for when geometry is resized.

**Syntax** ::

    geometry.register(callback);

``callback``

    Function taking no arguments, should handle that `geometry.vertexBuffer` will have been changed to a new object.

.. index::
    pair: ParticleGeometry; unregister

`unregister`
------------

**Summary**

Unregister callback handler.

**Syntax** ::

    geometry.unregister(callback);

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


