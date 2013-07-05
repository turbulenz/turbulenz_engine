// Copyright (c) 2009-2013 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global TurbulenzServices: false*/
/*global Camera: false*/
/*global CameraController: false*/
/*global Floor: false*/
/*global ResourceLoader: false*/
/*global RequestHandler: false*/
/*global TextureManager: false*/
/*global ShaderManager: false*/
/*global EffectManager: false*/
/*global AnimationManager: false*/
/*global PhysicsManager: false*/
/*global Scene: false*/
/*global DefaultRendering: false*/
/*global VMath: false*/
/*global InterpolatorController: false*/
/*global PoseController: false*/
/*global NodeTransformController: false*/
/*global SkinnedNode: false*/
/*global GPUSkinController: false*/

/*global getQueryStringDict: false*/
/*global jQuery: false*/
/*global window: false*/

TurbulenzEngine.onerror = function onerrorFn(error)
{
    window.console.log(error);
};


//
// Viewer
//
function Viewer() {}
Viewer.prototype =
{
    version : 1
};

// Constructor function
Viewer.create = function viewerCreateFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    var mathDeviceParameters = {};
    var md = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var graphicsDeviceParameters = { };
    var gd = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    var inputDeviceParameters = { };
    var id = TurbulenzEngine.createInputDevice(inputDeviceParameters);

    var physicsDeviceParameters = { };
    var pd = TurbulenzEngine.createPhysicsDevice(physicsDeviceParameters);

    var dynamicsWorldParameters = { };
    var dw = pd.createDynamicsWorld(dynamicsWorldParameters);

    var materials =
    {
        debugNormalsMaterial :
        {
            effect : "debug_normals"
        },

        debugLinesNormalsMaterial :
        {
            effect : "debug_lines_constant",
            meta:
            {
                constantColor : [0, 1, 0, 1]
            }
        },

        debugTangentsMaterial :
        {
            effect : "debug_tangents",
            meta :
            {
                materialcolor : true
            }
        },

        debugLinesTangentsMaterial :
        {
            effect : "debug_lines_constant",
            meta:
            {
                constantColor : [1, 0, 0, 1]
            }
        },

        debugBinormalsMaterial :
        {
            effect : "debug_binormals"
        },

        debugLinesBinormalsMaterial :
        {
            effect : "debug_lines_constant",
            meta:
            {
                constantColor : [0, 0, 1, 1]
            }
        }

    };

    var camera = Camera.create(md);
    var halfFov = Math.tan(30 * Math.PI / 180);
    camera.recipViewWindowX = 1.0 / halfFov;
    camera.recipViewWindowY = 1.0 / halfFov;
    camera.updateProjectionMatrix();

    var worldUp = md.v3BuildYAxis();
    camera.lookAt(md.v3Build(0.0, 1.0, 0.0), worldUp, md.v3Build(0.0, 50.0, 200.0));
    camera.updateViewMatrix();

    var cameraController = CameraController.create(gd, id, camera);

    var floor = Floor.create(gd, md);

    var rh = RequestHandler.create({});

    var tm = TextureManager.create(gd, rh, null, errorCallback);
    var sm = ShaderManager.create(gd, rh, null, errorCallback);
    var em = EffectManager.create(gd, md, sm, null, errorCallback);
    var animationManager = AnimationManager.create(errorCallback);

    var physicsManager = PhysicsManager.create(md, pd, dw);
    var physicsSnapshot = null;

    // Add support for pressing key 'R' to reset
    var keyCodes = id.keyCodes;

    var onKeyUp = function onKeyUpFn(keynum)
    {
        // If the key R is released we reset the positions
        if (keynum === keyCodes.R)
        {
            physicsManager.restoreSnapshot(physicsSnapshot);
        }
    };


    var scene = Scene.create(md);
    var sceneLoaded = false;

    var maxSpeed = cameraController.maxSpeed;
    var objectCenter = [0, 0, 0];
    var lightRadius = 1000;
    var lightAngle = 0;

    if (typeof window.gameSlug === 'undefined')
    {
        window.gameSlug = 'viewer';
    }

    var jQuery = window.jQuery;

    var vi = new Viewer();
    vi.camera = camera;
    vi.cameraController = cameraController;
    vi.scene = scene;
    vi.pathPrefix = '/play/' + window.gameSlug + '/';

    var urlMapping = null;
    var urlMappingReceived = false;

    var requestHandler = RequestHandler.create({});
    var request = function requestFn(url, onload)
    {
        return rh.request({
            src: ((urlMapping && urlMapping[url]) || (vi.pathPrefix + url)),
            onload: onload
        });
    };

    function viewerMappingTableReceivedFn(mappingTable)
    {
        var urlMapping = mappingTable.urlMapping;
        sm.setPathRemapping(urlMapping, mappingTable.assetPrefix);
        vi.renderer = DefaultRendering.create(gd, md, sm, em);
    }

    var viewerMappingSettings = {
        mappingTablePrefix: "staticmax/",
        assetPrefix: "missing/",
        mappingTableURL: vi.pathPrefix + "mapping_table.json"
    };
    TurbulenzServices.createMappingTable(requestHandler, null, viewerMappingTableReceivedFn,
                                                               viewerMappingSettings);


    var baseMaterialsSceneData = {
        version : 1,
        effects :
        {
            "default" :
            {
                type : "lambert"
            }
        },
        materials :
        {
            "default" :
            {
                effect : "default"
            }
        }
    };

    function addAnimationExtentsToScene(scene)
    {
        // no extents found so far so try using the animations to calculate them
        var maxValue = Number.MAX_VALUE;
        var animExtentMin0 = maxValue;
        var animExtentMin1 = maxValue;
        var animExtentMin2 = maxValue;
        var animExtentMax0 = -maxValue;
        var animExtentMax1 = -maxValue;
        var animExtentMax2 = -maxValue;
        var animations = animationManager.getAll();

        for (var a in animations)
        {
            if (animations.hasOwnProperty(a))
            {
                var anim = animations[a];
                var bounds = anim.bounds;
                var numFrames = anim.bounds.length;
                for (var i = 0; i < numFrames; i = i + 1)
                {
                    var bound = bounds[i];
                    var center = bound.center;
                    var halfExtent = bound.halfExtent;
                    var c0 = center[0];
                    var c1 = center[1];
                    var c2 = center[2];
                    var h0 = halfExtent[0];
                    var h1 = halfExtent[1];
                    var h2 = halfExtent[2];
                    var min0 = (c0 - h0);
                    var min1 = (c1 - h1);
                    var min2 = (c2 - h2);
                    var max0 = (c0 + h0);
                    var max1 = (c1 + h1);
                    var max2 = (c2 + h2);
                    animExtentMin0 = (animExtentMin0 < min0 ? animExtentMin0 : min0);
                    animExtentMin1 = (animExtentMin1 < min1 ? animExtentMin1 : min1);
                    animExtentMin2 = (animExtentMin2 < min2 ? animExtentMin2 : min2);
                    animExtentMax0 = (animExtentMax0 > max0 ? animExtentMax0 : max0);
                    animExtentMax1 = (animExtentMax1 > max1 ? animExtentMax1 : max1);
                    animExtentMax2 = (animExtentMax2 > max2 ? animExtentMax2 : max2);
                }
            }
        }

        // If any of the min values are less than or equal to the max values we found animations
        if (animExtentMin0 <= animExtentMax0)
        {
            scene.extents[0] = animExtentMin0 < scene.extents[0] ? animExtentMin0 :  scene.extents[0];
            scene.extents[1] = animExtentMin1 < scene.extents[1] ? animExtentMin1 :  scene.extents[1];
            scene.extents[2] = animExtentMin2 < scene.extents[2] ? animExtentMin2 :  scene.extents[2];

            scene.extents[3] = animExtentMax0 > scene.extents[3] ? animExtentMax0 :  scene.extents[3];
            scene.extents[4] = animExtentMax1 > scene.extents[4] ? animExtentMax1 :  scene.extents[4];
            scene.extents[5] = animExtentMax2 > scene.extents[5] ? animExtentMax2 :  scene.extents[5];
        }
    }

    function loadSceneFinishedFn(scene)
    {
        // For the viewer we include the extents of all the animations to try and get a better camera setup
        addAnimationExtentsToScene(scene);
        scene.update();
        var sceneExtents = scene.getExtents();
        var sceneMinExtent = md.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
        var sceneMaxExtent = md.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
        var c = md.v3ScalarMul(md.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);
        var e = md.v3Sub(c, sceneMinExtent);

        if (VMath.v3LengthSq(e) > VMath.precision)
        {
            camera.lookAt(c, worldUp, md.v3Build(c[0] + e[0] * 4.0,
                                                 c[1] + Math.max(e[0], e[1], e[2]) * 2.0,
                                                 c[2] + e[2] * 4.0));
            camera.updateViewMatrix();

            var len = VMath.v3Length(e);
            if (len < 4.0)
            {
                camera.nearPlane = len * 0.1;
            }
            else
            {
                camera.nearPlane = 1.0;
            }
            camera.farPlane = Math.ceil(len) * 100.0;
            camera.updateProjectionMatrix();

            maxSpeed = (len < 100 ? (len * 2) : (len * 0.5));
            objectCenter = c;
            lightRadius = (len * 4);
        }

        GPUSkinController.setDefaultBufferSize(vi.renderer.getDefaultSkinBufferSize());

        scene.skinnedNodes = [];
        var nodeHasSkeleton = animationManager.nodeHasSkeleton;

        var animations = animationManager.getAll();
        var sceneNodes = scene.rootNodes;
        var numNodes = sceneNodes.length;
        var a, anim, interp, skinnedNode, nodeController;
        for (var n = 0; n < numNodes; n += 1)
        {
            var node = sceneNodes[n];
            var skeleton = nodeHasSkeleton(node);
            if (skeleton && skeleton.numNodes)
            {
                interp = InterpolatorController.create(skeleton);
                skinnedNode = SkinnedNode.create(gd, md, node, skeleton, interp);
                scene.skinnedNodes.push(skinnedNode);
                skinnedNode.animController = interp;

                for (a in animations)
                {
                    if (animations.hasOwnProperty(a))
                    {
                        anim = animations[a];
                        if (anim.numNodes === skeleton.numNodes)
                        {
                            interp.setAnimation(anim, true);
                            break;
                        }
                    }
                }

                // Build a pose controller to allow the viewer to render bind poses
                var poseController = PoseController.create(skeleton);
                var numJoints = skeleton.numNodes;
                var parents = skeleton.parents;
                var bindPoses = skeleton.bindPoses;
                var hasScale = false;

                // Check if the bind pose includes any scale
                var j;
                for (j = 0; j < numJoints; j += 1)
                {
                    var poseMatrix = bindPoses[j];
                    if (!VMath.v3Equal([md.v3LengthSq(md.m43Right(poseMatrix)),
                                     md.v3LengthSq(md.m43Up(poseMatrix)),
                                     md.v3LengthSq(md.m43At(poseMatrix))],
                                     VMath.v3Build(1, 1, 1)))
                    {
                        hasScale = true;
                        break;
                    }
                }
                hasScale = false;

                // Dependent on whether we have scale setup the output channels on the pose controller
                if (hasScale)
                {
                    poseController.setOutputChannels({rotation: true, translation: true, scale: true});
                }
                else
                {
                    poseController.setOutputChannels({rotation: true, translation: true});
                }

                for (j = 0; j < numJoints; j += 1)
                {
                    var joint = bindPoses[j];
                    var parentIndex = parents[j];
                    if (parentIndex !== -1)
                    {
                        var parentJoint = bindPoses[parentIndex];
                        var invParent = md.m43Inverse(parentJoint);

                        joint = md.m43Mul(joint, invParent);
                    }
                    var sx, sy, sz;
                    if (hasScale)
                    {
                        sx = md.v3Length(md.m43Right(joint));
                        sy = md.v3Length(md.m43Up(joint));
                        sz = md.v3Length(md.m43At(joint));
                        md.m43SetRight(joint, md.v3ScalarMul(md.m43Right(joint), 1 / sx));
                        md.m43SetUp(joint, md.v3ScalarMul(md.m43Up(joint), 1 / sy));
                        md.m43SetAt(joint, md.v3ScalarMul(md.m43At(joint), 1 / sz));
                    }
                    var quat = md.quatFromM43(joint);
                    var pos = md.v3Build(joint[9], joint[10], joint[11]);

                    var scale;
                    if (hasScale)
                    {
                        scale = md.v3Build(sx, sy, sz);
                    }

                    poseController.setJointPose(j, quat, pos, scale);
                }
                skinnedNode.poseController = poseController;

                // If no suitable animation was found swap to poseController and drop reference to interp
                if (!interp.currentAnim)
                {
                    delete skinnedNode.animController;
                    skinnedNode.setInputController(skinnedNode.poseController);
                }
            }
        }

        scene.nodeControllers = [];
        // If there are no skinned nodes try creating some controllers to update nodes. Note these will work
        // to drive the animations even when no nodes are present
        if (scene.skinnedNodes.length === 0)
        {
            for (a in animations)
            {
                if (animations.hasOwnProperty(a))
                {
                    anim = animations[a];
                    interp = InterpolatorController.create(anim.hierarchy);
                    interp.setAnimation(anim, true);
                    nodeController = NodeTransformController.create(anim.hierarchy, scene);
                    nodeController.setInputController(interp);
                    scene.nodeControllers.push(nodeController);
                }
            }
        }

        var globalLights = scene.getGlobalLights();
        var numGlobalLights = globalLights.length;
        for (var g = 0; g < numGlobalLights; g += 1)
        {
            var globalLight = globalLights[g];
            if (globalLight.ambient)
            {
                vi.renderer.setAmbientColor(globalLight.color);
                break;
            }
        }

        vi.renderer.setDefaultTexture(tm.get("default"));

        if (scene.loadMaterial(gd, tm, em, "debugNormalsMaterial", materials.debugNormalsMaterial))
        {
            scene.getMaterial("debugNormalsMaterial").reference.add();
            materials.debugNormalsMaterial.loaded = true;
        }
        if (scene.loadMaterial(gd, tm, em, "debugLinesNormalsMaterial", materials.debugLinesNormalsMaterial))
        {
            scene.getMaterial("debugLinesNormalsMaterial").reference.add();
            materials.debugLinesNormalsMaterial.loaded = true;
        }
        if (scene.loadMaterial(gd, tm, em, "debugTangentsMaterial", materials.debugTangentsMaterial))
        {
            scene.getMaterial("debugTangentsMaterial").reference.add();
            materials.debugTangentsMaterial.loaded = true;
        }
        if (scene.loadMaterial(gd, tm, em, "debugLinesTangentsMaterial", materials.debugLinesTangentsMaterial))
        {
            scene.getMaterial("debugLinesTangentsMaterial").reference.add();
            materials.debugLinesTangentsMaterial.loaded = true;
        }
        if (scene.loadMaterial(gd, tm, em, "debugBinormalsMaterial", materials.debugBinormalsMaterial))
        {
            scene.getMaterial("debugBinormalsMaterial").reference.add();
            materials.debugBinormalsMaterial.loaded = true;
        }
        if (scene.loadMaterial(gd, tm, em, "debugLinesBinormalsMaterial", materials.debugLinesBinormalsMaterial))
        {
            scene.getMaterial("debugLinesBinormalsMaterial").reference.add();
            materials.debugLinesBinormalsMaterial.loaded = true;
        }

        // If there are physics objects then prevent them from falling
        if (physicsManager.physicsNodes.length > 0)
        {
            // Floor is represented by a plane shape
            var floorShape = pd.createPlaneShape({
                    normal : md.v3Build(0, 1, 0),
                    distance : 0,
                    margin : 0.001
                });

            var extents = scene.getExtents();

            var floorObject = pd.createCollisionObject({
                    shape : floorShape,
                    transform : md.m43BuildTranslation(extents[0], extents[1], extents[2]),
                    friction : 0.5,
                    restitution : 0.3,
                    group: pd.FILTER_STATIC,
                    mask: pd.FILTER_ALL
                });

            // Adds the floor collision object to the world
            dw.addCollisionObject(floorObject);

            // Create snapshot for reset functionality
            physicsSnapshot = physicsManager.createSnapshot();

            id.addEventListener("keyup", onKeyUp);

            jQuery('.engine-control').find('tbody')
                .append(jQuery('<tr>').append(jQuery('<td>').attr('class', 'key').text('R'))
                .append(jQuery('<td>').text('Reset physics objects'))
                );
        }

        sceneLoaded = true;

        jQuery(function ($j) {
            $j('#loading').toggle();
        });
    }

    vi.load = function viewerLoadFn(assetPath, urlBase, mappingTable, append, onload)
    {
        jQuery(function ($j) {
            $j('#loading').toggle();
        });

        sceneLoaded = false;

        if (!append)
        {
            scene.clear();
            scene.nodeControllers = [];
            scene.skinnedNodes = [];

            physicsManager.clear();
            physicsSnapshot = null;

            dw.flush();

            id.removeEventListener("keyup", onKeyUp);

            animationManager = AnimationManager.create(errorCallback);
        }

        urlMappingReceived = false;
        urlMapping = null;

        var checkMapping = function checkMappingFn()
        {
            if (urlMappingReceived)
            {
                var loadSceneFinished;
                if (onload)
                {
                    loadSceneFinished = function (scene)
                    {
                        loadSceneFinishedFn(scene);
                        onload(scene);
                    };
                }
                else
                {
                    loadSceneFinished = loadSceneFinishedFn;
                }

                var sceneReceived = function sceneReceivedFn(sceneData)
                {
                    // If we were supplied an animation manager let that load any animations from the resolved data
                    animationManager.loadData(sceneData);

                    var imageArchiveName = assetPath + ".images.tar";
                    if (urlMapping[imageArchiveName])
                    {
                        tm.loadArchive(imageArchiveName);
                    }

                    var yieldFn = function sceneLoadYieldFn(callback)
                    {
                        TurbulenzEngine.setTimeout(callback, 0);
                    };

                    var baseMaterialsScene = Scene.create(md);
                    baseMaterialsScene.load({
                            data : baseMaterialsSceneData,
                            graphicsDevice : gd,
                            keepVertexData : true
                        });

                    scene.load({
                        data : sceneData,
                        graphicsDevice : gd,
                        mathDevice : md,
                        physicsDevice : pd,
                        textureManager : tm,
                        effectManager : em,
                        baseScene : baseMaterialsScene,
                        append : append,
                        keepLights : true,
                        yieldFn : yieldFn,
                        onload : loadSceneFinished,
                        physicsManager : physicsManager,
                        keepVertexData : true
                    });
                };

                var loadResolve = function loadResolveFn(text)
                {
                    var sceneData = {};
                    if (text)
                    {
                        sceneData = JSON.parse(text);
                    }
                    var resourceLoader = ResourceLoader.create();
                    resourceLoader.resolve({
                        data : sceneData,
                        append : false,
                        requestHandler : rh,
                        onload : sceneReceived
                    });
                };
                request(assetPath, loadResolve);
            }
            else
            {
                TurbulenzEngine.setTimeout(checkMappingFn, 100);
            }
        };

        if (mappingTable && mappingTable !== '')
        {
            var mappingReceived = function mappingReceivedFn(mappingTable)
            {
                tm.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
                //sm.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);   // viewer doesn't load any more shaders
                animationManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

                urlMapping = mappingTable.urlMapping;
                urlMappingReceived = true;
            };
            var mappingError = function mappingErrorFn()
            {
                window.alert("Error loading asset mapping table: " + mappingTable +
                             " will attempt to continue without it");
                urlMapping = {};
                urlMappingReceived = true;
            };

            var mappingSettings = {
                mappingTablePrefix: urlBase + "staticmax/",
                assetPrefix: urlBase,
                mappingTableURL: urlBase + mappingTable
            };

            TurbulenzServices.createMappingTable(requestHandler, null, mappingReceived,
                                                 mappingSettings, mappingError);
        }
        else
        {
            urlMapping = {};
            urlMappingReceived = true;
        }

        checkMapping();
    };

    var clearColor = [0.95, 0.95, 1.0, 1.0];
    var previousFrameTime = 0;
    var nextUpdateTime = 0;
    vi.doUpdate = true;
    vi.drawInterpolators = true;
    vi.drawSkeleton = true;
    vi.drawLights = true;
    vi.drawPortals = false;
    vi.drawPhysicsGeometry = false;
    vi.drawPhysicsExtents = false;
    vi.drawOpaqueNodesExtents = false;
    vi.drawSceneNodeHierarchy = false;
    vi.drawNormals = false;
    vi.drawTangents = false;
    vi.drawBinormals = false;
    vi.isDefaultWireframeOn = false;
    vi.isBlueprintWireframeOn = false;
    vi.isDebugTangentsOn = false;
    vi.isDebugNormalsOn = false;
    vi.isDebugBinormalsOn = false;
    vi.drawAreasExtents = false;
    vi.animScale = 1;
    vi.movementScale = 1;
    vi.normalsScale = 1;

    if (gd.beginFrame())
    {
        gd.clear(clearColor, 1.0, 0);
        gd.endFrame();
    }

    function drawDecalsCB()
    {
        // Draw floor during decals pass to avoid artifacts with transparent materials
        floor.render(gd, camera);
    }

    function drawDebugCB()
    {
        if (vi.prevDrawNormals !== vi.drawNormals ||
            vi.prevDrawTangents !== vi.drawTangents ||
            vi.prevDrawBinormals !== vi.drawBinormals ||
            vi.prevNormalsScale !== vi.normalsScale)
        {
            vi.prevDrawNormals = vi.drawNormals;
            vi.prevDrawTangents = vi.drawTangents;
            vi.prevDrawBinormals = vi.drawBinormals;
            vi.prevNormalsScale = vi.normalsScale;

            scene.updateNormals(gd,
                                vi.normalsScale,
                                vi.drawNormals, scene.getMaterial("debugLinesNormalsMaterial"),
                                vi.drawTangents, scene.getMaterial("debugLinesTangentsMaterial"),
                                vi.drawBinormals, scene.getMaterial("debugLinesBinormalsMaterial"));
        }

        // TODO: draw the hierarchies at the correct positions
        if (vi.drawInterpolators)
        {
            var nodeControllers = scene.nodeControllers;
            var numNodeControllers = nodeControllers.length;
            for (var i = 0; i < numNodeControllers; i += 1)
            {
                var nodeController = nodeControllers[i];
                var interp = nodeController.inputController;
                var hierarchy = interp.currentAnim.hierarchy;
                scene.drawAnimationHierarchy(gd, sm, camera,
                                             hierarchy,
                                             hierarchy.numNodes,
                                             interp);
            }
        }

        if (vi.drawSkeleton)
        {
            var skinnedNodes = scene.skinnedNodes;
            var numSkins = skinnedNodes.length;
            for (var skin = 0; skin < numSkins; skin += 1)
            {
                var skinnedNode = skinnedNodes[skin];
                var controller = skinnedNode.skinController;
                var nodeTM = skinnedNode.node.world;
                scene.drawAnimationHierarchy(gd, sm, camera,
                                             controller.skeleton,
                                             controller.skeleton.numNodes,
                                             controller.inputController,
                                             nodeTM);
            }
        }

        if (vi.drawLights)
        {
            scene.drawLights(gd, sm, camera);
        }

        if (vi.drawPortals)
        {
            scene.drawPortals(gd, sm, camera);
        }

        if (vi.drawAreasExtents)
        {
            scene.drawAreas(gd, sm, camera);
        }

        if (vi.drawPhysicsGeometry)
        {
            scene.drawPhysicsGeometry(gd, sm, camera, physicsManager);
        }

        if (vi.drawPhysicsExtents)
        {
            scene.drawPhysicsNodes(gd, sm, camera, physicsManager);
        }

        if (vi.drawOpaqueNodesExtents)
        {
            scene.drawOpaqueNodesExtents(gd, sm, camera);
        }

        if (vi.drawSceneNodeHierarchy)
        {
            scene.drawSceneNodeHierarchy(gd, sm, camera);
        }
    }

    function renderFrameFn()
    {
        var nodeControllers, numNodeControllers, nodeController;
        var skinnedNodes, numSkins, skinnedNode, skin;
        var i;
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 1)
        {
            deltaTime = 1;
        }
        cameraController.maxSpeed = (deltaTime * maxSpeed * vi.movementScale);

        id.update();

        cameraController.update();

        var deviceWidth = gd.width;
        var deviceHeight = gd.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        var renderer = vi.renderer;

        if (vi.doUpdate)
        {
            renderer.setGlobalLightPosition(md.v3Build((objectCenter[0] + lightRadius * Math.cos(lightAngle)),
                                                       (objectCenter[1] + lightRadius),
                                                       (objectCenter[2] + lightRadius * Math.sin(lightAngle))));

            lightAngle += deltaTime;
            if (lightAngle >= (2 * Math.PI))
            {
                lightAngle -= (2 * Math.PI);
            }

            dw.update();
            physicsManager.update(scene);

            // Update all the animations in the scene
            nodeControllers = scene.nodeControllers;
            numNodeControllers = nodeControllers.length;
            for (i = 0; i < numNodeControllers; i += 1)
            {
                nodeController = nodeControllers[i];
                nodeController.addTime(deltaTime * vi.animScale);
                nodeController.update();
            }

            skinnedNodes = scene.skinnedNodes;
            numSkins = skinnedNodes.length;
            for (skin = 0; skin < numSkins; skin += 1)
            {
                skinnedNode = skinnedNodes[skin];
                if (vi.drawSkinBindPose || !skinnedNode.animController ||
                    vi.drawNormals ||
                    vi.drawTangents ||
                    vi.drawBinormals)
                {
                    skinnedNode.skinController.setInputController(skinnedNode.poseController);
                }
                else
                {
                    skinnedNode.skinController.setInputController(skinnedNode.animController);
                }
                skinnedNode.addTime(deltaTime * vi.animScale);
                skinnedNode.update();
            }

            if (currentTime >= nextUpdateTime)
            {
                nextUpdateTime = (currentTime + 1.0);
                renderer.updateShader(sm);
            }

            scene.update();

            renderer.update(gd, camera, scene, currentTime);
        }

        if (gd.beginFrame())
        {
            if (renderer.updateBuffers(gd, deviceWidth, deviceHeight))
            {
                renderer.draw(gd, clearColor, drawDecalsCB, null, drawDebugCB);
            }

            gd.endFrame();
        }

        vi.fps = gd.fps;

        previousFrameTime = currentTime;
    }

    var intervalID;

    function loadingLoopFn()
    {
        var deviceWidth = gd.width;
        var deviceHeight = gd.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        if (gd.beginFrame())
        {
            gd.clear(clearColor, 1.0, 0);

            floor.render(gd, camera);

            gd.endFrame();
        }

        if (sceneLoaded)
        {
            TurbulenzEngine.clearInterval(intervalID);

            intervalID = TurbulenzEngine.setInterval(renderFrameFn, 1000 / 60);
        }
    }

    intervalID = TurbulenzEngine.setInterval(loadingLoopFn, 1000 / 30);

    vi.reloadTextures = function viewerreloadTexturesFn()
    {
        nextUpdateTime = 0;
        tm.reloadAll();
    };

    vi.reloadShaders = function viewerreloadShadersFn()
    {
        nextUpdateTime = 0;
        sm.reloadAll();
    };

    vi.destroy = function destroyFn()
    {
        TurbulenzEngine.clearInterval(intervalID);
        sceneLoaded = false;
        if (physicsManager)
        {
            physicsManager.clear();
            physicsManager = null;
            physicsSnapshot = null;
        }
        vi.renderer = null;
        vi.scene = null;
        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        em = null;
        sm = null;
        tm = null;
        floor = null;
        cameraController = null;
        camera = null;
        TurbulenzEngine.flush();
        pd = null;
        id = null;
        gd = null;
        md = null;
    };


    vi.hasNodeSemantic = function hasNodeSemantic(node, semanticCondition)
    {
        if (node.hasRenderables())
        {
            var numRenderables = node.renderables.length;
            for (var r = 0; r < numRenderables; r += 1)
            {
                var renderable = node.renderables[r];
                if (renderable.geometry)
                {
                    var geometry = renderable.geometry;
                    var semantics = geometry.semantics;
                    var numSemantics = semantics.length;
                    for (var i = 0; i < numSemantics; i += 1)
                    {
                        if (semantics[i] === semanticCondition)
                        {
                            return true;
                        }
                    }
                }
            }
        }
        return vi.hasChildrenNodesSemantic(node, semanticCondition);
    };

    vi.hasChildrenNodesSemantic = function hasChildrenNodesSemantic(node, semanticCondition)
    {
        var children = node.children;

        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                var child = children[c];
                if (vi.hasNodeSemantic(child, semanticCondition))
                {
                    return true;
                }
            }
        }

        return false;

    };

    vi.convertSemantic = function convertSemanticFn(checkSemanticsString)
    {
        var semanticCondition;
        if (checkSemanticsString === "SEMANTIC_NORMAL")
        {
            semanticCondition = gd.SEMANTIC_NORMAL;
        }
        else if (checkSemanticsString === "SEMANTIC_TANGENT")
        {
            semanticCondition = gd.SEMANTIC_TANGENT;
        }
        else if (checkSemanticsString === "SEMANTIC_BINORMAL")
        {
            semanticCondition = gd.SEMANTIC_BINORMAL;
        }
        else
        {
            return null;
        }
        return semanticCondition;
    };

    vi.hasSemantic = function hasSemanticFn(checkSemanticsString)
    {
        var sceneNodes = scene.rootNodes;
        var semanticCondition = vi.convertSemantic(checkSemanticsString);

        var numNodes = sceneNodes.length;
        for (var n = 0; n < numNodes; n += 1)
        {
            var node = sceneNodes[n];
            if (vi.hasNodeSemantic(node, semanticCondition))
            {
                return true;
            }
        }
        return false;

    };

    function setNodeHierarchyMaterialFn(materialName, node, checkSemanticsString)
    {
        var children = node.children;

        if (node.hasRenderables())
        {
            var semanticCondition;
            semanticCondition = vi.convertSemantic(checkSemanticsString);

            var numRenderables = node.renderables.length;
            for (var r = 0; r < numRenderables; r += 1)
            {
                var renderable = node.renderables[r];
                if (renderable.geometry)
                {
                    var geometry = renderable.geometry;
                    var semantics = geometry.semantics;
                    var numSemantics = semantics.length;
                    for (var i = 0; i < numSemantics; i += 1)
                    {
                        if (!semanticCondition || semantics[i] === semanticCondition)
                        {
                            if (materialName && !renderable.lastMaterial)
                            {
                                //changing node to new material
                                renderable.lastMaterial = renderable.getMaterial();
                                renderable.lastMaterial.reference.add();
                                renderable.setMaterial(scene.getMaterial(materialName));
                            }

                            else if (materialName === null)
                            {
                                if (renderable.lastMaterial)
                                {
                                    // restoring node's old material
                                    renderable.setMaterial(renderable.lastMaterial);
                                    renderable.lastMaterial.reference.remove();
                                    delete renderable.lastMaterial;
                                }
                            }
                        }
                    }
                }
            }
        }

        if (children)
        {
            var numChildren = children.length;
            for (var c = 0; c < numChildren; c += 1)
            {
                var child = children[c];
                setNodeHierarchyMaterialFn(materialName, child, checkSemanticsString);
            }
        }
    }

    vi.enableDebugShader = function enableDebugShaderFn(choiceString)
    {
        var node, numNodes, n;
        var sceneNodes = scene.rootNodes;
        var checkSemantics, materialName;

        if (vi.isDebugTangentsOn || vi.isDebugBinormalsOn || vi.isDebugNormalsOn)
        {
            vi.isDebugTangentsOn = false;
            vi.isDebugBinormalsOn = false;
            vi.isDebugNormalsOn = false;

            numNodes = sceneNodes.length;
            for (n = 0; n < numNodes; n += 1)
            {
                node = sceneNodes[n];
                setNodeHierarchyMaterialFn(null, node, checkSemantics);
            }
        }

        if (choiceString === "enableDebugNormals")
        {
            checkSemantics = "SEMANTIC_NORMAL";
            materialName = "debugNormalsMaterial";
            vi.isDebugNormalsOn = true;
        }
        else if (choiceString === "enableDebugBinormals")
        {
            checkSemantics = "SEMANTIC_BINORMAL";
            materialName = "debugBinormalsMaterial";
            vi.isDebugBinormalsOn = true;
        }
        else if (choiceString === "enableDebugTangents")
        {
            checkSemantics = "SEMANTIC_TANGENT";
            materialName = "debugTangentsMaterial";
            vi.isDebugTangentsOn = true;
        }

        var material = materials[materialName];

        if (material && material.loaded)
        {
            numNodes = sceneNodes.length;
            for (n = 0; n < numNodes; n += 1)
            {
                node = sceneNodes[n];
                setNodeHierarchyMaterialFn(materialName, node, checkSemantics);
            }
        }
    };

    vi.removeDebugShaders = function removeDebugShadersFn()
    {
        var node, numNodes, n;
        var sceneNodes = scene.rootNodes;

        vi.isDebugBinormalsOn = false;
        vi.isDebugNormalsOn = false;
        vi.isDebugTangentsOn = false;

        numNodes = sceneNodes.length;
        for (n = 0; n < numNodes; n += 1)
        {
            node = sceneNodes[n];
            setNodeHierarchyMaterialFn(null, node, null);
        }

    };

    vi.enableWireframe = function enableWireframeFn(choiceString)
    {
        var wireframeInfo = {
            wireColor : null,
            fillColor : null,
            alphaRef  : null
        };

        vi.isDefaultWireframeOn = false;
        vi.isBlueprintWireframeOn = false;

        if (choiceString === "enableDefaultWireframe")
        {
            vi.isDefaultWireframeOn = true;
            wireframeInfo.wireColor = md.v4Build(0, 0, 0, 1); //choose color for the wireframe lines
            wireframeInfo.fillColor = md.v4Build(0.95, 0.95, 1, 0); //choose color for the interior of the polygons,
                                                        //leave alpha as zero to allow removing interior of polygons
            wireframeInfo.alphaRef = 0.35; //set to greater than zero (e.g. 0.1) to remove interior of polygons
        }
        else if (choiceString === "enableBlueprintWireframe")
        {
            vi.isBlueprintWireframeOn = true;
            wireframeInfo.wireColor = md.v4Build(1, 1, 1, 1);
            wireframeInfo.fillColor = md.v4Build(0, 0.2, 0.6, 0);
            wireframeInfo.alphaRef = 0;
        }

        if (vi.isDefaultWireframeOn || vi.isBlueprintWireframeOn)
        {
            vi.renderer.setWireframe(true, wireframeInfo);
        }
    };

    vi.deselectWireframe = function deselectWireframeFn()
    {
        vi.isDefaultWireframeOn = false;
        vi.isBlueprintWireframeOn = false;

        vi.renderer.setWireframe(false, null);
    };

    return vi;

};

