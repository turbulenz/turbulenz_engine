// Copyright (c) 2011-2012 Turbulenz Limited

//
// Application: The global for the whole application
//

/*global TurbulenzEngine: false*/
/*global RequestHandler: false*/
/*global TurbulenzServices: false*/
/*global FontManager: false*/
/*global Utilities: false*/
/*global Point: false*/
/*global Canvas: false*/
/*global HTMLControls: false*/

/// <reference path="../../../../jslib-modular/turbulenz.d.ts" />
/// <reference path="../../../../jslib-modular/fontmanager.d.ts" />
/// <reference path="../../../../jslib-modular/canvas.d.ts" />
/// <reference path="../../../../jslib-modular/utilities.d.ts" />
/// <reference path="../../../../jslib-modular/servicedatatypes.d.ts" />
/// <reference path="../../../../jslib-modular/services.d.ts" />

/// <reference path="../../../../external/definitelytyped/jquery/jquery-1.8.d.ts" />
/// <reference path="../../scripts/htmlcontrols.d.ts" />

/// <reference path="point.ts" />

class Application
{
    inputDevice: InputDevice;
    graphicsDevice: GraphicsDevice;
    canvas: Canvas;
    canvas2dContext: CanvasContext;

    mappingTable: any;
    fps: number;

    isHovering: bool;
    isFocused: bool;
    isClicking: bool;
    isMouseOver: bool;
    isMouseMove: bool;
    isMouseWheel: bool;
    isPadMove: bool;
    isCanvas: bool;
    hasPadSupport: bool;
    hasShutDown: bool;

    // Text
    textSize                = "32px";
    typeface                = "opensans";
    verticalTextOffset: number;
    verticalPadTextOffset: number;
    mouseButtonTextOffset: Point;
    keyTextOffset: Point;
    padButtonTextOffset: Point;
    mouseOverTextOffset: Point;
    mouseMoveTextOffset: Point;
    mouseWheelTextOffset: Point;
    touchesTextOffset: Point;
    focusedTextOffset: Point;
    hiddenTextOffset: Point;
    lockedTextOffset: Point;
    padMoveTextOffset: Point;

    focusedText             = "Plugin has focus";
    keyText                 = "Key: ";
    key                     = "";
    mouseButtonText         = "Mouse Button: ";
    mouseButton             = "";
    padButtonText           = "Pad Button: ";
    padButton               = "";
    mouseWheelText          = "Mouse Wheel Delta: ";
    mouseOverText           = "Mouse Over: ";
    mouseMoveText           = "Mouse Move: ";
    padMoveText             = "";
    padMoveTextLX           = "";
    padMoveTextLY           = "";
    padMoveTextLZ           = "";
    padMoveTextRX           = "";
    padMoveTextRY           = "";
    padMoveTextRZ           = "";
    lockedText              = "Mouse locked";
    hiddenText              = "Mouse hidden";
    lockButtonText          = "Lock";
    unlockButtonText        = "Unlock";
    touchesDetectedText     = "Touches Detected: ";

    // Focus border
    focusBorderWidth    = 30;

    // Lock button
    lockButtonOffset: Point;
    lockButtonWidth     = 100;
    lockButtonHeight    = 50;

    // Cursor
    cursorScalar    = 2.0;

    // Pad move visual output
    padCircleRadius: number;
    padCircleCenterRadius   = 5;
    padCircleLineWidth      = 2;
    padCircle1Position: Point;
    padCircle2Position: Point;
    padLeftTriggerPosition: Point;
    padRightTriggerPosition: Point;
    padTriggerWidth         = 15;

        // Logging and control related vars
    htmlControls: HTMLControls;
    logKeyboardInput: bool;
    logMouseButtonInput: bool;
    logMouseOverInput: bool;
    logMouseMoveInput: bool;
    logMouseWheelInput: bool;
    logPadButtonInput: bool;
    logPadMoveInput: bool;

    // Colors
    defaultTextColor        = "#FFFFFF";
    hoveringBackgroundColor = "#FF0000";
    defaultBackgroundColor  = "#555555";
    focusBorderColor        = "#000000";
    lockButtonColor         = "#000000";
    padUnsupportedColor     = "#ABABAB";
    padCircleLineColor      = "#FFFFFF";
    padPositionLineColor    = "#FFFFFF";

    // Control codes
    keyCodes: any;
    mouseCodes: any;
    padCodes: any;

    // Reverse keycode maps
    intToKeyCode    = {};
    intToMouseCode  = {};
    intToPadCode    = {};

    // Pad analogue control positions
    padLeftTrigger      = 0;
    padRightTrigger     = 0;
    padLeftThumbstick: Point;
    padRightThumbstick: Point;

    // Mouse position and deltas
    mousePosition: Point;
    mouseDelta: Point;
    mouseWheelDelta     = 0;

    // Touch positions
    ongoingTouches = [];

    // Touch colors
    touchColors = [
        '#00ff00',
        '#ffff00',
        '#00ffff',
        '#ff00ff',
        '#ff0000',
        '#0000ff',
        '#eeeeee'
    ];

    // Textures
    cursorImageDefault: Texture;
    cursorImageClicking: Texture;
    cursorImageLocked: Texture;

    requestHandler: RequestHandler;

    gameSession: GameSession;
    intervalID: number;
    hasShutdown: bool;

    // Initialize the application
    init()
    {
        if (!this.createDevices(this.canvas))
        {
            // Failed to create all devices
            return;
        }

        this.hasPadSupport = this.getPadSupport();
        this.createReverseControlCodeMaps();
        this.createInputCallbacks();

        this.setupHtmlControls();
        this.writeLocale();

        this.requestHandler = RequestHandler.create({});

        var creationFunctions =
        [
            {func : this.createGameSession, isDependent : false},
            {func : this.createMappingTable, isDependent : true},
            {func : this.loadCursorImages, isDependent : true},
            {func : this.postSetup, isDependent : true}
        ];

        this.enterCallbackChain(this, creationFunctions);
    };

    // Update function called in main loop
    update()
    {
        this.inputDevice.update();
    };

