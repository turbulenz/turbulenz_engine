// Copyright (c) 2009-2011 Turbulenz Limited

/// <reference path="turbulenz.d.ts" />

//
// Camera
//
class Camera
{
    static version = 1;

    md                   : MathDevice;
    matrix               : any;   // m43
    viewMatrix           : any;   // m43
    projectionMatrix     : any;   // m44
    viewProjectionMatrix : any;   // m44
    frustumPlanes        : any[]; // v4[]

    // updateProjectionMatrix(): void;
    // updateFrustumPlanes(): void;

    viewOffsetX = 0.0;
    viewOffsetY = 0.0;

    recipViewWindowX = 1.0 / 1.0;
    recipViewWindowY = 1.0 / 1.0;

    infinite = false;
    parallel = false;

    aspectRatio = 4.0 / 3.0;

    nearPlane = 1.0;
    farPlane  = 1000.0;

    lookAt(lookAt, up, eyePosition)
    {
        var md = this.md;
        var v3Normalize = md.v3Normalize;
        var v3Cross = md.v3Cross;
        var zaxis = md.v3Sub(eyePosition, lookAt);

        v3Normalize.call(md, zaxis, zaxis);
        var xaxis = v3Cross.call(md, v3Normalize.call(md, up, up), zaxis);
        v3Normalize.call(md, xaxis, xaxis);
        var yaxis = v3Cross.call(md, zaxis, xaxis);
        this.matrix = md.m43Build(xaxis, yaxis, zaxis, eyePosition, this.matrix);
    };

    updateProjectionMatrix()
    {
        var rcpvwX = this.recipViewWindowX;
        var rcpvwY = this.recipViewWindowY * this.aspectRatio;
        var shearX = rcpvwX * this.viewOffsetX;
        var shearY = rcpvwY * this.viewOffsetY;
        var far    = this.farPlane;
        var near   = this.nearPlane;

        var rcpfn;
        if (far !== near)
        {
            rcpfn = (1.0 / (far - near));
        }
        else
        {
            rcpfn = 0.0;
        }

        var z0, z1, w0, w1;
        if (this.parallel)
        {
            z0 = -2.0 * rcpfn;
            w0 = (-(far + near) * rcpfn);
            z1 = 0.0;
            w1 = 1.0;
        }
        else
        {
            if (this.infinite)
            {
                z0 = -1.0;
            }
            else
            {
                z0 = (-(far + near) * rcpfn);
                //z0 = (far * rcpfn);
            }

            w0 = -(2.0 * far * near * rcpfn);
            //w0 = (-z0 * near);

            z1 = -1.0;
            w1 = 0.0;
        }

        this.projectionMatrix = this.md.m44Build(rcpvwX,  0.0,     0.0, 0.0,
                                                 0.0,     rcpvwY,  0.0, 0.0,
                                                 -shearX, -shearY,  z0,  z1,
                                                 0.0,     0.0,      w0,  w1,
                                                 this.projectionMatrix);
    };

    updateViewMatrix()
    {
        var md = this.md;
        this.viewMatrix = md.m43InverseOrthonormal(this.matrix, this.viewMatrix);
    };

    updateViewProjectionMatrix()
    {
        var md = this.md;
        this.viewProjectionMatrix = md.m43MulM44(this.viewMatrix, this.projectionMatrix, this.viewProjectionMatrix);
    };

    extractFrustumPlanes(m, p): any[]
    {
        var md = this.md;
        var m0  = m[0];
        var m1  = m[1];
        var m2  = m[2];
        var m3  = m[3];
        var m4  = m[4];
        var m5  = m[5];
        var m6  = m[6];
        var m7  = m[7];
        var m8  = m[8];
        var m9  = m[9];
        var m10 = m[10];
        var m11 = m[11];
        var m12 = m[12];
        var m13 = m[13];
        var m14 = m[14];
        var m15 = m[15];
        var planes = (p || []);

        // Negate 'd' here to avoid doing it on the isVisible functions
        var vec = md.v4Build((m3  + m0), (m7  + m4), (m11 + m8), -(m15 + m12));
        planes[0] = md.planeNormalize(vec, planes[0]); // left

        md.v4Build((m3  - m0), (m7  - m4), (m11 - m8), -(m15 - m12), vec);
        planes[1] = md.planeNormalize(vec, planes[1]); // right

        md.v4Build((m3  - m1), (m7  - m5), (m11 - m9),  -(m15 - m13), vec);
        planes[2] = md.planeNormalize(vec, planes[2]); // top

        md.v4Build((m3  + m1), (m7  + m5), (m11 + m9),  -(m15 + m13), vec);
        planes[3] = md.planeNormalize(vec, planes[3]); // bottom

        md.v4Build((m3  + m2), (m7  + m6), (m11 + m10), -(m15 + m14), vec);
        planes[4] = md.planeNormalize(vec, planes[4]);  // near

        md.v4Build((m3  - m2), (m7  - m6), (m11 - m10), -(m15 - m14), vec);
        planes[5] = md.planeNormalize(vec, planes[5]); // far

        return planes;
    };

