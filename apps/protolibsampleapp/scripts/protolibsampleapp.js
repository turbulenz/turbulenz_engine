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
        var protolib = this.protolib;
        var mathDevice = protolib.getMathDevice();

        //Vars
        this.frameCount = 0;
        this.degToRad = Math.PI / 180;

        //Intermediate variables
        this.tempCameraPosition = mathDevice.v3Build(0, 0, 0);
        this.tempCameraDirection = mathDevice.v3Build(0, 0, 0);
        this.tempCameraRotation = 0;
        this.tempLightPosition = mathDevice.v3Build(1, 3, -1);
        this.tempLightDirection = mathDevice.v3Build(-1, -3, 1);

        this.spinningLogoRotationMatrix = mathDevice.m43BuildIdentity();

        //Background
        var bgColor = mathDevice.v3Build(0.5, 0.5, 0.5);
        protolib.setClearColor(bgColor);
        protolib.setAmbientLightColor(bgColor);

        //Camera
        this.cameraRadius = 3;
        this.cameraFocus = mathDevice.v3Build(0, 1, 0);
        this.minCameraRadius = 2;
        this.maxCameraRadius = 6;
        protolib.setCameraFOV(90 * this.degToRad, 90 * this.degToRad);
        protolib.setNearFarPlanes(0.01, 10);

        //Lights
        this.lightRotation = 0;
        this.lightColor = mathDevice.v3Build(1, 1, 1);

        this.spotLight = protolib.addSpotLight({
            v3Position : this.tempLightPosition,
            v3Direction : this.tempLightDirection,
            range : 5,
            spreadAngle: Math.PI / 2,
            v3Color : this.lightColor
        });

        //Mesh
        this.meshRotation = 0;
        this.lastMeshRotation = 0;
        this.lastMeshRotateTime = 0;
        this.spinningLogo = protolib.loadMesh({
            mesh: 'models/tz_logo.dae',
            v3Size: mathDevice.v3Build(0.5, 0.5, 0.5),
            v3Position: mathDevice.v3Build(0, 1, 0)
        });

        //Floor
        this.whiteFloor = protolib.loadMesh({
            mesh: 'models/white_cube.dae',
            v3Size: mathDevice.v3Build(50, 0.1, 50),
            v3Position: mathDevice.v3Build(0, -0.06, 0)
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
        if (this.protolibConfig.disableSound)
        {
            volumeInput.disabled = true;
        }

        // Volume slider
        this.volumeSliderID = protolib.addWatchVariable({
                title: 'Volume',
                object: protolib.globals.settings,
                property: 'volume',
                group: "Settings",
                type: protolib.watchTypes.SLIDER,
                options: volumeInput
            });
        this.lastVolume = protolib.globals.settings.volume;
        protolib.globals.settings.volume = 0; // Mute by default

        //Text
        this.turbulenzText = {
            text: 'Powered by Turbulenz',
            position: [180, protolib.height - 100],
            v3Color: [1.0, 1.0, 1.0],
            scale: 1
        };
        this.turbulenzTextScaleSliderID = protolib.addWatchVariable({
                title: 'Text Scale',
                object: this.turbulenzText,
                property: 'scale',
                group: "Debug",
                type: protolib.watchTypes.SLIDER,
                options: {
                    min: 0.1,
                    max: 10,
                    step: 0.1
                }
            });
        this.rotationScaleSliderID = protolib.addWatchVariable({
                title: 'Mesh Rotation',
                object: this,
                property: 'meshRotation',
                group: "Debug",
                type: protolib.watchTypes.SLIDER,
                options: {
                    min: 0,
                    max: Math.PI * 2,
                    step: Math.PI * 2 / 360 //1 degree
                }
            });

        this.currentTime = TurbulenzEngine.time;
        this.previousTime = 0;
    },

    update: function updateFn()
    {
        var protolib = this.protolib;
        var utils = protolib.utils;
        var mathDevice = protolib.getMathDevice();

        if (protolib.beginFrame())
        {
            protolib.draw2DSprite({
                texture: 'textures/tz-logo.png',
                position: [50, protolib.height - 150],
                width: 100,
                height: 100
            });

            var soundSpritePosition = [protolib.width - 100, protolib.height - 100];
            protolib.draw2DSprite({
                texture: 'textures/sound.png',
                position: soundSpritePosition,
                width: 50,
                height: 50
            });

            var mousePosition = protolib.getMousePosition();
            if (protolib.isMouseJustDown(protolib.mouseCodes.BUTTON_0))
            {
                if (mousePosition[0] > soundSpritePosition[0] &&
                    mousePosition[0] < soundSpritePosition[0] + 50 &&
                    mousePosition[1] > soundSpritePosition[1] &&
                    mousePosition[1] < soundSpritePosition[1] + 50)
                {
                    if (protolib.globals.settings.volume > 0)
                    {
                        this.lastVolume = protolib.globals.settings.volume;
                        protolib.globals.settings.volume = 0;
                    }
                    else
                    {
                        protolib.globals.settings.volume = this.lastVolume;
                    }
                }
            }

            if (protolib.globals.settings.volume === 0)
            {
                protolib.draw2DSprite({
                    texture: 'textures/cross.png',
                    v3Color: [1.0, 0.0, 0.0],
                    position: [protolib.width - 100, protolib.height - 100],
                    width: 50,
                    height: 50
                });
            }

            this.turbulenzText.position[1] = protolib.height - 100;
            protolib.drawText(this.turbulenzText);

            this.currentTime = TurbulenzEngine.time;
            var deltaTime = this.currentTime - this.previousTime;
            if (deltaTime > 0.1)
            {
                deltaTime = 0.1;
            }
            this.previousTime = this.currentTime;

            if (this.lastMeshRotation === this.meshRotation)
            {
                if (this.lastMeshRotateTime + 3 < this.currentTime)
                {
                    this.meshRotation += Math.PI * 2 * deltaTime * this.meshRotateSpeed;
                    this.meshRotation %= Math.PI * 2;
                    this.lastMeshRotation = this.meshRotation;
                }
            }
            else
            {
                this.lastMeshRotation = this.meshRotation;
                this.lastMeshRotateTime = this.currentTime;
            }

            mathDevice.m43SetAxisRotation(this.spinningLogoRotationMatrix, mathDevice.v3BuildYAxis(), this.meshRotation);
            this.spinningLogo.setRotationMatrix(this.spinningLogoRotationMatrix);

            //Camera controller: Rotate camera around y axis.
            var mouseDelta = protolib.getMouseDelta();

            if (protolib.isMouseDown(protolib.mouseCodes.BUTTON_0))
            {
                this.tempCameraRotation += mouseDelta[0] / 100;
            }

            var mouseWheelDelta = protolib.getMouseWheelDelta();
            var cameraRadius = this.cameraRadius = utils.clamp(this.cameraRadius + (0.2 * mouseWheelDelta), this.minCameraRadius, this.maxCameraRadius);

            var x = cameraRadius * Math.sin(this.tempCameraRotation);
            var z = cameraRadius * Math.cos(this.tempCameraRotation);
            mathDevice.v3Build(x, 2.5, z, this.tempCameraPosition);
            protolib.setCameraPosition(this.tempCameraPosition);

            mathDevice.v3Sub(this.cameraFocus, this.tempCameraPosition, this.tempCameraDirection);
            protolib.setCameraDirection(this.tempCameraDirection);

            //Rotate light around y axis.
            if (protolib.isKeyDown(protolib.keyCodes.LEFT))
            {
                this.lightRotation -= 0.05;
            }
            else if (protolib.isKeyDown(protolib.keyCodes.RIGHT))
            {
                this.lightRotation += 0.05;
            }
            mathDevice.v3Build(Math.cos(this.lightRotation), 3, Math.sin(this.lightRotation), this.tempLightPosition);
            this.spotLight.setPosition(this.tempLightPosition);
            mathDevice.v3ScalarMul(this.tempLightPosition, -1, this.tempLightDirection);
            this.spotLight.setDirection(this.tempLightDirection);

            //Light sprite.
            protolib.draw3DSprite({
                texture: "textures/dot.png",
                blendStyle: protolib.blendStyle.ADDITIVE,
                v3Position: this.tempLightPosition,
                size: 0.2,
                v3Color: this.lightColor
            });

            //3D Axis
            protolib.draw3DLine({pos1: [0, 0, 0], pos2: [1, 0, 0], v3Color: [1, 0, 0]});
            protolib.draw3DLine({pos1: [0, 0, 0], pos2: [0, 1, 0], v3Color: [0, 1, 0]});
            protolib.draw3DLine({pos1: [0, 0, 0], pos2: [0, 0, 1], v3Color: [0, 0, 1]});

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