    // Render function called in main loop
    render()
    {
        var graphicsDevice = this.graphicsDevice;
        var deviceHeight = graphicsDevice.height;
        var deviceWidth = graphicsDevice.width;
        var canvas = this.canvas;
        var canvas2dContext = this.canvas2dContext;

        // Start rendering a frame
        if (graphicsDevice.beginFrame())
        {
            // Canvas rendering
            canvas.width = deviceWidth;
            canvas.height = deviceHeight;

            canvas2dContext.beginFrame(graphicsDevice, [0, 0, deviceWidth, deviceHeight]);
            this.renderCanvas();
            canvas2dContext.endFrame();

            // End frame
            graphicsDevice.endFrame();
        }
    };

    renderCanvas()
    {
        var canvas = this.canvas;
        var canvas2dContext = this.canvas2dContext;

        // Clear background to red or grey
        if (this.isHovering)
        {
            canvas2dContext.fillStyle = this.hoveringBackgroundColor;
            canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);
        }
        else
        {
            canvas2dContext.fillStyle = this.defaultBackgroundColor;
            canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Focus
        if (this.isFocused)
        {
            this.drawFocusBorder();
        }

        // Lock button
        this.drawLockButton();

        // Draw text event output
        this.drawEventText();

        if (this.logPadMoveInput)
        {
            this.drawPadMove();
        }

        this.drawCursor();

        this.drawTouches();
    };

    drawText(text: string, xCoord: number, yCoord: number, color?)
    {
        var canvas2dContext = this.canvas2dContext;

        if (!color)
        {
            color = this.defaultTextColor;
        }

        canvas2dContext.fillStyle = color;
        canvas2dContext.fillText(text, xCoord, yCoord);
    };

    drawEventText()
    {
        var inputDevice             = this.inputDevice;
        var padMoveTextOffset       = this.padMoveTextOffset;
        var verticalPadTextOffset   = this.verticalPadTextOffset;
        var canvas2dContext         = this.canvas2dContext;
        var mouseOverText           = this.mouseOverText;
        var mouseMoveText           = this.mouseMoveText;
        var mouseWheelText          = this.mouseWheelText;
        var numberOfTouches         = this.ongoingTouches.length;

        // Set typeface and text size
        canvas2dContext.font = this.textSize + " " + this.typeface;

        // Focus
        if (this.isFocused)
        {
            this.drawText(this.focusedText, this.focusedTextOffset.x, this.focusedTextOffset.y);
        }

        // Keyboard and mouse button text
        if (this.logKeyboardInput)
        {
            this.drawText((this.keyText + this.key), this.keyTextOffset.x, this.keyTextOffset.y);
        }

        if (this.logMouseButtonInput)
        {
            this.drawText((this.mouseButtonText + this.mouseButton),
                          this.mouseButtonTextOffset.x, this.mouseButtonTextOffset.y);
        }

        if (this.logPadButtonInput)
        {
            this.drawText((this.padButtonText + this.padButton),
                          this.padButtonTextOffset.x, this.padButtonTextOffset.y);
        }

        // Draw mouseover text
        if (this.logMouseOverInput)
        {
            if (this.isMouseOver)
            {
                mouseOverText += "x = " + this.mousePosition.x + ", y = " + this.mousePosition.y;
            }

            this.drawText(mouseOverText, this.mouseOverTextOffset.x, this.mouseOverTextOffset.y);
        }

        // Draw mousemove text
        if (this.logMouseMoveInput)
        {
            if (this.isMouseMove)
            {
                mouseMoveText += "dX = " + this.mouseDelta.x + ", dY = " + this.mouseDelta.y;
            }

            this.drawText(mouseMoveText, this.mouseMoveTextOffset.x, this.mouseMoveTextOffset.y);
        }

        // Mouse wheel text
        if (this.logMouseWheelInput)
        {
            if (this.isMouseWheel)
            {
                mouseWheelText += this.mouseWheelDelta;
            }


            this.drawText(mouseWheelText, this.mouseWheelTextOffset.x,
                          this.mouseWheelTextOffset.y);
        }

        // Pad move text
        if (this.logPadMoveInput &&
            this.isPadMove)
        {
            this.drawText((this.padMoveText), this.padMoveTextOffset.x,
                          padMoveTextOffset.y);
            this.drawText((this.padMoveTextLX), this.padMoveTextOffset.x,
                          (padMoveTextOffset.y + (1 * verticalPadTextOffset)));
            this.drawText((this.padMoveTextLY), this.padMoveTextOffset.x,
                          (padMoveTextOffset.y + (2 * verticalPadTextOffset)));
            this.drawText((this.padMoveTextLZ), this.padMoveTextOffset.x,
                          (padMoveTextOffset.y + (3 * verticalPadTextOffset)));
            this.drawText((this.padMoveTextRX), this.padMoveTextOffset.x,
                          (padMoveTextOffset.y + (4 * verticalPadTextOffset)));
            this.drawText((this.padMoveTextRY), this.padMoveTextOffset.x,
                          (padMoveTextOffset.y + (5 * verticalPadTextOffset)));
            this.drawText((this.padMoveTextRZ), this.padMoveTextOffset.x,
                          (padMoveTextOffset.y + (6 * verticalPadTextOffset)));
        }

        // MouseHidden text
        if (inputDevice.isHidden())
        {
            this.drawText(this.hiddenText, this.hiddenTextOffset.x, this.hiddenTextOffset.y);
        }

        // Locked text
        if (inputDevice.isLocked())
        {
            this.drawText(this.lockedText, this.lockedTextOffset.x, this.lockedTextOffset.y);
        }

        // Touch text
        this.drawText((this.touchesDetectedText + numberOfTouches),
                      this.touchesTextOffset.x,
                      this.touchesTextOffset.y);
    };

    drawFocusBorder()
    {
        var canvas2dContext = this.canvas2dContext;
        var canvas = this.canvas;

        // Draw top border
        canvas2dContext.strokeStyle = this.focusBorderColor;
        canvas2dContext.lineWidth = this.focusBorderWidth;
        canvas2dContext.beginPath();
        canvas2dContext.moveTo(0, 0);
        canvas2dContext.lineTo(0, canvas.height);
        canvas2dContext.lineTo(canvas.width, canvas.height);
        canvas2dContext.lineTo(canvas.width, 0);
        canvas2dContext.lineTo(0, 0);
        canvas2dContext.closePath();
        canvas2dContext.stroke();
    };