    updateFrustumPlanes()
    {
        this.frustumPlanes = this.extractFrustumPlanes(this.viewProjectionMatrix, this.frustumPlanes);
    };

    isVisiblePoint(p)
    {
        var md = this.md;
        return md.isInsidePlanesPoint(p, this.frustumPlanes);
    };

    isVisibleSphere(c, r)
    {
        var md = this.md;
        return md.isInsidePlanesSphere(c, r, this.frustumPlanes);
    };

    isVisibleBox(c, h)
    {
        var md = this.md;
        return md.isInsidePlanesBox(c, h, this.frustumPlanes);
    };

    isVisibleAABB(extents)
    {
        var md = this.md;
        return md.aabbIsInsidePlanes(extents, this.frustumPlanes);
    };

    isFullyInsideAABB(extents)
    {
        var md = this.md;
        return md.aabbIsFullyInsidePlanes(extents, this.frustumPlanes);
    };

    getFrustumPoints(farPlane?) : any[]
    {
        var viewOffsetX = this.viewOffsetX;
        var viewOffsetY = this.viewOffsetY;

        var viewWindowX = 1.0 / this.recipViewWindowX;
        var viewWindowY = 1.0 / (this.recipViewWindowY * this.aspectRatio);

        var transform = this.matrix;

        var farClip  = farPlane || this.farPlane;
        var nearClip = this.nearPlane;

        var frustumPoints = [];

        if (!this.parallel)
        {
            var co0 = ((transform[0] * viewOffsetX) + (transform[3] * viewOffsetY));
            var co1 = ((transform[1] * viewOffsetX) + (transform[4] * viewOffsetY));
            var co2 = ((transform[2] * viewOffsetX) + (transform[5] * viewOffsetY));

            var right0 = (transform[0] * viewWindowX);
            var right1 = (transform[1] * viewWindowX);
            var right2 = (transform[2] * viewWindowX);
            var up0    = (transform[3] * viewWindowY);
            var up1    = (transform[4] * viewWindowY);
            var up2    = (transform[5] * viewWindowY);
            var at0    = (co0 - transform[6]);
            var at1    = (co1 - transform[7]);
            var at2    = (co2 - transform[8]);
            var pos0   = (transform[9]  + co0);
            var pos1   = (transform[10] + co1);
            var pos2   = (transform[11] + co2);

            var dirTR0 = (at0 + right0 + up0);
            var dirTR1 = (at1 + right1 + up1);
            var dirTR2 = (at2 + right2 + up2);
            var dirTL0 = (at0 - right0 + up0);
            var dirTL1 = (at1 - right1 + up1);
            var dirTL2 = (at2 - right2 + up2);
            var dirBL0 = (at0 - right0 - up0);
            var dirBL1 = (at1 - right1 - up1);
            var dirBL2 = (at2 - right2 - up2);
            var dirBR0 = (at0 + right0 - up0);
            var dirBR1 = (at1 + right1 - up1);
            var dirBR2 = (at2 + right2 - up2);

            frustumPoints[0] = [(pos0 + (dirTR0 * nearClip)), (pos1 + (dirTR1 * nearClip)), (pos2 + (dirTR2 * nearClip))];
            frustumPoints[4] = [(pos0 + (dirTR0 * farClip)),  (pos1 + (dirTR1 * farClip)),  (pos2 + (dirTR2 * farClip))];
            frustumPoints[1] = [(pos0 + (dirTL0 * nearClip)), (pos1 + (dirTL1 * nearClip)), (pos2 + (dirTL2 * nearClip))];
            frustumPoints[5] = [(pos0 + (dirTL0 * farClip)),  (pos1 + (dirTL1 * farClip)),  (pos2 + (dirTL2 * farClip))];
            frustumPoints[2] = [(pos0 + (dirBL0 * nearClip)), (pos1 + (dirBL1 * nearClip)), (pos2 + (dirBL2 * nearClip))];
            frustumPoints[6] = [(pos0 + (dirBL0 * farClip)),  (pos1 + (dirBL1 * farClip)),  (pos2 + (dirBL2 * farClip))];
            frustumPoints[3] = [(pos0 + (dirBR0 * nearClip)), (pos1 + (dirBR1 * nearClip)), (pos2 + (dirBR2 * nearClip))];
            frustumPoints[7] = [(pos0 + (dirBR0 * farClip)),  (pos1 + (dirBR1 * farClip)),  (pos2 + (dirBR2 * farClip))];
        }
        else
        {
            frustumPoints[0] = [];
            frustumPoints[4] = [];
            frustumPoints[1] = [];
            frustumPoints[5] = [];
            frustumPoints[2] = [];
            frustumPoints[6] = [];
            frustumPoints[3] = [];
            frustumPoints[7] = [];

            frustumPoints[0][2] = nearClip;
            frustumPoints[1][2] = nearClip;
            frustumPoints[2][2] = nearClip;
            frustumPoints[3][2] = nearClip;

            frustumPoints[4][2] = farClip;
            frustumPoints[5][2] = farClip;
            frustumPoints[6][2] = farClip;
            frustumPoints[7][2] = farClip;

            var offset = (1.0 - nearClip) * viewOffsetX;
            frustumPoints[0][0] = (viewWindowX + offset);
            frustumPoints[1][0] = (offset - viewWindowX);
            frustumPoints[2][0] = (offset - viewWindowX);
            frustumPoints[3][0] = (viewWindowX + offset);

            offset = (1.0 - farClip) * viewOffsetX;
            frustumPoints[4][0] = (viewWindowX + offset);
            frustumPoints[5][0] = (offset - viewWindowX);
            frustumPoints[6][0] = (offset - viewWindowX);
            frustumPoints[7][0] = (viewWindowX + offset);

            offset = (1.0 - nearClip) * viewOffsetY;
            frustumPoints[0][1] = (viewWindowY + offset);
            frustumPoints[1][1] = (viewWindowY + offset);
            frustumPoints[2][1] = (offset - viewWindowY);
            frustumPoints[3][1] = (offset - viewWindowY);

            offset = (1.0 - farClip) * viewOffsetY;
            frustumPoints[4][1] = (viewWindowY + offset);
            frustumPoints[5][1] = (viewWindowY + offset);
            frustumPoints[6][1] = (offset - viewWindowY);
            frustumPoints[7][1] = (offset - viewWindowY);

            var md = this.md;
            frustumPoints[0] = md.m43TransformPoint(transform, frustumPoints[0]);
            frustumPoints[1] = md.m43TransformPoint(transform, frustumPoints[1]);
            frustumPoints[2] = md.m43TransformPoint(transform, frustumPoints[2]);
            frustumPoints[3] = md.m43TransformPoint(transform, frustumPoints[3]);
            frustumPoints[4] = md.m43TransformPoint(transform, frustumPoints[4]);
            frustumPoints[5] = md.m43TransformPoint(transform, frustumPoints[5]);
            frustumPoints[6] = md.m43TransformPoint(transform, frustumPoints[6]);
            frustumPoints[7] = md.m43TransformPoint(transform, frustumPoints[7]);
        }

        return frustumPoints;
    };

