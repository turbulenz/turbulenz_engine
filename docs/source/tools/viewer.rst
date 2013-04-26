.. index::
    pair: Tools; viewer

.. _viewer:

======
Viewer
======

-----
Usage
-----

**Syntax** ::

    http://x.x.x.x:8070/viewer/game/asset.json

Allows to view game asset objects with a set of different tools for their debugging.

* To get control of the object view, click on the viewer.
* Use keyboard arrows or keys 'W'/'S' (forward/backward) and 'A'/'D' (left/right) to move the camera.
* Use mouse to control the view angle of the camera.
* To obtain control over the mouse cursor back, press Escape.

-------
Options
-------

* **Select Wireframe**
    Renders the object using a default or blueprint style wire-frame model, to visualize the underlying design structure of the asset object.
* **Select a debug shader**
    Depending on the geometry semantics the object has (normals, binormals, tangents), it can have different debug shaders available to render it, which can be used to debug the object view problems.
* **Draw lights extents**
    Draws the extents of the lights loaded in the scene.
* **Draw Interpolators**
    Draws the animated object hierarchy skeleton.
* **Draw Skeleton**
    For skinned objects, draws the skeleton of the object.
* **Draw scene node hierarchy**
    Draws the hierarchy of the objects, if such exists.
* **Draw opaque nodes extents**
    The extents of the opaque nodes will be drawn in green.
* **Draw physics geometry**
    For the objects that have kinematics, their geometry is drawn in blue, for dynamic objects - in green, and for static - in red.
* **Draw physics extents**
    Draws the extents of the object physics.
* **Draw areas extents**
    Draws the scene subdivision in areas.
* **Draw portals**
    Displays portals on the scene.
* **Draw skins in bind pose**
    For the skinned, animated objects, will display the skin in a non-moving pose.
* **Draw normals/tangents/binormals**
    Draw the normals/tangents/binormals at each vertex on the model.
* **Animation speed scale**
    Allows to control the speed of animation, for animated objects.
* **Movement speed scale**
    Allows to control the movement speed of objects.
* **Normals scale**
    Scale the size of the normals/tangents/binormals lines.