    drawPadMove()
    {
        var canvas2dContext         = this.canvas2dContext;
        var circle1Position         = this.padCircle1Position;
        var circle2Position         = this.padCircle2Position;
        var circleRadius            = this.padCircleRadius;
        var circleCenterRadius      = this.padCircleCenterRadius;

        var triggerScalar           = (circleRadius * 2);
        var triggerWidth            = this.padTriggerWidth;

        var leftTriggerPosition     = this.padLeftTriggerPosition;
        var rightTriggerPosition    = this.padRightTriggerPosition;

        var leftThumbstick;
        var rightThumbstick;
        var leftTriggerHeight;
        var rightTriggerHeight;


        canvas2dContext.lineWidth = this.padCircleLineWidth;
        canvas2dContext.strokeStyle = this.padCircleLineColor;
        canvas2dContext.fillStyle = this.padCircleLineColor;

        // Draw circle 1 (for left thumbstick)
        canvas2dContext.beginPath();
        canvas2dContext.arc(circle1Position.x, circle1Position.y, circleRadius, 0, (Math.PI * 2), true);
        canvas2dContext.closePath();
        canvas2dContext.stroke();

        // Draw circle 1 center
        canvas2dContext.beginPath();
        canvas2dContext.arc(circle1Position.x, circle1Position.y, circleCenterRadius, 0, (Math.PI * 2), true);
        canvas2dContext.closePath();
        canvas2dContext.fill();

        // Draw circle 2 (for right thumbstick)
        canvas2dContext.beginPath();
        canvas2dContext.arc(circle2Position.x, circle2Position.y, circleRadius, 0, (Math.PI * 2), true);
        canvas2dContext.closePath();
        canvas2dContext.stroke();

        // Draw circle 2 center
        canvas2dContext.beginPath();
        canvas2dContext.arc(circle2Position.x, circle2Position.y, circleCenterRadius, 0, (Math.PI * 2), true);
        canvas2dContext.closePath();
        canvas2dContext.fill();

        canvas2dContext.fillStyle = this.padPositionLineColor;

        // Draw left thumbstick position
        leftThumbstick = Point.create((circle1Position.x + (this.padLeftThumbstick.x * circleRadius)),
                                      (circle1Position.y - (this.padLeftThumbstick.y * circleRadius)));

        canvas2dContext.beginPath();
        canvas2dContext.arc(leftThumbstick.x, leftThumbstick.y, circleCenterRadius, 0, (Math.PI * 2), true);
        canvas2dContext.closePath();
        canvas2dContext.fill();

        // Draw right thumbstick position
        rightThumbstick = Point.create((circle2Position.x + (this.padRightThumbstick.x * circleRadius)),
                                       (circle2Position.y - (this.padRightThumbstick.y * circleRadius)));

        canvas2dContext.beginPath();
        canvas2dContext.arc(rightThumbstick.x, rightThumbstick.y, circleCenterRadius, 0, (Math.PI * 2), true);
        canvas2dContext.closePath();
        canvas2dContext.fill();

        // Draw left trigger
        leftTriggerHeight = (this.padLeftTrigger * triggerScalar);
        leftTriggerHeight = Math.max(1, leftTriggerHeight);
        canvas2dContext.beginPath();
        canvas2dContext.fillRect(leftTriggerPosition.x, (leftTriggerPosition.y - leftTriggerHeight),
                                 triggerWidth, leftTriggerHeight);
        canvas2dContext.closePath();

        // Draw right trigger
        rightTriggerHeight = (this.padRightTrigger * triggerScalar);
        rightTriggerHeight = Math.max(1, rightTriggerHeight);
        canvas2dContext.beginPath();
        canvas2dContext.fillRect((rightTriggerPosition.x - triggerWidth),
                                 (rightTriggerPosition.y - rightTriggerHeight),
                                 triggerWidth, rightTriggerHeight);
        canvas2dContext.closePath();
    };

    drawCursor()
    {
        var cursorImageOrigin   = Point.create(0, 0);
        var canvas2dContext     = this.canvas2dContext;
        var mousePosition       = this.mousePosition;
        var canvas              = this.canvas;
        var cursorScalar        = this.cursorScalar;

        var cursorImage;

        // Draw cursor image
        if (this.isHovering)
        {
            if (this.inputDevice.isLocked())
            {
                cursorImage     = this.cursorImageLocked;
                mousePosition.x = (canvas.width * 0.5);
                mousePosition.y = (canvas.height * 0.5);
            }
            else if (this.isClicking)
            {
                cursorImage = this.cursorImageClicking;
            }

            else
            {
                cursorImage = this.cursorImageDefault;
            }

            cursorImageOrigin.x = mousePosition.x - (cursorImage.width * 0.5);
            cursorImageOrigin.y = mousePosition.y - (cursorImage.height * 0.5);

            canvas2dContext.save();
            canvas2dContext.drawImage(cursorImage,
                                      cursorImageOrigin.x,
                                      cursorImageOrigin.y,
                                      (cursorImage.width * cursorScalar),
                                      (cursorImage.height * cursorScalar));
            canvas2dContext.restore();
        }
    };

    drawTouches()
    {
        var touches         = this.ongoingTouches;
        var touchesLength   = touches.length;

        var touch;
        var touchColor;
        var i;

        for (i = 0; i < touchesLength; i += 1)
        {
            touch = touches[i];

            touchColor = this.getTouchColor(touch.identifier);
            this.drawTouch(touch, touchColor);
        }
    };

    getTouchColor(touchIndex)
    {
        var touchColors = this.touchColors;

        if (touchIndex < touchColors.length)
        {
            return this.touchColors[touchIndex];
        }
        else
        {
            return '#' + ('000000' + Math.floor((1 / touchIndex) * 0xFFFFFF).toString(16)).substr(-6);
        }
    };

    drawTouch(touch, color)
    {
        var canvas2dContext = this.canvas2dContext;
        var radiusX         = touch.radiusX;
        var radiusY         = touch.radiusY;
        var force           = touch.force;

        canvas2dContext.save();
        canvas2dContext.translate(touch.positionX, touch.positionY);
        canvas2dContext.rotate(touch.rotationAngle);
        canvas2dContext.scale(1, radiusY / radiusX);
        canvas2dContext.beginPath();
        canvas2dContext.arc(0, 0, radiusX, 0, 2 * Math.PI, false);
        canvas2dContext.closePath();
        canvas2dContext.fillStyle = color;
        canvas2dContext.fill();
        if (force !== 0)
        {
            // Generate a thin->fat outline fading from black to white dependent on force
            var forceScale = Math.pow(Math.min(1, force), 5);
            canvas2dContext.beginPath();
            canvas2dContext.arc(0, 0, radiusX, 0, 2 * Math.PI, false);
            var shade = Math.floor(0xff * forceScale).toString(16);
            canvas2dContext.strokeStyle = '#' + shade + shade + shade;
            canvas2dContext.lineWidth = 2 + 10 * forceScale;
            canvas2dContext.stroke();
        }
        canvas2dContext.restore();
    };