    getFrustumFarPoints()
    {
        var viewOffsetX = this.viewOffsetX;
        var viewOffsetY = this.viewOffsetY;
        var viewWindowX = 1.0 / this.recipViewWindowX;
        var viewWindowY = 1.0 / (this.recipViewWindowY * this.aspectRatio);
        var transform   = this.matrix;
        var farClip     = this.farPlane;

        var frustumPoints;

        if (!this.parallel)
        {
            var t0  = transform[0];
            var t1  = transform[1];
            var t2  = transform[2];
            var t3  = transform[3];
            var t4  = transform[4];
            var t5  = transform[5];
            var t6  = transform[6];
            var t7  = transform[7];
            var t8  = transform[8];
            var t9  = transform[9];
            var t10 = transform[10];
            var t11 = transform[11];

            var co0 = ((t0 * viewOffsetX) + (t3 * viewOffsetY));
            var co1 = ((t1 * viewOffsetX) + (t4 * viewOffsetY));
            var co2 = ((t2 * viewOffsetX) + (t5 * viewOffsetY));

            var right0 = (t0  * viewWindowX);
            var right1 = (t1  * viewWindowX);
            var right2 = (t2  * viewWindowX);
            var up0    = (t3  * viewWindowY);
            var up1    = (t4  * viewWindowY);
            var up2    = (t5  * viewWindowY);
            var at0    = (co0 - t6);
            var at1    = (co1 - t7);
            var at2    = (co2 - t8);
            var pos0   = (t9  + co0);
            var pos1   = (t10 + co1);
            var pos2   = (t11 + co2);

            var dirTR0 = ((at0 + right0 + up0) * farClip);
            var dirTR1 = ((at1 + right1 + up1) * farClip);
            var dirTR2 = ((at2 + right2 + up2) * farClip);
            var dirTL0 = ((at0 - right0 + up0) * farClip);
            var dirTL1 = ((at1 - right1 + up1) * farClip);
            var dirTL2 = ((at2 - right2 + up2) * farClip);
            var dirBL0 = ((at0 - right0 - up0) * farClip);
            var dirBL1 = ((at1 - right1 - up1) * farClip);
            var dirBL2 = ((at2 - right2 - up2) * farClip);
            var dirBR0 = ((at0 + right0 - up0) * farClip);
            var dirBR1 = ((at1 + right1 - up1) * farClip);
            var dirBR2 = ((at2 + right2 - up2) * farClip);

            frustumPoints = [ [(pos0 + dirTR0), (pos1 + dirTR1), (pos2 + dirTR2)],
                              [(pos0 + dirTL0), (pos1 + dirTL1), (pos2 + dirTL2)],
                              [(pos0 + dirBL0), (pos1 + dirBL1), (pos2 + dirBL2)],
                              [(pos0 + dirBR0), (pos1 + dirBR1), (pos2 + dirBR2)] ];
        }
        else
        {
            var offsetX = (1.0 - farClip) * viewOffsetX;
            var offsetY = (1.0 - farClip) * viewOffsetY;
            var md = this.md;
            frustumPoints = [ md.m43TransformPoint(transform, [(viewWindowX + offsetX), (viewWindowY + offsetY), farClip]),
                              md.m43TransformPoint(transform, [(offsetX - viewWindowX), (viewWindowY + offsetY), farClip]),
                              md.m43TransformPoint(transform, [(offsetX - viewWindowX), (offsetY - viewWindowY), farClip]),
                              md.m43TransformPoint(transform, [(viewWindowX + offsetX), (offsetY - viewWindowY), farClip]) ];
        }

        return frustumPoints;
    };

