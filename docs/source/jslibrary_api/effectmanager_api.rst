.. index::
    single: EffectManager

.. highlight:: javascript

.. _effectmanager:

-------------------------
The EffectManager Object
-------------------------

Provides management of the :ref:`Effect <effect>` objects used by the :ref:`Scene <scene>` objects.

This object keeps a map of requested Effects by name in order to avoid duplicates.
It also provides support for a default Effect for those cases where the required one is missing by using the map() function.

**Required scripts**

The EffectManager object requires::

    /*{{ javascript("jslib/effectmanager.js") }}*/

.. _effectmanager_effectregistration:

Registering an Effect
=====================

The renderers supply many default Effects for skinned and rigid geometry types. These can be extended by adding a new :ref:`geometryType <renderable_geometrytype>` to an existing Effect or by registering a new Effect.

::

    effect = Effect.create("mycustomeffect");
    effectManager.add(effect);

    effectTypeData = {  prepare : myPrepareFn,
                        shaderName : "shaders/myshader.cgfx",
                        techniqueName : "mycustomeffect",
                        update : myUpdateFn };

    effect.add("rigid", effectTypeData);


.. highlight:: javascript


Constructor
===========

.. index::
    pair: EffectManager; create

`create`
--------

**Summary**

**Syntax** ::

    var effectManager = EffectManager.create();

Method
======

.. index::
    pair: EffectManager; add

`add`
-----

**Summary**

Add an :ref:`Effect <effect>` to the EffectManager dictionary using the Effect.name.

**Syntax** ::

    effectManager.add(effect);

``effect``
    The the Effect to add.

.. index::
    pair: EffectManager; remove

`remove`
--------

**Summary**

Deletes the :ref:`Effect <effect>` stored with the given name.

**Syntax** ::

    effectManager.remove(name);

``name``
    The name of the effect to remove.


.. index::
    pair: EffectManager; get

`get`
-----

**Summary**

Returns the :ref:`Effect <effect>` stored with the given name.

**Syntax** ::

    var effect = effectManager.get(name);

``name``
    The name of the effect to get.

Returns an :ref:`Effect <effect>` object. The "default" effect if the required one is missing.

.. index::
    pair: EffectManager; map

.. _effectmanager_map:

`map`
-----

**Summary**

Alias one :ref:`Effect <effect>` to another name.

During construction the renderers use the map() to set a "default" effect to "blinn". This can be overridden at a later stage using effectManager.map("default", yourEffectName).

**Syntax** ::

    effectManager.map(alias, name);

``name``
    The name to be mapped.

``alias``
    The new alias for ``name``.


Properties
==========

.. index::
    pair: EffectManager; version

`version`
---------

**Summary**

The version number of the EffectManager implementation.

**Syntax** ::

    var versionNumber = effectManager.version;
