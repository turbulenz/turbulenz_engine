// Copyright (c) 2013 Turbulenz Limited
/* global Protolib: false*/
/* global Config: false*/

function Application() {}
Application.prototype =
{
    // Use the properties from Config by default, otherwise use these defaults
    protolibConfig: Protolib.extend(true, {
        fps: 60,
        useShadows: true,
        fonts: {
            regular: "opensans"
        }
    },
    Config),

    init: function initFn()
    {
        var protolib = this.protolib;
        var md = protolib.getMathDevice();

        //Vars
        this.frameCount = 0;

        this.origin = md.v3Build(0, 0, 0);
        this.white = md.v3Build(1, 1, 1);
        this.red = md.v3Build(1, 0, 0);
        this.unitX = md.v3BuildXAxis();
        this.unitY = md.v3BuildYAxis();
        this.unitZ = md.v3BuildZAxis();
        this.degToRad = Math.PI / 180;

        this.cameraPosition = md.v3Build(0, 0, 0);
        this.cameraDirection = md.v3Build(0, 0, 0);

        this.cameraRotation = 0;
        this.cameraRadius = 3;
        this.cameraFocus = md.v3Build(0, 1, 0);

        this.lightPosition = md.v3Build(1, 3, -1);
        this.lightDirection = md.v3Build(-1, -3, 1);
        this.lightColor = md.v3Build(1, 1, 1);
        this.lightRotation = 0;

        this.spinningLogoRotationMatrix = md.m43BuildIdentity();

        //Camera
        protolib.setCameraFOV(90 * this.degToRad, 90 * this.degToRad);
        protolib.setNearFarPlanes(0.01, 10);

        //Lights
        var bgColor = md.v3Build(0.5, 0.5, 0.5);
        protolib.setClearColor(bgColor);
        protolib.setAmbientLightColor(bgColor);

        this.spotLight = protolib.addSpotLight({
            v3Position : this.lightPosition,
            v3Direction : this.lightDirection,
            range : 5,
            spreadAngle: Math.PI / 2,
            v3Color : this.lightColor
        });

        //Meshes
        this.spinningLogo = protolib.loadMesh({
            mesh: 'models/tz_logo.dae',
            v3Size: md.v3Build(0.5, 0.5, 0.5),
            v3Position: md.v3Build(0, 1, 0)
        });

        this.whiteFloor = protolib.loadMesh({
            mesh: 'models/white_cube.dae',
            v3Size: md.v3Build(50, 0.1, 50),
            v3Position: md.v3Build(0, -0.06, 0)
        });

        //Sound
        this.bgSound = protolib.playSound({
            sound: "sounds/bgmusic_loop.ogg",
            background: true,
            volume: 0.5,
            looping: true
        });

        //Hiding mouse logic.
        var inputDevice = protolib.getInputDevice();
        inputDevice.addEventListener('mouseenter', function ()
        {
            inputDevice.hideMouse();
        });

        //Add sliders
        var volumeInput = {
                min : 0,
                max : 1,
                step : 0.05
            };
        if (Config.disableSound)
        {
            volumeInput.disabled = true;
        }

        // Volume slider
        this.volumeSliderID = protolib.addWatchVariable({
                title: 'Volume',
                object: protolib.globals.settings,
                property: 'volume',
                group: "Settings",
                type: protolib.watch.SLIDER,
                options: volumeInput
            });

        //Text
        this.turbulenzText = {
            text: 'Powered by Turbulenz',
            position: [180, protolib.height - 100],
            v3Color: this.white,
            scale: 1
        };
        this.turbulenzTextScaleSliderID = protolib.addWatchVariable({
                title: 'Text Scale',
                object: this.turbulenzText,
                property: 'scale',
                group: "Debug",
                type: protolib.watch.SLIDER,
                options: {
                    min: 0.1,
                    max: 10,
                    step: 0.1
                }
            });
    },

    update: function updateFn()
    {
        var protolib = this.protolib;
        var utils = protolib.utils;
        var md = protolib.getMathDevice();

        if (protolib.beginFrame())
        {
            protolib.draw2DSprite({
                texture: 'textures/tz-logo.png',
                position: [50, protolib.height - 150],
                width: 100,
                height: 100
            });

            protolib.draw2DSprite({
                texture: 'textures/sound.png',
                position: [protolib.width - 100, protolib.height - 100],
                width: 50,
                height: 50
            });

            if (protolib.globals.settings.volume === 0)
            {
                protolib.draw2DSprite({
                    texture: 'textures/cross.png',
                    v3Color: this.red,
                    position: [protolib.width - 100, protolib.height - 100],
                    width: 50,
                    height: 50
                });
            }

            this.turbulenzText.position[1] = protolib.height - 100;
            protolib.drawText(this.turbulenzText);

            //Light sprite.
            protolib.draw3DSprite({
                texture: "textures/dot.png",
                blendStyle: protolib.blendStyle.ADDITIVE,
                v3Position: this.lightPosition,
                size: 0.2,
                v3Color: this.lightColor
            });

            md.m43SetAxisRotation(this.spinningLogoRotationMatrix, this.unitY, this.frameCount / 250);
            this.spinningLogo.setRotationMatrix(this.spinningLogoRotationMatrix);

            //Camera controller: Rotate camera around y axis.
            var mouseDelta = protolib.getMouseDelta();

            if (protolib.isMouseDown(protolib.mouseCodes.BUTTON_0))
            {
                this.cameraRotation += mouseDelta[0] / 100;
            }

            var mouseWheelDelta = protolib.getMouseWheelDelta();
            this.cameraRadius += 0.2 * mouseWheelDelta;
            this.cameraRadius = utils.clamp(this.cameraRadius, 2, 6);

            var x = this.cameraRadius * Math.sin(this.cameraRotation);
            var z = this.cameraRadius * Math.cos(this.cameraRotation);
            md.v3Build(x, 2.5, z, this.cameraPosition);
            protolib.setCameraPosition(this.cameraPosition);

            md.v3Sub(this.cameraFocus, this.cameraPosition, this.cameraDirection);
            protolib.setCameraDirection(this.cameraDirection);

            //Rotate light around y axis.
            if (protolib.isKeyDown(protolib.keyCodes.LEFT))
            {
                this.lightRotation -= 0.05;
            }
            else if (protolib.isKeyDown(protolib.keyCodes.RIGHT))
            {
                this.lightRotation += 0.05;
            }
            md.v3Build(Math.cos(this.lightRotation), 3, Math.sin(this.lightRotation), this.lightPosition);
            this.spotLight.setPosition(this.lightPosition);
            md.v3ScalarMul(this.lightPosition, -1, this.lightDirection);
            this.spotLight.setDirection(this.lightDirection);

            //3D Axis
            protolib.draw3DLine({pos1: this.origin, pos2: this.unitX, v3Color: this.unitX});
            protolib.draw3DLine({pos1: this.origin, pos2: this.unitY, v3Color: this.unitY});
            protolib.draw3DLine({pos1: this.origin, pos2: this.unitZ, v3Color: this.unitZ});

            protolib.draw2DSprite({
                texture: "textures/cursor.png",
                position: protolib.getMousePosition(),
                width: 40,
                height: 40
            });

            this.frameCount += 1;
            protolib.endFrame();
        }
    },

    destroy: function destroyFn()
    {
        // Destruction code goes here
        var protolib = this.protolib;
        if (protolib)
        {
            protolib.destroy();
            this.protolib = null;
        }
    }
};

// Application constructor function
Application.create = function applicationCreateFn(protolib)
{
    var app = new Application();
    app.protolib = protolib;
    app.init();
    return app;
};