    getFrustumExtents(extents, farClip)
    {
        var frustumPoints = this.getFrustumPoints(farClip);
        var frustumPoint = frustumPoints[0];
        var min0 = frustumPoint[0];
        var min1 = frustumPoint[1];
        var min2 = frustumPoint[2];
        var max0 = min0;
        var max1 = min1;
        var max2 = min2;
        for (var i = 1; i < 8; i += 1)
        {
            frustumPoint = frustumPoints[i];
            var p0 = frustumPoint[0];
            var p1 = frustumPoint[1];
            var p2 = frustumPoint[2];
            if (min0 > p0)
            {
                min0 = p0;
            }
            else if (max0 < p0)
            {
                max0 = p0;
            }
            if (min1 > p1)
            {
                min1 = p1;
            }
            else if (max1 < p1)
            {
                max1 = p1;
            }
            if (min2 > p2)
            {
                min2 = p2;
            }
            else if (max2 < p2)
            {
                max2 = p2;
            }
        }
        extents[0] = min0;
        extents[1] = min1;
        extents[2] = min2;
        extents[3] = max0;
        extents[4] = max1;
        extents[5] = max2;
    };

    // Constructor function
    static create(md: MathDevice): Camera
    {
        var c = new Camera();
        c.md = md;
        c.matrix = md.m43BuildIdentity();
        c.viewMatrix = md.m43BuildIdentity();
        c.updateProjectionMatrix();
        c.viewProjectionMatrix = c.projectionMatrix.slice();
        c.frustumPlanes = [];
        c.updateFrustumPlanes();
        return c;
    };
};

