// Copyright (c) 2011-2012 Turbulenz Limited

/*global window*/
/*global Touch: false*/
/*global TouchEvent: false*/
/*global TurbulenzEngine: false*/

/// <reference path="touchevent.ts" />

//
// WebGLInputDevice
//
interface WebGLInputDevice extends InputDevice
{
    lastX: number;
    lastY: number;

    isMouseLocked: bool;
    isHovering: bool;
    isWindowFocused: bool;
    isCursorHidden: bool;
    isOutsideEngine: bool;

    touches: any;

    boundFunctions: any;
    elementEventFlags: any;

    canvas: any;
    previousCursor: string;
    ignoreNextMouseMoves: number;

    // Used to screen out auto-repeats, dictionary from keycode to bool,
    // true for each key currently pressed down
    pressedKeys: any;

    // keyCodes: any; // TODO: moving the definition into a class will
    //                // automatically fill in this type info.
    keyMap: any;   // Could use a literal here.  Can't do:
                   // { [index: any]: number; };

    mouseMap: any; //{ 0: number; 1: number; 2: number; };

    padButtons: number[];
    padMap: any;
    padAxisDeadZone: number;
    maxAxisRange: number;
    padTimestampUpdate: number;

    keyCodeToUnicode: any;

    macosx: bool;
    webkit: bool;

    // Game event handlers.  TODO: introduce types
    handlers:
    {
        keydown : any[];
        keyup : any[];

        mousedown : any[];
        mouseup : any[];
        mousewheel : any[];
        mouseover : any[];
        mousemove : any[];

        paddown : any[];
        padup : any[];
        padmove : any[];

        mouseenter : any[];
        mouseleave : any[];
        focus : any[];
        blur : any[];
        mouselocklost : any[];

        touchstart : any[];
        touchend : any[];
        touchenter : any[];
        touchleave : any[];
        touchmove : any[];
        touchcancel : any[];
    };

    requestBrowserLock: { () : void; };
    requestBrowserUnlock: { (): void; };

    setEventHandlersCanvas(): void;
    setEventHandlersWindow(): void;
    setEventHandlersFocus(): void;
    setEventHandlersBlur(): void;
    setEventHandlersTouch(): void;

    destroy(): void;
};
declare var WebGLInputDevice :
{
    new(): WebGLInputDevice;
    prototype: any;
    create(canvas: any /*, params: any */);
};

