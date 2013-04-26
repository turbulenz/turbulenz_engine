.. index::
    single: TechniqueParameters

.. _techniqueparameters:

.. highlight:: javascript

------------------------------
The TechniqueParameters Object
------------------------------

A container for technique properties.

Shading techniques require technique parameters to be set before any effective rendering can be done,
for example the vertex program could require the world transformation matrix and the view-projection one,
whilst the fragment program may require a material color or a light position.

The technique properties can be modified by grouping them on a TechniqueParameters object to be set all at once by ``graphicsDevice.setTechniqueParameters``,
or one by one directly on the Technique object.
The former method is recommended when multiple properties need to be changed between draw calls, for example::

    graphicsDevice.setTechnique(sharedTechnique);

    graphicsDevice.setTechniqueParameters(sharedTechniqueParameters);

    var renderable, n;
    for (n = 0; n < numRenderables; n += 1)
    {
        renderable = renderables[n];

        graphicsDevice.setTechniqueParameters(renderable.instanceTechniqueParameters);

        graphicsDevice.setStream(renderable.vertexBuffer, renderable.semantics);

        graphicsDevice.setIndexBuffer(renderable.indexBuffer);

        graphicsDevice.drawIndexed(renderable.primitive, renderable.numIndices);
    }

The name of the shading property will be the name of the uniform variable used on the shading programs.

Valid types for shading properties are:

    * Numbers
    * Arrays of numbers
        * It is highly recommended to use those created by the MathDevice object.
    * TechniqueParameterBuffer objects
    * Texture objects
    * Booleans

Setting a property value works as with a JavaScript object::

    instanceTechniqueParameters.lightScale = 2.0;
    instanceTechniqueParameters.world = mathDevice.m43BuildIdentity();

Deleting a property from a TechniqueParameters object is done by setting it to ``undefined``::

    instanceTechniqueParameters.lightScale = undefined;

The same TechniqueParameters object may be used with multiple Techniques.

Constructor
===========

A TechniqueParameters object can be constructed with :ref:`GraphicsDevice.createTechniqueParameters <graphicsdevice_createtechniqueparameters>`.