//
// CameraController
//

interface CameraControllerTouch
{
    id: number;
    originX: number;
    originY: number;
};

class CameraController
{
    static version = 1;

    rotateSpeed       = 2.0;
    maxSpeed          = 1;
    mouseRotateFactor = 0.1;

    md               : MathDevice;
    camera           : Camera;
    turn             : number;
    pitch            : number;
    right            : number;
    left             : number;
    up               : number;
    down             : number;
    forward          : number;
    backward         : number;
    step             : number;
    padright         : number;
    padleft          : number;
    padforward       : number;
    padbackward      : number;
    looktouch        : CameraControllerTouch;
    movetouch        : CameraControllerTouch;

    // Internal

    onkeydown        : InputDeviceEventListener;
    onkeyup          : { (keyCode: number): void; };
    onmouseup        : { (button: number, x: number, y: number): void; };
    onmousewheel     : { (delta: number): void; };
    onmousemove      : { (deltaX: number, deltaY: number): void; };
    onpadmove        : { (lX: number, lY: number, lZ: number,
                          rX: number, rY: number, rZ: number,
                          dpadState : number): void; };
    onmouselocklost  : { (): void; };
    ontouchstart     : { (touchEvent: TouchEvent): void; };
    ontouchend       : { (touchEvent: TouchEvent): void; };
    ontouchmove      : { (touchEvent: TouchEvent): void; };

    attach           : (id: InputDevice) => void;

    rotate(turn, pitch)
    {
        var degreestoradians = (Math.PI / 180.0);
        var md = this.md;
        var matrix = this.camera.matrix;
        var pos = md.m43Pos(matrix);
        md.m43SetPos(matrix, md.v3BuildZero());

        var rotate;
        if (pitch !== 0.0)
        {
            pitch *= this.rotateSpeed * degreestoradians;
            pitch *= this.mouseRotateFactor;

            var right = md.v3Normalize(md.m43Right(matrix));
            md.m43SetRight(matrix, right);

            rotate = md.m43FromAxisRotation(right, pitch);

            matrix = md.m43Mul(matrix, rotate);
        }

        if (turn !== 0.0)
        {
            turn *= this.rotateSpeed * degreestoradians;
            turn *= this.mouseRotateFactor;

            rotate = md.m43FromAxisRotation(md.v3BuildYAxis(), turn);

            matrix = md.m43Mul(matrix, rotate);
        }

        md.m43SetPos(matrix, pos);

        this.camera.matrix = matrix;
    };

    translate(right, up, forward)
    {
        var md = this.md;
        var matrix = this.camera.matrix;
        var pos = md.m43Pos(matrix);
        var speed = this.maxSpeed;
        pos = md.v3Add4(pos,
                        md.v3ScalarMul(md.m43Right(matrix), (speed * right)),
                        md.v3ScalarMul(md.m43Up(matrix),    (speed * up)),
                        md.v3ScalarMul(md.m43At(matrix),   -(speed * forward)));
        md.m43SetPos(matrix, pos);
    };

    update()
    {
        var updateMatrix = false;

        if (this.turn !== 0.0 ||
            this.pitch !== 0.0)
        {
            updateMatrix = true;

            this.rotate(this.turn, this.pitch);

            this.turn = 0.0;
            this.pitch = 0.0;
        }

        if (this.step > 0)
        {
            this.forward += this.step;
        }
        else if (this.step < 0)
        {
            this.backward -= this.step;
        }

        var right = ((this.right + this.padright) - (this.left + this.padleft));
        var up = this.up - this.down;
        var forward = ((this.forward + this.padforward) - (this.backward + this.padbackward));
        if (right !== 0.0 ||
            up !== 0.0 ||
            forward !== 0.0)
        {
            updateMatrix = true;

            this.translate(right, up, forward);

            if (this.step > 0)
            {
                this.forward -= this.step;
                this.step = 0.0;
            }
            else if (this.step < 0)
            {
                this.backward += this.step;
                this.step = 0.0;
            }
        }

        if (updateMatrix)
        {
            this.camera.updateViewMatrix();
        }
    };