    drawLockButton()
    {
        var lockButtonOffset    = this.lockButtonOffset;
        var canvas2dContext     = this.canvas2dContext;
        var buttonText          = this.inputDevice.isLocked() ? this.unlockButtonText : this.lockButtonText;

        // Set typeface and text size
        canvas2dContext.font = this.textSize + " " + this.typeface;

        // Draw rect
        canvas2dContext.fillStyle = this.lockButtonColor;
        canvas2dContext.fillRect(lockButtonOffset.x, lockButtonOffset.y, this.lockButtonWidth, this.lockButtonHeight);

        // Write text
        var textWidth   = canvas2dContext.measureText(buttonText).width;
        var textHeight  = canvas2dContext.measureText("M").width;

        var textPositionX = (lockButtonOffset.x + ((this.lockButtonWidth - textWidth) * 0.5));
        var textPositionY = (lockButtonOffset.y + ((this.lockButtonHeight - textHeight) * 0.5));

        var oldVaseline = canvas2dContext.textBaseline;
        canvas2dContext.textBaseline = 'middle';

        this.drawText(buttonText, textPositionX, textPositionY);

        canvas2dContext.textBaseline = oldVaseline;
    };

    // Creates and registers the html controls
    setupHtmlControls()
    {
        var that            = this;
        var htmlControls    = HTMLControls.create();
        this.htmlControls   = htmlControls;

        var padButtonDiv;
        var padMoveDiv;
        var padButtonCheckboxDiv;
        var padMoveCheckboxDiv;

        // Keyboard
        htmlControls.addCheckboxControl({
            id: "checkbox-keyboard",
            value: "logKeyboardInput",
            isSelected: this.logKeyboardInput,
            fn: function ()
            {
                that.logKeyboardInput = !that.logKeyboardInput;
            }
        });

        // Mouse Buttons
        htmlControls.addCheckboxControl({
            id: "checkbox-mousebutton",
            value: "logMouseButtonInput",
            isSelected: this.logMouseButtonInput,
            fn: function ()
            {
                that.logMouseButtonInput = !that.logMouseButtonInput;
            }
        });

        // Mouse Over
        htmlControls.addCheckboxControl({
            id: "checkbox-mouseover",
            value: "logMouseOverInput",
            isSelected: this.logMouseOverInput,
            fn: function ()
            {
                that.logMouseOverInput = !that.logMouseOverInput;
            }
        });

        // Mouse Move
        htmlControls.addCheckboxControl({
            id: "checkbox-mousemove",
            value: "logMouseMoveInput",
            isSelected: this.logMouseMoveInput,
            fn: function ()
            {
                that.logMouseMoveInput = !that.logMouseMoveInput;
            }
        });

        // Mouse Scroll
        htmlControls.addCheckboxControl({
            id: "checkbox-mousewheel",
            value: "logMouseWheelInput",
            isSelected: this.logMouseWheelInput,
            fn: function ()
            {
                that.logMouseWheelInput = !that.logMouseWheelInput;
            }
        });

        if (this.hasPadSupport)
        {
            // Pad Buttons
            htmlControls.addCheckboxControl({
                id: "checkbox-padbutton",
                value: "logPadButtonInput",
                isSelected: this.logPadButtonInput,
                fn: function ()
                {
                    that.logPadButtonInput = !that.logPadButtonInput;
                }
            });

            // Pad Move
            htmlControls.addCheckboxControl({
                id: "checkbox-padmove",
                value: "logPadMoveInput",
                isSelected: this.logPadMoveInput,
                fn: function ()
                {
                    that.logPadMoveInput = !that.logPadMoveInput;
                }
            });
        }
        else
        {
            padButtonDiv = document.getElementById("padbutton-div");
            padMoveDiv = document.getElementById("padmove-div");
            padButtonCheckboxDiv = document.getElementById("checkbox-padbutton");
            padMoveCheckboxDiv = document.getElementById("checkbox-padmove");

            // Grey out pad button div
            if (padButtonDiv)
            {
                padButtonDiv.style.color = this.padUnsupportedColor;
            }

            // Grey out pad move div
            if (padMoveDiv)
            {
                padMoveDiv.style.color = this.padUnsupportedColor;
            }

            // Grey out pad button div checkbox
            if (padButtonCheckboxDiv)
            {
                padButtonCheckboxDiv.disabled = "true";
            }

            // Grey out pad move div checkbox
            if (padMoveCheckboxDiv)
            {
                padMoveCheckboxDiv.disabled = "true";
            }

        }

        htmlControls.register();
    };

    // Writes text to element specified
    writeTextContent(element, value)
    {
        var content;

        if (!element)
        {
            return;
        }

        content = element.textContent;

        if (value !== undefined)
        {
            // Check if text content is defined (not in ie)
            if (content !== undefined)
            {
                element.textContent = value;
            }
            else
            {
                element.innerText = value;
            }
        }
    };

    // Outputs the user's locale to the page
    writeLocale()
    {
        var locale      = TurbulenzEngine.getSystemInfo().userLocale;
        var localeDiv   = document.getElementById("locale");

        if (localeDiv)
        {
            localeDiv.style.padding     = "18px";
            localeDiv.style.background  = "#C8C8C8";
            localeDiv.style.fontWeight  = "bold";

            this.writeTextContent(localeDiv, "Locale: " + locale);
        }
    };

    // Create the device interfaces required
    createDevices(canvas)
    {
        var graphicsDevice;
        var inputDevice;
        var inputDeviceParameters       = {};
        var graphicsDeviceParameters    =
        {
            multisample : 4
        };

        inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);

