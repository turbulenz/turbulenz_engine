/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: User Data
 * @description:
 * This samples shows how to load and save user specific data using our Turbulenz services.
*/

/*{{ javascript("jslib/aabbtree.js") }}*/
/*{{ javascript("jslib/camera.js") }}*/
/*{{ javascript("jslib/geometry.js") }}*/
/*{{ javascript("jslib/material.js") }}*/
/*{{ javascript("jslib/light.js") }}*/
/*{{ javascript("jslib/scenenode.js") }}*/
/*{{ javascript("jslib/scene.js") }}*/
/*{{ javascript("jslib/vmath.js") }}*/
/*{{ javascript("jslib/effectmanager.js") }}*/
/*{{ javascript("jslib/shadermanager.js") }}*/
/*{{ javascript("jslib/texturemanager.js") }}*/
/*{{ javascript("jslib/renderingcommon.js") }}*/
/*{{ javascript("jslib/defaultrendering.js") }}*/
/*{{ javascript("jslib/observer.js") }}*/
/*{{ javascript("jslib/resourceloader.js") }}*/
/*{{ javascript("jslib/utilities.js") }}*/
/*{{ javascript("jslib/requesthandler.js") }}*/
/*{{ javascript("jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("jslib/indexbuffermanager.js") }}*/

/*{{ javascript("jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("jslib/services/gamesession.js") }}*/
/*{{ javascript("jslib/services/mappingtable.js") }}*/
/*{{ javascript("jslib/services/userdatamanager.js") }}*/
/*{{ javascript("jslib/services/osdlib.js") }}*/

