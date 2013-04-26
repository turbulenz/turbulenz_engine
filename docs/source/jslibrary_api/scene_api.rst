.. index::
    single: Scene

.. highlight:: javascript

.. _scene:

-----------------
The Scene Object
-----------------

Provides functionality for loading and managing scenes.

It is implemented as a hierarchy of :ref:`SceneNodes <scenenode>` with several acceleration structures to optimize
visibility calculations and hardware dispatching.

Each :ref:`SceneNode <scenenode>` in the hierarchy can simultaneously reference multiple :ref:`renderables <renderable>`, multiple :ref:`LightInstances <lightinstance>`,
a physics body and a camera. The :ref:`SceneNode <scenenode>` have axis-aligned extents calculated from the extents of these object.

The scene automatically synchronizes physics bodies transforms and extents with the attached rendering information.

A portal system is use in conjunction with several bounding volume hierarchies to reduce the cost of visibility calculations.

Material information for rendering is **not** propagated from parent to child.
Each renderable item, e.g. a :ref:`GeometryInstances <geometryinstance>`, attached to a node have references to all the material information required to render it,
but some of this information can be shared with other nodes in order to reduce memory requirements and state changes.

The format in which scenes are stored allows for external references to material information and other external scenes
that can be embedded at any point in the node hierarchy in a recursive fashion.
All these external references are resolved at load time, avoiding redundant data in order to provide optimal rendering of
multiple instances of the same model. Metadata information can be stored on the nodes and materials in order to provide
application specific information to use the scene.

**Required scripts**

The Scene object requires::

    /*{{ javascript("jslib/scene.js") }}*/
    /*{{ javascript("jslib/light.js") }}*/
    /*{{ javascript("jslib/material.js") }}*/
    /*{{ javascript("jslib/geometry.js") }}*/
    /*{{ javascript("jslib/aabbtree.js") }}*/
    /*{{ javascript("jslib/scenenode.js") }}*/
    /*{{ javascript("jslib/utilities.js") }}*/
    /*{{ javascript("jslib/vertexbuffermanager.js") }}*/
    /*{{ javascript("jslib/indexbuffermanager.js") }}*/


Constructor
===========

.. index::
    pair: Scene; create

`create`
--------

**Summary**

Creates and returns a scene object with default values.

**Syntax** ::

    var scene = Scene.create(mathDevice);

``mathDevice``
    The MathDevice object to be used for math calculations.

Methods
=======

.. index::
    pair: Scene; load

.. _scene_load:

`load`
------

**Summary**

Loads and initializes a scene from the given scene parameters.

**Syntax** ::

    function yieldFn(callback)
    {
        TurbulenzEngine.setTimeout(callback, 0);
    }

    var levelLoaded = false;

    function levelLoadedFn()
    {
        levelLoaded = true;
    }

    var sceneParameters = {
            append : true,
            data : sceneData,
            graphicsDevice : graphicsDevice,
            mathDevice : mathDevice,
            physicsDevice : physicsDevice,
            collisionMargin : 0.1,
            textureManager : textureManager,
            keepLights : true,
            keepCameras : false,
            baseScene: null,
            baseMatrix: null,
            skin: null,
            nodesNamePrefix : "level1",
            shapesNamePrefix : "level1",
            yieldFn : yieldFn,
            onload : levelLoadedFn,
            physicsManager : physicsManager,
            dynamic : true,
            disabled : true,
            keepVertexData : true,
            vertexBufferManager : vertexBufferManager,
            indexBufferManager : indexBufferManager
        };
    scene.load(sceneParameters);

``append``
    If true the scene data is appended to the existing one on the scene.
    If false the current scene is cleared and initialize the scene from the scratch from the given scene data.

``data``
    The scene data read from a JSON file,
    can containing geometries, lights, materials, effects, physics volumes, node hierarchy, etc.

``graphicsDevice``
    The GraphicsDevice object to be used by the scene object to create rendering objects.

``mathDevice``
    The MathDevice object to be used by the scene object to create MathDevice objects.

