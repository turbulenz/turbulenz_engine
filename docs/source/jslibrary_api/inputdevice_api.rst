.. _inputdevice:

.. highlight:: javascript

.. index::
    single: InputDevice

----------------------
The InputDevice Object
----------------------

``InputDevice`` provides support for keyboard, mouse, and Xbox 360
gamepad input events. It queues input events received between
consecutive calls to :ref:`update<inputdevice-update>`. When
:ref:`update<inputdevice-update>` is called, the events are dispatched
in order using the appropriate event handlers and the event queue is
cleared.

The ``InputDevice`` also allows the game to hide/show the mouse cursor
and lock its position (by calling
:ref:`lockMouse<inputdevice-lockMouse>`).

Event Handling
==============

For each HID supported, there are three main event types: down events,
up events, and move events. Down events occur when a button/key is
pressed, up events when a button/key is released and move events occur
when the HID is moved, or an analogue control on it (e.g. thumbstick)
is adjusted. In addition, the following events are supported:

* :ref:`mousewheel<inputdevice-mousewheel>` events
* :ref:`focus<inputdevice-focus>`/:ref:`blur<inputdevice-blur>` events
* :ref:`mouseenter<inputdevice-mouseenter>`/:ref:`mouseleave<inputdevice-mouseleave>` events
* :ref:`mouselocklost<inputdevice-mouselocklost>` events

Focus and blur events occur when the TurbulenzEngine object gains or
loses focus. Clicking on the TurbulenzEngine object gives it focus,
and clicking elsewhere or switching window (or tab) causes it to lose
focus.

.. NOTE::

    Unless otherwise specified, events of a certain type are only received when the TurbulenzEngine has focus; the
    events not requiring focus are: :ref:`mouseenter<inputdevice-mouseenter>`,
    :ref:`mouseleave<inputdevice-mouseleave>`, :ref:`mouseover<inputdevice-mouseover>`,
    :ref:`mouseup<inputdevice-mouseup>`, and :ref:`mousedown<inputdevice-mousedown>`.

Event handlers are added and removed using
:ref:`addEventListener<inputdevice-addeventlistener>` and
:ref:`removeEventListener<inputdevice-removeeventlistener>`.  Multiple
event listeners may be added for each event type.


Control Codes
=============

In general, a human interface device (HID) such as a mouse or
keyboard, has a number of "controls" which the user can interact with
to produce input events. Each control (e.g. mouse button, keyboard
key) has an associated "control code".  These allow the game to
identify input consistently and clearly. Keyboard, mouse and pad
control codes are referred to as `KeyCodes`, `MouseCodes`, and
`PadCodes` respectively.

The keyboard is treated as a game controller rather than a text entry
device. Each keyboard control code (KeyCode) therefore corresponds to
an individual physical key on the keyboard (i.e. a control) and not
the text character that would result from such a key press. For
instance, pressing "Q" on the US keyboard will result in the same
KeyCode as pressing "A" on a French keyboard (as they are in the same
physical location on the keyboard). The names of the KeyCodes
correspond to the names of the keys on the US keyboard and in the
example above, the KeyCode generated would be "Q". For reference,
please see the US keyboard `here:
<http://en.wikipedia.org/wiki/File:KB_United_States-NoAltGr.svg>`_

.. NOTE::

    The Escape key is reserved for unlocking the user's mouse and
    exiting fullscreen, and pressing it or releasing it causes no key
    events to be sent. In general, keys which are not currently part
    of the mapping scheme will not send events and cannot be used by
    the game.

.. WARNING::

    Keyboards exist with a wide variety of different keys. It is
    strongly recommended to only use the most common keys as part of
    any default control scheme. A list of standard keys are shown in
    the :ref:`KeyCode table <inputdevice-keycodetable>` section.

Using controls rather than characters for keyboard input has the
advantage that game code written will work for all keyboard layouts
without the need for localization; there is no need for multiple
versions of input code for each keyboard layout a game wishes to
support.

