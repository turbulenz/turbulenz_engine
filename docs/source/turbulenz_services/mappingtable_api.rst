.. index::
    single: MappingTable

.. highlight:: javascript

.. _mappingtable:

-----------------------
The MappingTable Object
-----------------------

It is recommended that you read the :ref:`creating a mapping table
<creating-a-mapping-table>` section before proceeding.

The MappingTable object allows the Turbulenz Services to control where
your game assets are hosted without requiring changes to your game's
code.  Subsequently, all requests for game assets **must** be made
with a URL received from a :ref:`getURL <mappingtable_geturl>` call.

A mapping table can be created with the
:ref:`TurbulenzServices.createMappingTable
<turbulenzservices_createmappingtable>` method.

**Required scripts**

The ``MappingTable`` object requires::

    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/services/mappingtable.js") }}*/

Mapping Table File Structure
============================

The MappingTable file path is set in the :ref:`local server
<getting_started_local_development_server>`.  It must be in JSON
format with the following structure::

    {
        "version": 1.0,
        "urnmapping":
        {
            "logicalAssetPath1": "physicalAssetPath1",
            "logicalAssetPath2": "physicalAssetPath2",
            ...
            "logicalAssetPathN": "physicalAssetPathN",
        },
        "overrides":    // optional (see below)
        {
            ...
        }
    }

Where ``logicalAssetPath1`` is a string giving the logical path for an
asset and ``physicalAssetPath1`` is the physical path to that asset.
For example the mapping table for the Sample App is::

    {
        "version": 1.0,
        "urnmapping":
        {
            "textures/duck.png": "E91_Ym3MMRjHxq4mvC7qQQ.png",
            "shaders/standard.cgfx": "RVX9ZZ8vsQgi1c18tHQ2fw.json",
            "shaders/debug.cgfx": "IJ_nEyT7jofhyafUf-Opqg.json",
            "models/duck.dae": "-IsFBQM8MlnCoRVwRERq1A.json",
            "shaders/defaultrendering.cgfx": "_fgBTnJyIvZg0VdNYMAGFw.json"
        }
    }

Optionally, the Mapping Table data can contain an ``overrides``
property, used to specify profiles that override the default table
(for example, to automatically load assets of different resolutions
based on hardware capabilities).  The ``overrides`` property must take
the form::

    "overrides"
    {
        "profilename1":
        {
            "urnmapping":
            {
                "logicalAssetPath1": "profile1AssetPath1",
                "logicalAssetPath2": "profile1AssetPath2",
                ...
            },
            "parent": "otherprofilename",   // optional
        },
        "profilename2":
        {
            ...
        },
    }

Each profile can specify just those paths which should be overriden.
If a given URL is not found in the ``urnmapping`` for the current
profile, the parent is checked recursively.  If no ``parent`` is
specified, the default table it used.

MappingTables are created with an active profile name equal to the
``platformProfile`` attribute of the :ref:`SystemInfo object
<turbulenzengine_getSystemInfo>`.  Developers can also populate
MappingTables with custom profiles and activate them at runtime.

For more information about JSON please visit `json.org
<http://json.org/>`_.

Methods
=======

.. index::
    pair: MappingTable; getURL

.. _mappingtable_geturl:

`getURL`
--------

**Summary**

Remap a logical game asset to its real URL path.

**Syntax** ::

    function missingCallbackFn(assetPath) {}
    mappingTable.getURL(assetPath, missingCallbackFn);

    //example usage:
    var request = function requestFn(assetPath, onload)
    {
        return TurbulenzEngine.request(mappingTable.getURL(assetPath), onload);
    };

``assetPath``
    A JavaScript string.
    The logical name of the asset to retrieve the URL for.

``missingCallbackFn`` (Optional)
    A JavaScript function.  Used for debugging (release builds should
    not have missing assets!).  This callback is called when
    ``assetPath`` is not in the MappingTable.  In this case ``getURL``
    returns a dummy URL that can be seen in the :ref:`local server
    console <debugging-a-mapping-table>`.

Returns a JavaScript string.
This string is the URL to load the logical game asset.

.. index::
    pair: MappingTable; alias

.. _mappingtable_alias:

`alias`
-------

**Summary**

Add a logical alias to another logical path in the mapping table.

**Syntax** ::

    mappingTable.alias(aliasPath, logicalPath);

    //example usage:
    mappingTable.alias('lambertshader.cgfx', 'blinnshader.cgfx');

``aliasPath``
    A JavaScript string.
    The alias path.

``logicalPath``
    A JavaScript string.
    The logical path to alias.

We recommend that you either change your assets to reference logical assets correctly, add effects (:ref:`EffectManager.add <effectmanager_effectregistration>`)
or use the managers ``map`` functions
(:ref:`ShaderManager.map <shadermanager_map>`, :ref:`TextureManager.map <texturemanager_map>` and :ref:`EffectManager.map <effectmanager_map>`)
rather than use this function.

.. index::
    pair: MappingTable; map

`map`
-----

**Summary**

Add a logical-physical path pair to the mapping table.

**Syntax** ::

    mappingTable.map(logicalPath, physicalPath);

    //example usage:
    mappingTable.map('blinnshader.cgfx', 'IJ_nEyT7jofhyafUf-Opqg.json');

``logicalPath``
    A JavaScript string.
    The logical asset path to remap.

``physicalPath``
    A JavaScript string.
    The physical path to remap to.

This function is only for debugging.  If you need to alias another
asset already in your mapping table use :ref:`MappingTable.alias
<mappingtable_alias>` instead.

`getCurrentProfile`
-------------------

**Summary**

Returns the string name of the currently active profile.

**Syntax** ::

    var currentProfile = mappingTable.getCurrentProfile();

`setProfile`
------------

**Summary**

Sets the currently active profile.

**Syntax** ::

    mappingTable.setProfile("mycustomprofile");
