// Copyright (c) 2009-2012 Turbulenz Limited
/*global TurbulenzEngine:false*/
/*global Profile:false*/

/// <reference path="turbulenz.d.ts" />
/// <reference path="utilities.ts" />

//
// CharacterController
//
class CharacterController
{
    static version = 1;

    md                           : MathDevice;

    matrix                       : any; // m43?
    turn                         : number;
    pitch                        : number;
    right                        : number;
    left                         : number;
    up                           : number;
    forward                      : number;
    backward                     : number;
    padright                     : number;
    padleft                      : number;
    padforward                   : number;
    padbackward                  : number;
    step                         : number;
    extents                      : any; //AABB;

    radius                       : number;
    halfHeight                   : number;
    crouchHalfHeight             : number;
    rotateSpeed                  : number;
    mouseRotateFactor            : number;
    collisionMargin              : number;
    maxSpeed                     : number;
    speedModifier                : number;
    maxStepHeight                : number;
    maxJumpHeight                : number;

    jump                         : bool;
    jumped                       : bool;
    crouch                       : bool;
    onGround                     : bool;
    dead                         : bool;
    god                          : bool;

    walkDirection                : any; // v3

    physicsHeightOffset          : number;
    physicsStandingHeightOffset  : number;
    physicsCrouchingHeightOffset : any; // v3
    deadHeightOffset             : any; // v3
    character                    : PhysicsCharacter;

    onkeydown                    : { (keynum: number): void; };
    onkeyup                      : { (keynum: number): void; };
    onmousewheel                 : { (delta: number): void; };
    onmousemove                  : { (deltaX: number, deltaY: number): void; };
    onpadmove                    : { (lX: number, lY: number, lZ: number,
                                      rX: number, rY: number, rZ: number,
                                      dpadState: number): void; };
    onpaddown                    : { (buttonnum: number): void; };
    attach                       : { (id: InputDevice): void; };

