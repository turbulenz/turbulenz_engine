// Copyright (c) 2012 Turbulenz Limited

class Touch
{
    force: number;
    identifier: number;
    isGameTouch: bool;
    positionX: number;
    positionY: number;
    radiusX: number;
    radiusY: number;
    rotationAngle: number;

    static create(params: any): Touch
    {
        var touch = new Touch();

        touch.force         = params.force;
        touch.identifier    = params.identifier;
        touch.isGameTouch   = params.isGameTouch;
        touch.positionX     = params.positionX;
        touch.positionY     = params.positionY;
        touch.radiusX       = params.radiusX;
        touch.radiusY       = params.radiusY;
        touch.rotationAngle = params.rotationAngle;

        return touch;
    }
}
