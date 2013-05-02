// Copyright (c) 2009-2013 Turbulenz Limited
function DebugDraw(mathDevice, shaderManager, graphicsDevice, camera)
{
    this.mathDevice = mathDevice;
    this.shaderManager = shaderManager;
    this.graphicsDevice = graphicsDevice;
    this.camera = camera;

    var gd = this.graphicsDevice;

    if (typeof this.debugLineVertexBuffer === "undefined")
    {
        var debugLinesAttributes = [ gd.VERTEXFORMAT_FLOAT3, gd.VERTEXFORMAT_FLOAT3 ];
        this.numAttributeComponents = 6;
        this.vertexBuffer = gd.createVertexBuffer({
                numVertices: (2 * this.maximumLines),
                attributes: debugLinesAttributes,
                dynamic: true
            });

        this.data = new Float32Array((2 * this.maximumLines) * this.numAttributeComponents);
        this.debugLinesCount   =   0;
    }
}

DebugDraw.prototype =
{
    maximumLines : 2000,

    drawDebugLine : function debugDrawDrawDebugLineFn(v3pos0, v3pos1, r, g, b)
    {
        if (this.debugLinesCount >= this.maximumLines)
        {
            return;
        }

        var dstIndex    =   this.debugLinesCount * (2 * this.numAttributeComponents);

        this.data[dstIndex + 0] = v3pos0[0];
        this.data[dstIndex + 1] = v3pos0[1];
        this.data[dstIndex + 2] = v3pos0[2];
        this.data[dstIndex + 3] = r;
        this.data[dstIndex + 4] = g;
        this.data[dstIndex + 5] = b;

        this.data[dstIndex + 6] = v3pos1[0];
        this.data[dstIndex + 7] = v3pos1[1];
        this.data[dstIndex + 8] = v3pos1[2];
        this.data[dstIndex + 9] = r;
        this.data[dstIndex + 10] = g;
        this.data[dstIndex + 11] = b;

        this.debugLinesCount += 1;
    },

    getColourFromID : function debugDrawGetColourFromID(id)
    {
        var md = this.mathDevice;

        if (this.randomColours === undefined)
        {
            this.randomColours  =   [
                md.v3Build(1.0, 0.0, 0.0),
                md.v3Build(0.0, 1.0, 0.0),
                md.v3Build(0.0, 0.0, 1.0),
                md.v3Build(0.0, 1.0, 1.0),
                md.v3Build(1.0, 0.0, 1.0),
                md.v3Build(1.0, 1.0, 0.0)
            ];
        }

        return  this.randomColours[id % this.randomColours.length];
    },

    drawDebugCircle : function debugDrawDrawDebugCircleFn(v3pos, v3normal, radius, r, g, b)
    {
        var md = this.mathDevice;

        var number_of_segments	=	5.0 * radius;
        if (number_of_segments < 5)
        {
            number_of_segments  =   5;
        }
        if (number_of_segments > 30)
        {
            number_of_segments  =   30;
        }
        var radian_per_segment      =       Math.PI * 2.0 / number_of_segments;

        md.v3Normalize(v3normal, v3normal);

        var v3InitialLocalOffset    =       md.v3Build(radius, 0.0, 0.0);
        if (v3normal[1] !== 1.0 && v3normal[1] !== -1.0)
        {
            v3InitialLocalOffset   =    md.v3Cross(v3normal, md.v3BuildYAxis());
            md.v3ScalarMul(v3InitialLocalOffset, radius, v3InitialLocalOffset);
        }

        var rotationMatrix = md.m33FromAxisRotation(v3normal, radian_per_segment);

        var v3Previous  =   md.v3Add(v3pos, v3InitialLocalOffset);
        var v3Current   =   md.v3Copy(v3Previous);

        var j;
        for (j = 1; j < number_of_segments + 1; j += 1)
        {
            v3InitialLocalOffset    =   md.m33Transform(rotationMatrix, v3InitialLocalOffset);
            md.v3Add(v3pos, v3InitialLocalOffset, v3Current);

            this.drawDebugLine(v3Previous, v3Current, r, g, b);

            md.v3Copy(v3Current, v3Previous);
        }
    },

    drawDebugPoint : function debugDrawDrawDebugPointFn(v3pos, r, g, b, size)
    {
        var sz = 0.25;
        if (size !== undefined)
        {
            sz = size;
        }

        var md = this.mathDevice;

        this.drawDebugLine(md.v3Add(v3pos, md.v3Build(-sz, 0, 0)), md.v3Add(v3pos, md.v3Build(sz, 0, 0)), r, g, b);
        this.drawDebugLine(md.v3Add(v3pos, md.v3Build(0, -sz, 0)), md.v3Add(v3pos, md.v3Build(0, sz, 0)), r, g, b);
        this.drawDebugLine(md.v3Add(v3pos, md.v3Build(0, 0, -sz)), md.v3Add(v3pos, md.v3Build(0, 0, sz)), r, g, b);
    },

    drawDebugSphere : function debugDrawDrawDebugSphere(v3pos, radius, r, g, b)
    {
        var md = this.mathDevice;

        this.drawDebugCircle(v3pos, md.v3BuildXAxis(), radius, r, g, b);
        this.drawDebugCircle(v3pos, md.v3BuildYAxis(), radius, r, g, b);
        this.drawDebugCircle(v3pos, md.v3BuildZAxis(), radius, r, g, b);
    },

    drawDebugHalfCube : function debugDrawDrawDebugCubeFn(v3pos, length, r, g, b)
    {
        //8 corners.
        //   a   b
        // c   d
        //
        //   e   f
        // g   h

        //12 lines.
        //ab,bd,bc,ca
        //ae,bf,dh,cg
        //ef,fh,hg,ge

        var md = this.mathDevice;
        //var ca, cb, cc, cd, ce, cf, cg, ch;
        var ca, cb, cc, ce;
        var half_length =   md.v3Build(length * 0.5, length * 0.5, length * 0.5);

        ca   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], -half_length[2]));
        cb   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], -half_length[2]));
        cc   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], +half_length[2]));
        //cd   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], +half_length[2]));
        ce   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], -half_length[2]));
        //cf   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], -half_length[2]));
        //cg   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], +half_length[2]));
        //ch   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], +half_length[2]));

        this.drawDebugLine(ca, cb, r, g, b);
        //this.drawDebugLine(cb,cd,r,g,b);
        //this.drawDebugLine(cd,cc,r,g,b);
        this.drawDebugLine(cc, ca, r, g, b);

        this.drawDebugLine(ca, ce, r, g, b);
       // this.drawDebugLine(cb,cf,r,g,b);
       // this.drawDebugLine(cd,ch,r,g,b);
       // this.drawDebugLine(cc,cg,r,g,b);

        //this.drawDebugLine(ce,cf,r,g,b);
        //this.drawDebugLine(cf,ch,r,g,b);
        //this.drawDebugLine(ch,cg,r,g,b);
        //this.drawDebugLine(cg,ce,r,g,b);
    },

    drawDebugExtents : function debugDrawDrawDebugHalfExtentsFn(extents, r, g, b)
    {
        //8 corners.
        //   a   b
        // c   d
        //
        //   e   f
        // g   h

        //12 lines.
        //ab,bd,bc,ca
        //ae,bf,dh,cg
        //ef,fh,hg,ge

        var md = this.mathDevice;
        var ca, cb, cc, cd, ce, cf, cg, ch;
        var v3pos = md.v3BuildZero();
        var half_length =   md.v3BuildZero();

        md.aabbGetCenterAndHalf(extents, v3pos, half_length);

        ca   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], -half_length[2]));
        cb   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], -half_length[2]));
        cc   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], +half_length[2]));
        cd   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], +half_length[2]));
        ce   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], -half_length[2]));
        cf   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], -half_length[2]));
        cg   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], +half_length[2]));
        ch   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], +half_length[2]));

        this.drawDebugLine(ca, cb, r, g, b);
        this.drawDebugLine(cb, cd, r, g, b);
        this.drawDebugLine(cd, cc, r, g, b);
        this.drawDebugLine(cc, ca, r, g, b);

        this.drawDebugLine(ca, ce, r, g, b);
        this.drawDebugLine(cb, cf, r, g, b);
        this.drawDebugLine(cd, ch, r, g, b);
        this.drawDebugLine(cc, cg, r, g, b);

        this.drawDebugLine(ce, cf, r, g, b);
        this.drawDebugLine(cf, ch, r, g, b);
        this.drawDebugLine(ch, cg, r, g, b);
        this.drawDebugLine(cg, ce, r, g, b);
    },

    drawDebugHalfExtents : function debugDrawDrawDebugHalfExtentsFn(extents, r, g, b)
    {
        //8 corners.
        //   a   b
        // c   d
        //
        //   e   f
        // g   h

        //12 lines.
        //ab,bd,bc,ca
        //ae,bf,dh,cg
        //ef,fh,hg,ge

        var md = this.mathDevice;
        //var ca, cb, cc, cd, ce, cf, cg, ch;
        var ca, cb, cc, ce;
        var v3pos = md.v3BuildZero();
        var half_length =   md.v3BuildZero();

        md.aabbGetCenterAndHalf(extents, v3pos, half_length);

        ca   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], -half_length[2]));
        cb   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], -half_length[2]));
        cc   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], +half_length[2]));
        //cd   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], +half_length[2]));
        ce   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], -half_length[2]));
        //cf   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], -half_length[2]));
        //cg   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], +half_length[2]));
        //ch   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], +half_length[2]));

        this.drawDebugLine(ca, cb, r, g, b);
        //this.drawDebugLine(cb,cd,r,g,b);
        //this.drawDebugLine(cd,cc,r,g,b);
        this.drawDebugLine(cc, ca, r, g, b);

        this.drawDebugLine(ca, ce, r, g, b);
       // this.drawDebugLine(cb,cf,r,g,b);
       // this.drawDebugLine(cd,ch,r,g,b);
       // this.drawDebugLine(cc,cg,r,g,b);

        //this.drawDebugLine(ce,cf,r,g,b);
        //this.drawDebugLine(cf,ch,r,g,b);
        //this.drawDebugLine(ch,cg,r,g,b);
        //this.drawDebugLine(cg,ce,r,g,b);
    },

    drawDebugCube : function debugDrawDrawDebugCubeFn(v3pos, length, r, g, b)
    {
        //8 corners.
        //   a   b
        // c   d
        //
        //   e   f
        // g   h

        //12 lines.
        //ab,bd,bc,ca
        //ae,bf,dh,cg
        //ef,fh,hg,ge

        var md = this.mathDevice;
        var ca, cb, cc, cd, ce, cf, cg, ch;
        var half_length =   md.v3Build(length * 0.5, length * 0.5, length * 0.5);

        ca   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], -half_length[2]));
        cb   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], -half_length[2]));
        cc   =   md.v3Add(v3pos, md.v3Build(-half_length[0], +half_length[1], +half_length[2]));
        cd   =   md.v3Add(v3pos, md.v3Build(+half_length[0], +half_length[1], +half_length[2]));
        ce   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], -half_length[2]));
        cf   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], -half_length[2]));
        cg   =   md.v3Add(v3pos, md.v3Build(-half_length[0], -half_length[1], +half_length[2]));
        ch   =   md.v3Add(v3pos, md.v3Build(+half_length[0], -half_length[1], +half_length[2]));

        this.drawDebugLine(ca, cb, r, g, b);
        this.drawDebugLine(cb, cd, r, g, b);
        this.drawDebugLine(cd, cc, r, g, b);
        this.drawDebugLine(cc, ca, r, g, b);

        this.drawDebugLine(ca, ce, r, g, b);
        this.drawDebugLine(cb, cf, r, g, b);
        this.drawDebugLine(cd, ch, r, g, b);
        this.drawDebugLine(cc, cg, r, g, b);

        this.drawDebugLine(ce, cf, r, g, b);
        this.drawDebugLine(cf, ch, r, g, b);
        this.drawDebugLine(ch, cg, r, g, b);
        this.drawDebugLine(cg, ce, r, g, b);
    },

    // mat being a maths m43
    drawDebugMatrix : function debugDrawDrawDebugMatrixFn(mat)
    {
        // var sz = 1.0;

        var md = this.mathDevice;

        var po = md.m43Pos(mat);
        // var px = md.m43TransformPoint(mat, md.v3Build(sz, 0, 0));
        // var py = md.m43TransformPoint(mat, md.v3Build(0, sz, 0));
        // var pz = md.m43TransformPoint(mat, md.v3Build(0, 0, sz));

        //this.drawDebugLine(po, px, 255, 0, 0);
        //this.drawDebugLine(po, py, 0, 255, 0);
        //this.drawDebugLine(po, pz, 0, 0, 255);

        this.drawDebugLine(po, md.v3Add(po, md.v3Normalize(md.m43Right(mat))), 255, 0, 0);
        this.drawDebugLine(po, md.v3Add(po, md.v3Normalize(md.m43Up(mat))), 0, 255, 0);
        this.drawDebugLine(po, md.v3Add(po, md.v3Normalize(md.m43At(mat))), 0, 0, 255);
    },

    drawDebugAxis : function debugDrawDrawDebugAxisFn(v3Location, scale)
    {
        var md = this.mathDevice;

        this.drawDebugLine(v3Location, md.v3Add(v3Location, md.v3Build(scale, 0.0, 0.0)), 255, 0, 0);
        this.drawDebugLine(v3Location, md.v3Add(v3Location, md.v3Build(0.0, scale, 0.0)), 0, 255, 0);
        this.drawDebugLine(v3Location, md.v3Add(v3Location, md.v3Build(0.0, 0.0, scale)), 0, 0, 255);
    },

    buildArrowPoints : function debugDrawBuildArrowPoints()
    {
        if (DebugDraw.prototype.arrowPoints === undefined)
        {
            var md      =   this.mathDevice;
            var baseWidth = 0.5;
            var neckWidth = 0.4;
            var neckHeight = 0.75;

            DebugDraw.prototype.arrowPoints = [
                md.v3Build(0.0,         0.0, -baseWidth),
                md.v3Build(0.0,         0.0, baseWidth),
                md.v3Build(neckHeight,  0.0, neckWidth),
                md.v3Build(neckHeight,  0.0, 1.0),
                md.v3Build(1.0,         0.0, 0.0),  //Top
                md.v3Build(neckHeight,  0.0, -1.0),
                md.v3Build(neckHeight,  0.0, -neckWidth),
                md.v3Build(0.0,         0.0, -baseWidth)
            ];
        }
    },

    //
    // drawDebugArrow
    //
    drawDebugArrow : function debugDrawDrawDebugArrowFn(v3Start, v3End, width, r, g, b)
    {
        var md      =   this.mathDevice;
        var forward =   md.v3Sub(v3End, v3Start);
        var length  =   md.v3Length(forward);

        var rotationAmount  =   md.v3ToAngle(forward);
        var m43ScaleMatrix  =   md.m43BuildScale(md.v3Build(length - 0.5, 1.0, width));
        var m43RotateMatrix =   md.m43BuildRotationY(rotationAmount);
        var tMatrix         =   md.m43Mul(m43ScaleMatrix, m43RotateMatrix);
        var worldOffset     =   md.m43TransformVector(m43RotateMatrix, md.v3Build(0.5, 0.0, 0.0));
        md.m43SetPos(tMatrix, md.v3Add(v3Start, worldOffset));

        //this.drawDebugMatrix(tMatrix,r,g,b);

        this.buildArrowPoints();

        var arrowPoints         =   this.arrowPoints;
        var arrowPointsLength   =   arrowPoints.length;

        var thisPoint;
        var prevPoint  =    md.m43TransformPoint(tMatrix, arrowPoints[0]);
        var aPIndex;
        for (aPIndex = 1; aPIndex < arrowPointsLength; aPIndex += 1)
        {
            thisPoint   =   md.m43TransformPoint(tMatrix, arrowPoints[aPIndex], thisPoint);
            this.drawDebugLine(prevPoint, thisPoint, r, g, b);

            prevPoint   =   md.v3Copy(thisPoint, prevPoint);
        }
    },

    //
    // drawDebugLines
    //
    drawDebugLines : function debugDrawDrawDebugLinesFn()
    {
        if (this.debugLinesCount === 0)
        {
            return;
        }

        var sm  =   this.shaderManager;
        var gd  =   this.graphicsDevice;
        var camera = this.camera;

        var shader      = sm.get("shaders/debug.cgfx");
        var technique   = shader.getTechnique("debug_lines");
        if (!technique)
        {
            return;
        }

        gd.setTechnique(technique);

        var techniqueParameters = this.debugLinesTechniqueParameters;
        if (!techniqueParameters)
        {
            techniqueParameters = gd.createTechniqueParameters(
            {
                worldViewProjection: camera.viewProjectionMatrix
            });
            this.debugLinesTechniqueParameters = techniqueParameters;
        }
        else
        {
            techniqueParameters.worldViewProjection = camera.viewProjectionMatrix;
        }

        gd.setTechniqueParameters(techniqueParameters);

        this.vertexBuffer.setData(this.data, 0, (2 * this.debugLinesCount));
        var debugSemantics = gd.createSemantics([ gd.SEMANTIC_POSITION,
                                                  gd.SEMANTIC_COLOR ]);
        gd.setStream(this.vertexBuffer, debugSemantics);
        gd.draw(gd.PRIMITIVE_LINES, (2 * this.debugLinesCount), 0);

        this.clearDebugLineList();
    },

    preload : function debugdrawPreloadFn()
    {
        var sm = this.shaderManager;

        sm.load('shaders/debug.cgfx');
    },

    clearDebugLineList : function debugdrawClearDebugLineListFn()
    {
        this.debugLinesCount = 0;
    }
};

DebugDraw.createFromGlobals = function debugDrawCreateFromGlobalsFn(globals)
{
    return  DebugDraw.create(globals.mathDevice, globals.shaderManager, globals.graphicsDevice, globals.camera);
};

DebugDraw.create = function debugDrawCreateFn(mathDevice, shaderManager, graphicsDevice, camera)
{
    return  new DebugDraw(mathDevice, shaderManager, graphicsDevice, camera);
};
