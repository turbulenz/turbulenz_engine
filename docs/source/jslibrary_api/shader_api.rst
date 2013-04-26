.. index::
    single: Shader

.. highlight:: javascript

.. _shader:

-----------------
The Shader Object
-----------------

A Shader object is a container of shading techniques.

Constructor
===========

A Shader object can be constructed with the :ref:`GraphicsDevice.createShader <graphicsdevice_createshader>` function.

Methods
=======

.. index::
    pair: Shader; getTechnique

.. _gettechnique:

`getTechnique`
--------------

**Summary**

Returns the requested shader technique.

**Syntax** ::

    var techniqueByName = shader.getTechnique('blinn');
    var techniqueByIndex = shader.getTechnique(1);

Returns a :ref:`Technique <technique>` object.
Techniques can be requested by name or by index from zero to ``shader.numTechniques`` minus one.
Returns a Technique object if the requested name or index exists, null otherwise.
It is recommended to request techniques once at loading time and to store them somewhere else
rather than to request them continuously.


.. index::
    pair: Shader; getParameter

`getParameter`
--------------

**Summary**

Returns the requested shader parameter information.

**Syntax** ::

    var parameterInfoByName = shader.getParameter('lightColor');
    var parameterInfoByIndex = shader.getParameter(1);

    var parameterName = parameterInfoByIndex.name;
    var parameterType = parameterInfoByIndex.type;
    var parameterNumRows = parameterInfoByIndex.rows;
    var parameterNumColumns = parameterInfoByIndex.columns;

Parameters can be requested by name or by index from zero to ``shader.numParameters`` minus one.

Returns a shader parameter information object if the requested name or index exists, null otherwise.


.. index::
    pair: Shader; destroy

`destroy`
---------

**Summary**

Releases the Shader resources, the object will be invalid after the method is called.

**Syntax** ::

    shader.destroy();


Properties
==========

.. index::
    pair: Shader; name

`name`
------

**Summary**

The name of the shader object,
usually the path to the CgFX file that originated the shader definition used to create the shader.

**Syntax** ::

    var shaderName = shader.name;

.. note:: Read Only


.. index::
    pair: Shader; numTechniques

`numTechniques`
---------------

**Summary**

The number of shading techniques contained on the Shader object.

**Syntax** ::

    var numTechniquesShader = shader.numTechniques;

.. note:: Read Only


.. index::
    pair: Shader; numParameters

`numParameters`
---------------

**Summary**

The number of shading parameters used by the techniques on the Shader object.

**Syntax** ::

    var numParametersShader = shader.numParameters;

.. note:: Read Only

.. index::
    single: Technique

.. _technique:

--------------------
The Technique Object
--------------------

A shading technique.
This object is required to perform any geometry rendering.

Common Properties
=================

.. index::
    pair: Technique; name

`name`
------

**Summary**

The name of the shading technique.

**Syntax** ::

    var techniqueName = technique.name;

.. note:: Read Only


Shading Properties
==================

Shading techniques require shading parameters to be set before any effective rendering can be done,
for example the vertex program could require the world transformation matrix and the view-projection one,
whilst the fragment program may require a material color or a light position.

This shading properties can be modified by grouping them on a TechniqueParameters object to be set all at once by ``graphicsDevice.setTechniqueParameters``,
or one by one directly on the Technique object.
The later method is recommended only when a handful of properties need to be changed between draw calls, for example::

    graphicsDevice.setTechnique(sharedTechnique);

    graphicsDevice.setTechniqueParameters(sharedTechniqueParameters);

    var renderable, n;
    for (n = 0; n < numRenderables; n += 1)
    {
        renderable = renderables[n];

        sharedTechnique.world = renderable.worldMatrix;

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

Setting a property directly onto a Technique object will cause the plugin to crash if the parameter is unsupported by the Technique.
Be careful of this when debugging shaders as the compiler will remove any unused parameters from Techniques.