function WebGLInputDevice() { return this; }
WebGLInputDevice.prototype = {

    version : 1,

    // Public API

    update : function inputDeviceUpdateFn()
    {
        if (!this.isWindowFocused)
        {
            return;
        }

        this.updateGamePad();
    },

    addEventListener : function addEventListenerFn(eventType, eventListener)
    {
        var i;
        var length;
        var eventHandlers;

        if (this.handlers.hasOwnProperty(eventType))
        {
            eventHandlers = this.handlers[eventType];

            if (eventListener)
            {
                // Check handler is not already stored
                length = eventHandlers.length;
                for (i = 0; i < length; i += 1)
                {
                    if (eventHandlers[i] === eventListener)
                    {
                        // Event handler has already been added
                        return;
                    }
                }

                eventHandlers.push(eventListener);
            }
        }
    },

    removeEventListener : function removeEventListenerFn(eventType, eventListener)
    {
        var i;
        var length;
        var eventHandlers;

        if (this.handlers.hasOwnProperty(eventType))
        {
            eventHandlers = this.handlers[eventType];

            if (eventListener)
            {
                length = eventHandlers.length;
                for (i = 0; i < length; i += 1)
                {
                    if (eventHandlers[i] === eventListener)
                    {
                        eventHandlers.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },

    lockMouse : function lockMouseFn()
    {
        if (this.isHovering &&
            this.isWindowFocused)
        {
            this.isMouseLocked = true;
            this.hideMouse();

            this.requestBrowserLock();

            this.setEventHandlersLock();

            return true;
        }
        else
        {
            return false;
        }
    },

    unlockMouse : function unlockMouseFn()
    {
        if (this.isMouseLocked)
        {
            this.isMouseLocked = false;
            this.showMouse();

            this.requestBrowserUnlock();

            this.setEventHandlersUnlock();

            if (this.isOutsideEngine)
            {
                this.isOutsideEngine = false;

                this.isHovering = false;

                this.setEventHandlersMouseLeave();

                // Send mouseout event
                this.sendEventToHandlers(this.handlers.mouseleave);
            }

            // Send mouselocklost event
            this.sendEventToHandlers(this.handlers.mouselocklost);

            return true;
        }
        else
        {
            return false;
        }
    },

    isLocked : function isLockedFn()
    {
        return this.isMouseLocked;
    },

    hideMouse : function hideMouseFn()
    {
        if (this.isHovering)
        {
            if (!this.isCursorHidden)
            {
                this.isCursorHidden = true;
                this.previousCursor = document.body.style.cursor;
                document.body.style.cursor = 'none';
                if (this.webkit)
                {
                    this.ignoreNextMouseMoves = 2;
                }
            }

            return true;
        }
        else
        {
            return false;
        }
    },

    showMouse : function showMouseFn()
    {
        if (this.isCursorHidden &&
            !this.isMouseLocked)
        {
            this.isCursorHidden = false;
            document.body.style.cursor = this.previousCursor;
            return true;
        }
        else
        {
            return false;
        }
    },

    isHidden : function isHiddenFn()
    {
        return this.isCursorHidden;
    },

    isFocused : function isFocused()
    {
        return this.isWindowFocused;
    },

    // Cannot convert keycodes to unicode in javascript so return empty strings
    convertToUnicode : function convertToUnicodeFn(keyCodeArray)
    {
        var keyCodeToUnicode = this.keyCodeToUnicode;
        var result = {};
        var length = keyCodeArray.length;
        var i;
        var keyCode;

        for (i = 0; i < length; i += 1)
        {
            keyCode = keyCodeArray[i];
            result[keyCode] = keyCodeToUnicode[keyCode] || "";
        }

        return result;
    },

    // KeyCodes: List of key codes and their values

    keyCodes :
    {
        A : 0,
        B : 1,
        C : 2,
        D : 3,
        E : 4,
        F : 5,
        G : 6,
        H : 7,
        I : 8,
        J : 9,
        K : 10,
        L : 11,
        M : 12,
        N : 13,
        O : 14,
        P : 15,
        Q : 16,
        R : 17,
        S : 18,
        T : 19,
        U : 20,
        V : 21,
        W : 22,
        X : 23,
        Y : 24,
        Z : 25,
        NUMBER_0 : 100,
        NUMBER_1 : 101,
        NUMBER_2 : 102,
        NUMBER_3 : 103,
        NUMBER_4 : 104,
        NUMBER_5 : 105,
        NUMBER_6 : 106,
        NUMBER_7 : 107,
        NUMBER_8 : 108,
        NUMBER_9 : 109,
        LEFT : 200,
        RIGHT : 201,
        UP : 202,
        DOWN : 203,
        LEFT_SHIFT : 300,
        RIGHT_SHIFT : 301,
        LEFT_CONTROL : 302,
        RIGHT_CONTROL : 303,
        LEFT_ALT : 304,
        RIGHT_ALT : 305,
        ESCAPE : 400,
        TAB : 401,
        SPACE :    402,
        BACKSPACE : 403,
        RETURN : 404,
        GRAVE : 500,
        MINUS : 501,
        EQUALS : 502,
        LEFT_BRACKET : 503,
        RIGHT_BRACKET : 504,
        SEMI_COLON : 505,
        APOSTROPHE : 506,
        COMMA : 507,
        PERIOD : 508,
        SLASH: 509,
        BACKSLASH: 510,
        F1 : 600,
        F2 : 601,
        F3 : 602,
        F4 : 603,
        F5 : 604,
        F6 : 605,
        F7 : 606,
        F8 : 607,
        F9 : 608,
        F10 : 609,
        F11 : 610,
        F12 : 611,
        NUMPAD_0 : 612,
        NUMPAD_1 : 613,
        NUMPAD_2 : 614,
        NUMPAD_3 : 615,
        NUMPAD_4 : 616,
        NUMPAD_5 : 617,
        NUMPAD_6 : 618,
        NUMPAD_7 : 619,
        NUMPAD_8 : 620,
        NUMPAD_9 : 621,
        NUMPAD_ENTER : 622,
        NUMPAD_DIVIDE : 623,
        NUMPAD_MULTIPLY : 624,
        NUMPAD_ADD : 625,
        NUMPAD_SUBTRACT : 626,
        LEFT_WIN : 627,
        RIGHT_WIN : 628,
        LEFT_OPTION : 629,
        RIGHT_OPTION : 630,
        CAPS_LOCK : 631,
        INSERT : 632,
        DELETE : 633,
        HOME : 634,
        END : 635,
        PAGE_UP: 636,
        PAGE_DOWN: 637,
        BACK: 638
    },

    mouseCodes :
    {
        BUTTON_0 : 0,
        BUTTON_1 : 1,
        BUTTON_2 : 2,
        DELTA_X : 100,
        DELTA_Y : 101,
        MOUSE_WHEEL : 102
    },

    padCodes :
    {
        UP : 0,
        LEFT : 1,
        DOWN : 2,
        RIGHT : 3,
        A : 4,
        B : 5,
        X : 6,
        Y : 7,
        LEFT_TRIGGER : 8,
        RIGHT_TRIGGER : 9,
        LEFT_SHOULDER : 10,
        RIGHT_SHOULDER : 11,
        LEFT_THUMB : 12,
        LEFT_THUMB_X : 13,
        LEFT_THUMB_Y : 14,
        RIGHT_THUMB : 15,
        RIGHT_THUMB_X : 16,
        RIGHT_THUMB_Y : 17,
        START : 18,
        BACK : 19
    },

    // Private API

    sendEventToHandlers :
    function sendEventToHandlersFn(eventHandlers, arg0, arg1, arg2, arg3,
                                   arg4, arg5)
    {
        var i;
        var length = eventHandlers.length;

        if (length)
        {
            for (i = 0; i < length; i += 1)
            {
                eventHandlers[i](arg0, arg1, arg2, arg3, arg4, arg5);
            }
        }
    },

    sendEventToHandlersASync :
    function sendEventToHandlersASyncFn(handlers, a0, a1, a2, a3, a4, a5)
    {
        var sendEvent = WebGLInputDevice.prototype.sendEventToHandlers;
        TurbulenzEngine.setTimeout(function callSendEventToHandlersFn() {
            sendEvent(handlers, a0, a1, a2, a3, a4, a5);
        }, 0);
    },

    updateGamePad : function updateGamePadFn()
    {
        var magnitude;
        var normalizedMagnitude;

        var gamepads = (navigator.gamepads ||
                        navigator.webkitGamepads ||
                        (navigator.webkitGetGamepads && navigator.webkitGetGamepads()));

        if (gamepads)
        {
            var deadZone = this.padAxisDeadZone;
            var maxAxisRange = this.maxAxisRange;
            var sendEvent = this.sendEventToHandlersASync;
            var handlers = this.handlers;
            var padButtons = this.padButtons;
            var padMap = this.padMap;
            var leftThumbX = 0;
            var leftThumbY = 0;
            var rightThumbX = 0;
            var rightThumbY = 0;

            var numGamePads = gamepads.length;
            for (var i = 0; i < numGamePads; i += 1)
            {
                var gamepad = gamepads[i];
                if (gamepad)
                {
                    // Update button states

                    var buttons = gamepad.buttons;

                    if (this.padTimestampUpdate < gamepad.timestamp)
                    {
                        this.padTimestampUpdate = gamepad.timestamp;

                        var numButtons = buttons.length;
                        for (var n = 0; n < numButtons; n += 1)
                        {
                            var value = buttons[n];
                            if (padButtons[n] !== value)
                            {
                                padButtons[n] = value;

                                var padCode = padMap[n];
                                if (padCode !== undefined)
                                {
                                    if (value)
                                    {
                                        sendEvent(handlers.paddown, padCode);
                                    }
                                    else
                                    {
                                        sendEvent(handlers.padup, padCode);
                                    }
                                }
                            }
                        }
                    }

                    // Update axes states

                    var axes = gamepad.axes;
                    if (axes.length <= 4)
                    {
                        // Axis 1 & 2
                        var lX = axes[0];
                        var lY = -axes[1];
                        magnitude = ((lX * lX) + (lY * lY));

                        if (magnitude > (deadZone * deadZone))
                        {
                            magnitude = Math.sqrt(magnitude);

                            // Normalize lX and lY
                            lX = (lX / magnitude);
                            lY = (lY / magnitude);

                            // Clip the magnitude at its max possible value
                            if (magnitude > maxAxisRange)
                            {
                                magnitude = maxAxisRange;
                            }

                            // Adjust magnitude relative to the end of the dead zone
                            magnitude -= deadZone;

                            // Normalize the magnitude
                            normalizedMagnitude = (magnitude / (maxAxisRange - deadZone));

                            leftThumbX = (lX * normalizedMagnitude);
                            leftThumbY = (lY * normalizedMagnitude);
                        }

                        // Axis 3 & 4
                        var rX = axes[2];
                        var rY = -axes[3];
                        magnitude = ((rX * rX) + (rY * rY));

                        if (magnitude > (deadZone * deadZone))
                        {
                            magnitude = Math.sqrt(magnitude);

                            // Normalize lX and lY
                            rX = (rX / magnitude);
                            rY = (rY / magnitude);

                            // Clip the magnitude at its max possible value
                            if (magnitude > maxAxisRange)
                            {
                                magnitude = maxAxisRange;
                            }

                            // Adjust magnitude relative to the end of the dead zone
                            magnitude -= deadZone;

                            // Normalize the magnitude
                            normalizedMagnitude = (magnitude / (maxAxisRange - deadZone));

                            rightThumbX = (rX * normalizedMagnitude);
                            rightThumbY = (rY * normalizedMagnitude);
                        }


                        sendEvent(handlers.padmove,
                                  leftThumbX, leftThumbY, buttons[6],
                                  rightThumbX, rightThumbY, buttons[7]);
                    }

                    // Our API only supports one active pad...
                    break;
                }
            }
        }
    },

    // Cannot detect locale in canvas mode
    getLocale : function getLocaleFn()
    {
        return "";
    },

    // Returns the local coordinates of the event (i.e. position in Canvas coords)
    getCanvasPosition : function getCanvasPositionFn(event, position)
    {
        if (event.offsetX !== undefined)
        {
            position.x = event.offsetX;
            position.y = event.offsetY;
        }
        else if (event.layerX !== undefined)
        {
            position.x = event.layerX;
            position.y = event.layerY;
        }
    },

    // Called when blurring
    resetKeyStates : function resetKeyStatesFn()
    {
        var k;
        var pressedKeys = this.pressedKeys;
        var keyUpHandlers = this.handlers.keyup;

        for (k in pressedKeys)
        {
            if (pressedKeys.hasOwnProperty(k) && pressedKeys[k])
            {
                k = parseInt(k, 10);
                pressedKeys[k] = false;
                this.sendEventToHandlers(keyUpHandlers, k);
            }
        }
    },

    // Private mouse event methods

    onMouseOver : function onMouseOverFn(event)
    {
        var position :
        {
            x?: number;
            y?: number;
        } = {};
        var mouseOverHandlers = this.handlers.mouseover;

        event.stopPropagation();
        event.preventDefault();

        this.getCanvasPosition(event, position);

        this.lastX = event.screenX;
        this.lastY = event.screenY;

        this.sendEventToHandlers(mouseOverHandlers, position.x, position.y);
    },

    onMouseMove : function onMouseMoveFn(event)
    {
        var mouseMoveHandlers = this.handlers.mousemove;

        var deltaX, deltaY;

        event.stopPropagation();
        event.preventDefault();

        if (this.ignoreNextMouseMoves)
        {
            this.ignoreNextMouseMoves -= 1;
            return;
        }

        if (event.movementX !== undefined)
        {
            deltaX = event.movementX;
            deltaY = event.movementY;
        }
        else if (event.mozMovementX !== undefined)
        {
            deltaX = event.mozMovementX;
            deltaY = event.mozMovementY;
        }
        else if (event.webkitMovementX !== undefined)
        {
            deltaX = event.webkitMovementX;
            deltaY = event.webkitMovementY;
        }
        else
        {
            deltaX = (event.screenX - this.lastX);
            deltaY = (event.screenY - this.lastY);
            if (0 === deltaX && 0 === deltaY)
            {
                return;
            }
        }

        this.lastX = event.screenX;
        this.lastY = event.screenY;

        this.sendEventToHandlers(mouseMoveHandlers, deltaX, deltaY);
    },

    onWheel : function onWheelFn(event)
    {
        var mouseWheelHandlers = this.handlers.mousewheel;

        var scrollDelta;

        event.stopPropagation();
        event.preventDefault();

        if (event.wheelDelta)
        {
            if (window.opera)
            {
                scrollDelta = event.wheelDelta < 0 ? 1 : -1;
            }
            else
            {
                scrollDelta = event.wheelDelta > 0 ? 1 : -1;
            }
        }
        else
        {
            scrollDelta = event.detail < 0 ? 1 : -1;
        }

        this.sendEventToHandlers(mouseWheelHandlers, scrollDelta);
    },

    emptyEvent : function emptyEventFn(event)
    {
        event.stopPropagation();
        event.preventDefault();
    },

    onWindowFocus : function onWindowFocusFn()
    {
        if (this.isHovering &&
            window.document.activeElement === this.canvas)
        {
            this.addInternalEventListener(window, 'mousedown', this.onMouseDown);
        }
    },

    onFocus : function onFocusFn()
    {
        var canvas = this.canvas;
        var handlers = this.handlers;
        var focusHandlers = handlers.focus;

        if (!this.isWindowFocused)
        {
            this.isWindowFocused = true;

            window.focus();
            canvas.focus();

            this.setEventHandlersFocus();

            canvas.oncontextmenu = function () {
                return false;
            };

            this.sendEventToHandlers(focusHandlers);
        }
    },

    onBlur : function onBlurFn()
    {
        var canvas = this.canvas;
        var handlers = this.handlers;
        var blurHandlers = handlers.blur;

        if (this.isMouseLocked)
        {
            this.unlockMouse();
        }

        if (this.isWindowFocused)
        {
            this.isWindowFocused = false;

            this.resetKeyStates();
            this.setEventHandlersBlur();
            canvas.oncontextmenu = null;

            this.sendEventToHandlers(blurHandlers);
        }
    },

    onMouseDown : function onMouseDownFn(event)
    {
        var handlers = this.handlers;

        if (this.isHovering)
        {
            var mouseDownHandlers = handlers.mousedown;
            var button = event.button;
            var position  :
            {
                x?: number;
                y?: number;
            }= {};

            this.onFocus();

            event.stopPropagation();
            event.preventDefault();

            if (button < 3)
            {
                button = this.mouseMap[button];
            }

            this.getCanvasPosition(event, position);

            this.sendEventToHandlers(mouseDownHandlers, button, position.x, position.y);
        }
        else
        {
            this.onBlur();
        }
    },

    onMouseUp : function onMouseUpFn(event)
    {
        var mouseUpHandlers = this.handlers.mouseup;

        if (this.isHovering)
        {
            var button = event.button;
            var position  :
            {
                x?: number;
                y?: number;
            } = {};

            event.stopPropagation();
            event.preventDefault();

            if (button < 3)
            {
                button = this.mouseMap[button];
            }

            this.getCanvasPosition(event, position);

            this.sendEventToHandlers(mouseUpHandlers, button, position.x, position.y);
        }
    },

    // Private key event methods

    onKeyDown : function onKeyDownFn(event)
    {
        var keyDownHandlers = this.handlers.keydown;
        var pressedKeys = this.pressedKeys;
        var keyCodes = this.keyCodes;

        event.stopPropagation();
        event.preventDefault();

        var keyCode = event.keyCode;
        keyCode = this.keyMap[keyCode];

        var keyLocation = event.keyLocation || event.location;

        if (undefined !== keyCode &&
           (keyCodes.ESCAPE !== keyCode))
        {
            // Handle left / right key locations
            //   DOM_KEY_LOCATION_STANDARD = 0x00;
            //   DOM_KEY_LOCATION_LEFT     = 0x01;
            //   DOM_KEY_LOCATION_RIGHT    = 0x02;
            //   DOM_KEY_LOCATION_NUMPAD   = 0x03;
            //   DOM_KEY_LOCATION_MOBILE   = 0x04;
            //   DOM_KEY_LOCATION_JOYSTICK = 0x05;

            if (2 === keyLocation)
            {
                // The Turbulenz KeyCodes are such that CTRL, SHIFT
                // and ALT have their RIGHT versions exactly one above
                // the LEFT versions.
                keyCode = keyCode + 1;
            }
            if (!pressedKeys[keyCode])
            {
                pressedKeys[keyCode] = true;
                this.sendEventToHandlers(keyDownHandlers, keyCode);
            }
        }
    },

    onKeyUp : function onKeyUpFn(event)
    {
        var keyUpHandlers = this.handlers.keyup;
        var pressedKeys = this.pressedKeys;
        var keyCodes = this.keyCodes;

        event.stopPropagation();
        event.preventDefault();

        var keyCode = event.keyCode;
        keyCode = this.keyMap[keyCode];

        var keyLocation = event.keyLocation || event.location;

        if (keyCode === keyCodes.ESCAPE)
        {
            this.unlockMouse();
        }
        else if (undefined !== keyCode)
        {
            // Handle LEFT / RIGHT.  (See OnKeyDown)

            if (2 === keyLocation)
            {
                keyCode = keyCode + 1;
            }
            if (pressedKeys[keyCode])
            {
                pressedKeys[keyCode] = false;
                this.sendEventToHandlers(keyUpHandlers, keyCode);

                // Nasty hack for mac to deal with the missing KeyUp
                // signals when CMD is released.  #1016.

                if ((627 === keyCode || 628 === keyCode) && (this.macosx))
                {
                    this.resetKeyStates();
                }
            }
        }
    },

    // Private touch event methods

    onTouchStart : function onTouchStartFn(event)
    {
        var eventHandlers = this.handlers.touchstart;

        event.preventDefault();

        // Store new touches
        this.addTouches(event.changedTouches);

        event = this.convertW3TouchEventToTurbulenzTouchEvent(event);

        this.sendEventToHandlers(eventHandlers, event);
    },

    onTouchEnd : function onTouchEndFn(event)
    {
        var eventHandlers = this.handlers.touchend;

        event.preventDefault();

        event = this.convertW3TouchEventToTurbulenzTouchEvent(event);

        // Remove ended touches
        this.removeTouches(event.changedTouches);

        this.sendEventToHandlers(eventHandlers, event);
    },

    onTouchMove : function onTouchMoveFn(event)
    {
        var eventHandlers = this.handlers.touchmove;

        event.preventDefault();

        this.addTouches(event.changedTouches);

        event = this.convertW3TouchEventToTurbulenzTouchEvent(event);

        this.sendEventToHandlers(eventHandlers, event);
    },

    onTouchEnter : function onTouchEnterFn(event)
    {
        var eventHandlers = this.handlers.touchenter;

        event.preventDefault();

        event = this.convertW3TouchEventToTurbulenzTouchEvent(event);

        this.sendEventToHandlers(eventHandlers, event);
    },

    onTouchLeave : function onTouchLeaveFn(event)
    {
        var eventHandlers = this.handlers.touchleave;

        event.preventDefault();

        event = this.convertW3TouchEventToTurbulenzTouchEvent(event);

        this.sendEventToHandlers(eventHandlers, event);
    },

    onTouchCancel : function onTouchCancelFn(event)
    {
        var eventHandlers = this.handlers.touchcancel;

        event.preventDefault();

        event = this.convertW3TouchEventToTurbulenzTouchEvent(event);

        // Remove canceled touches
        this.removeTouches(event.changedTouches);

        this.sendEventToHandlers(eventHandlers, event);
    },

    convertW3TouchEventToTurbulenzTouchEvent : function convertW3TouchEventToTurbulenzTouchEventFn(w3TouchEvent)
    {
        // Initialize changedTouches
        var changedTouches = this.convertW3TouchListToTurbulenzTouchList(w3TouchEvent.changedTouches);

        // Initialize gameTouches
        var gameTouches = this.convertW3TouchListToTurbulenzTouchList(w3TouchEvent.targetTouches);

        // Initialize touches
        var touches = this.convertW3TouchListToTurbulenzTouchList(w3TouchEvent.touches);

        var touchEventParams =
        {
            changedTouches  : changedTouches,
            gameTouches     : gameTouches,
            touches         : touches
        };

        return WebGLTouchEvent.create(touchEventParams);
    },

    convertW3TouchListToTurbulenzTouchList : function convertW3TouchListToTurbulenzTouchListFn(w3TouchList)
    {
        // Set changedTouches
        var w3TouchListLength = w3TouchList.length;
        var touchList = [];

        var touch;
        var touchIndex;

        touchList.length = w3TouchListLength;

        for (touchIndex = 0; touchIndex < w3TouchListLength; touchIndex += 1)
        {
            touch = this.getTouchById(w3TouchList[touchIndex].identifier);
            touchList[touchIndex] = touch;
        }

        return touchList;
    },

    convertW3TouchToTurbulenzTouch : function convertW3TouchToTurbulenzTouchFn(w3Touch)
    {
        var canvasElement   = this.canvas;
        var canvasRect      = canvasElement.getBoundingClientRect();

        var touchParams =
        {
            force           : (w3Touch.force || w3Touch.webkitForce || 0),
            identifier      : w3Touch.identifier,
            isGameTouch     : (w3Touch.target === canvasElement),
            positionX       : (w3Touch.pageX - canvasRect.left),
            positionY       : (w3Touch.pageY - canvasRect.top),
            radiusX         : (w3Touch.radiusX || w3Touch.webkitRadiusX || 1),
            radiusY         : (w3Touch.radiusY || w3Touch.webkitRadiusY || 1),
            rotationAngle   : (w3Touch.rotationAngle || w3Touch.webkitRotationAngle || 0)
        };

        return Touch.create(touchParams);
    },

    addTouches : function addTouchesFn(w3TouchList)
    {
        var w3TouchListLength = w3TouchList.length;

        var touchIndex;
        var touch;

        for (touchIndex = 0; touchIndex < w3TouchListLength; touchIndex += 1)
        {
            touch = this.convertW3TouchToTurbulenzTouch(w3TouchList[touchIndex]);
            this.addTouch(touch);
        }
    },

    removeTouches : function removeTouchesFn(w3TouchList)
    {
        var w3TouchListLength = w3TouchList.length;

        var touchIndex;
        var touchId;

        for (touchIndex = 0; touchIndex < w3TouchListLength; touchIndex += 1)
        {
            touchId = w3TouchList[touchIndex].identifier;
            this.removeTouchById(touchId);
        }
    },

    addTouch : function addTouchFn(touch)
    {
        this.touches[touch.identifier] = touch;
    },

    getTouchById : function getTouchByIdFn(id)
    {
        return this.touches[id];
    },

    removeTouchById : function removeTouchByIdFn(id)
    {
        delete this.touches[id];
    },

    // Canvas event handlers

    canvasOnMouseOver : function canvasOnMouseOverFn(event)
    {
        var mouseEnterHandlers = this.handlers.mouseenter;

        if (!this.isMouseLocked)
        {
            this.isHovering = true;

            this.lastX = event.screenX;
            this.lastY = event.screenY;

            this.setEventHandlersMouseEnter();

            // Send mouseover event
            this.sendEventToHandlers(mouseEnterHandlers);
        }
        else
        {
            this.isOutsideEngine = false;
        }
    },

    canvasOnMouseOut : function canvasOnMouseOutFn(/* event */)
    {
        var mouseLeaveHandlers = this.handlers.mouseleave;

        if (!this.isMouseLocked)
        {
            this.isHovering = false;

            if (this.isCursorHidden)
            {
                this.showMouse();
            }

            this.setEventHandlersMouseLeave();

            // Send mouseout event
            this.sendEventToHandlers(mouseLeaveHandlers);
        }
        else
        {
            this.isOutsideEngine = true;
        }
    },

    // This is required in order to detect hovering when we missed the initial mouseover event
    canvasOnMouseDown : function canvasOnMouseDownFn(event)
    {
        var mouseEnterHandlers = this.handlers.mouseenter;

        this.canvas.onmousedown = null;

        if (!this.isHovering)
        {
            this.isHovering = true;

            this.lastX = event.screenX;
            this.lastY = event.screenY;

            this.setEventHandlersMouseEnter();

            this.sendEventToHandlers(mouseEnterHandlers);

            this.onMouseDown(event);
        }

        return false;
    },

    // Window event handlers

    onFullscreenChanged : function onFullscreenChangedFn(/* event */)
    {
        if (this.isMouseLocked)
        {
            if (document.fullscreenEnabled || document.mozFullScreen || document.webkitIsFullScreen)
            {
                this.ignoreNextMouseMoves = 2; // Some browsers will send 2 mouse events with a massive delta
                this.requestBrowserLock();
            }
            else
            {
                // Browsers capture the escape key whilst in fullscreen
                this.unlockMouse();
            }
        }
    },

    // Set event handler methods

    setEventHandlersMouseEnter : function setEventHandlersMouseEnterFn()
    {
        // Add event listener to get focus event
        if (!this.isFocused())
        {
            this.addInternalEventListener(window, 'mousedown', this.onMouseDown);
        }

        this.addInternalEventListener(window, 'mouseup', this.onMouseUp);
        this.addInternalEventListener(window, 'mousemove', this.onMouseOver);
        this.addInternalEventListener(window, 'DOMMouseScroll', this.onWheel);
        this.addInternalEventListener(window, 'mousewheel', this.onWheel);
        this.addInternalEventListener(window, 'click', this.emptyEvent);
    },

    setEventHandlersMouseLeave : function setEventHandlersMouseLeaveFn()
    {
        // We do not need a mousedown listener if not focused
        if (!this.isFocused())
        {
            this.removeInternalEventListener(window, 'mousedown', this.onMouseDown);
        }

        // Remove mouse event listeners
        this.removeInternalEventListener(window, 'mouseup', this.onMouseUp);
        this.removeInternalEventListener(window, 'mousemove', this.onMouseOver);
        this.removeInternalEventListener(window, 'DOMMouseScroll', this.onWheel);
        this.removeInternalEventListener(window, 'mousewheel', this.onWheel);
        this.removeInternalEventListener(window, 'click', this.emptyEvent);
    },

    setEventHandlersFocus : function setEventHandlersFocusFn()
    {
        this.addInternalEventListener(window, 'keydown', this.onKeyDown);
        this.addInternalEventListener(window, 'keyup', this.onKeyUp);
    },

    setEventHandlersBlur : function setEventHandlersBlurFn()
    {
        this.removeInternalEventListener(window, 'keydown', this.onKeyDown);
        this.removeInternalEventListener(window, 'keyup', this.onKeyUp);
        this.removeInternalEventListener(window, 'mousedown', this.onMouseDown);
    },

    setEventHandlersLock : function setEventHandlersLockFn()
    {
        this.removeInternalEventListener(window, 'mousemove', this.onMouseOver);

        this.addInternalEventListener(window, 'mousemove', this.onMouseMove);
        this.addInternalEventListener(window, 'fullscreenchange', this.onFullscreenChanged);
        this.addInternalEventListener(window, 'mozfullscreenchange', this.onFullscreenChanged);
        this.addInternalEventListener(window, 'webkitfullscreenchange', this.onFullscreenChanged);
    },

    setEventHandlersUnlock : function setEventHandlersUnlockFn()
    {
        this.removeInternalEventListener(window, 'webkitfullscreenchange', this.onFullscreenChanged);
        this.removeInternalEventListener(window, 'mozfullscreenchange', this.onFullscreenChanged);
        this.removeInternalEventListener(window, 'fullscreenchange', this.onFullscreenChanged);
        this.removeInternalEventListener(window, 'mousemove', this.onMouseMove);

        this.addInternalEventListener(window, 'mousemove', this.onMouseOver);
    },

    setEventHandlersCanvas : function setEventHandlersCanvasFn()
    {
        var canvas = this.canvas;

        this.addInternalEventListener(canvas, 'mouseover', this.canvasOnMouseOver);
        this.addInternalEventListener(canvas, 'mouseout', this.canvasOnMouseOut);
        this.addInternalEventListener(canvas, 'mousedown', this.canvasOnMouseDown);
    },

    setEventHandlersWindow : function setEventHandlersWindowFn()
    {
        this.addInternalEventListener(window, 'blur', this.onBlur);
        this.addInternalEventListener(window, 'focus', this.onWindowFocus);
    },

    removeEventHandlersWindow : function removeEventHandlersWindowFn()
    {
        this.removeInternalEventListener(window, 'blur', this.onBlur);
        this.removeInternalEventListener(window, 'focus', this.onWindowFocus);
    },

    setEventHandlersTouch : function setEventHandlersTouchFn()
    {
        var canvas = this.canvas;

        this.addInternalEventListener(canvas, 'touchstart', this.onTouchStart);
        this.addInternalEventListener(canvas, 'touchend', this.onTouchEnd);
        this.addInternalEventListener(canvas, 'touchenter', this.onTouchEnter);
        this.addInternalEventListener(canvas, 'touchleave', this.onTouchLeave);
        this.addInternalEventListener(canvas, 'touchmove', this.onTouchMove);
        this.addInternalEventListener(canvas, 'touchcancel', this.onTouchCancel);
    },

    // Helper methods

    addInternalEventListener : function addInternalEventListenerFn(element, eventName, eventHandler)
    {
        var elementEventFlag = this.elementEventFlags[element];
        if (!elementEventFlag)
        {
            this.elementEventFlags[element] = elementEventFlag = {};
        }

        if (!elementEventFlag[eventName])
        {
            elementEventFlag[eventName] = true;

            var boundEventHandler = this.boundFunctions[eventHandler];
            if (!boundEventHandler)
            {
                this.boundFunctions[eventHandler] = boundEventHandler = eventHandler.bind(this);
            }

            element.addEventListener(eventName, boundEventHandler, false);
        }
    },

    removeInternalEventListener : function removeInternalEventListenerFn(element, eventName, eventHandler)
    {
        var elementEventFlag = this.elementEventFlags[element];
        if (elementEventFlag)
        {
            if (elementEventFlag[eventName])
            {
                elementEventFlag[eventName] = false;

                var boundEventHandler = this.boundFunctions[eventHandler];

                element.removeEventListener(eventName, boundEventHandler, false);
            }
        }
    },

    destroy : function destroyFn()
    {
        // Remove all event listeners
        if (this.isLocked())
        {
            this.setEventHandlersUnlock();
        }

        if (this.isHovering)
        {
            this.setEventHandlersMouseLeave();
        }

        if (this.isWindowFocused)
        {
            this.setEventHandlersBlur();
        }

        this.removeEventHandlersWindow();

        var canvas = this.canvas;
        canvas.onmouseover = null;
        canvas.onmouseout = null;
        canvas.onmousedown = null;
    },

    isSupported : function inputDevice_isSupportedFn(name)
    {
        var canvas = this.canvas;

        if ((canvas) && (name === "POINTER_LOCK"))
        {
            // Currently Firefox requires full screen mode for pointer
            // lock to work.

            var fullscreenEnabled = (document.fullscreenEnabled ||
                                     document.mozFullScreen ||
                                     document.webkitIsFullScreen);

            // This check prevents allowing pointer lock in Firefox
            // until this requirement is removed.  Allows chrome to
            // lock whenever.

            var navStr = window.navigator.userAgent;
            var allowPointerLock =
                (navStr.indexOf('Chrome') >= 0) || fullscreenEnabled;

            var havePointerLock = ('pointerLockElement' in document) ||
                ('mozPointerLockElement' in document) ||
                ('webkitPointerLockElement' in document);

            var requestPointerLock = (canvas.requestPointerLock ||
                                      canvas.mozRequestPointerLock ||
                                      canvas.webkitRequestPointerLock);

            if (allowPointerLock && havePointerLock && requestPointerLock)
            {
                return true;
            }
        }

        return false;
    }
};

// Constructor function
WebGLInputDevice.create = function webGLInputDeviceFn(canvas /*, params */)
{
    var id = new WebGLInputDevice();

    id.lastX = 0;
    id.lastY = 0;

    id.touches = {};

    id.boundFunctions = {};
    id.elementEventFlags = {};

    id.canvas = canvas;
    id.isMouseLocked = false;
    id.isHovering = false;
    id.isWindowFocused = false;
    id.isCursorHidden = false;
    id.isOutsideEngine = false; // Used for determining where we are when unlocking
    id.previousCursor = '';
    id.ignoreNextMouseMoves = 0;

    // Used to screen out auto-repeats, dictionary from keycode to bool,
    // true for each key currently pressed down
    id.pressedKeys = {};

    // Game event handlers
    id.handlers =
    {
        keydown : [],
        keyup : [],

        mousedown : [],
        mouseup : [],
        mousewheel : [],
        mouseover : [],
        mousemove : [],

        paddown : [],
        padup : [],
        padmove : [],

        mouseenter : [],
        mouseleave : [],
        focus : [],
        blur : [],
        mouselocklost : [],

        touchstart : [],
        touchend : [],
        touchenter : [],
        touchleave : [],
        touchmove : [],
        touchcancel : []
    };

    // Populate the keyCodeToUnicodeTable.  Just use the 'key' part of
    // the keycodes, overriding some special cases.

    var keyCodeToUnicodeTable = {};
    var keyCodes = id.keyCodes;
    for (var k in keyCodes)
    {
        if (keyCodes.hasOwnProperty(k))
        {
            var code = keyCodes[k];
            keyCodeToUnicodeTable[code] = k;
        }
    }
    keyCodeToUnicodeTable[keyCodes.SPACE] = ' ';
    keyCodeToUnicodeTable[keyCodes.NUMBER_0] = '0';
    keyCodeToUnicodeTable[keyCodes.NUMBER_1] = '1';
    keyCodeToUnicodeTable[keyCodes.NUMBER_2] = '2';
    keyCodeToUnicodeTable[keyCodes.NUMBER_3] = '3';
    keyCodeToUnicodeTable[keyCodes.NUMBER_4] = '4';
    keyCodeToUnicodeTable[keyCodes.NUMBER_5] = '5';
    keyCodeToUnicodeTable[keyCodes.NUMBER_6] = '6';
    keyCodeToUnicodeTable[keyCodes.NUMBER_7] = '7';
    keyCodeToUnicodeTable[keyCodes.NUMBER_8] = '8';
    keyCodeToUnicodeTable[keyCodes.NUMBER_9] = '9';
    keyCodeToUnicodeTable[keyCodes.GRAVE] = '`';
    keyCodeToUnicodeTable[keyCodes.MINUS] = '-';
    keyCodeToUnicodeTable[keyCodes.EQUALS] = '=';
    keyCodeToUnicodeTable[keyCodes.LEFT_BRACKET] = '[';
    keyCodeToUnicodeTable[keyCodes.RIGHT_BRACKET] = ']';
    keyCodeToUnicodeTable[keyCodes.SEMI_COLON] = ';';
    keyCodeToUnicodeTable[keyCodes.APOSTROPHE] = "'";
    keyCodeToUnicodeTable[keyCodes.COMMA] = ',';
    keyCodeToUnicodeTable[keyCodes.PERIOD] = '.';
    keyCodeToUnicodeTable[keyCodes.SLASH] = '/';
    keyCodeToUnicodeTable[keyCodes.BACKSLASH] = '\\';

    // KeyMap: Maps JavaScript keycodes to Turbulenz keycodes - some
    // keycodes are consistent across all browsers and some mappings
    // are browser specific.
    var keyMap = {};

    // A-Z
    keyMap[65] = 0; // A
    keyMap[66] = 1; // B
    keyMap[67] = 2; // C
    keyMap[68] = 3; // D
    keyMap[69] = 4; // E
    keyMap[70] = 5; // F
    keyMap[71] = 6; // G
    keyMap[72] = 7; // H
    keyMap[73] = 8; // I
    keyMap[74] = 9; // J
    keyMap[75] = 10; // K
    keyMap[76] = 11; // L
    keyMap[77] = 12; // M
    keyMap[78] = 13; // N
    keyMap[79] = 14; // O
    keyMap[80] = 15; // P
    keyMap[81] = 16; // Q
    keyMap[82] = 17; // R
    keyMap[83] = 18; // S
    keyMap[84] = 19; // T
    keyMap[85] = 20; // U
    keyMap[86] = 21; // V
    keyMap[87] = 22; // X
    keyMap[88] = 23; // W
    keyMap[89] = 24; // Y
    keyMap[90] = 25; // Z

    // 0-9
    keyMap[48] = 100; // 0
    keyMap[49] = 101; // 1
    keyMap[50] = 102; // 2
    keyMap[51] = 103; // 3
    keyMap[52] = 104; // 4
    keyMap[53] = 105; // 5
    keyMap[54] = 106; // 6
    keyMap[55] = 107; // 7
    keyMap[56] = 108; // 8
    keyMap[57] = 109; // 9

    // Arrow keys
    keyMap[37] = 200; // LEFT
    keyMap[39] = 201; // RIGHT
    keyMap[38] = 202; // UP
    keyMap[40] = 203; // DOWN

    // Modifier keys
    keyMap[16] = 300; // LEFT_SHIFT
    //keyMap[16] = 301; // RIGHT_SHIFT
    keyMap[17] = 302; // LEFT_CONTROL
    //keyMap[17] = 303; // RIGHT_CONTROL
    keyMap[18] = 304; // LEFT_ALT
    keyMap[0] = 305; // RIGHT_ALT

    // Special keys
    keyMap[27] = 400; // ESCAPE
    keyMap[9] = 401; // TAB
    keyMap[32] = 402; // SPACE
    keyMap[8] = 403; // BACKSPACE
    keyMap[13] = 404; // RETURN

    // Punctuation keys
    keyMap[223] = 500; // GRAVE
    keyMap[173] = 501; // MINUS (mozilla - gecko)
    keyMap[189] = 501; // MINUS (ie + webkit)
    keyMap[61] = 502; // EQUALS (mozilla - gecko)
    keyMap[187] = 502; // EQUALS (ie + webkit)
    keyMap[219] = 503; // LEFT_BRACKET
    keyMap[221] = 504; // RIGHT_BRACKET
    keyMap[59] = 505; // SEMI_COLON (mozilla - gecko)
    keyMap[186] = 505; // SEMI_COLON (ie + webkit)
    keyMap[192] = 500; // GRAVE
    keyMap[188] = 507; // COMMA
    keyMap[190] = 508; // PERIOD
    keyMap[222] = 506; // APOSTROPHE

    // if Mac OS GRAVE can sometimes come through as 0
    if (navigator.appVersion.indexOf("Mac") !== -1)
    {
        keyMap[0] = 500; // GRAVE (mac gecko + safari 5.1)
    }

    // Non-standard keys
    keyMap[112] = 600; // F1
    keyMap[113] = 601; // F2
    keyMap[114] = 602; // F3
    keyMap[115] = 603; // F4
    keyMap[116] = 604; // F5
    keyMap[117] = 605; // F6
    keyMap[118] = 606; // F7
    keyMap[119] = 607; // F8
    keyMap[120] = 608; // F9
    keyMap[121] = 609; // F10
    keyMap[122] = 610; // F11
    keyMap[123] = 611; // F12
    //keyMap[45 : 612, // NUMPAD_0 (numlock on/off)
    keyMap[96] = 612; // NUMPAD_0 (numlock on/off)
    //keyMap[35] = 613;, // NUMPAD_1 (numlock on/off)
    keyMap[97] = 613; // NUMPAD_1 (numlock on/off)
    //keyMap[40] = 614; // NUMPAD_2 (numlock on/off)
    keyMap[98] = 614; // NUMPAD_2 (numlock on/off)
    //keyMap[34] = 615; // NUMPAD_3 (numlock on/off)
    keyMap[99] = 615; // NUMPAD_3 (numlock on/off)
    //keyMap[37] = 616;, // NUMPAD_4 (numlock on/off)
    keyMap[100] = 616; // NUMPAD_4 (numlock on/off)
    keyMap[12] = 617; // NUMPAD_5 (numlock on/off)
    keyMap[101] = 617; // NUMPAD_5 (numlock on/off)
    keyMap[144] = 617; // NUMPAD_5 (numlock on/off) and NUMPAD_NUM
    //keyMap[39] = 618; // NUMPAD_6 (numlock on/off)
    keyMap[102] = 618; // NUMPAD_6 (numlock on/off)
    //keyMap[36] = 619; // NUMPAD_7 (numlock on/off)
    keyMap[103] = 619; // NUMPAD_7 (numlock on/off)
    //keyMap[38] = 620; // NUMPAD_8 (numlock on/off)
    keyMap[104] = 620; // NUMPAD_8 (numlock on/off)
    //keyMap[33] = 621; // NUMPAD_9 (numlock on/off)
    keyMap[105] = 621; // NUMPAD_9 (numlock on/off)
    //keyMap[13] = 622; // NUMPAD_ENTER (numlock on/off)
    keyMap[111] = 623; // NUMPAD_DIVIDE (numlock on/off)
    keyMap[191] = 623; // NUMPAD_DIVIDE (numlock on/off), mac chrome
    keyMap[106] = 624; // NUMPAD_MULTIPLY (numlock on/off)
    keyMap[107] = 625; // NUMPAD_ADD (numlock on/off)
    keyMap[109] = 626; // NUMPAD_SUBTRACT (numlock on/off)
    keyMap[91] = 627; // LEFT_WIN
    keyMap[224] = 627; // LEFT_WIN (mac, firefox)
    keyMap[92] = 628; // RIGHT_WIN
    keyMap[93] = 628; // RIGHT_WIN (mac, chrome)
    //: 629, // LEFT_OPTION
    //: 630, // RIGHT_OPTION
    keyMap[20] = 631; // CAPS_LOCK
    keyMap[45] = 632; // INSERT
    keyMap[46] = 633; // DELETE
    keyMap[36] = 634; // HOME
    keyMap[35] = 635; // END
    keyMap[33] = 636; // PAGE_UP
    keyMap[34] = 637; // PAGE_DOWN

    id.keyMap = keyMap;

    // MouseMap: Maps current mouse controls to new controls
    var mouseMap =
    {
        0 : 0,
        1 : 2,
        2 : 1
    };

    id.mouseMap = mouseMap;

    // padMap: Maps current pad buttons to new buttons
    var padMap =
    {
        0 : 4, // A
        1 : 5, // B
        2 : 6, // X
        3 : 7, // Y

        4 : 10, // LEFT_SHOULDER
        5 : 11, // RIGHT_SHOULDER

        8 : 19, // BACK
        9 : 18, // START

        10 : 12, // LEFT_THUMB
        11 : 15, // RIGHT_THUMB

        12 : 0, // UP
        13 : 2, // DOWN
        14 : 1, // LEFT
        15 : 3  // RIGHT
    };

    id.padMap = padMap;

    id.keyCodeToUnicode = keyCodeToUnicodeTable;

    id.padButtons = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    id.padMap = padMap;
    id.padAxisDeadZone = 0.26;
    id.maxAxisRange = 1.0;
    id.padTimestampUpdate = 0;

    // Pointer locking
    var requestPointerLock = (canvas.requestPointerLock    ||
                              canvas.mozRequestPointerLock ||
                              canvas.webkitRequestPointerLock);
    if (requestPointerLock)
    {
        var exitPointerLock = (document.exitPointerLock    ||
                               document.mozExitPointerLock ||
                               document.webkitExitPointerLock);

        id.requestBrowserLock = function requestBrowserLockFn()
        {
            var pointerLockElement = (document.pointerLockElement    ||
                                      document.mozPointerLockElement ||
                                      document.webkitPointerLockElement);
            if (pointerLockElement !== canvas)
            {
                requestPointerLock.call(canvas);
            }
        };

        id.requestBrowserUnlock = function requestBrowserUnlockFn()
        {
            var pointerLockElement = (document.pointerLockElement    ||
                                      document.mozPointerLockElement ||
                                      document.webkitPointerLockElement);
            if (pointerLockElement === canvas)
            {
                exitPointerLock.call(document);
            }
        };
    }
    else
    {
        var pointer = (navigator.pointer || navigator.webkitPointer);
        if (pointer)
        {
            id.requestBrowserLock = function requestBrowserLockFn()
            {
                if (!pointer.isLocked)
                {
                    pointer.lock(canvas);
                }
            };

            id.requestBrowserUnlock = function requestBrowserUnlockFn()
            {
                if (pointer.isLocked)
                {
                    pointer.unlock();
                }
            };
        }
        else
        {
            id.requestBrowserLock = function requestBrowserLockFn() {};
            id.requestBrowserUnlock = function requestBrowserUnlockFn() {};
        }
    }

    // Add canvas mouse event listeners
    id.setEventHandlersCanvas();

    // Add window blur event listener
    id.setEventHandlersWindow();

    // Add canvas touch event listeners
    id.setEventHandlersTouch();

    // Record the platforms so that we can enable workarounds, etc.
    var sysInfo = TurbulenzEngine.getSystemInfo();
    id.macosx = ("Darwin" === sysInfo.osName);
    id.webkit = (/WebKit/.test(navigator.userAgent));

    return id;
};