    static create(gd: GraphicsDevice, id: InputDevice, camera: Camera,
                  log?: HTMLElement) : CameraController
    {
        var c = new CameraController();

        c.md = camera.md;
        c.camera = camera;
        c.turn = 0.0;
        c.pitch = 0.0;
        c.right = 0.0;
        c.left = 0.0;
        c.up = 0.0;
        c.down = 0.0;
        c.forward = 0.0;
        c.backward = 0.0;
        c.step = 0.0;
        c.padright = 0.0;
        c.padleft = 0.0;
        c.padforward = 0.0;
        c.padbackward = 0.0;
        c.looktouch = {
            id: -1,
            originX: 0,
            originY: 0
        };
        c.movetouch = {
            id: -1,
            originX: 0,
            originY: 0
        };

        var keyCodes;

        if (id)
        {
            keyCodes = id.keyCodes;
        }

        // keyboard handling
        var onkeydownFn = function(keynum)
        {
            switch (keynum)
            {
            case keyCodes.A:
            case keyCodes.LEFT:
            case keyCodes.NUMPAD_4:
                c.left = 1.0;
                break;

            case keyCodes.D:
            case keyCodes.RIGHT:
            case keyCodes.NUMPAD_6:
                c.right = 1.0;
                break;

            case keyCodes.W:
            case keyCodes.UP:
            case keyCodes.NUMPAD_8:
                c.forward = 1.0;
                break;

            case keyCodes.S:
            case keyCodes.DOWN:
            case keyCodes.NUMPAD_2:
                c.backward = 1.0;
                break;

            case keyCodes.E:
            case keyCodes.NUMPAD_9:
                c.up = 1.0;
                break;

            case keyCodes.Q:
            case keyCodes.NUMPAD_7:
                c.down = 1.0;
                break;
            }
        };

        var onkeyupFn = function(keynum)
        {
            switch (keynum)
            {
            case keyCodes.A:
            case keyCodes.LEFT:
            case keyCodes.NUMPAD_4:
                c.left = 0.0;
                break;

            case keyCodes.D:
            case keyCodes.RIGHT:
            case keyCodes.NUMPAD_6:
                c.right = 0.0;
                break;

            case keyCodes.W:
            case keyCodes.UP:
            case keyCodes.NUMPAD_8:
                c.forward = 0.0;
                break;

            case keyCodes.S:
            case keyCodes.DOWN:
            case keyCodes.NUMPAD_2:
                c.backward = 0.0;
                break;

            case keyCodes.E:
            case keyCodes.NUMPAD_9:
                c.up = 0.0;
                break;

            case keyCodes.Q:
            case keyCodes.NUMPAD_7:
                c.down = 0.0;
                break;

            case keyCodes.RETURN:
                gd.fullscreen = !gd.fullscreen;
                break;
            }
        }

        if (log)
        {
            c.onkeydown = function onkeydownLogFn(keynum)
            {
                log.innerHTML += " KeyDown:&nbsp;" + keynum;
                onkeydownFn(keynum);
            };

            c.onkeyup = function onkeyupLogFn(keynum)
            {
                if (keynum === keyCodes.BACKSPACE)
                {
                    log.innerHTML = "";
                }
                else
                {
                    log.innerHTML += " KeyUp:&nbsp;" + keynum;
                }
                onkeyupFn(keynum);
            };
        }
        else
        {
            c.onkeydown = onkeydownFn;
            c.onkeyup = onkeyupFn;
        }

        // Mouse handling
        c.onmouseup = function onmouseupFn(/* button, x, y */)
        {
            if (!id.isLocked())
            {
                id.lockMouse();
            }
        };

        c.onmousewheel = function onmousewheelFn(delta)
        {
            c.step = delta * 5;
        };

        c.onmousemove = function onmousemoveFn(deltaX, deltaY)
        {
            c.turn  += deltaX;
            c.pitch += deltaY;
        };

        // Pad handling
        c.onpadmove = function onpadmoveFn(lX, lY, lZ, rX, rY /*, rZ, dpadState */)
        {
            c.turn  += lX * 10.0;
            c.pitch += lY * 10.0;

            if (rX >= 0)
            {
                c.padright = rX;
                c.padleft  = 0;
            }
            else
            {
                c.padright = 0;
                c.padleft  = -rX;
            }

            if (rY >= 0)
            {
                c.padforward  = rY;
                c.padbackward = 0.0;
            }
            else
            {
                c.padforward  = 0.0;
                c.padbackward = -rY;
            }
        };

        c.onmouselocklost = function onmouselocklostFn()
        {
            id.unlockMouse();
        };

        c.ontouchstart = function ontouchstartFn(touchEvent)
        {
            var changedTouches = touchEvent.changedTouches;
            var numTouches = changedTouches.length;
            var t;
            var halfScreenWidth = gd.width * 0.5;
            for (t = 0; t < numTouches; t += 1)
            {
                var touchId = changedTouches[t].identifier;
                var touchX = changedTouches[t].positionX;
                var touchY = changedTouches[t].positionY;
                if (touchX < halfScreenWidth &&
                    c.looktouch.id === -1)
                {
                    c.looktouch.id = touchId;
                    c.looktouch.originX = touchX;
                    c.looktouch.originY = touchY;
                }
                else if (touchX >= halfScreenWidth &&
                         c.movetouch.id === -1)
                {
                    c.movetouch.id = touchId;
                    c.movetouch.originX = touchX;
                    c.movetouch.originY = touchY;
                }
            }
        };

        c.ontouchend = function ontouchendFn(touchEvent)
        {
            var changedTouches = touchEvent.changedTouches;
            var numTouches = changedTouches.length;
            var t;
            for (t = 0; t < numTouches; t += 1)
            {
                var touchId = changedTouches[t].identifier;
                if (c.looktouch.id === touchId)
                {
                    c.looktouch.id = -1;
                    c.looktouch.originX = 0;
                    c.looktouch.originY = 0;
                    c.turn = 0;
                    c.pitch = 0;
                }
                else if (c.movetouch.id === touchId)
                {
                    c.movetouch.id = -1;
                    c.movetouch.originX = 0;
                    c.movetouch.originY = 0;
                    c.left = 0.0;
                    c.right = 0.0;
                    c.forward = 0.0;
                    c.backward = 0.0;
                }
            }
        };

        c.ontouchmove = function ontouchmoveFn(touchEvent)
        {
            var changedTouches = touchEvent.changedTouches;
            var numTouches = changedTouches.length;
            var deadzone = 16.0;
            var t;
            for (t = 0; t < numTouches; t += 1)
            {
                var touchId = changedTouches[t].identifier;
                var touchX = changedTouches[t].positionX;
                var touchY = changedTouches[t].positionY;
                if (c.looktouch.id === touchId)
                {
                    if (touchX - c.looktouch.originX > deadzone ||
                        touchX - c.looktouch.originX < -deadzone)
                    {
                        c.turn = (touchX - c.looktouch.originX) / deadzone;
                    }
                    else
                    {
                        c.turn = 0.0;
                    }
                    if (touchY - c.looktouch.originY > deadzone ||
                        touchY - c.looktouch.originY < -deadzone)
                    {
                        c.pitch = (touchY - c.looktouch.originY) / 16.0;
                    }
                    else
                    {
                        c.pitch = 0.0;
                    }
                }
                else if (c.movetouch.id === touchId)
                {
                    if (touchX - c.movetouch.originX > deadzone)
                    {
                        c.left = 0.0;
                        c.right = 1.0;
                    }
                    else if (touchX - c.movetouch.originX < -deadzone)
                    {
                        c.left = 1.0;
                        c.right = 0.0;
                    }
                    else
                    {
                        c.left = 0.0;
                        c.right = 0.0;
                    }
                    if (touchY - c.movetouch.originY > deadzone)
                    {
                        c.forward = 0.0;
                        c.backward = 1.0;
                    }
                    else if (touchY - c.movetouch.originY < -deadzone)
                    {
                        c.forward = 1.0;
                        c.backward = 0.0;
                    }
                    else
                    {
                        c.forward = 0.0;
                        c.backward = 0.0;
                    }
                }
            }
        };

        // Attach to an InputDevice
        c.attach = function attachFn(id)
        {
            id.addEventListener('keydown', c.onkeydown);
            id.addEventListener('keyup', c.onkeyup);
            id.addEventListener('mouseup', c.onmouseup);
            id.addEventListener('mousewheel', c.onmousewheel);
            id.addEventListener('mousemove', c.onmousemove);
            id.addEventListener('padmove', c.onpadmove);
            id.addEventListener('mouselocklost', c.onmouselocklost);
            id.addEventListener('touchstart', c.ontouchstart);
            id.addEventListener('touchend', c.ontouchend);
            id.addEventListener('touchmove', c.ontouchmove);
        };

        if (id)
        {
            c.attach(id);
        }

        return c;
    };
};