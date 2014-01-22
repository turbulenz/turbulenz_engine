// Copyright (c) 2010-2011 Turbulenz Limited

/*global VMath: false */

//
// DynamicCameraController
//
class DynamicCameraController
{
    version = 1;

    transformTypes = {
        linear  : 0
    };

    cameraType = {
        fixed   : 0,    // Cannot move, can set target
        rail    : 1,    // Can move, can follow target, fixed transition time
        chase   : 2     // Can follow at a flexible distance, flexible transition time
    };

    gd            : GraphicsDevice;
    md            : MathDevice;
    camera        : Camera;
    curMode       : number;
    camTargetPos  : any; // m43
    transformMode : number;
    rate          : number;
    chaseRate     : number;
    currentTime   : number;
    startTime     : number;
    endTime       : number;
    camCurUp      : any; // v3
    trackCurPos   : any; // v3
    isTracking    : boolean;

    setRate(rate)
    {
        this.rate = rate;
    }

    setChaseRate(rate)
    {
        this.chaseRate = rate;
    }

    setTracking(isTracking)
    {
        this.isTracking = isTracking;
    }

    // TODO: are these args really optional?
    setCameraTargetPos(pos, time?, delta?)
    {
        // Ignore previous camera move if a new position is set
        var md = this.md;
        var p0 = pos[0];
        var p1 = pos[1];
        var p2 = pos[2];

        this.camTargetPos = md.v3Build(p0, p1, p2);

        this.currentTime = time;
        this.startTime = time;
        this.endTime = this.currentTime + delta;
    }

    setTrackTarget(pos)
    {
        var md = this.md;
        var p0 = pos[0];
        var p1 = pos[1];
        var p2 = pos[2];

        this.trackCurPos = md.v3Build(p0, p1, p2);
    }

    setCameraMode(mode)
    {
        var fixedMode = this.cameraType.fixed;
        var railMode = this.cameraType.rail;
        var chaseMode = this.cameraType.chase;
        var camCurPos = this.md.m43Pos(this.camera.matrix);

        switch (mode)
        {
        case fixedMode:
            this.setCameraTargetPos(camCurPos);
            this.curMode = mode;
            return true;
        case railMode:
            this.curMode = mode;
            return true;
        case chaseMode:
            this.curMode = mode;
            return true;
        default:
            // Not a recognised mode
            return false;
        }
    }

    snapCameraToTarget()
    {
        var md = this.md;
        md.m43SetPos(this.camera.matrix, this.camTargetPos);
    }

    isCameraAtTarget(): boolean
    {
        var md = this.md;
        return md.v3Equal(md.m43Pos(this.camera.matrix), this.camTargetPos);
    }

    getLookAtMatrix()
    {
        var md = this.md;
        var up = this.camCurUp;
        var currentPos = md.m43Pos(this.camera.matrix);

        var v3Normalize = md.v3Normalize;
        var v3Cross = md.v3Cross;
        var zaxis = md.v3Sub(currentPos, this.trackCurPos);
        v3Normalize.call(md, zaxis, zaxis);
        var xaxis = v3Cross.call(md, v3Normalize.call(md, up, up), zaxis);
        v3Normalize.call(md, xaxis, xaxis);
        var yaxis = v3Cross.call(md, zaxis, xaxis);

        return md.m43Build(xaxis, yaxis, zaxis, currentPos);
    }

    transform(delta)
    {
        // Delta already takes into account rate
        var md = this.md;
        var m43Pos = md.m43Pos;
        var v3Normalize = md.v3Normalize;
        var v3ScalarMul = md.v3ScalarMul;
        var v3Add = md.v3Add;
        var v3Lerp = md.v3Lerp;

        var camTargetPos = this.camTargetPos;
        var camCurPos = m43Pos.call(md, this.camera.matrix);
        var posResult = this.camTargetPos;

        if (this.curMode === this.cameraType.rail &&
            this.transformMode === this.transformTypes.linear)
        {
            posResult = v3Lerp.call(md, camCurPos, camTargetPos, delta);
        }

        if (this.curMode === this.cameraType.chase &&
            this.transformMode === this.transformTypes.linear)
        {
            var camTar2ChaseTar = md.v3Sub(this.trackCurPos, this.camTargetPos, camTar2ChaseTar);
            var chaseTar2CamCur = md.v3Sub(camCurPos, this.trackCurPos, chaseTar2CamCur);
            var dist = md.v3Length(camTar2ChaseTar);

            v3Normalize.call(md, chaseTar2CamCur, chaseTar2CamCur);

            chaseTar2CamCur = v3ScalarMul.call(md, chaseTar2CamCur, dist);
            var target = v3Add.call(md, this.trackCurPos, chaseTar2CamCur);
            target = v3Lerp.call(md, target, this.camTargetPos, this.chaseRate * delta);

            posResult = v3Lerp.call(md, camCurPos, target, delta);
        }

        md.m43SetPos(this.camera.matrix, posResult);
    }

    rotate()
    {
        this.camera.matrix = this.getLookAtMatrix();
    }

    update(delta)
    {
        var updateMatrix = false;
        var fixedMode = this.cameraType.fixed;
        var railMode = this.cameraType.rail;
        var chaseMode = this.cameraType.chase;
        var transformDelta = 0.0;

        this.currentTime += delta * this.rate;

        // If delta is small enough we keep the current transform
        if (delta > VMath.precision)
        {
            if (!this.isCameraAtTarget())
            {
                updateMatrix = true;
                switch (this.curMode)
                {
                case fixedMode:
                    this.snapCameraToTarget();
                    break;
                case railMode:
                    if (this.currentTime < this.endTime)
                    {
                        transformDelta = (this.currentTime - this.startTime) / (this.endTime - this.startTime);
                        this.transform(transformDelta);
                    }
                    else
                    {
                        // Set the matrix to the final transform
                        this.snapCameraToTarget();
                    }
                    break;
                case chaseMode:
                    if (this.currentTime < this.endTime)
                    {
                        transformDelta = (this.currentTime - this.startTime) / (this.endTime - this.startTime);
                        this.transform(transformDelta);
                    }
                    else
                    {
                        // Set the matrix to the final transform
                        this.snapCameraToTarget();
                    }
                    break;
                }
            }

            if (this.isTracking)
            {
                updateMatrix = true;
                this.rotate();
            }
        }

        if (updateMatrix)
        {
            this.camera.updateViewMatrix();
        }
    }

    // Constructor function
    static create(camera: Camera, gd: GraphicsDevice): DynamicCameraController
    {
        var c = new DynamicCameraController();

        c.gd = gd;
        c.md = camera.md;
        c.camera = camera;
        c.curMode = c.cameraType.fixed;
        c.camTargetPos = c.md.m43Pos(camera.matrix);
        c.transformMode = c.transformTypes.linear;
        c.rate = 1;
        c.chaseRate = 1;
        c.currentTime = 0.0;
        c.startTime = 0.0;
        c.endTime = 0.0;
        // Up is Y axis up by default
        c.camCurUp = c.md.v3Build(0, 1, 0);
        // Look at center
        c.trackCurPos = c.md.v3BuildZero();
        c.isTracking = false;

        return c;
    }
}
