// Copyright (c) 2010-2012 Turbulenz Limited
/*global TurbulenzEngine: false */
/*global VMath: false */

/// <reference path="turbulenz.d.ts" />
/// <reference path="vmath.ts" />
/// <reference path="material.ts" />

//
// Light
//
class Light
{
    static version = 1;

    name                : string;
    color               : any; // v3

    directional         : bool;
    spot                : bool;
    ambient             : bool;
    point               : bool;

    origin              : any; // v3
    radius              : number;
    direction           : any; // v3

    frustum             : any; // m33
    frustumNear         : number;
    center              : any; // v3
    halfExtents         : any; // v3

    shadows             : bool;
    dynamicshadows      : bool;
    disabled            : bool;
    dynamic             : bool;

    material            : Material;
    techniqueParameters : TechniqueParameters;
    sharedMaterial      : Material;

    fog                 : bool;
    global              : bool;

    target: any; // v3?  TODO: can't see where this is actualy set

    //
    // clone
    //
    clone() : Light
    {
        var clone = new Light();

        clone.name = this.name;
        clone.spot = this.spot;
        clone.ambient = this.ambient;
        clone.point = this.point;
        clone.fog = this.fog;
        clone.global = this.global;
        clone.directional = this.directional;
        clone.color = (this.color && this.color.slice());
        clone.direction = (this.direction && this.direction.slice());
        clone.origin = (this.origin && this.origin.slice());
        clone.frustum = (this.frustum && this.frustum.slice());
        clone.frustumNear = this.frustumNear;
        clone.center = (this.center && this.center.slice());
        clone.halfExtents = (this.halfExtents && this.halfExtents.slice());
        clone.radius = this.radius;
        clone.shadows = this.shadows;
        clone.dynamicshadows = this.dynamicshadows;
        clone.disabled = this.disabled;
        clone.dynamic = this.dynamic;
        clone.techniqueParameters = this.techniqueParameters;

        return clone;
    };

    //
    // isGlobal
    //
    isGlobal() : bool
    {
        return this.global;
    };

    //
    // Light create
    //
    static create(params) : Light
    {
        var light = new Light();

        var mathDevice = TurbulenzEngine.getMathDevice();

        var abs = Math.abs;
        var max = Math.max;

        if (params.name)
        {
            light.name = params.name;
        }

        light.color = params.color && params.color.length ? params.color : mathDevice.v3BuildOne();

        if (params.directional)
        {
            light.directional = true;
        }
        else if (params.spot)
        {
            light.spot = true;
        }
        else if (params.ambient)
        {
            light.ambient = true;
        }
        else
        {
            light.point = true;
        }

        light.origin = params.origin;

        var target = params.target;
        if (target || light.spot)
        {
            if (!target)
            {
                target = mathDevice.v3Build(0, 0, -(params.radius || 1));
            }

            // "falloff_angle" is the total angle in degrees
            // calculate half angle in radians: angle * 0.5 / 180 * PI
            var angle = (params.falloff_angle || 90) / 360 * Math.PI;
            var tangent = Math.abs(target[2]) * Math.tan(angle);

            var right = params.right || mathDevice.v3Build(tangent, 0, 0);
            var up = params.up || mathDevice.v3Build(0, tangent, 0);
            var end = params.end || target;

            light.frustum = mathDevice.m33Build(right, up, end);
            var d0 = (abs(right[0]) + abs(up[0]));
            var d1 = (abs(right[1]) + abs(up[1]));
            var d2 = (abs(right[2]) + abs(up[2]));
            var e0 = end[0];
            var e1 = end[1];
            var e2 = end[2];
            var c0, c1, c2;
            var start = params.start;
            if (start)
            {
                target = mathDevice.v3Normalize(target);
                light.frustumNear = (mathDevice.v3Dot(target, start) / mathDevice.v3Dot(target, end));
                c0 = ((e0 + start[0]) * 0.5);
                c1 = ((e1 + start[1]) * 0.5);
                c2 = ((e2 + start[2]) * 0.5);
            }
            else
            {
                light.frustumNear = 0;
                c0 = (e0 * 0.5);
                c1 = (e1 * 0.5);
                c2 = (e2 * 0.5);
            }
            light.center = mathDevice.v3Build(c0, c1, c2);
            light.halfExtents = mathDevice.v3Build(max(abs(e0 - d0 - c0), abs(e0 + d0 - c0)),
                                                   max(abs(e1 - d1 - c1), abs(e1 + d1 - c1)),
                                                   max(abs(e2 - d2 - c2), abs(e2 + d2 - c2)));
        }
        else
        {
            var halfExtents = params.halfExtents;
            if (halfExtents)
            {
                light.halfExtents = (halfExtents.length && halfExtents) || mathDevice.v3BuildZero();
            }
            else
            {
                var radius = params.radius;
                if (radius)
                {
                    light.radius = radius;
                    light.halfExtents = mathDevice.v3ScalarBuild(radius);
                }
                else if (!light.ambient)
                {
                    light.halfExtents = mathDevice.v3ScalarBuild(VMath.FLOAT_MAX);
                }
            }
        }

        light.direction = params.direction;

        if (!params.halfExtents &&
            !params.radius &&
            !params.target)
        {
            light.global = true;
        }

        if (!light.global &&
            (params.shadows || params.dynamicshadows))
        {
            light.shadows = true;

            if (params.dynamicshadows)
            {
                light.dynamicshadows = true;
            }
        }

        if (params.disabled)
        {
            light.disabled = true;
        }

        if (params.dynamic)
        {
            light.dynamic = true;
        }

        var material = params.material;
        if (material)
        {
            var techniqueParameters = material.techniqueParameters;

            light.techniqueParameters = techniqueParameters;

            var metaMaterial = material.meta;
            if (metaMaterial)
            {
                var ambient = metaMaterial.ambient;
                if (ambient)
                {
                    light.ambient = true;
                }

                var fog = metaMaterial.fog;
                if (fog)
                {
                    light.fog = true;
                }
            }
        }

        return light;
    };
};