It may be necessary to convert from KeyCodes to the Unicode character
which would result from pressing that physical key with the user’s
keyboard layout e.g. when localizing the game controls displayed to
the user. The InputDevice API provides the function
:ref:`convertToUnicode <inputdevice-converttounicode>` for this
reason. In order to facilitate correct translation of in-game text,
and correct formatting of dates and numbers, the locale of the player
can be requested using the :ref:`TurbluenzEngine.getSystemInfo
<turbulenzengine_getSystemInfo>` function.


Methods
=======

.. _inputdevice-update:

`update`
--------

**Summary**

Iterates through the events in the event queue calling the relevant callbacks. Once all events have been dispatched, the
event queue is cleared.

.. NOTE::

    This behavior is different when running in canvas; in canvas mode, events are dispatched to handlers the moment
    they are received. To maintain compatibility with both modes, any clearing of input states carried out by the game
    should take place after input has been handled each frame.

.. NOTE::
    The plugin version requires the :ref:`GraphicsDevice <graphicsdevice>` to have been created for the InputDevice to generate events.

**Syntax** ::

    inputDevice.update();


.. _inputdevice-addeventlistener:

`addEventListener`
------------------

**Summary**

Adds an event listener for the specified event. Multiple event listeners may be added for each event type. Adding the
same event listener twice has no effect - the event listener will still only be called once per event.

**Syntax** ::

    var eventType = 'mouseleave';
    var eventListener = function onMouseLeave()
    {
        game.pause();
    }
    inputDevice.addEventListener(eventType, eventListener);


``eventType``
    A valid :ref:`event type <inputdevice-eventypes>` string.

``eventListener``
    Callback associated with events of eventType.

.. _inputdevice-removeeventlistener:


`removeEventListener`
---------------------

**Summary**

Removes an event listener for the specified event. If the event listener supplied was never added using
:ref:`addEventListener <inputdevice-addeventlistener>`, this has no effect.

**Syntax** ::

    inputDevice.removeEventListener(eventType, eventListener);


``eventType``
    A valid :ref:`event type <inputdevice-eventypes>` string.

``eventListener``
    Callback associated with events of eventType.


.. _inputdevice-lockmouse:

`lockMouse`
-----------

**Summary**

Locks the mouse cursor position and hides the cursor. Fails if the
cursor is not over the TurbulenzEngine object or if the
TurbulenzEngine object is not focused. Returns true or false to
indicate success or failure.

.. NOTE::

    When locked, :ref:`mousemove <inputdevice-mousemove>` events rather than
    :ref:`mouseover <inputdevice-mouseover>` events will be received for mouse movement.

**Syntax** ::

    if (!inputDevice.lockMouse())
    {
        // Failed to lockMouse (mouse is not over the TurbulenzEngine object)
    }


.. _inputdevice-unlockmouse:

`unlockMouse`
-------------

**Summary**

Unlocks the mouse cursor (reverses a `lockMouse` call) and reshows the mouse
cursor if it was not hidden before the call to `lockMouse`.  Fails if
the cursor is not currently locked. Returns true or false to indicate
success or failure.

**Syntax** ::

    if (!inputDevice.unlockMouse())
    {
        // Failed to unlockMouse (mouse was not already locked)
    }


.. _inputdevice-islocked:

`isLocked`
----------

**Summary**

Returns true if the mouse is currently locked, false otherwise.

**Syntax** ::

    if (!inputDevice.isLocked())
    {
        inputDevice.lockMouse();
    }


.. _inputdevice-hidemouse:

`hideMouse`
-----------

**Summary**

Hides the cursor if it is currently visible (not locked) and over the
TurbulenzEngine object; fails otherwise. Returns true or false to
indicate success or failure. When the mouse is locked the mouse cursor
is already hidden, this function will have no effect and will return
false.