function createSceneFn()
{
    var htmlDoc = window.document;
    var viewer = Viewer.create();
    if (!viewer)
    {
        window.alert("Viewer object not loaded correctly");
    }

    var isLoading = false; // to avoid reloading scene twice

    function onSceneLoadedFn(scene)
    {
        var sceneDetailsDiv = htmlDoc.getElementById('scene-details');
        var sceneDetailsString = "";

        var sceneMetrics = scene.getMetrics();
        var metricsString = "<div>Scene metrics:<\/div><table class=\"status\" border=\"1\" bordercolor=\"gray\">";
        metricsString += "<tr><td>Nodes<\/td><td align=\"right\">" + sceneMetrics.numNodes + "<\/td><\/tr>";
        metricsString += "<tr><td>Renderables<\/td><td align=\"right\">" + sceneMetrics.numRenderables + "<\/td><\/tr>";
        metricsString += "<tr><td>Vertices<\/td><td align=\"right\">" + sceneMetrics.numVertices + "<\/td><\/tr>";
        metricsString += "<tr><td>Primitives<\/td><td align=\"right\">" + sceneMetrics.numPrimitives + "<\/td><\/tr>";
        metricsString += "<tr><td>Lights<\/td><td align=\"right\">" + sceneMetrics.numLights + "<\/td><\/tr>";
        metricsString += "<\/table>";
        sceneDetailsString += metricsString;

        var globalLights = scene.globalLights;
        var numGlobalLights = globalLights.length;
        if (0 < numGlobalLights)
        {
            var lightsString = "<div>Global Lights:<\/div><table class=\"status\" border=\"1\" bordercolor=\"gray\">";
            var n = 0;
            do
            {
                var light = globalLights[n];
                var lightName = scene.findLightName(light);
                var lightType;
                if (light.ambient)
                {
                    lightType = "ambient";
                }
                else if (light.directional)
                {
                    lightType = "directional";
                }
                else if (light.spot)
                {
                    lightType = "spot";
                }
                else //if (light.point)
                {
                    lightType = "point";
                }
                lightsString += "<tr><td>" + lightName + "<\/td><td align=\"right\">" + lightType + "<\/td><\/tr>";
                n += 1;
            }
            while (n < numGlobalLights);
            lightsString += "<\/table>";

            sceneDetailsString += lightsString;
        }

        sceneDetailsDiv.innerHTML += sceneDetailsString;

        function drawOptionFn()
        {
            viewer[this.value] = this.checked;
        }

        function drawOptionFloatValueFn()
        {
            var value = parseFloat(this.value);
            if (!isNaN(value))
            {
                viewer[this.id.replace("text_", "")] = value;
            }
        }

        function dropDownBoxCheck()
        {
            var selectBox;
            if (this.id === 'debugShaders')
            {
                if (this.options[this.selectedIndex].value === "removeDebugShaders")
                {
                    viewer.removeDebugShaders();
                }
                else
                {
                    selectBox = htmlDoc.getElementById('selectWireframe');
                    selectBox.selectedIndex = 0;
                    viewer.deselectWireframe();
                    viewer.enableDebugShader(this.options[this.selectedIndex].value);
                }
            }
            else
            {
                if (this.options[this.selectedIndex].value === "deselectWireframe")
                {
                    viewer.deselectWireframe();
                }
                else
                {
                    selectBox = htmlDoc.getElementById('debugShaders');
                    selectBox.selectedIndex = 0;
                    viewer.removeDebugShaders();
                    viewer.enableWireframe(this.options[this.selectedIndex].value);
                }
            }
        }

        var check_drawNormals = htmlDoc.getElementById('check_drawNormals');
        var check_drawTangents = htmlDoc.getElementById('check_drawTangents');
        var check_drawBinormals = htmlDoc.getElementById('check_drawBinormals');

        htmlDoc.getElementById('check_drawSceneNodeHierarchy').checked = false;
        htmlDoc.getElementById('check_drawOpaqueNodesExtents').checked = false;
        htmlDoc.getElementById('check_drawPhysicsGeometry').checked = false;
        htmlDoc.getElementById('check_drawPhysicsExtents').checked = false;
        htmlDoc.getElementById('check_drawAreasExtents').checked = false;
        htmlDoc.getElementById('check_drawPortals').checked = false;
        htmlDoc.getElementById('check_useSkinBindPose').checked = false;
        htmlDoc.getElementById('check_drawNormals').checked = false;
        htmlDoc.getElementById('check_drawTangents').checked = false;
        htmlDoc.getElementById('check_drawBinormals').checked = false;

        htmlDoc.getElementById('selectWireframe').onchange = dropDownBoxCheck;
        htmlDoc.getElementById('debugShaders').onchange = dropDownBoxCheck;
        htmlDoc.getElementById('check_drawLights').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawInterpolators').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawSkeleton').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawSceneNodeHierarchy').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawOpaqueNodesExtents').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawPhysicsGeometry').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawPhysicsExtents').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawAreasExtents').onclick = drawOptionFn;
        htmlDoc.getElementById('check_drawPortals').onclick = drawOptionFn;
        htmlDoc.getElementById('check_useSkinBindPose').onclick = drawOptionFn;
        htmlDoc.getElementById('text_animScale').onchange = drawOptionFloatValueFn;
        htmlDoc.getElementById('text_movementScale').onchange = drawOptionFloatValueFn;
        htmlDoc.getElementById('text_normalsScale').onchange = drawOptionFloatValueFn;

        check_drawNormals.onclick = drawOptionFn;
        check_drawTangents.onclick = drawOptionFn;
        check_drawBinormals.onclick = drawOptionFn;

        function setOptions()
        {
            var selectBox = htmlDoc.getElementById('debugShaders');
            var debugNormalsExist, debugBinormalsExist, debugTangentsExist;
            selectBox.options.length = 0;
            selectBox.options.add(new Option("None", "removeDebugShaders", false));
            debugNormalsExist = viewer.hasSemantic("SEMANTIC_NORMAL");
            debugBinormalsExist = viewer.hasSemantic("SEMANTIC_BINORMAL");
            debugTangentsExist = viewer.hasSemantic("SEMANTIC_TANGENT");

            check_drawNormals.disabled = !debugNormalsExist;
            check_drawTangents.disabled = !debugTangentsExist;
            check_drawBinormals.disabled = !debugBinormalsExist;

            if (debugNormalsExist)
            {
                selectBox.options.add(new Option("Debug Normals", "enableDebugNormals"));
            }
            if (debugBinormalsExist)
            {
                selectBox.options.add(new Option("Debug Binormals", "enableDebugBinormals"));
            }
            if (debugTangentsExist)
            {
                selectBox.options.add(new Option("Debug Tangents", "enableDebugTangents"));
            }

            selectBox = htmlDoc.getElementById('selectWireframe');
            selectBox.options.length = 0;
            selectBox.options.add(new Option("None", "deselectWireframe", false));
            selectBox.options.add(new Option("Default", "enableDefaultWireframe"));
            selectBox.options.add(new Option("Blueprint", "enableBlueprintWireframe"));
        }
        setOptions();

        function destroySceneFn()
        {
            if (viewer)
            {
                viewer.destroy();
                viewer = null;
            }
        }

        TurbulenzEngine.onunload = destroySceneFn;

        isLoading = false;
    }

    var fileInputElement = document.getElementById("assetfileinput");
    var baseurlInputElement = document.getElementById("asseturlinput");
    var mappingInputElement = document.getElementById("assetmappinginput");
    var loadFileInputElement = document.getElementById("buttonloadassetfile");
    if (!fileInputElement || !baseurlInputElement || !mappingInputElement || !loadFileInputElement)
    {
        window.alert('Turbulenz Viewer needs to be launched from the html file');
    }

    var lastSearch = document.location.search;

    function doLoad() {
        if (isLoading)
        {
            return;
        }
        else
        {
            isLoading = true;
        }

        var baseURL = baseurlInputElement.value;
        var baseURLLength = baseURL.length;
        if (baseURLLength && baseURL[baseURLLength - 1] !== '/')
        {
            baseURL = baseURL.concat('/');
        }
        var mappingTable = mappingInputElement.value;
        var assetPath = fileInputElement.value;

        viewer.pathPrefix = baseURL;
        viewer.load(assetPath, baseURL, mappingTable, false, onSceneLoadedFn);

        var title = 'Viewer - ' + assetPath.slice(assetPath.lastIndexOf("/") + 1);
        document.title = title;
        if (typeof window.history !== 'undefined')
        {
            var search = '?baseurl=' + baseURL + '&assetpath=' + assetPath;
            if (mappingTable !== 'mapping_table.json')
            {
                search = search + '&mapping_table=' + mappingTable;
            }
            var path = document.location.pathname + search;
            var state = { baseurl: baseURL,
                          assetpath: assetPath,
                          mapping_table: mappingTable };
            if (lastSearch !== search)
            {
                lastSearch = search;
                window.history.pushState(state, title, path);
            }
            else
            {
                window.history.replaceState(state, title, path);
            }
        }
    }

    loadFileInputElement.onclick = doLoad;
    loadFileInputElement = null;

    function checkQueryString() {
        var qsValues = getQueryStringDict();
        if (qsValues.assetpath)
        {
            fileInputElement.value = qsValues.assetpath;
            baseurlInputElement.value = qsValues.baseurl || baseurlInputElement.value;
            if (qsValues.mapping_table !== undefined)
            {
                mappingInputElement.value = qsValues.mapping_table;
            }
            doLoad();
        }
    }

    checkQueryString();

    if (typeof window.history !== 'undefined')
    {
        window.onpopstate = function (event) {
            var state = event.state;
            if (state)
            {
                fileInputElement.value = state.assetpath;
                baseurlInputElement.value = state.baseurl;
                mappingInputElement.value = state.mapping_table;
                doLoad();
            }
            else
            {
                checkQueryString();
            }
        };
    }
}

TurbulenzEngine.onload = function viewerStartupFn()
{
    createSceneFn();
};
