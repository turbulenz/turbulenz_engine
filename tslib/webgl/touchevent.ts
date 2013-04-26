// Copyright (c) 2012 Turbulenz Limited

/// <reference path="../turbulenz.d.ts" />

/// <reference path="touch.ts" />

class WebGLTouchEvent implements TouchEvent
{
    gameTouches    : any[];
    touches        : any[];
    changedTouches : any;

    static create(params): TouchEvent
    {
        var touchEvent = new WebGLTouchEvent();

        touchEvent.changedTouches   = params.changedTouches;
        touchEvent.gameTouches      = params.gameTouches;
        touchEvent.touches          = params.touches;

        return touchEvent;
    };
};