**Syntax** ::

    if (!inputDevice.hideMouse())
    {
        // Failed to hideMouse (it was either locked, already hidden,
        // or outside of the TurbulenzEngine object)
    }


.. _inputdevice-showmouse:

`showMouse`
------------

**Summary**

Shows the cursor if it is currently hidden and not locked; fails
otherwise. Returns true or false to indicate success or failure.

It is an error to call this function while the mouse is locked, and it
will not affect the visibility of the mouse after subsequent calls to
`unlockMouse`.

**Syntax** ::

    if (!inputDevice.showMouse())
    {
        // Failed to showMouse (it was either already visible, or locked)
    }


.. _inputdevice-ishidden:

`isHidden`
-------------

**Summary**

Returns true if the mouse is currently hidden (including when locked), false
otherwise.

**Syntax** ::

    if (!inputDevice.isHidden())
    {
        inputDevice.hideMouse();
    }


.. _inputdevice-isfocused:

`isFocused`
-------------

**Summary**

Returns true if the TurbulenzEngine object is currently focused, false otherwise.

**Syntax** ::

    var isFocused = inputDevice.isFocused();


.. _inputdevice-converttounicode:

`convertToUnicode`
------------------

**Summary**

Converts a given array of KeyCodes to an object of the Unicode characters which would result from pressing those
physical keys with the user's keyboard layout. Returns null if the argument passed in is not an array. For KeyCodes
which do not have a corresponding Unicode character (e.g. the "alt" key), an empty string will be returned as the
property value in the returned object.

The returned object has the form { keycode : unicode, ... }.

**Syntax** ::

    var keyCodes = inputDevice.keyCodes;

    var keyCodeArray = [keyCodes.Q, keyCodes.B];
    var unicodeCharacterObject = convertToUnicode(keyCodeArray);
    // On a US keyboard unicodeCharacterObject[keyCodes.Q] will be equal to 'q',
    // while on a French keyboard, unicodeCharacterObject[keyCodes.Q] will be equal to 'a';

.. _inputdevice-issupported:

`isSupported`
-------------

**Summary**

Accepts a string describing a feature and returns a boolean informing
the game whether given features are supported in the current
configuration (depending on device, OS, browser, plugin vs canvas etc).

Currently supported features:

`POINTER_LOCK`

    The ability to lock and hide the mouse cursor and receive only
    mouse movement delta values.

**Syntax** ::

    var canLockMouse = inputDevice.isSupported("POINTER_LOCK");



Properties
==========

.. _inputdevice-keycodes:

`keyCodes`
-----------

A JavaScript object, storing KeyCode enums for use in game code. These should be cached for best performance. See the
:ref:`KeyCode Table<inputdevice-keycodetable>` for the full list.

**Syntax** ::

    var keyCodes = inputDevice.keyCodes;


.. _inputdevice-mousecodes:

`mouseCodes`
------------

A JavaScript object, storing MouseCode enums for use in game code. These should be cached for best performance. See the
:ref:`MouseCode Table<inputdevice-mousecodetable>` for the full list.

**Syntax** ::

    var mouseCodes = inputDevice.mouseCodes;


.. _inputdevice-padcodes:

`padCodes`
-----------

A JavaScript object, storing PadCode enums for use in game code. These should be cached for best performance. See the
:ref:`PadCode Table<inputdevice-padcodetable>` for the full list.

**Syntax** ::

    var padCodes = inputDevice.padCodes;


.. _inputdevice-eventypes:

Event Types
===========

Currently, the Turbulenz Engine supports keyboard, mouse, and touch events, as well as the Xbox 360 gamepad. Event
listeners can be added for the following event types:

* :ref:`keydown <inputdevice-keydown>`
* :ref:`keyup <inputdevice-keyup>`
* :ref:`mousedown <inputdevice-mousedown>`
* :ref:`mouseup <inputdevice-mouseup>`
* :ref:`mousewheel <inputdevice-mousewheel>`
* :ref:`mouseover <inputdevice-mouseover>`
* :ref:`mousemove <inputdevice-mousemove>`
* :ref:`mouseenter <inputdevice-mouseenter>`
* :ref:`mouseleave <inputdevice-mouseleave>`
* :ref:`paddown <inputdevice-paddown>`
* :ref:`padup <inputdevice-padup>`
* :ref:`focus <inputdevice-focus>`
* :ref:`blur <inputdevice-blur>`
* :ref:`mouselocklost <inputdevice-mouselocklost>`
* :ref:`touchstart <inputdevice-touchstart>`
* :ref:`touchend <inputdevice-touchend>`
* :ref:`touchmove <inputdevice-touchmove>`
* :ref:`touchenter <inputdevice-touchenter>`
* :ref:`touchleave <inputdevice-touchleave>`
* :ref:`touchcancel <inputdevice-touchcancel>`


.. _inputdevice-mouseevents:

Mouse Events
------------

These occur for laptop trackpads and traditional desktop mice.


.. _inputdevice-mousedown:

`mousedown`
-----------

**Summary**

Occurs when a mouse button is pressed down.

**Syntax** ::

    // Cache mouseCodes
    var mouseCodes = inputDevice.mouseCodes;

    var onMouseDown = function onMouseDownFn(mouseCode, x, y)
    {
        eventPositionX = x;
        eventPositionY = y;

        if (mouseCode === mouseCodes.BUTTON_0)
        {
            mouseFireButtonDown = true;
        }
    };

    inputDevice.addEventListener('mousedown', onMouseDown);

**Event Listener Arguments**

``mouseCode``
   A :ref:`mousecode <inputdevice-mousecodes>` corresponding to the mouse button pressed.

``x``
    x position of the event (in coordinates local to the TurbulenzEngine). Omitted if mouse is locked.

``y``
    y position of the event (in coordinates local to the TurbulenzEngine). Omitted if mouse is locked.


.. _inputdevice-mouseup:

`mouseup`
---------

**Summary**

Occurs when a mouse button is released.

**Syntax** ::

    // Cache mouseCodes
    var mouseCodes = inputDevice.mouseCodes;

    var onMouseUp = function onMouseUpFn(mouseCode, x, y)
    {
        eventPositionX = x;
        eventPositionY = y;

        if (mouseCode === mouseCodes.BUTTON_0)
        {
            mouseFireButtonDown = false;
        }
    };

    inputDevice.addEventListener('mouseup', onMouseUp);

**Event Listener Arguments**

``mouseCode``
   A :ref:`mousecode <inputdevice-mousecodes>` corresponding to the mouse button released.

``x``
    x position of the event (in coordinates local to the TurbulenzEngine). Omitted if mouse is locked.

``y``
    y position of the event (in coordinates local to the TurbulenzEngine). Omitted if mouse is locked.


.. _inputdevice-mousewheel:

`mousewheel`
------------

**Summary**

Occurs when the mouse wheel is moved.

**Syntax** ::

    var onMouseWheel = function onMouseWheelFn(delta)
    {
        if (delta > 0)
        {
            character.weapon += 1;
        }
        else
        {
            character.weapon -= 1;
        }
    };

    inputDevice.addEventListener('mousewheel', onMouseWheel);

**Event Listener Arguments**

``delta``
    The distance scrolled by the user - positive for upwards scrolling and negative otherwise.


.. _inputdevice-mousemove:

`mousemove`
-------------

**Summary**

Occurs when the mouse is moved whilst locked.

**Syntax** ::

    var onMouseMove = function onMouseMoveFn(deltaX, deltaY)
    {
        character.turn  += deltaX;
        character.pitch += deltaY;
    };

    inputDevice.addEventListener('mousemove', onMouseMove);

**Event Listener Arguments**

``deltaX``
    The distance the mouse has moved in the x direction since the last mouse move event.