        if (!this.isCanvas)
        {
            graphicsDevice = TurbulenzEngine.createGraphicsDevice(graphicsDeviceParameters);

            // Test for device creation, and shader support
            if (!graphicsDevice ||
                !graphicsDevice.shadingLanguageVersion)
            {
                return false;
            }

            this.canvas             = Canvas.create(graphicsDevice);
            this.canvas2dContext    = this.canvas.getContext('2d');
        }
        else
        {
            this.canvas             = canvas;
            this.canvas2dContext    = canvas.getContext('2d');
        }

        this.graphicsDevice = graphicsDevice;
        this.inputDevice    = inputDevice;

        this.keyCodes   = inputDevice.keyCodes;
        this.mouseCodes = inputDevice.mouseCodes;
        this.padCodes   = inputDevice.padCodes;

        return true;
    };

    // Creates the reverse control code maps used for console output
    createReverseControlCodeMaps()
    {
        var keyCode;
        var mouseCode;
        var padCode;
        var keyCodes        = this.keyCodes;
        var mouseCodes      = this.mouseCodes;
        var padCodes        = this.padCodes;
        var intToKeyCode    = this.intToKeyCode;
        var intToMouseCode  = this.intToMouseCode;
        var intToPadCode    = this.intToPadCode;

        for (keyCode in keyCodes)
        {
            if (keyCodes.hasOwnProperty(keyCode))
            {
                intToKeyCode[keyCodes[keyCode]] = keyCode;
            }
        }

        for (mouseCode in mouseCodes)
        {
            if (mouseCodes.hasOwnProperty(mouseCode))
            {
                intToMouseCode[mouseCodes[mouseCode]] = mouseCode;
            }
        }

        for (padCode in padCodes)
        {
            if (padCodes.hasOwnProperty(padCode))
            {
                intToPadCode[padCodes[padCode]] = padCode;
            }
        }
    };

    // Checks for xbox 360 gamepad support
    getPadSupport(): bool
    {
        var systemInfo      = TurbulenzEngine.getSystemInfo();
        var isWindows       = (-1 !== systemInfo.osName.indexOf("Windows"));
        var hasPadSupport   = (isWindows);

        return hasPadSupport;
    };

    // Adds onKeyDown functions to inputDevice
    createInputCallbacks()
    {
        var inputDevice = this.inputDevice;

        inputDevice.addEventListener('keydown', this.onKeyDown.bind(this));
        inputDevice.addEventListener('keyup', this.onKeyUp.bind(this));
        inputDevice.addEventListener('mousedown', this.onMouseDown.bind(this));

        inputDevice.addEventListener('mouseup', this.onMouseUp.bind(this));
        inputDevice.addEventListener('mouseover', this.onMouseOver.bind(this));
        inputDevice.addEventListener('mousemove', this.onMouseMove.bind(this));
        inputDevice.addEventListener('mousewheel', this.onMouseWheel.bind(this));

        inputDevice.addEventListener('padup', this.onPadUp.bind(this));
        inputDevice.addEventListener('paddown', this.onPadDown.bind(this));
        inputDevice.addEventListener('padmove', this.onPadMove.bind(this));

        inputDevice.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        inputDevice.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        inputDevice.addEventListener('focus', this.onFocus.bind(this));
        inputDevice.addEventListener('blur', this.onBlur.bind(this));
        inputDevice.addEventListener('mouselocklost', this.onMouseLockLost.bind(this));

        inputDevice.addEventListener('touchstart', this.onTouchStart.bind(this));
        inputDevice.addEventListener('touchend', this.onTouchEnd.bind(this));
        inputDevice.addEventListener('touchenter', this.onTouchEnter.bind(this));
        inputDevice.addEventListener('touchleave', this.onTouchLeave.bind(this));
        inputDevice.addEventListener('touchmove', this.onTouchMove.bind(this));
        inputDevice.addEventListener('touchcancel', this.onTouchCancel.bind(this));
    };

    onKeyDown(controlCode)
    {
        var unicodeObject   = this.inputDevice.convertToUnicode([controlCode]);
        var unicode         = unicodeObject[controlCode];
        var keyCode         = this.intToKeyCode[controlCode];

        if (this.logKeyboardInput)
        {
            Utilities.log("KeyDown Event, KeyCode =  " +
                        keyCode +
                        ", KeyCode number = " +
                        controlCode +
                        ", Unicode = " +
                        unicode);
        }

        this.key = keyCode;
    };

    onKeyUp(controlCode)
    {
        var unicodeObject   = this.inputDevice.convertToUnicode([controlCode]);
        var unicode         = unicodeObject[controlCode];
        var keyCode         = this.intToKeyCode[controlCode];
        var keyCodes        = this.keyCodes;

        // Keyboard controls
        if (keyCodes.RETURN === controlCode &&
            !this.isCanvas)
        {
            this.graphicsDevice.fullscreen = !this.graphicsDevice.fullscreen;
        }
        else if (keyCodes.NUMBER_1 === controlCode)
        {
            this.logKeyboardInput = !this.logKeyboardInput;
        }
        else if (keyCodes.NUMBER_2 === controlCode)
        {
            this.logMouseButtonInput = !this.logMouseButtonInput;
        }
        else if (keyCodes.NUMBER_3 === controlCode)
        {
            this.logMouseOverInput = !this.logMouseOverInput;
        }
        else if (keyCodes.NUMBER_4 === controlCode)
        {
            this.logMouseMoveInput = !this.logMouseMoveInput;
        }
        else if (keyCodes.NUMBER_5 === controlCode)
        {
            this.logMouseWheelInput = !this.logMouseWheelInput;
        }
        else if (keyCodes.NUMBER_6 === controlCode)
        {
            this.logPadButtonInput = !this.logPadButtonInput;
        }
        else if (keyCodes.NUMBER_7 === controlCode)
        {
            this.logPadMoveInput = !this.logPadMoveInput;
        }

        if (this.logKeyboardInput)
        {
            Utilities.log("KeyUp Event, KeyCode =  " +
                        keyCode +
                        ", KeyCode number = " +
                        controlCode +
                        ", Unicode = " +
                        unicode);
        }

        if (keyCode === this.key)
        {
            this.key = "";
        }
    };

    onMouseDown(controlCode, x, y)
    {
        if (this.logMouseButtonInput)
        {
            Utilities.log("MouseDown Event: ControlCode = " +
                         this.intToMouseCode[controlCode] +
                         ", ControlCode number = " +
                         controlCode,
                         ", x = ",
                         x +
                         ", y = ",
                         y);
        }

        this.mouseButton = controlCode;
        this.isClicking = true;
    };

    onMouseUp(controlCode, x, y)
    {
        if (this.logMouseButtonInput)
        {
            Utilities.log("MouseUp Event: ControlCode = " +
                         this.intToMouseCode[controlCode] +
                         ", ControlCode number = " +
                         controlCode,
                         ", x = ",
                         x +
                         ", y = ",
                         y);
        }

        if (!this.inputDevice.isLocked())
        {
            if (this.isOverLockButton(x, y))
            {
                this.inputDevice.lockMouse();
            }
        }
        else
        {
            if (this.isOverLockButton(this.mousePosition.x, this.mousePosition.y))
            {
                this.inputDevice.unlockMouse();
            }
        }

        this.mouseButton = "";
        this.isClicking = false;
    };

    onMouseOver(x, y)
    {
        if (this.logMouseOverInput)
        {
            Utilities.log("MouseOver Event: " +
                    x + ", " +
                    y);
        }

        this.mousePosition.x = x;
        this.mousePosition.y = y;

        this.isMouseOver = true;
    };

    onMouseMove(deltaX, deltaY)
    {
        if (this.logMouseMoveInput)
        {
            Utilities.log("MouseMove Event: " +
                    deltaX + ", " +
                    deltaY);
        }

        this.mouseDelta.x = deltaX;
        this.mouseDelta.y = deltaY;

        this.isMouseMove = true;
    };

    onMouseWheel(delta)
    {
        if (this.logMouseWheelInput)
        {
            Utilities.log("MouseWheel Event: " + delta);
        }

        this.mouseWheelDelta = delta;
        this.isMouseWheel   = true;
    };

    onPadDown(controlCode)
    {
        var padCode = this.intToPadCode[controlCode];

        if (this.logPadButtonInput)
        {
            Utilities.log("PadDown Event: ControlCode = " +
                         padCode +
                         ", ControlCode number = " +
                         controlCode);
        }

        this.padButton = padCode;
        this.isClicking = true;
    };

    onPadUp(controlCode)
    {
        if (this.logPadButtonInput)
        {
            Utilities.log("PadUp Event: ControlCode = " +
                         this.intToPadCode[controlCode] +
                         ", ControlCode number = " +
                         controlCode);
        }

        this.padButton  = "";
        this.isClicking = false;
    };

    onPadMove(lX, lY, lZ, rX, rY, rZ)
    {
        if (this.logPadMoveInput)
        {
            Utilities.log("PadMove Event:" +
                    lX + ", " +
                    lY + ", " +
                    lZ + ", " +
                    rX + ", " +
                    rY + ", " +
                    rZ);
        }

        this.padLeftThumbstick.x    = lX;
        this.padLeftThumbstick.y    = lY;
        this.padLeftTrigger         = lZ;
        this.padRightThumbstick.x   = rX;
        this.padRightThumbstick.y   = rY;
        this.padRightTrigger        = rZ;

        this.padMoveText    = "padmove: ";
        this.padMoveTextLX  = "lX = " + lX;
        this.padMoveTextLY  = "lY = " + lY;
        this.padMoveTextLZ  = "lZ = " + lZ;
        this.padMoveTextRX  = "rX = " + rX;
        this.padMoveTextRY  = "rY = " + rY;
        this.padMoveTextRZ  = "rZ = " + rZ;

        this.isPadMove = true;
    };

    onMouseEnter()
    {
        this.isHovering = true;
        this.inputDevice.hideMouse();

        Utilities.log("MouseEnter Event!");
    };

    onMouseLeave()
    {
        this.isHovering = false;
        Utilities.log("MouseLeave Event!");
    };

    onFocus()
    {
        Utilities.log("Focus Event!");
        this.isFocused = true;
    };

    onBlur()
    {
        Utilities.log("Blur Event!");
        this.isFocused = false;
    };

    onMouseLockLost()
    {
        Utilities.log("MouseLockLost Event!");
        this.inputDevice.hideMouse();
    };

    onTouchStart(event)
    {
        var changedTouches          = event.changedTouches;
        var changedTouchesLength    = changedTouches.length;
        var ongoingTouches          = this.ongoingTouches;

        var touch;
        var i;

        Utilities.log("TouchStart event!");

        for (i = 0; i < changedTouchesLength; i += 1)
        {
            touch = changedTouches[i];

            ongoingTouches.push(touch);
        }
    };

    onTouchEnd(event)
    {
        var changedTouches          = event.changedTouches;
        var changedTouchesLength    = changedTouches.length;
        var ongoingTouches          = this.ongoingTouches;

        var touch;
        var touchId;
        var touchIndex;
        var i;

        Utilities.log("TouchEnd event!");

        for (i = 0; i < changedTouchesLength; i += 1)
        {
            touch   = changedTouches[i];
            touchId = touch.identifier;

            touchIndex = this.getTouchIndexFromId(touchId);

            ongoingTouches.splice(touchIndex, 1);
        }
    };

    onTouchEnter(event)
    {
        var changedTouches          = event.changedTouches;
        var changedTouchesLength    = changedTouches.length;
        var ongoingTouches          = this.ongoingTouches;

        var touch;
        var touchId;
        var touchIndex;
        var i;

        Utilities.log("TouchEnter event!");

        // If the touch did not start on the game, then store it now
        for (i = 0; i < changedTouchesLength; i += 1)
        {
            touch   = changedTouches[i];
            touchId = touch.identifier;

            touchIndex = this.getTouchIndexFromId(touchId);

            if (touchIndex < 0)
            {
                ongoingTouches.push(touch);
            }
        }
    };

    onTouchLeave(/* event */)
    {
        Utilities.log("TouchLeave event!");
    };

    onTouchMove(event)
    {
        var changedTouches          = event.changedTouches;
        var changedTouchesLength    = changedTouches.length;
        var ongoingTouches          = this.ongoingTouches;

        var touch;
        var touchId;
        var touchIndex;
        var i;

        Utilities.log("TouchMove event!");

        for (i = 0; i < changedTouchesLength; i += 1)
        {
            touch   = changedTouches[i];
            touchId = touch.identifier;

            touchIndex = this.getTouchIndexFromId(touchId);

            ongoingTouches.splice(touchIndex, 1, changedTouches[i]);
        }
    };

    onTouchCancel(event)
    {
        var changedTouches          = event.changedTouches;
        var changedTouchesLength    = changedTouches.length;
        var ongoingTouches          = this.ongoingTouches;

        var touch;
        var touchId;
        var touchIndex;
        var i;

        Utilities.log("TouchCancel event!");

        for (i = 0; i < changedTouchesLength; i += 1)
        {
            touch   = changedTouches[i];
            touchId = touch.identifier;

            touchIndex = this.getTouchIndexFromId(touchId);

            ongoingTouches.splice(touchIndex, 1);
        }
    };

    getTouchIndexFromId(id)
    {
        var ongoingTouches          = this.ongoingTouches;
        var ongoingTouchesLength    = ongoingTouches.length;

        var touch;
        var touchId;
        var i;

        for (i = 0; i < ongoingTouchesLength; i += 1)
        {
            touch   = ongoingTouches[i];
            touchId = touch.identifier;

            if (id === touchId)
            {
                return i;
            }
        }

        return -1;
    };

    // Calls functions in order
    enterCallbackChain(context, functions)
    {
        var length = functions.length;
        var localCallback;
        var callNextFunction;

        var currentFunction = -1;
        var activeCallbacks = 0;

        callNextFunction = function callNextFunctionFn()
        {
            currentFunction += 1;
            activeCallbacks += 1;
            functions[currentFunction].func.call(context, localCallback, arguments);
        };

        localCallback = function localCallbackFn()
        {
            activeCallbacks -= 1;

            // If no callbacks are left then call functions consecutively until dependent (or blocker) function is seen
            if (activeCallbacks === 0 &&
                currentFunction < (length - 1))
            {
                // No active callbacks so immediately call next function
                callNextFunction();

                // Call functions until we hit a dependent (blocking) function
                while (currentFunction < (length - 1) &&
                       !functions[currentFunction].isDependent)
                {
                    callNextFunction();
                }
            }
        };

        // Start the async callback chain
        callNextFunction();
    };

    // Create game session
    createGameSession(callback)
    {
        this.gameSession = TurbulenzServices.createGameSession(this.requestHandler, callback, this.errorCallback);
    };

    createMappingTable(callback)
    {
        var defaultMappingSettings =
        {
            mappingTablePrefix: "staticmax/",
            assetPrefix: "missing/",
            mappingTableURL: "mapping_table.json",
            urnMapping: {}
        };

        this.mappingTable = TurbulenzServices.createMappingTable(this.requestHandler, this.gameSession,
                                                                 callback, defaultMappingSettings, this.errorCallback);
    };

    loadCursorImages(callback)
    {
        var that = this;
        var numberOfImages = 3;
        var imagesLoaded = 0;

        // Load default custom cursor
        this.loadImage("textures/hand.png",
                        function (image)
                        {
                            that.cursorImageDefault = image;
                            imagesLoaded += 1;

                            if (numberOfImages === imagesLoaded)
                            {
                                callback();
                            }
                        });

        // Load clicking cursor
        this.loadImage("textures/hand-down.png",
                        function (image)
                        {
                            that.cursorImageClicking = image;
                            imagesLoaded += 1;

                            if (numberOfImages === imagesLoaded)
                            {
                                callback();
                            }
                        });

        // Load crosshair
        this.loadImage("textures/crosshair.png",
                        function (image)
                        {
                            that.cursorImageLocked = image;
                            imagesLoaded += 1;

                            if (numberOfImages === imagesLoaded)
                            {
                                callback();
                            }
                        });

    };

    loadImage(imagePath, callback)
    {
        var imageParameters;

        if (!this.isCanvas)
        {
            imageParameters =
            {
                src     : this.mappingTable.getURL(imagePath),
                mipmaps : true,
                onload  : callback
            };

            this.graphicsDevice.createTexture(imageParameters);
        }
        else
        {
            var imageLoading = new Image();
            imageLoading.onload = function ()
            {
                callback(this);
            };
            imageLoading.src = this.mappingTable.getURL(imagePath);
        }
    };

    postSetup()
    {
        var that = this;
        var mappingTable = this.mappingTable;
        var urlMapping = mappingTable.urlMapping;
        var assetPrefix = mappingTable.assetPrefix;

        var localMainStateLoop = function localMainStateLoopFn()
        {
            return that.mainStateLoop();
        };

        if (!this.isCanvas)
        {
            var fontManager =
                FontManager.create(this.graphicsDevice, this.requestHandler,
                                   null, this.errorCallback);
            fontManager.setPathRemapping(urlMapping, assetPrefix);
            fontManager.load('fonts/opensans.fnt');

            this.canvas.setFontManager(fontManager);
        }

        this.intervalID = TurbulenzEngine.setInterval(localMainStateLoop, (1000 / this.fps));
    };

    mainStateLoop()
    {
        this.update();

        if (!this.isCanvas)
        {
            this.render();
        }
        else
        {
            this.renderCanvas();
        }

        this.resetState();
    };

    // Attempts to free memory - called from onbeforeunload and/or
    // TurbulenzEngine.onUnload
    shutdown()
    {
        if (!this.hasShutdown)
        {
            this.hasShutdown = true;

            TurbulenzEngine.clearInterval(this.intervalID);

            this.canvas          = null;
            this.canvas2dContext = null;

            // Attempt to force clearing of the garbage collector
            TurbulenzEngine.flush();

            this.inputDevice     = null;
            this.graphicsDevice  = null;
        }
    };

    isOverLockButton(x, y)
    {
        return !((x < this.lockButtonOffset.x) ||
                 (y < this.lockButtonOffset.y) ||
                 (x > this.lockButtonOffset.x + this.lockButtonWidth) ||
                 (y > this.lockButtonOffset.y + this.lockButtonHeight));

    };

    resetState()
    {
        this.isMouseOver = false;
        this.isMouseMove = false;
        this.isMouseWheel = false;
        this.isPadMove = false;

        this.mouseWheelDelta = 0;

        // Need to reset these in case pad is disconnected
        this.padLeftThumbstick.x    = 0;
        this.padLeftThumbstick.y    = 0;
        this.padLeftTrigger         = 0;
        this.padRightThumbstick.x   = 0;
        this.padRightThumbstick.y   = 0;
        this.padRightTrigger        = 0;
    };

    errorCallback(message)
    {
        Utilities.log(message);
    };

    // Application constructor function
    static create(canvas)
    {
        var application = new Application();

        // Devices and canvas
        application.inputDevice     = null;
        application.graphicsDevice  = null;
        application.canvas          = canvas;
        application.canvas2dContext = null;

        application.mappingTable    = null;
        application.fps             = 60;

        // Bools
        application.isHovering      = false;
        application.isFocused       = false;
        application.isClicking      = false;
        application.isMouseOver     = false;
        application.isMouseMove     = false;
        application.isMouseWheel    = false;
        application.isPadMove       = false;
        application.isCanvas        = (canvas ? true : false);
        application.hasPadSupport   = false;
        application.hasShutDown     = false; // Ensures shutdown function is only called once

        // Text
        var horizontalTextOffset            = 25;
        var verticalTextOffset              = 35;
        var verticalDelta                   = 25;

        application.textSize                = "32px";
        application.typeface                = "opensans";
        application.verticalTextOffset      = verticalTextOffset;
        application.verticalPadTextOffset   = (verticalTextOffset * 0.75);
        application.mouseButtonTextOffset   = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 0)));
        application.keyTextOffset           = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 1)));
        application.padButtonTextOffset     = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 2)));
        application.mouseOverTextOffset     = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 3)));
        application.mouseMoveTextOffset     = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 4)));
        application.mouseWheelTextOffset    = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 5)));
        application.touchesTextOffset       = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 6)));
        application.focusedTextOffset       = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 7)));
        application.hiddenTextOffset        = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 8)));
        application.lockedTextOffset        = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 9)));
        application.padMoveTextOffset       = Point.create(horizontalTextOffset,
                                                           (verticalTextOffset + (verticalDelta * 19)));

        application.focusedText             = "Plugin has focus";
        application.keyText                 = "Key: ";
        application.key                     = "";
        application.mouseButtonText         = "Mouse Button: ";
        application.mouseButton             = "";
        application.padButtonText           = "Pad Button: ";
        application.padButton               = "";
        application.mouseWheelText          = "Mouse Wheel Delta: ";
        application.mouseOverText           = "Mouse Over: ";
        application.mouseMoveText           = "Mouse Move: ";
        application.padMoveText             = "";
        application.padMoveTextLX           = "";
        application.padMoveTextLY           = "";
        application.padMoveTextLZ           = "";
        application.padMoveTextRX           = "";
        application.padMoveTextRY           = "";
        application.padMoveTextRZ           = "";
        application.lockedText              = "Mouse locked";
        application.hiddenText              = "Mouse hidden";
        application.lockButtonText          = "Lock";
        application.unlockButtonText        = "Unlock";
        application.touchesDetectedText     = "Touches Detected: ";

        // Focus border
        application.focusBorderWidth    = 30;

        // Lock button
        application.lockButtonOffset    = Point.create(horizontalTextOffset, (verticalTextOffset + (verticalDelta * 10)));
        application.lockButtonWidth     = 100;
        application.lockButtonHeight    = 50;

        // Cursor
        application.cursorScalar    = 2.0;

        // Pad move visual output
        var padCircleRadius                 = 40;
        var padTriggerPadding               = 15;
        var padCircleSeparation             = ((2 * padCircleRadius) + (2 * padTriggerPadding) + 50);
        var padCircle1Origin                = Point.create((horizontalTextOffset + padCircleRadius),
                                                           ((verticalDelta * 16) + (padCircleRadius * 0.5)));

        var padCircle2Origin                = Point.create((padCircle1Origin.x + padCircleSeparation),
                                                           padCircle1Origin.y);

        var padLeftTriggerOrigin            = Point.create(((padCircle1Origin.x + padCircleRadius) + padTriggerPadding),
                                                           (padCircle1Origin.y + padCircleRadius));

        var padRightTriggerOrigin           = Point.create(((padCircle2Origin.x - padCircleRadius) - padTriggerPadding),
                                                           (padCircle2Origin.y + padCircleRadius));

        application.padCircleRadius         = padCircleRadius;
        application.padCircleCenterRadius   = 5;
        application.padCircleLineWidth      = 2;
        application.padCircle1Position      = padCircle1Origin;
        application.padCircle2Position      = padCircle2Origin;
        application.padLeftTriggerPosition  = padLeftTriggerOrigin;
        application.padRightTriggerPosition = padRightTriggerOrigin;
        application.padTriggerWidth         = 15;

        // Logging and control related vars
        application.htmlControls            = null;
        application.logKeyboardInput        = true;
        application.logMouseButtonInput     = true;
        application.logMouseOverInput       = true;
        application.logMouseMoveInput       = true;
        application.logMouseWheelInput      = true;
        application.logPadButtonInput       = true;
        application.logPadMoveInput         = true;

        // Colors
        application.defaultTextColor        = "#FFFFFF";
        application.hoveringBackgroundColor = "#FF0000";
        application.defaultBackgroundColor  = "#555555";
        application.focusBorderColor        = "#000000";
        application.lockButtonColor         = "#000000";
        application.padUnsupportedColor     = "#ABABAB";
        application.padCircleLineColor      = "#FFFFFF";
        application.padPositionLineColor    = "#FFFFFF";

        // Control codes
        application.keyCodes    = null;
        application.mouseCodes  = null;
        application.padCodes    = null;

        // Reverse keycode maps
        application.intToKeyCode    = {};
        application.intToMouseCode  = {};
        application.intToPadCode    = {};

        // Pad analogue control positions
        application.padLeftTrigger      = 0;
        application.padRightTrigger     = 0;
        application.padLeftThumbstick   = Point.create(0, 0);
        application.padRightThumbstick  = Point.create(0, 0);

        // Mouse position and deltas
        application.mousePosition       = Point.create(0, 0);
        application.mouseDelta          = Point.create(0, 0);
        application.mouseWheelDelta     = 0;

        // Touch positions
        application.ongoingTouches = [];

        // Touch colors
        application.touchColors =
            [
                '#00ff00',
                '#ffff00',
                '#00ffff',
                '#ff00ff',
                '#ff0000',
                '#0000ff',
                '#eeeeee'
            ];

        // Textures
        application.cursorImageDefault  = null;
        application.cursorImageClicking = null;
        application.cursorImageLocked   = null;

        return application;
    };
};
