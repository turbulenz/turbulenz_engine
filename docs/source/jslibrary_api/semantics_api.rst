.. index::
    single: Semantics

.. _semantics:

--------------------
The Semantics Object
--------------------

.. highlight:: javascript

A Semantics object is an optimal container for vertex attributes semantic information and
it is required for setting streams or for inline geometry drawing.

This object behaves as a JavaScript array, after its creation you can iterate over its elements
and modify them directly as with any other array::

    // create Semantics object
    var semantics = graphicsDevice.createSemantics([graphicsDevice.SEMANTIC_POSITION,
                                        graphicsDevice.SEMANTIC_NORMAL]);

    // print the raw semantic values
    var numSemantics = semantics.length;
    for (var n = 0; n < numSemantics; n += 1)
    {
        console.log(semantics[n]);
    }

    // Append a new one
    semantics[semantics.length] = graphicsDevice.SEMANTIC_TEXCOORD;

You can find a list of supported semantics here :ref:`graphicsDevice.SEMANTIC_ <graphicsDevice_SEMANTIC>`.

Properties
==========

.. index::
    pair: Semantics; length

`length`
--------

**Summary**

Number of semantics stored on the Semantics object.

**Syntax** ::

    var numSemantics = semantics.length;