/*{{ javascript("scripts/sceneloader.js") }}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global TurbulenzEngine: true */
/*global TurbulenzServices: false */
/*global RequestHandler: false */
/*global OSD: false */
/*global MathDeviceConvert: false */
/*global UserDataManager: false */
/*global TextureManager: false */
/*global ShaderManager: false */
/*global EffectManager: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global Camera: false */
/*global HTMLControls: false */
/*global DefaultRendering: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };

    var osd = OSD.create();

    // Print a message to the on-screen-display that the game is loading
    osd.startLoading();


    var inputDevice = TurbulenzEngine.createInputDevice({});

    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    if (!graphicsDevice.shadingLanguageVersion)
    {
        errorCallback("No shading language support detected.\nPlease check your graphics drivers are up to date.");
        graphicsDevice = null;
        return;
    }

    // Clear the background color of the engine window
    var clearColor = [0.87, 0.87, 0.87, 1.0];
    if (graphicsDevice.beginFrame())
    {
        graphicsDevice.clear(clearColor);
        graphicsDevice.endFrame();
    }

    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var requestHandlerParameters = {};
    var requestHandler = RequestHandler.create(requestHandlerParameters);

    var textureManager = TextureManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, errorCallback);
    var effectManager = EffectManager.create();

    var scene = Scene.create(mathDevice);
    var sceneLoader = SceneLoader.create();
    var renderer;
    // Setup world space
    var worldUp = mathDevice.v3BuildYAxis();

    // Setup a camera to view a close-up object
    var camera = Camera.create(mathDevice);
    var cameraDistanceFactor = 1.0;
    camera.nearPlane = 0.05;

    // The name of the node we want to rotate to demonstrate loading and saving engine objects
    var nodeName = "LOD3sp";
    var objectNode = null;

    var rotation = 0;
    var transformToRotateFrom = mathDevice.m43BuildIdentity();
    var rotationTransform = mathDevice.m43BuildIdentity();
    var duckTransform = mathDevice.m43BuildIdentity();
    var duckSpeed = 0.1;
    var duckDirection = 1;

    var saveId = 1;
    var setText = document.getElementById("userDataSet");
    var getText = document.getElementById("userDataGet");
    var duckText = document.getElementById("userDataDuck");
    var getKeysText = document.getElementById("userDataGetKeys");

    var setInnerHTML = function setInnerHTMLFn(documentElement, value)
    {
        if (documentElement)
        {
            documentElement.innerHTML = value;
        }
    };

    var appendInnerHTML = function appendInnerHTMLFn(documentElement, value)
    {
        if (documentElement)
        {
            documentElement.innerHTML += value;
        }
    };

    var buttonLoadDuck = document.getElementById("buttonLoadDuck");
    var buttonSaveDuck = document.getElementById("buttonSaveDuck");
    var buttonRemoveDuck = document.getElementById("buttonRemoveDuck");
    var buttonsAvailable = buttonLoadDuck && buttonSaveDuck && buttonRemoveDuck;

    var buttonsSetDisabled = function buttonsSetDisabledFn(disabledValue)
    {
        if (buttonsAvailable)
        {
            buttonLoadDuck.disabled = disabledValue;
            buttonSaveDuck.disabled = disabledValue;
            buttonRemoveDuck.disabled = disabledValue;
        }
    };
    buttonsSetDisabled(true);

    var gameSession;
    var userDataManager;
    var duckSaveOperation = false;

    var userDataGetKeys = function userDataGetKeysFn()
    {
        // Function to call once the Turbulenz Services have successfully completed a set
        var getKeysSuccess = function setSuccessFn(keys)
        {
            setInnerHTML(getKeysText, 'Key list:<br />');
            var keysLength = keys.length;
            for (var i = 0; i < keysLength; i += 1)
            {
                var key = keys[i];
                appendInnerHTML(getKeysText, key + '<br />');
            }
        };
        setInnerHTML(getKeysText, 'Getting keys...<br />');
        userDataManager.getKeys(getKeysSuccess);
    };

    var userDataGet = function userDataGetFn()
    {
        // Keep track of the number of get operations to reply with success
        var keysToGet = 2;

        // Function to call once the Turbulenz Services have successfully completed a get
        var getSuccess = function getSuccessFn(/* key, value */)
        {
            keysToGet -= 1;
            if (!keysToGet)
            {
                appendInnerHTML(getText, 'All keys successfully retrieved<br />');
            }
        };

        userDataManager.get("demo", function getDemoValueFn(key, value)
            {
                appendInnerHTML(getText, 'Key "' + key + '" has value "' + value + '"<br />');
                getSuccess();
            });

        userDataManager.get("complex-object", function getComplexObjectValueFn(key, value)
            {
                var complexObject = JSON.parse(value);
                appendInnerHTML(getText, 'Key "' + key + '" has value ' + value + '<br />');
                appendInnerHTML(getText, 'It can be parsed to get ' + complexObject.can.have[2]["we want"] + '<br />');
                getSuccess();
            });
    };

    var userDataSet = function userDataSetFn()
    {
        // Keep track of the number of set operations to reply with success
        var keysToSet = 2;

        // Function to call once the Turbulenz Services have successfully completed a set
        var setSuccess = function setSuccessFn(key)
        {
            var text = 'Key "' + key + '" has been successfully set';
            appendInnerHTML(setText, text + '<br />');
            window.console.log(text);

            keysToSet -= 1;
            if (!keysToSet)
            {
                appendInnerHTML(setText, 'All keys successfully set<br />');

                // Now that the keys have been set we can retrieve them with get operations
                userDataGet();
                userDataGetKeys();
            }
        };

        // Set the key "demo" equal to the string "hello world"
        userDataManager.set("demo", "hello world", setSuccess);

        var complexObject = {
            "a": "complex object",
            "can": {
                "have": ["any", "structure", <string><any>{
                    "we want": 438
                }]
            }
        };
        // Set the key "complex-object" equal to a stringified object
        userDataManager.set("complex-object", JSON.stringify(complexObject), setSuccess);
    };

    var userDataError =
        function userDataErrorFn(errorMsg, status?, errorMethod?)
    {
        window.console.log("userDataErrorFn: " + errorMsg);
        // This is called in the event of an error
        if (errorMethod === userDataManager.set)
        {
            appendInnerHTML(setText, errorMsg + '<br />');
        }
        else if (errorMethod === userDataManager.get)
        {
            appendInnerHTML(getText, errorMsg + '<br />');
        }
        else if (errorMethod === userDataManager.getKeys)
        {
            appendInnerHTML(getKeysText, errorMsg + '<br />');
        }
    };

    var duckError = function duckErrorFn(errorMsg)
    {
        appendInnerHTML(duckText, "Failed<br />" + errorMsg);
        buttonsSetDisabled(false);
        duckSaveOperation = false;
    };

    var htmlControls = HTMLControls.create();

    var loadDuck = function loadDuckFn()
    {
        window.console.log("Loading duck ...");
        var getSuccess = function setSuccessFn(key, value)
        {
            // Check that the value is set
            if (value)
            {
                var duckState = JSON.parse(value);
                if (duckState)
                {
                    var duckTransform = duckState.transform;
                    // Convert the duckTransform from a JavaScript array into a MathDevice object
                    // Here we can use a destination
                    MathDeviceConvert.arrayToM43(mathDevice, duckTransform, transformToRotateFrom);

                    duckDirection = duckState.direction;
                    htmlControls.updateCheckbox("checkReverseDuck", (duckDirection === 1));
                    rotation = 0;
                }

                appendInnerHTML(duckText, 'Complete');
            }
            else
            {
                appendInnerHTML(duckText, 'No duck save!');
            }

            duckSaveOperation = false;
            buttonsSetDisabled(false);
            // Remove the message on the on-screen-display concerning loading
            osd.stopLoading();
            window.console.log("... finished loading duck data");
        };

        duckSaveOperation = true;
        setInnerHTML(duckText, 'Loading the duck...<br />');
        buttonsSetDisabled(true);
        // Print message to on-screen-display that the stored state is being loaded
        osd.startLoading();

        userDataManager.get("duck.state" + saveId, getSuccess, duckError);
    };

    var removeDuck = function removeDuckFn()
    {
        var removeSuccess = function removeSuccessFn(/* key */)
        {
            appendInnerHTML(duckText, 'Complete');
            duckSaveOperation = false;
            buttonsSetDisabled(false);

            userDataGetKeys();
        };

        duckSaveOperation = true;
        setInnerHTML(duckText, 'Removing the duck save...<br />');
        buttonsSetDisabled(true);

        userDataManager.remove("duck.state" + saveId, removeSuccess, duckError);
    };

    var saveDuck = function saveDuckFn()
    {
        window.console.log("Saving duck data ...");

        // Function to call once the Turbulenz Services have successfully completed a set
        var setSuccess = function setSuccessFn(/* key */)
        {
            appendInnerHTML(duckText, 'Complete');
            buttonsSetDisabled(false);
            duckSaveOperation = false;
            // Remove the message from the on-screen-display about storing the state
            osd.stopSaving();

            userDataGetKeys();

            window.console.log("... finished setting duck data");
        };

        setInnerHTML(duckText, 'Saving the duck...<br />');
        buttonsSetDisabled(true);
        duckSaveOperation = true;
        // Print message to on-screen-display that the current state is being stored
        osd.startSaving();

        // Set the key "duck.state" to a native engine math object using the MathDeviceConvert object
        var duckTransformObject = {
            "transform": MathDeviceConvert.m43ToArray(objectNode.getLocalTransform()),
            "direction": duckDirection
        };
        userDataManager.set("duck.state" + saveId, JSON.stringify(duckTransformObject), setSuccess, duckError);
    };

    var userDataDemo = function userDataDemoFn()
    {
        // Check that the turbulenz services are available
        // When running the file from disk this will be false
        if (TurbulenzServices.available())
        {
            // Create the userData object from a gameSession
            // This must be done after the createGameSession callback has been called
            userDataManager = UserDataManager.create(requestHandler, gameSession, userDataError);

            setInnerHTML(document.getElementById("duckHeading"), "<h3>Duck state<\/h3>");
            setInnerHTML(document.getElementById("getKeysHeading"), "<h3>Get Keys status<\/h3>");
            setInnerHTML(setText, "<h3>Set status<\/h3>");
            setInnerHTML(getText, "<h3>Get status<\/h3>");
            buttonsSetDisabled(false);

            userDataSet();
            loadDuck();
        }
        else
        {
            var statusText = document.getElementById("userDataStatus");
            setInnerHTML(statusText, "<h3>Turbulenz Services Unavailable<\/h3>");
            appendInnerHTML(statusText, "You must run this sample from the local server");
        }
    };

    // Touch / mouse controls

    var saved = false;
    inputDevice.addEventListener('mouseup', function onMouseUpFn() {
        if (saved)
        {
            loadDuck();
        }
        else
        {
            saveDuck();
        }
        saved = !saved;
    });

    // HTML controls

    htmlControls.addButtonControl({
        id: "buttonLoadDuck",
        value: "Get",
        fn: loadDuck
    });
    htmlControls.addButtonControl({
        id: "buttonSaveDuck",
        value: "Set",
        fn: saveDuck
    });
    htmlControls.addButtonControl({
        id: "buttonRemoveDuck",
        value: "Remove",
        fn: removeDuck
    });
    htmlControls.addCheckboxControl({
        id: "checkReverseDuck",
        value: "Clockwise",
        isSelected: (duckDirection === 1),
        fn: function reverseFn()
        {
            duckDirection = -duckDirection;
            return (duckDirection === 1);
        }
    });
    htmlControls.addRadioControl({
        id: "radioSave01",
        groupName: "saveId",
        radioIndex: 0,
        value: "pos01",
        fn: function ()
        {
            saveId = 1;
        },
        isDefault: true
    });
    htmlControls.addRadioControl({
        id: "radioSave02",
        groupName: "saveId",
        radioIndex: 1,
        value: "pos02",
        fn: function ()
        {
            saveId = 2;
        },
        isDefault: false
    });
    htmlControls.addRadioControl({
        id: "radioSave03",
        groupName: "saveId",
        radioIndex: 2,
        value: "pos03",
        fn: function ()
        {
            saveId = 3;
        },
        isDefault: false
    });
    htmlControls.register();

    // Initialize the previous frame time
    var previousFrameTime = TurbulenzEngine.time;

    var renderFrame = function renderFrameFn()
    {
        var currentTime = TurbulenzEngine.time;
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        var deviceWidth = graphicsDevice.width;
        var deviceHeight = graphicsDevice.height;
        var aspectRatio = (deviceWidth / deviceHeight);
        if (aspectRatio !== camera.aspectRatio)
        {
            camera.aspectRatio = aspectRatio;
            camera.updateProjectionMatrix();
        }
        camera.updateViewProjectionMatrix();

        if (objectNode)
        {
            rotation += deltaTime * duckSpeed * duckDirection;
            if (rotation > 2 * Math.PI)
            {
                rotation -= 2 * Math.PI;
            }
            else if (rotation < 0)
            {
                rotation += 2 * Math.PI;
            }

            mathDevice.m43FromAxisRotation(worldUp, rotation, rotationTransform);
            mathDevice.m43Mul(rotationTransform, transformToRotateFrom, duckTransform);
            objectNode.setLocalTransform(duckTransform);
        }

        scene.update();

        renderer.update(graphicsDevice, camera, scene, currentTime);

        if (graphicsDevice.beginFrame())
        {
            if (renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight))
            {
                renderer.draw(graphicsDevice, clearColor);
            }

            graphicsDevice.endFrame();
        }
    };

    var intervalID;
    var loadingLoop = function loadingLoopFn()
    {
        if (sceneLoader.complete())
        {
            TurbulenzEngine.clearInterval(intervalID);

            // For the default texture, take the result loaded by the scene
            objectNode = scene.findNode(nodeName);

            var sceneExtents = scene.getExtents();
            var sceneMinExtent = mathDevice.v3Build(sceneExtents[0], sceneExtents[1], sceneExtents[2]);
            var sceneMaxExtent = mathDevice.v3Build(sceneExtents[3], sceneExtents[4], sceneExtents[5]);
            var center = mathDevice.v3ScalarMul(mathDevice.v3Add(sceneMaxExtent, sceneMinExtent), 0.5);
            var extent = mathDevice.v3Sub(center, sceneMinExtent);

            camera.lookAt(center, worldUp, mathDevice.v3Build(center[0] + extent[0] * 2 * cameraDistanceFactor,
                                                              center[1] + extent[1] * cameraDistanceFactor,
                                                              center[2] + extent[2] * 2 * cameraDistanceFactor));
            camera.updateViewMatrix();

            renderer.updateShader(shaderManager);

            // Remove the message on the on-screen-display that the game is loading
            osd.stopLoading();

            userDataDemo();

            intervalID = TurbulenzEngine.setInterval(renderFrame, 1000 / 60);
        }
    };
    intervalID = TurbulenzEngine.setInterval(loadingLoop, 1000 / 10);

    var loadAssets = function loadAssetsFn()
    {
        // Renderer for the scene (requires shader assets).
        renderer = DefaultRendering.create(graphicsDevice,
                                           mathDevice,
                                           shaderManager,
                                           effectManager);

        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));

        // Create object using scene loader
        sceneLoader.load({
            scene : scene,
            assetPath : "models/duck.dae",
            graphicsDevice : graphicsDevice,
            mathDevice : mathDevice,
            textureManager : textureManager,
            effectManager : effectManager,
            shaderManager : shaderManager,
            requestHandler : requestHandler,
            append : false,
            dynamic : true
        });
    };

    var mappingTableReceived = function mappingTableReceivedFn(mappingTable)
    {
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        loadAssets();
    };

    var gameSessionCreated = function gameSessionCreatedFn(gameSession)
    {
        TurbulenzServices.createMappingTable(requestHandler,
                                             gameSession,
                                             mappingTableReceived);
    };
    gameSession = TurbulenzServices.createGameSession(requestHandler, gameSessionCreated);

    // Create a scene destroy callback to run when the window is closed
    TurbulenzEngine.onunload = function destroyScene()
    {
        TurbulenzEngine.clearInterval(intervalID);
        intervalID = null;

        if (gameSession)
        {
            gameSession.destroy();
            gameSession = null;
        }

        clearColor = null;

        rotation = null;
        if (scene)
        {
            scene.destroy();
            scene = null;
        }
        sceneLoader = null;
        requestHandler = null;
        camera = null;
        userDataManager = null;

        if (renderer)
        {
            renderer.destroy();
            renderer = null;
        }

        if (textureManager)
        {
            textureManager.destroy();
            textureManager = null;
        }

        if (shaderManager)
        {
            shaderManager.destroy();
            shaderManager = null;
        }

        effectManager = null;

        TurbulenzEngine.flush();
        graphicsDevice = null;
        mathDevice = null;
    };
};