``deltaY``
    The distance the mouse has moved in the y direction since the last mouse move event.


.. _inputdevice-mouseover:

`mouseover`
-------------

**Summary**

Occurs when the mouse is moved whilst unlocked.

**Syntax** ::

    var onMouseOver = function onMouseOverFn(x, y)
    {
        mousePosition.x = x;
        mousePosition.y = y;
    };

    inputDevice.addEventListener('mouseover', onMouseOver);

**Event Listener Arguments**

``x``
    x position of the event (in coordinates local to the TurbulenzEngine). Omitted if mouse is locked.

``y``
    y position of the event (in coordinates local to the TurbulenzEngine). Omitted if mouse is locked.


.. _inputdevice-mouseenter:

`mouseenter`
--------------

**Summary**

Occurs when the mouse cursor enters the game area.

**Syntax** ::

    var onMouseEnter = function onMouseEnterFn()
    {
        inputDevice.hideMouse();
    };

    inputDevice.addEventListener('mouseenter', onMouseEnter);


.. _inputdevice-mouseleave:

`mouseleave`
--------------

**Summary**

Occurs when the mouse cursor leaves the game area.

**Syntax** ::

    var onMouseLeave = function onMouseLeaveFn()
    {
        inputDevice.showMouse();
    };

    inputDevice.addEventListener('mouseleave', onMouseLeave);


.. _inputdevice-keyboardevents:

Keyboard Events
---------------

.. _inputdevice-keydown:

`keydown`
-----------

**Summary**

Occurs when a keyboard key is pressed down.

**Syntax** ::

    // Cache keyCodes
    var keyCodes = inputDevice.keyCodes;

    var onKeyDown = function onKeyDownFn(keycode)
    {
        if (keycode === keyCodes.LEFT || keycode === keyCodes.A)
        {
            character.left = 1.0;
        }
        else if (keycode === keyCodes.RIGHT || keycode === keyCodes.D)
        {
            character.right = 1.0;
        }
        else if (keycode === keyCodes.UP || keycode === keyCodes.W)
        {
            character.forward = 1.0;
        }
        else if (keycode === keyCodes.DOWN || keycode === keyCodes.S)
        {
            character.backward = 1.0;
        }
    };

    inputDevice.addEventListener('keydown', onKeyDown);

**Event Listener Arguments**

``keycode``
    A :ref:`keycode <inputdevice-keycodes>` corresponding to the key pressed.


.. _inputdevice-keyup:

`keyup`
---------

**Summary**

Occurs when a keyboard key is released.

**Syntax** ::

    // Cache keyCodes
    var keyCodes = inputDevice.keyCodes;

    var onKeyUp = function onKeyUpFn(keycode)
    {
        if (keycode === keyCodes.LEFT || keycode === keyCodes.A)
        {
            character.left = 0;
        }
        else if (keycode === keyCodes.RIGHT || keycode === keyCodes.D)
        {
            character.right = 0;
        }
        else if (keycode === keyCodes.UP || keycode === keyCodes.W)
        {
            character.forward = 0;
        }
        else if (keycode === keyCodes.DOWN || keycode === keyCodes.S)
        {
            character.backward = 0;
        }
    };

    inputDevice.addEventListener('keyup', onKeyUp);

**Event Listener Arguments**

``keycode``
    A :ref:`keycode <inputdevice-keycodes>` corresponding to the key released.


.. _inputdevice-touchevents:

Touch Events
------------

.. _inputdevice-touchstart:

`touchstart`
-------------

**Summary**

Occurs when at least one touch begins, and begins inside the game area.

**Syntax** ::

    var onTouchStart = function onTouchStartFn(touchEvent)
    {
        var newTouches = touchEvent.changedTouches;
    };

    inputDevice.addEventListener('touchstart', onTouchStart);

**Event Listener Arguments**

``touchEvent``
    A :ref:`TouchEvent <touchevent>` where :ref:`changedTouches <touchevent-changedtouches>` refers to the new touches.