``physicsDevice``
    The PhysicsDevice object to be used by the scene object to create physics objects.

``collisionMargin``
    The default collision margin for collisions between objects on the scene in world units.

``textureManager``
    The TextureManager object to be used by the scene to load and create `Texture` objects.

``keepLights``
    Enables the loading of lights from the scene data.

``keepCameras``
    Enables the loading of cameras from the scene data.

``baseScene``
    Specifies a base scene to be used to look for missing textures or materials.

``baseMatrix``
    Specifies the root transform matrix for the scene data to be loaded.

``skin``
    Specifies a remapping table for the material names on the scene.

``nodesNamePrefix``
    Specifies a prefix to be added to all node names on the scene to be loaded.

``shapesNamePrefix``
    Specifies a prefix to be added to all geometry shape names on the scene to be loaded.

``yieldFn``
    Specifies a callback to be used by the scene to delay the execution of part of the scene loading.

``onload``
    Specifies a callbacks to be executed when all the loading has finished.

``physicsManager``
    Specifies the physicsManager to process physics nodes.

``dynamic``
    All nodes should be marked dynamic. This should be true if all the nodes will move at any stage.

``disabled``
    All nodes should be marked disabled. Could be used to load nodes in the background for later use.

``vertexFormatMap``
    A mapping from semantic name to desired vertex format.  The engine
    will attempt to choose a suitable format for vertex data, so most
    applications do not need to specify this parameter.

``keepVertexData``
    The surfaces keeps the vertex data in an array called `vertexData`.
    The size is equal to the number of vertices * the vertex stride.
    If there are indexed then they are retained in array called `indexData`.
    This data can be manually discarded or by calling :ref:`clearShapesVertexData() <scene_clearshapesvertexdata>`.

``vertexBufferManager``
    The :ref:`VertexBufferManager <vertexbuffermanager>` object to be used by the scene to create `VertexBuffer` objects.
    The Scene will use an internal one if not provided.

``indexBufferManager``
    The :ref:`IndexBufferManager <indexBufferManager>` object to be used by the scene to create `IndexBuffer` objects.
    The Scene will use an internal one if not provided.

The Scene object loads external references asynchronously and it may
delay execution of some of the loading in order to provide a
cooperative environment with the rest of the application.  This means
that although the `load` method will return immediately, the whole
scene will not be ready until the callback `onload` is executed.

.. index::
    pair: Scene; clear

`clear`
-------

**Summary**

Clears the scene, removing all nodes, geometries, lights, materials, physics objects, etc.

**Syntax** ::

    if (reloadLevel)
    {
        scene.clear();
    }

.. index::
    pair: Scene; addRootNode


`addRootNode`
-------------

**Summary**

Add a root sceneNode, along with all its children, to the scene. The root node must have a unique name. Once added to the scene the name should not be changed.

A sceneNode can only be in one scene.

**Syntax** ::

    var nodeRoot = SceneNode.create();
    nodeRoot.setName("player1");
    scene.addRootNode(nodeRoot);

``nodeRoot``
    A :ref:`SceneNode <scenenode>` object.

.. index::
    pair: Scene; removeRootNode

`removeRootNode`
----------------

**Summary**

Remove a root SceneNode, along with all its children, from the scene. See :ref:`SceneNode.removeChild() <scenenode_removechild>` to remove non-root nodes.

**Syntax** ::

    scene.removeRootNode(nodeRoot);

    //example usage:
    var redLightNode = scene.findNode("redLight-node");
    scene.removeRootNode(redLightNode);

``nodeRoot``
    A :ref:`SceneNode <scenenode>` object.
    This node must be a root node.

.. index::
    pair: Scene; cloneRootNode

`cloneRootNode`
----------------

**Summary**

Creates a clone of the SceneNode, along with all its descendants, and adds it to the scene's root nodes.

See also :ref:`SceneNode.clone() <scenenode_clone>`.

