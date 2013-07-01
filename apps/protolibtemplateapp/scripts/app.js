// Copyright (c) 2013 Turbulenz Limited
/* global Protolib: false*/
/* global Config: false*/

function Application() {}
Application.prototype =
{
    // Use the properties from Config by default, otherwise use these defaults
    protolibConfig: Protolib.extend(true, {
        fps: 60,
        useShadows: true
    },
    Config),

    init: function initFn()
    {
        // Locally referenced variables to use for this function
        var protolib = this.protolib;
        var mathDevice = protolib.getMathDevice();

        // Set the background color to clear during protolib.beginFrame
        protolib.setClearColor(mathDevice.v3Build(0, 0, 0));

        // Initialization code goes here
    },

    update: function updateFn()
    {
        var protolib = this.protolib;
        if (protolib.beginFrame())
        {
            // Update code goes here

            // Render code goes here
            protolib.endFrame();
        }
    },

    destroy: function destroyFn()
    {
        var protolib = this.protolib;
        if (protolib)
        {
            // Destruction code goes here
            protolib.destroy();
            this.protolib = null;
        }
    }
};

// Application constructor function
Application.create = function applicationCreateFn(params)
{
    var app = new Application();
    app.protolib = params.protolib;
    if (!app.protolib)
    {
        var console = window.console;
        if (console)
        {
            console.error("Protolib could not be found");
        }
        return null;
    }
    app.init();
    return app;
};