.. _inputdevice-touchend:

`touchend`
-------------

**Summary**

Occurs when at least one touch ends.

**Syntax** ::

    var onTouchEnd = function onTouchEndFn(touchEvent)
    {
        var endedTouches = touchEvent.changedTouches;
    };

    inputDevice.addEventListener('touchend', onTouchEnd);

**Event Listener Arguments**

``touchEvent``
    A :ref:`TouchEvent <touchevent>` where :ref:`changedTouches <touchevent-changedtouches>` refers to the ended touches.

.. _inputdevice-touchmove:

`touchmove`
-------------

**Summary**

Occurs when at least one touch moves, changes :ref:`force <touch-force>`, :ref:`radiusX <touch-radiusx>`, or
:ref:`radiusY <touch-radiusy>`.

**Syntax** ::

    var onTouchMove = function onTouchMoveFn(touchEvent)
    {
        var movedTouches = touchEvent.changedTouches;
    };

    inputDevice.addEventListener('touchmove', onTouchMove);

**Event Listener Arguments**

``touchEvent``
    A :ref:`TouchEvent <touchevent>` where :ref:`changedTouches <touchevent-changedtouches>` refers to the moved touches.

.. _inputdevice-touchenter:

`touchenter`
-------------

**Summary**

Occurs when at least one touch enters the game area.

**Syntax** ::

    var onTouchEnter = function onTouchEnterFn(touchEvent)
    {
        var enteredTouches = touchEvent.changedTouches;
    };

    inputDevice.addEventListener('touchenter', onTouchEnter);

**Event Listener Arguments**

``touchEvent``
    A :ref:`TouchEvent <touchevent>` where :ref:`changedTouches <touchevent-changedtouches>` refers to the entered touches.

.. _inputdevice-touchleave:

`touchleave`
-------------

**Summary**

Occurs when at least one touch leaves the game area.

**Syntax** ::

    var onTouchLeave= function onTouchLeaveFn(touchEvent)
    {
        var leftTouches = touchEvent.changedTouches;
    };

    inputDevice.addEventListener('touchleave', onTouchLeave);

**Event Listener Arguments**

``touchEvent``
    A :ref:`TouchEvent <touchevent>` where :ref:`changedTouches <touchevent-changedtouches>` refers to the touches which have
    just left the game area.

.. _inputdevice-touchcancel:

`touchcancel`
-------------

**Summary**

Operating system/environment dependent. Called when at least one touch is dirupted or canceled.

**Syntax** ::

    var onTouchCancel = function onTouchCancelFn(touchEvent)
    {
        var canceledTouches = touchEvent.changedTouches;
    };

    inputDevice.addEventListener('touchcancel', onTouchCancel);

**Event Listener Arguments**

``touchEvent``
    A :ref:`TouchEvent <touchevent>` where :ref:`changedTouches <touchevent-changedtouches>` refers to the canceled touches.


.. _inputdevice-padevents:

Pad Events
----------

.. NOTE::

    Pad input is only supported using the Xbox 360 Controller on Windows.


.. _inputdevice-paddown:

`paddown`
-------------

**Summary**

Occurs when a (Xbox 360) gamepad button is pressed down.

**Syntax** ::

    // Cache padCodes
    var padCodes = inputDevice.padCodes;

    var onPadDown = function onPadDownFn(padCode)
    {
        if (!character.dead)
        {
            if (padCode === padCodes.A)
            {
                character.jump = true;
            }
        }
    };

    inputDevice.addEventListener('paddown', onKeyUp);

**Event Listener Arguments**

``padcode``
    A :ref:`padcode <inputdevice-padcodes>` corresponding to the pad button pressed.


.. _inputdevice-padup:

`padup`
-----------

**Summary**

Occurs when a (Xbox 360) gamepad button is released.

