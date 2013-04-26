/*{# Copyright (c) 2013 Turbulenz Limited #}*/

interface SimpleButton
{
    left: number;
    top: number;
    right: number;
    bottom: number;
    callback: { (): void; };
};

class SimpleButtonManager
{
    static private _buttons : SimpleButton[] = [];

    static init(inputDevice: InputDevice)
    {
        var onMouseUp = function onMouseUpFn(mouseButton, x, y)
        {
            var buttons = SimpleButtonManager._buttons;
            var numButtons = buttons.length;
            for (var i = 0 ; i < numButtons ; i = i + 1)
            {
                var button = buttons[i];

                if (x >= button.left && x <= button.right &&
                    y >= button.top && y <= button.bottom)
                {
                    button.callback();
                    break;
                }
            }
        };
        inputDevice.addEventListener('mouseup', onMouseUp);
    };

    static addButton(left: number, top: number, right: number, bottom: number,
                     callback: { (): void; })
    {
        SimpleButtonManager._buttons.push({
            left: left,
            top: top,
            right: right,
            bottom: bottom,
            callback: callback
        });
    };

    static clearButtons()
    {
        SimpleButtonManager._buttons = [];
    };
};
