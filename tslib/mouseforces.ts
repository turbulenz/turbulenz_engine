// Copyright (c) 2009-2012 Turbulenz Limited

/// <reference path="turbulenz.d.ts" />
/// <reference path="camera.ts" />

//
// MouseForces
//
class MouseForces
{
    static version = 1;

    md: MathDevice;
    pd: PhysicsDevice;
    pickFilter: number;
    pickRayFrom: number[];
    pickRayTo: number[];
    clamp: number;
    pickConstraint: PhysicsPoint2PointConstraint;
    pickedBody: PhysicsRigidBody;
    oldPickingDist: number;
    dragExtentsMin: any; // v3?
    dragExtentsMax: any; // v3?

    mouseX: number;
    mouseY: number;
    mouseZ: number;
    X: number;
    Y: number;
    Z: number;

    grabBody: bool;

    onmousewheel: { (delta: number): bool; };
    onmousemove: { (deltaX: number, deltaY: number): bool; };
    onmousedown: { (/* button, x, y */): bool; };
    onmouseup: { (/* button, x, y */): bool; };

    generatePickRay(cameraTransform,
                    viewWindowX, viewWindowY,
                    aspectRatio,
                    farPlane)
    {
        var md = this.md;
        var cam_right = md.m43Right(cameraTransform);
        var cam_up    = md.m43Up(cameraTransform);
        var cam_at    = md.v3Build(-cameraTransform[6], -cameraTransform[7], -cameraTransform[8]);
        var cam_pos   = md.m43Pos(cameraTransform);

        this.X = this.mouseX;
        this.Y = this.mouseY;

        var x = (2.0 * this.X - 1.0) * viewWindowX;
        var y = (2.0 * this.Y - 1.0) * viewWindowY / aspectRatio;

        this.pickRayFrom = cam_pos;

        var direction = md.v3Normalize(md.v3Sub(md.v3Add(cam_at, md.v3ScalarMul(cam_right, x)), md.v3ScalarMul(cam_up, y)));
        this.pickRayTo = md.v3Add(cam_pos, md.v3ScalarMul(direction, farPlane));
    };

    update(dynamicsWorld: PhysicsWorld, camera: Camera, force)
    {
        var md = this.md;
        if (this.grabBody)
        {
            this.generatePickRay(camera.matrix,
                                 1.0 / camera.recipViewWindowX,
                                 1.0 / camera.recipViewWindowY,
                                 camera.aspectRatio,
                                 camera.farPlane);

            if (this.pickedBody)
            {
                //keep it at the same picking distance
                var dir = md.v3Normalize(md.v3Sub(this.pickRayTo, this.pickRayFrom));
                var newPos = md.v3Add(this.pickRayFrom, md.v3ScalarMul(dir, this.oldPickingDist));
                if (this.dragExtentsMin)
                {
                    // If the user has supplied a bound for the dragging apply it
                    newPos = md.v3Max(newPos, this.dragExtentsMin);
                    newPos = md.v3Min(newPos, this.dragExtentsMax);
                }
                this.pickConstraint.pivotB = newPos;
                this.pickedBody.active = true;
            }
            else
            {
                //add a point to point constraint for picking
                var rayHit = dynamicsWorld.rayTest({
                        from : this.pickRayFrom,
                        to   : this.pickRayTo,
                        mask : this.pickFilter
                    });
                if (rayHit)
                {
                    var body = rayHit.body;
                    var pickPos = rayHit.hitPoint;

                    body.active = true;

                    this.pickedBody = body;

                    var localPivot = md.m43TransformPoint(md.m43InverseOrthonormal(body.transform), pickPos);

                    this.pickConstraint = this.pd.createPoint2PointConstraint({
                            bodyA   : body,
                            pivotA  : localPivot,
                            force   : force,
                            damping : 0.5,
                            impulseClamp : this.clamp
                        });

                    dynamicsWorld.addConstraint(this.pickConstraint);

                    this.oldPickingDist = md.v3Length(md.v3Sub(pickPos, this.pickRayFrom));
                }
            }
        }
        else
        {
            if (this.pickedBody)
            {
                dynamicsWorld.removeConstraint(this.pickConstraint);
                this.pickConstraint = null;

                this.pickedBody = null;
            }
        }
    };

    // Constructor function
    static create(gd: GraphicsDevice, id: InputDevice,
                  md: MathDevice, pd: PhysicsDevice,
                  dragExtentsMin?, dragExtentsMax?): MouseForces
    {
        var c = new MouseForces();

        c.md = md;
        c.pd = pd;

        c.pickFilter = pd.FILTER_DYNAMIC;

        c.pickRayFrom = [0, 0, 0];
        c.pickRayTo = [0, 0, 0];

        c.clamp = 0;

        c.pickConstraint = null;
        c.pickedBody = null;

        c.oldPickingDist = 0;

        if (dragExtentsMin && dragExtentsMax)
        {
            c.dragExtentsMin = dragExtentsMin;
            c.dragExtentsMax = dragExtentsMax;
        }

        c.mouseX = 0.5;
        c.mouseY = 0.5;
        c.mouseZ = 0.0;
        c.X = 0.5;
        c.Y = 0.5;
        c.Z = 0.0;

        c.grabBody = false;

        // Mouse handling
        c.onmousewheel = function onmousewheelFn(delta)
        {
            c.mouseZ += delta;

            return false;
        };

        c.onmousemove = function onmousemoveFn(deltaX, deltaY)
        {
            c.mouseX += (deltaX / gd.width);
            c.mouseY += (deltaY / gd.height);

            return false;
        };

        c.onmousedown = function onmousedownFn()
        {
            c.mouseX = 0.5;
            c.mouseY = 0.5;
            c.mouseZ = 0.0;
            c.grabBody = true;
            return false;
        };

        c.onmouseup = function onmouseupFn()
        {
            c.mouseX = 0.5;
            c.mouseY = 0.5;
            c.mouseZ = 0.0;

            c.grabBody = false;
            return false;
        };

        id.addEventListener("mousewheel", c.onmousewheel);
        id.addEventListener("mousemove", c.onmousemove);
        id.addEventListener("mousedown", c.onmousedown);
        id.addEventListener("mouseup", c.onmouseup);

        return c;
    };
};