**Syntax** ::

    // Cache padCodes
    var padCodes = inputDevice.padCodes;

    var onPadUp = function onPadUpFn(padCode)
    {
        if (!character.dead)
        {
            if (padCode === padCodes.A)
            {
                character.jump = false;
            }
        }
    };

    inputDevice.addEventListener('padup', onPadUp);

**Event Listener Arguments**

``padcode``
    A :ref:`padcode <inputdevice-padcodes>` corresponding to the pad button released.


.. _inputdevice-padmove:

`padmove`
-------------

**Summary**

Occurs when either a thumbstick or shoulder trigger is displaced.

If a gamepad is connected, this function will be called for every call to :ref:`update <inputdevice-update>`. If the
gamepad controls are not displaced, all arguments will have a value of 0.

**Syntax** ::

    // Cache padCodes
    var padCodes = inputDevice.padCodes;

    var onPadMove = function onPadMoveFn(lX, lY, lZ, rX, rY, rZ)
    {
        character.turn  += lX * 10.0;
        character.pitch += lY * 10.0;

        if (rX >= 0)
        {
            character.padright = rX;
            character.padleft  = 0;
        }
        else
        {
            character.padright = 0;
            character.padleft  = -rX;
        }

        if (rY >= 0)
        {
            character.padforward  = rY;
            character.padbackward = 0.0;
        }
        else
        {
            character.padforward  = 0.0;
            character.padbackward = -rY;
        }
    };

    inputDevice.addEventListener('padmove', onPadMove);

**Event Listener Arguments**

``lX``
    Horizontal position of the left thumbstick. Has values from -1 to 1 inclusive.

``lY``
    Vertical position of the left thumbstick. Has values from -1 to 1 inclusive.

``lZ``
    Position of the left shoulder trigger. Has values in the range 0 to 1 inclusive.

``rX``
    Horizontal position of the right thumbstick. Has values from -1 to 1 inclusive.

``rY``
    Vertical position of the right thumbstick. Has values from -1 to 1 inclusive.

``rZ``
    Position of the right shoulder trigger. Has values in the range 0 to 1 inclusive.

Positive `lX`, `lY`, `rX`, and `rY` values correspond to right and up directions. Negative deltas correspond to left and
down directions.

A value of 0 denotes the edge of a deadzone and value of ±1 denotes the maximum possible displacement from rest
position. The deadzones used are the defaults provided by XInput. Please see
`XInput on MSDN <http://msdn.microsoft.com/en-us/library/windows/desktop/ee417001(v=vs.85).aspx>`_ for further details.


Other Events
------------

.. _inputdevice-focus:

`focus`
---------

**Summary**

Occurs when the TurbulenzEngine object gains focus - e.g. when the user first clicks inside the game area.

**Syntax** ::

    var onFocus = function onFocusFn()
    {
        game.unpause();
    };

    inputDevice.addEventListener('focus', onFocus);


.. _inputdevice-blur:

`blur`
--------

**Summary**

Occurs when the TurbulenzEngine object loses focus - e.g. when the user clicks outside of the game area or
switches windows/tabs.

**Syntax** ::

    var onBlur = function onBlurFn()
    {
        game.pause();
    };

    inputDevice.addEventListener('blur', onBlur);


.. _inputdevice-mouselocklost:

`mouselocklost`
-----------------

**Summary**

Occurs when the mouse lock is lost. E.g. if the user presses the Escape key when the mouse is locked, or after
:ref:`unlockMouse <inputdevice-unlockmouse>` is called.

**Syntax** ::

    inputDevice.onMouseLockLost = function onMouseLockLostFn()
    {
        game.pause();
    };

    inputDevice.addEventListener('mouselocklost', onMouseLockLost);


.. _inputdevice-controlcodetables:

Control Code Tables
===================

.. _inputdevice-keycodetable:

KeyCodes
--------

.. NOTE::

    KeyCodes are named according to the names of the physical keys on the US keyboard. Click
    `here <http://en.wikipedia.org/wiki/Keyboard_layout#United_States>`_ for details.