**Syntax** ::

    var cloneNode = scene.cloneRootNode(rootNode, cloneName);

    //example usage:
    var redLightNode = scene.findNode("redLight-node");
    var redLightNode2 = scene.cloneRootNode(redLightNode, "redLight-node2");

``rootNode``
    A :ref:`SceneNode <scenenode>` object.
    This must be a root node.

``cloneName``
    A JavaScript string.

Returns a :ref:`SceneNode <scenenode>` object.

.. index::
    pair: Scene; fineNode

`findNode`
----------

**Summary**

Find a SceneNode with the given path. The path can be created from :ref:`SceneNode.getPath() <scenenode_getpath>`.
A root node path is just its name.

**Syntax** ::

    var node = scene.findNode(nodeName);

``nodeName``
    A JavaScript string.

Returns a :ref:`SceneNode <scenenode>` object.
If a node with the name ``nodeName`` doesn't exist then this function returns undefined.

.. index::
    pair: Scene; addLight

`addLight`
----------

**Summary**

Add a named light to the scene's collection of lights.
Any light marked as global are added to the scene's global light list.
For non-global lights their visibility and influence is determined from the SceneNodes they are attached to.

**Syntax** ::

    scene.addLight(light);

``light``
    A :ref:`Light <light>` object.

.. index::
    pair: Scene; removeLight

`removeLight`
-------------

**Summary**

Remove a light from the scene's collection of lights.
Global lights are removed from the scene's global lights list.

**Syntax** ::

    scene.removeLight(light);

``light``
    A :ref:`Light <light>` object.

.. index::
    pair: Scene; getLight

`getLight`
-----------

**Summary**

Get a light by name.

**Syntax** ::

    var light = scene.getLight(lightName);

``lightName``
    A JavaScript string.

Returns a :ref:`Light <light>` object.


.. index::
    pair: Scene; getGlobalLights

.. _scene_getgloballights:

`getGlobalLights`
-----------------

**Summary**

Get an array of lights that affect all nodes.
See also :ref:`scene_getcurrentvisiblelights`.

**Syntax** ::

    var globalLights = scene.getGlobalLights();
    var numGlobalLights = globalLights.length;
    if (numGlobalLights)
    {
        drawGlobalLights(globalLights, numGlobalLights);
    }

Returns an array of :ref:`Light <light>` objects.

.. index::
    pair: Scene; update

.. _scene_update:

`update`
--------

**Summary**

Updates the node hierarchy and updates nodes extents.

**Syntax** ::

    scene.update();


.. index::
    pair: Scene; updateNodes

.. _scene_updatenodes:

`updateNodes`
-------------

**Summary**

Updates all the sceneNodes so that world transforms and world extents are updated.
Once this is called the SceneNode properties can be read directly.
This method is called by :ref:`scene.update() <scene_update>`.

**Syntax** ::

	scene.updateNodes();


.. index::
    pair: Scene; updateVisibleNodes

.. _scene_updatevisiblenodes:

`updateVisibleNodes`
--------------------

**Summary**

Updates the array of visible nodes for the given camera.

**Syntax** ::

    scene.updateVisibleNodes(camera);

``camera``
    The Camera object to be used to calculate the visible nodes.


.. index::
    pair: Scene; getCurrentVisibleNodes

.. _scene_getcurrentvisiblenodes:

`getCurrentVisibleNodes`
------------------------

**Summary**

Get the current array of visible nodes.

You have to call ``scene.updateVisibleNodes(camera)`` before use this method.

**Syntax** ::

    var visibleNodes = scene.getCurrentVisibleNodes();
    var numVisibleNodes = visibleNodes.length;
    if (0 < numVisibleNodes)
    {
        //...
    }

Returns an array of :ref:`SceneNode <scenenode>` objects.

.. index::
    pair: Scene; getCurrentVisibleRenderables

.. _scene_getcurrentvisiblerenderables:

`getCurrentVisibleRenderables`
------------------------------

**Summary**

Get the current array of visible renderable objects.

You have to call ``scene.updateVisibleNodes(camera)`` before use this method.