//
// Light Instance
//
class LightInstance
{
    static version = 1;

    node               : SceneNode;
    light              : Light;
    worldExtents       : any; // arrayConstructor(6);
    worldExtentsUpdate : number;

    arrayConstructor   : any; //
    disabled           : bool;


    //
    // setMaterial
    //
    setMaterial(material)
    {
        // TODO: this is really being set on the light not the instance so
        // we either need to move the materials and meta to the instance or remove this
        // and create Scene.setLightMaterial

        this.light.sharedMaterial = material;

        var meta = material.meta;
        if (material.meta)
        {
            var ambient = meta.ambient;
            if (ambient)
            {
                this.light.ambient = true;
            }
            else
            {
                if (this.light.ambient)
                {
                    delete this.light.ambient;
                }
            }

            var fog = meta.fog;
            if (fog)
            {
                this.light.fog = true;
            }
            else
            {
                if (this.light.fog)
                {
                    delete this.light.fog;
                }
            }
        }
    };

    //
    // setNode
    //
    setNode(node)
    {
        this.node = node;
        this.worldExtentsUpdate = -1;
    };

    //
    // getNode
    //
    getNode() : SceneNode
    {
        return this.node;
    };

    //
    // getWorldExtents
    //
    getWorldExtents()
    {
        //Note: This method is only valid on a clean node.
        var worldExtents = this.worldExtents;
        var node = this.node;
        if (node.worldUpdate !== this.worldExtentsUpdate)
        {
            //Note: set this.worldExtentsUpdate to -1 if local extents change.
            // If we need custom extents we can set worldExtentsUpdate to some distinct value <0.
            this.worldExtentsUpdate = node.worldUpdate;

            var light = this.light;

            var world = node.world;
            var m0 = world[0];
            var m1 = world[1];
            var m2 = world[2];
            var m3 = world[3];
            var m4 = world[4];
            var m5 = world[5];
            var m6 = world[6];
            var m7 = world[7];
            var m8 = world[8];

            var ct0 = world[9];
            var ct1 = world[10];
            var ct2 = world[11];

            if (light.spot)
            {
                var minX, minY, minZ, maxX, maxY, maxZ, pX, pY, pZ;
                minX = ct0;
                minY = ct1;
                minZ = ct2;
                maxX = ct0;
                maxY = ct1;
                maxZ = ct2;

                //var transform = md.m33MulM43(light.frustum, world);
                //var p0 = md.m43TransformPoint(transform, md.v3Build(-1, -1, 1));
                //var p1 = md.m43TransformPoint(transform, md.v3Build(1, -1, 1));
                //var p2 = md.m43TransformPoint(transform, md.v3Build(-1, 1, 1));
                //var p3 = md.m43TransformPoint(transform, md.v3Build(1, 1, 1));
                var f = light.frustum;
                var f0 = f[0];
                var f1 = f[1];
                var f2 = f[2];
                var f3 = f[3];
                var f4 = f[4];
                var f5 = f[5];
                var f6 = f[6];
                var f7 = f[7];
                var f8 = f[8];

                ct0 += (m0 * f6 + m3 * f7 + m6 * f8);
                ct1 += (m1 * f6 + m4 * f7 + m7 * f8);
                ct2 += (m2 * f6 + m5 * f7 + m8 * f8);

                var abs = Math.abs;
                var d0 = (abs(m0 * f0 + m3 * f1 + m6 * f2) + abs(m0 * f3 + m3 * f4 + m6 * f5));
                var d1 = (abs(m1 * f0 + m4 * f1 + m7 * f2) + abs(m1 * f3 + m4 * f4 + m7 * f5));
                var d2 = (abs(m2 * f0 + m5 * f1 + m8 * f2) + abs(m2 * f3 + m5 * f4 + m8 * f5));
                pX = (ct0 - d0);
                pY = (ct1 - d1);
                pZ = (ct2 - d2);
                if (minX > pX)
                {
                    minX = pX;
                }
                if (minY > pY)
                {
                    minY = pY;
                }
                if (minZ > pZ)
                {
                    minZ = pZ;
                }

                pX = (ct0 + d0);
                pY = (ct1 + d1);
                pZ = (ct2 + d2);
                if (maxX < pX)
                {
                    maxX = pX;
                }
                if (maxY < pY)
                {
                    maxY = pY;
                }
                if (maxZ < pZ)
                {
                    maxZ = pZ;
                }

                worldExtents[0] = minX;
                worldExtents[1] = minY;
                worldExtents[2] = minZ;
                worldExtents[3] = maxX;
                worldExtents[4] = maxY;
                worldExtents[5] = maxZ;
            }
            else
            {
                var center = light.center;
                var halfExtents = light.halfExtents;

                if (center)
                {
                    var c0 = center[0];
                    var c1 = center[1];
                    var c2 = center[2];
                    ct0 += (m0 * c0 + m3 * c1 + m6 * c2);
                    ct1 += (m1 * c0 + m4 * c1 + m7 * c2);
                    ct2 += (m2 * c0 + m5 * c1 + m8 * c2);
                }

                var h0 = halfExtents[0];
                var h1 = halfExtents[1];
                var h2 = halfExtents[2];
                var ht0 = ((m0 < 0 ? -m0 : m0) * h0 + (m3 < 0 ? -m3 : m3) * h1 + (m6 < 0 ? -m6 : m6) * h2);
                var ht1 = ((m1 < 0 ? -m1 : m1) * h0 + (m4 < 0 ? -m4 : m4) * h1 + (m7 < 0 ? -m7 : m7) * h2);
                var ht2 = ((m2 < 0 ? -m2 : m2) * h0 + (m5 < 0 ? -m5 : m5) * h1 + (m8 < 0 ? -m8 : m8) * h2);

                worldExtents[0] = (ct0 - ht0);
                worldExtents[1] = (ct1 - ht1);
                worldExtents[2] = (ct2 - ht2);
                worldExtents[3] = (ct0 + ht0);
                worldExtents[4] = (ct1 + ht1);
                worldExtents[5] = (ct2 + ht2);
            }
        }
        return worldExtents;
    };

    //
    // clone
    //
    clone() : LightInstance
    {
        var newInstance = LightInstance.create(this.light);
        return newInstance;
    };

    //
    // Constructor function
    //
    static create(light: Light) : LightInstance
    {
        var instance = new LightInstance();

        instance.node = undefined;
        instance.light = light;
        instance.worldExtents = new instance.arrayConstructor(6);
        instance.worldExtentsUpdate = -1;

        return instance;
    };
};

// Detect correct typed arrays
(function () {
    LightInstance.prototype.arrayConstructor = Array;
    if (typeof Float32Array !== "undefined")
    {
        var testArray = new Float32Array(4);
        var textDescriptor = Object.prototype.toString.call(testArray);
        if (textDescriptor === '[object Float32Array]')
        {
            LightInstance.prototype.arrayConstructor = Float32Array;
        }
    }
}());