.. WARNING::

    It should be stressed that the numerical values of the KeyCodes should not be used directly in game code and are
    subject to change. The values below should be used only for debugging purposes.

.. _inputdevice-standardkeys:

Standard Keys
*************

The keys below represent the most common physical keys found on keyboards and are safe to use as part of a default
control scheme.

=============== =====
KeyCode Name    Value
=============== =====
A               0
B               1
C               2
D               3
E               4
F               5
G               6
H               7
I               8
J               9
K               10
L               11
M               12
N               13
O               14
P               15
Q               16
R               17
S               18
T               19
U               20
V               21
W               22
X               23
Y               24
Z               25

NUMBER_0        100
NUMBER_1        101
NUMBER_2        102
NUMBER_3        103
NUMBER_4        104
NUMBER_5        105
NUMBER_6        106
NUMBER_7        107
NUMBER_8        108
NUMBER_9        109

LEFT            200
RIGHT           201
UP              202
DOWN            203

LEFT_SHIFT      300
RIGHT_SHIFT     301
LEFT_CONTROL    302
RIGHT_CONTROL   303
LEFT_ALT        304

ESCAPE          400
TAB             401
SPACE           402
BACKSPACE       403
RETURN          404

GRAVE           500
MINUS           501
EQUALS          502
LEFT_BRACKET    503
RIGHT_BRACKET   504
SEMI_COLON      505
APOSTROPHE      506
COMMA           507
PERIOD          508
=============== =====

Non-Standard Keys
*****************

The following are non-standard keys and should not be used as part of a default control scheme.

=============== =====
KeyCode Name    Value
=============== =====
RIGHT_ALT       305
F1              600
F2              601
F3              602
F4              603
F5              604
F6              605
F7              606
F8              607
F9              608
F10             609
F11             610
F12             611
NUMPAD_0        612
NUMPAD_1        613
NUMPAD_2        614
NUMPAD_3        615
NUMPAD_4        616
NUMPAD_5        617
NUMPAD_6        618
NUMPAD_7        619
NUMPAD_8        620
NUMPAD_9        621
NUMPAD_ENTER    622
NUMPAD_DIVIDE   623
NUMPAD_MULTIPLY 624
NUMPAD_ADD      625
NUMPAD_SUBTRACT 626
LEFT_WIN        627
RIGHT_WIN       628
LEFT_OPTION     629
RIGHT_OPTION    630
CAPS_LOCK       631
INSERT          632
DELETE          633
HOME            634
END             635
PAGE_UP         635
PAGE_DOWN       635
=============== =====

.. _inputdevice-mousecodetable:

MouseCodes
----------

These are typically mapped to left, right and middle buttons respectively.

.. WARNING::

    It should be stressed that the numerical values of the MouseCodes should not be used directly in game code and are
    subject to change. The values below should be used only for debugging purposes.

=============== =====
MouseCode Name  Value
=============== =====
BUTTON_0        0
BUTTON_1        1
BUTTON_2        2
=============== =====

.. _inputdevice-padcodetable:

PadCodes
--------

The PadCode names derive from the names of the Xbox 360 gamepad buttons.

.. WARNING::

    It should be stressed that the numerical values of the PadCodes should not be used directly in game code and are
    subject to change. The values below should be used only for debugging purposes.

=============== =====
PadCode Name    Value
=============== =====
UP              0
LEFT            1
DOWN            2
RIGHT           3
A               4
B               5
X               6
Y               7
LEFT_TRIGGER    8
RIGHT_TRIGGER   9
LEFT_SHOULDER   10
RIGHT_SHOULDER  11
LEFT_THUMB      12
LEFT_THUMB_X    13
LEFT_THUMB_Y    14
RIGHT_THUMB     15
RIGHT_THUMB_X   16
RIGHT_THUMB_Y   17
START           18
BACK            19
=============== =====