**Syntax** ::

    var visibleRenderables = scene.getCurrentVisibleRenderables();
    var numVisibleRenderables = visibleRenderables.length;
    if (0 < numVisibleRenderables)
    {
        //...
    }

Returns an array of :ref:`SceneNode <scenenode>` objects.

.. index::
    pair: Scene; getCurrentVisibleLights

.. _scene_getcurrentvisiblelights:

`getCurrentVisibleLights`
-------------------------

**Summary**

Get the current array of visible lights.

This does not include global lights. See :ref:`scene_getgloballights`.

You have to call ``scene.updateVisibleNodes(camera)`` before use this method.

**Syntax** ::

    var visibleLights = scene.getCurrentVisibleLights();
    var numVisibleLights = visibleLights.length;
    if (0 < numVisibleLights)
    {
        //...
    }

Returns an array of :ref:`Light <light>` objects.

.. index::
    pair: Scene; loadMaterial

.. _scene_loadmaterial:

`loadMaterial`
--------------

**Summary**

Creates a material in the scene from the material reference provided.
The function will return false if:

* A material with materialName already exists on the scene

**Syntax** ::

    var material = {
        effect : "phong",
        parameters : {
            diffuse : "textures/plastic.png"
        }
    };
    var materialName = "PlasticMaterial";

    if (scene.loadMaterial(graphicsDevice, textureManager, effectManager, materialName, material))
    {
        // ...
    }

``graphicsDevice``
    The instance of the graphics device.

``textureManager``
    The texture manager used to manage textures on the scene.

``effectManager``
    The effect manager used to manage effects on the scene.

``materialName``
    The string name of the material to load the into the scene.

``material``
    The material reference to be loaded for the scene.

.. index::
    pair: Scene; hasMaterial

`hasMaterial`
-------------

**Summary**

Checks if the scene already has a material with materialName.
This function will return true if the materialName already exists on the scene.

**Syntax** ::

    if (scene.hasMaterial(materialName))
    {
        // The material can be set on a renderable
        node.renderables[0].setMaterial(scene.getMaterial(materialName));
    }

``materialName``
    The string name of the material to check.

.. index::
    pair: Scene; getMaterial

`getMaterial`
--------------

**Summary**

Get a material by name.

**Syntax** ::

   var material = scene.getMaterial(materialName);

Returns a :ref:`Material <material>` object.

.. index::
    pair: Scene; getExtents

`getExtents`
-------------

**Summary**

Get the world extents of the whole scene.

**Syntax** ::

    var sceneExtents = scene.getExtents();
    var maxHeight = sceneExtents[5];

Returns an :ref:`extents <extents>` object.

.. index::
    pair: Scene; destroy

`destroy`
---------

**Summary**

Destroys the scene, clearing it and freeing system resources.

The scene should not be used after this call.

**Syntax** ::

    if (exitGame)
    {
        scene.destroy();
        scene = null;
    }

.. _scene_clearShapesVertexData:

.. index::
    pair: Scene; clearShapesVertexData

`clearShapesVertexData`
-----------------------

**Summary**

Clears the `vertexData` and `indexData` from loaded geometry objects. See :ref:`load <scene_load>`.

**Syntax** ::

    scene.clearShapesVertexData();

Properties
==========


.. index::
    pair: Scene; version

`version`
---------

**Summary**

The version number of the Scene implementation.

**Syntax** ::

    var sceneVersionNumber = scene.version;


.. index::
    pair: Scene; extents

`extents`
-----------

**Summary**

The bounding box :ref:`extents <extents>` of all the nodes in the scene.

This should only be called after ``scene.updateNodes()`` or ``scene.update()`` has been called.
Use ``scene.getExtents()`` otherwise.

**Syntax** ::

    var minHeight = scene.extents[1];


.. index::
    pair: Scene; maxDistance

`maxDistance`
-------------

**Summary**

The maximum distance to the camera near plane of the visible nodes axis-aligned bounding boxes.

**Syntax** ::

    var maxSceneDepth = scene.maxDistance;