    static create(gd: GraphicsDevice, id: InputDevice, pd: PhysicsDevice,
                  dynamicsWorld: PhysicsWorld, matrix: any, params: any,
                  log: HTMLElement): CharacterController
    {
        var c = new CharacterController();

        var md = TurbulenzEngine.getMathDevice();
        c.md = md;
        c.matrix = matrix.slice();
        c.turn = 0.0;
        c.pitch = 0.0;
        c.right = 0.0;
        c.left = 0.0;
        c.up = 0.0;
        c.forward = 0.0;
        c.backward = 0.0;
        c.padright = 0.0;
        c.padleft = 0.0;
        c.padforward = 0.0;
        c.padbackward = 0.0;
        c.step = 0.0;
        c.extents = md.aabbBuildEmpty();

        //
        // Character creation
        //

        var radius = 16;
        var height = 74;
        var crouchheight = 38;
        c.radius = radius;
        c.halfHeight = (height / 2);
        c.crouchHalfHeight = (crouchheight / 2);
        c.rotateSpeed = 2.0;
        c.mouseRotateFactor = 0.1;
        c.collisionMargin = 0.30;
        c.maxSpeed = 160;
        c.speedModifier = 1;
        c.maxStepHeight = 8;
        c.maxJumpHeight = 48;
        c.jump = false;
        c.jumped = false;
        c.crouch = false;
        c.onGround = false;
        c.dead = false;
        c.god = false;

        if (params)
        {
            c.radius = params.radius || c.radius;
            c.halfHeight = params.halfHeight || c.halfHeight;
            c.crouchHalfHeight = params.crouchHalfHeight || c.crouchHalfHeight;
            c.rotateSpeed = params.rotateSpeed || c.rotateSpeed;
            c.mouseRotateFactor = params.mouseRotateFactor || c.mouseRotateFactor;
            c.collisionMargin = params.collisionMargin || c.collisionMargin;
            c.maxSpeed = params.maxSpeed || c.maxSpeed;
            c.maxStepHeight = params.maxStepHeight || c.maxStepHeight;
            c.maxJumpHeight = params.maxJumpHeight || c.maxJumpHeight;
        }

        var at = md.m43At(matrix);
        c.walkDirection = md.v3Normalize(md.v3Build(at[0], 0, at[2]));

        var physicsHeightOffset = md.v3Build(0, c.halfHeight, 0);
        c.physicsHeightOffset = physicsHeightOffset;
        c.physicsStandingHeightOffset = physicsHeightOffset;
        c.physicsCrouchingHeightOffset = md.v3Build(0, c.crouchHalfHeight, 0);
        c.deadHeightOffset = md.v3BuildZero();

        var physicsMatrix = matrix.slice();
        physicsMatrix[10] += c.halfHeight;
        c.updateExtents(md.m43Pos(physicsMatrix));

        c.character = pd.createCharacter({
            transform : physicsMatrix,
            mass: 100.0,
            radius : c.radius,
            height : (2 * c.halfHeight),
            crouchHeight: (2 * c.crouchHalfHeight),
            stepHeight : c.maxStepHeight,
            maxJumpHeight : c.maxJumpHeight,
            restitution: 0.1,
            friction: 0.7
        });

        dynamicsWorld.addCharacter(c.character);

        // keyboard handling
        var keyCodes, padCodes;
        if (id)
        {
            keyCodes = id.keyCodes;
            padCodes = id.padCodes;
        }

        var onkeydownFn = function onkeydownFnFn(keynum)
        {
            if (!c.dead)
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

                case keyCodes.SPACE:
                    c.jump = true;
                    break;

                case keyCodes.C:
                    c.crouch = true;
                    c.physicsHeightOffset = c.physicsCrouchingHeightOffset;
                    break;
                }
            }
        };

        var onkeyupFn = function onkeyupFnFn(keynum)
        {
            if (!c.dead)
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

                case keyCodes.C:
                    c.crouch = false;
                    c.physicsHeightOffset = c.physicsStandingHeightOffset;
                    break;
                }
            }
            if (keynum === keyCodes.G)
            {
                c.god = !c.god;
                if (c.god)
                {
                    c.character.velocity = c.md.v3BuildZero();
                }
                else
                {
                    var characterPosition = c.md.m43Pos(c.matrix);
                    c.character.position = c.md.v3Add(characterPosition, c.physicsHeightOffset);
                }
            }
            else if (keynum === keyCodes.RETURN)
            {
                gd.fullscreen = !gd.fullscreen;
            }

            if (keynum === keyCodes.P && Profile)
            {
                Profile.reset();
            }
        };

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
        c.onmousewheel = function onmousewheelFn(delta)
        {
            if (!c.dead)
            {
                if (delta !== 0.0)
                {
                    // Only use the mouse wheel for movement in god mode
                    if (c.god)
                    {
                        c.step = delta * 5;
                    }
                }
            }
        };

        c.onmousemove = function onmousemoveFn(deltaX, deltaY)
        {
            if (!c.dead)
            {
                c.turn  += deltaX;
                c.pitch += deltaY;
            }
        };

        // Pad handling
        c.onpadmove = function onpadmoveFn(lX, lY, lZ, rX, rY /*, rZ, dpadState */)
        {
            if (!c.dead)
            {
                c.turn  += rX * 15.0;
                c.pitch -= rY * 15.0;

                if (lX >= 0)
                {
                    c.padright = lX;
                    c.padleft  = 0;
                }
                else
                {
                    c.padright = 0;
                    c.padleft  = -lX;
                }

                if (lY >= 0)
                {
                    c.padforward  = lY;
                    c.padbackward = 0.0;
                }
                else
                {
                    c.padforward  = 0.0;
                    c.padbackward = -lY;
                }
            }
        };

        c.onpaddown = function onpaddownFn(buttonnum)
        {
            if (!c.dead)
            {
                if (buttonnum === padCodes.A)
                {
                    c.jump = true;
                }
                else if (buttonnum === padCodes.LEFT_THUMB)
                {
                    c.crouch = !c.crouch;
                    c.physicsHeightOffset = c.crouch ? c.physicsCrouchingHeightOffset : c.physicsStandingHeightOffset;
                }
            }
            if (buttonnum === padCodes.BACK)
            {
                c.god = !c.god;
                if (c.god)
                {
                    c.character.velocity = c.md.v3BuildZero();
                }
                else
                {
                    var characterPosition = c.md.m43Pos(c.matrix);
                    c.character.position = c.md.v3Add(characterPosition, c.physicsHeightOffset);
                }
            }
        };

        // Attach to an InputDevice
        c.attach = function attachFn(inputDevice)
        {
            inputDevice.addEventListener('keydown', c.onkeydown);
            inputDevice.addEventListener('keyup', c.onkeyup);
            inputDevice.addEventListener('mousewheel', c.onmousewheel);
            inputDevice.addEventListener('mousemove', c.onmousemove);
            inputDevice.addEventListener('padmove', c.onpadmove);
            inputDevice.addEventListener('paddown', c.onpaddown);
        };

        if (id)
        {
            c.attach(id);
        }

        return c;
    };

    rotate(turn, pitch)
    {
        var md = this.md;
        var degreestoradians = (Math.PI / 180.0);
        var mul = md.m43Mul;
        var axisRotation = md.m43FromAxisRotation;
        var matrix = this.matrix;
        var pos = md.m43Pos(matrix);
        md.m43SetPos(matrix, md.v3BuildZero());

        var rotate;
        if (pitch !== 0.0)
        {
            pitch *= this.rotateSpeed * degreestoradians;
            pitch *= this.mouseRotateFactor;

            var right = md.v3Normalize(md.m43Right(matrix));
            md.m43SetRight(matrix, right);

            rotate = axisRotation.call(md, right, pitch);

            matrix = mul.call(md, matrix, rotate);
        }

        if (turn !== 0.0)
        {
            turn *= this.rotateSpeed * degreestoradians;
            turn *= this.mouseRotateFactor;

            rotate = axisRotation.call(md, md.v3BuildYAxis(), turn);

            this.walkDirection = md.m43TransformVector(rotate, this.walkDirection);

            matrix = mul.call(md, matrix, rotate);
        }

        md.m43SetPos(matrix, pos);

        this.matrix = matrix;
    };

    setPosition(position)
    {
        var md = this.md;
        var physicsPosition = md.v3Add(position, this.physicsHeightOffset);
        this.character.position = physicsPosition;
        this.updateExtents(physicsPosition);
        md.m43SetPos(this.matrix, position);
    };

    setDead(dead)
    {
        if (dead && !this.dead)
        {
            this.dead = true;
            this.crouch = false;
            this.jump = false;
            this.jumped = false;
            this.forward = 0.0;
            this.backward = 0.0;
            this.left = 0.0;
            this.right = 0.0;
            this.character.dead = true;
            this.physicsHeightOffset = this.deadHeightOffset;
        }
        else if (!dead && this.dead)
        {
            this.dead = false;
            this.crouch = false;
            this.character.dead = false;
            this.physicsHeightOffset = this.physicsStandingHeightOffset;
        }
    };

    updateExtents(position)
    {
        var radius = this.radius;
        var halfHeight = this.halfHeight;
        if (this.crouch)
        {
            halfHeight = this.crouchHalfHeight;
        }
        else if (this.dead)
        {
            halfHeight = this.radius;
        }
        var p0 = position[0];
        var p1 = position[1];
        var p2 = position[2];
        var extents = this.extents;
        extents[0] = (p0 - radius);
        extents[1] = (p1);
        extents[2] = (p2 - radius);
        extents[3] = (p0 + radius);
        extents[4] = (p1 + (halfHeight * 2));
        extents[5] = (p2 + radius);
    };

    update(deltaTime)
    {
        var md = this.md;
        var position;
        if (this.dead)
        {
            // If we're dead we ignore input and just update based on the physics changes
            var charPosition = this.character.position;
            position = md.v3Sub(charPosition, this.physicsHeightOffset);
            this.updateExtents(position);
            md.m43SetPos(this.matrix, position);
            this.turn = 0.0;
            this.pitch = 0.0;
            this.step = 0.0;
            return;
        }

        if (this.turn !== 0.0 ||
            this.pitch !== 0.0)
        {
            this.rotate(this.turn, this.pitch);

            this.turn = 0.0;
            this.pitch = 0.0;
        }

        var step = this.step;
        if (step > 0)
        {
            this.forward += step;
        }
        else if (step < 0)
        {
            this.backward -= step;
        }

        var matrix = this.matrix;
        var character = this.character;
        var maxSpeed = this.maxSpeed;
        var right = ((this.right + this.padright) - (this.left + this.padleft));
        var forward = ((this.forward + this.padforward) - (this.backward + this.padbackward));

        if (this.god)
        {
            // Clamp character velocities at zero for when god mode is switched off
            character.velocity = md.v3BuildZero();
            position = md.m43Pos(matrix);

            var up = this.up;
            if (right !== 0.0 ||
                up !== 0.0 ||
                forward !== 0.0)
            {
                var muls = md.v3ScalarMul;
                var speed = (maxSpeed * deltaTime);
                position = md.v3Add4(muls.call(md, md.m43Right(matrix), (speed * right)),
                                        muls.call(md, md.m43Up(matrix),    (speed * up)),
                                        muls.call(md, md.m43At(matrix),   -(speed * forward)),
                                        position);

                this.updateExtents(position);
            }
            this.onGround = false;
        }
        else
        {
            var onGround = character.onGround;

            var oldVelocity = character.velocity;
            var oldVelocity0 = oldVelocity[0];
            var oldVelocity1 = oldVelocity[1];
            var oldVelocity2 = oldVelocity[2];

            if (right !== 0.0 ||
                forward !== 0.0)
            {
                var walkAt = this.walkDirection;
                var walkAt0 = -walkAt[0];
                var walkAt2 = -walkAt[2];
                //var walkRight = this.md.v3Cross([0, 1, 0], walkAt);
                var walkRight0 = -walkAt2;
                var walkRight2 =  walkAt0;

                if (this.crouch)
                {
                    maxSpeed *= 0.5;
                }

                maxSpeed *= this.speedModifier;

                var acceleration = (maxSpeed * deltaTime);
                if (onGround)
                {
                    acceleration *= 15.0;
                }
                else
                {
                    acceleration *= 1.18;
                }
                var newVelocity0 = (oldVelocity0 + (acceleration * (walkRight0 * right + walkAt0 * forward)));
                var newVelocity2 = (oldVelocity2 + (acceleration * (walkRight2 * right + walkAt2 * forward)));

                var velocityMagnitudeSq = ((newVelocity0 * newVelocity0) + (newVelocity2 * newVelocity2));
                if (velocityMagnitudeSq > (maxSpeed * maxSpeed))
                {
                    var velocityClamp;
                    var oldVelocityMagnitudeSq = ((oldVelocity0 * oldVelocity0) + (oldVelocity2 * oldVelocity2));
                    if (oldVelocityMagnitudeSq < (maxSpeed * maxSpeed))
                    {
                        // If we weren't already above max walking speed then clamp the velocity to that
                        velocityClamp = maxSpeed / Math.sqrt(velocityMagnitudeSq);
                    }
                    else
                    {
                        // Otherwise make sure we don't increase the speed
                        velocityClamp = Math.sqrt(oldVelocityMagnitudeSq) / Math.sqrt(velocityMagnitudeSq);
                    }
                    newVelocity0 *= velocityClamp;
                    newVelocity2 *= velocityClamp;
                }

                character.velocity = md.v3Build(newVelocity0,
                                              oldVelocity1,
                                              newVelocity2);
            }
            else
            {
                if (onGround)
                {
                    var dampingScale = Math.pow((1.0 - 0.8), deltaTime);
                    character.velocity = md.v3Build(((Math.abs(oldVelocity0) < 0.01) ? 0.0 : (oldVelocity0 * dampingScale)),
                                                  oldVelocity1,
                                                  ((Math.abs(oldVelocity2) < 0.01) ? 0.0 : (oldVelocity2 * dampingScale)));
                }
            }

            character.crouch = this.crouch;

            if (this.jump && onGround)
            {
                this.jump = false; // Avoid jumping again until they press the key again
                character.jump();
                this.jumped = true;
            }
            else
            {
                this.jumped = false;
            }

            this.onGround = onGround;

            var physicsPosition = character.position;
            position = md.v3Sub(physicsPosition, this.physicsHeightOffset);
            this.updateExtents(position);
        }

        if (step > 0)
        {
            this.forward -= step;
            this.step = 0.0;
        }
        else if (step < 0)
        {
            this.backward += step;
            this.step = 0.0;
        }

        md.m43SetPos(matrix, position);
    };

};
