/*{# Copyright (c) 2010-2012 Turbulenz Limited #}*/

/*
 * @title: Basic loop
 * @description:
 * This sample is an introduction to the Turbulenz API.
 * It shows the Turbulenz Engine entry and exit points and how to set up a simple render loop that clears the background.
 * You can enable or disable the animation of the background clear colour.
*/

/*{# Import additional JS files here #}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global window: false */
/*global TurbulenzEngine: true */
/*global HTMLControls: false */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };
    TurbulenzEngine.onerror = errorCallback;

    // Create each of the native engine API devices to be used
    var mathDeviceParameters = {};
    var mathDevice = TurbulenzEngine.createMathDevice(mathDeviceParameters);

    var graphicsDeviceParameters = { };
    var graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

    // Setup the default graphics color
    var clearColor = [0.0, 0.0, 0.0, 1.0];

    //
    // This basic loop is used to simply change the graphics default color
    //
    // The rate at which the color should be changed
    var blendRate = 0.5;
    // The colors to blend between
    var blendColor1 = [0.2, 0.2, 0.4, 1.0];
    var blendColor2 = [0.6, 0.8, 0.8, 1.0];
    // The amount of blendColor2 to use compared to blendColor1 (0.0 - 1.0)
    var blendRatio = 0.0;
    // Increment or decrement the blendRatio (-1 or 1)
    var blendDir = 1;

    // Default control value
    var doBlend = true;

    //
    // updateColor: The function to update the graphicsDevice clearColor
    //
    var updateColor = function updateColorFn(delta)
    {
        // Declare the variables to be used in this function
        var blendDelta = (blendRate * delta);
        var channels = clearColor.length;
        var blendRatioInv;

        blendRatio += blendDelta * blendDir;
        if (blendRatio > 1.0)
        {
            blendRatio = 1.0;
            blendDir = -1;

        }
        if (blendRatio < 0.0)
        {
            blendRatio = 0.0;
            blendDir = 1;
        }
        blendRatioInv = 1.0 - blendRatio;

        // Blend the clear color output
        for (var i = 0; i < channels; i += 1)
        {
            clearColor[i] = (blendColor1[i] * blendRatioInv) + (blendColor2[i] * blendRatio);
        }
    };

    // Controls
    var htmlControls = HTMLControls.create();
    htmlControls.addCheckboxControl({
        id: "checkbox01",
        value: "doBlend",
        isSelected: doBlend,
        fn: function ()
        {
            doBlend = !doBlend;
            return doBlend;
        }
    });
    htmlControls.register();

    // Set the initial previous frametime for the first loop
    var previousFrameTime = TurbulenzEngine.time;

    //
    // Update: Should update the input, physics, sound and other js libraries used.
    //         The function should then trigger the rendering using the graphicsDevice
    //
    var update = function updateFn()
    {
        // Gets the currentTime to be used in calculations for this frame
        var currentTime = TurbulenzEngine.time;

        // Delta is calculated to be used by update functions that require the elapsed time since they were last called
        var deltaTime = (currentTime - previousFrameTime);
        if (deltaTime > 0.1)
        {
            deltaTime = 0.1;
        }

        // In this sample we are going to update the background color
        if (doBlend)
        {
            updateColor(deltaTime);
        }

        // Render the color
        if (graphicsDevice.beginFrame())
        {
            graphicsDevice.clear(clearColor, 1.0, 0);

            graphicsDevice.endFrame();
        }

        previousFrameTime = currentTime;
    };

    // Once all initialization is complete and functions are declared,
    // use setInterval to set the 'update' function to be called

    // This method of creating a loop allows the Turbulenz Engine to
    // hand control back to the browser and maintain the execution

    // It is recommended to use a single setInterval to trigger
    // updates at the rate required e.g. 60hz Updating that need to be
    // triggered less frequently should use either currentTime or
    // deltaTime to calculate when to update
    var intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

    TurbulenzEngine.onunload = function destroyScene()
    {
        // Clear the interval to stop update from being called
        TurbulenzEngine.clearInterval(intervalID);

        // Clear any references to memory
        clearColor = [];
        blendColor1 = [];
        blendColor2 = [];

        // Tell the Turbulenz Engine to force the js virtual machine
        // to free as much memory as possible
        TurbulenzEngine.flush();

        // Clear each native engine reference
        graphicsDevice = null;
        mathDevice = null;

        TurbulenzEngine.onunload = null;
    };
};
