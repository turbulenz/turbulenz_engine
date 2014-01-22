// Copyright (c) 2011-2012 Turbulenz Limited

class DebugConstraint
{
    drawSliderConstraintLimits: { (constraint, scale): void; };
    drawHingeConstraintLimits: { (constraint, scale): void; };
    drawP2PConstraintLimits: { (constraint, scale): void; };
    drawConeTwistConstraintLimits: { (constraint, scale): void; };
    draw6DOFConstraintLimits: { (constraint, scale): void; };

    static create(graphicsDevice, technique, mathsDevice, camera)
    {
        var tech = technique;
        var gd = graphicsDevice;
        var cm = camera;
        var md = mathsDevice;

        var debug = new DebugConstraint();
        var posColSem = gd.createSemantics(['POSITION', 'COLOR']);

        function setupGd()
        {
            gd.setTechnique(tech);

            var techniqueParameters = this.debugLinesTechniqueParameters;
            if (!techniqueParameters)
            {
                techniqueParameters = gd.createTechniqueParameters({
                    worldViewProjection: cm.viewProjectionMatrix
                });
                this.debugLinesTechniqueParameters = techniqueParameters;
            }
            else
            {
                techniqueParameters.worldViewProjection = cm.viewProjectionMatrix;
            }

            gd.setTechniqueParameters(techniqueParameters);
        }

        function drawLineFn(writer, startPoint, endPoint, color)
        {
            if (writer)
            {
                writer(startPoint, color[0], color[1], color[2]);
                writer(endPoint, color[0], color[1], color[2]);
            }
        }

        function drawSingleLineFn(startPoint, endPoint, color)
        {
            setupGd();
            var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                      2,
                                      ['FLOAT3',   'FLOAT3'],
                                      posColSem);

            if (writer)
            {
                writer(startPoint, color[0], color[1], color[2]);
                writer(endPoint, color[0], color[1], color[2]);
            }

            gd.endDraw(writer);
        }

        function drawTransform(transform, scale)
        {
            var px = transform[9];
            var py = transform[10];
            var pz = transform[11];

            setupGd();

            var transformWriter = gd.beginDraw(gd.PRIMITIVE_LINES,
                                               6,
                                               ['FLOAT3', 'FLOAT3'],
                                               posColSem);

            transformWriter(px, py, pz, 1, 0, 0);
            transformWriter(px + transform[0] * scale, py + transform[1] * scale, pz + transform[2] * scale, 1, 0, 0);
            transformWriter(px, py, pz, 0, 1, 0);
            transformWriter(px + transform[3] * scale, py + transform[4] * scale, pz + transform[5] * scale, 0, 1, 0);
            transformWriter(px, py, pz, 0, 0, 1);
            transformWriter(px + transform[6] * scale, py + transform[7] * scale, pz + transform[8] * scale, 0, 0, 1);

            gd.endDraw(transformWriter);
        }

        // Curve parameter indicates whether you just want to draw a curved line (perhaps a circle)
        // rather than an actual arc. Therefore, pass true to draw a circle
        function drawArcFn(center, normal, axis, radiusA, radiusB, minAngle, maxAngle, color, stepDegrees?, curve?)
        {
            if (!stepDegrees)
            {
                stepDegrees = 16;
            }

            var vx = axis;
            var vy = md.v3Cross(normal, axis, vy);
            var step = stepDegrees * 0.0174532925; // 0.17.. = Rads per degree
            var sectLines = (curve) ? 0 : 4;
            var nSteps = Math.floor((maxAngle - minAngle) / step);

            if (!nSteps || nSteps < 0)
            {
                return;
            }
            // center + (radiusA * vx * Math.cos(minAngle)) + (radiusB *
            // vy * Math.sin(minAngle));
            var prev = md.v3Add(
                md.v3Add(center, md.v3ScalarMul(vx, (radiusA * Math.cos(minAngle)))),
                md.v3ScalarMul(vy, (radiusB * Math.sin(minAngle))), prev);

            setupGd();

            var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                      (2 * nSteps) + sectLines,
                                      ['FLOAT3',   'FLOAT3'],
                                      posColSem);
            if (!curve)
            {
                drawLineFn(writer, center, prev, color);
            }

            var angle = 0;
            var next;

            for (var i = 1; i <= nSteps; i += 1)
            {
                angle = minAngle + (maxAngle - minAngle) * i / nSteps;
                next = md.v3Add(
                    md.v3Add(center, md.v3ScalarMul(vx, (radiusA * Math.cos(angle)))),
                    md.v3ScalarMul(vy, (radiusB * Math.sin(angle))), next);

                drawLineFn(writer, prev, next, color);
                prev[0] = next[0];
                prev[1] = next[1];
                prev[2] = next[2];
            }

            if (!curve)
            {
                drawLineFn(writer, center, prev, color);
            }

            gd.endDraw(writer);
        }

        function pointForAngleFn(angleInRadians, length, swingSpan1, swingSpan2)
        {
            // Compute x/y in ellipse using cone angle (0 -> 2*PI along
            // surface of cone)
            var xEllipse = Math.cos(angleInRadians);
            var yEllipse = Math.sin(angleInRadians);

            // Use the slope of the vector (using x/y) and find the length
            // of the line that intersects the ellipse
            //  x^y^2
            //  --- + --- = 1, where a and b are semi-major axes 2 and 1 respectively (ie. the limits)
            //  a^b^2
            // Do the math and it should be clear.

            var swingLimit = swingSpan1; // if xEllipse == 0, just use axis b (1)
            if (Math.abs(xEllipse) > 0.0000001) // Small epsilon
            {
                var surfaceSlope2 = (yEllipse * yEllipse) / (xEllipse * xEllipse);
                var norm = (1 / (swingSpan2 * swingSpan2)) + (surfaceSlope2 / (swingSpan1 * swingSpan1));
                var swingLimit2 = (1 + surfaceSlope2) / norm;
                swingLimit = Math.sqrt(swingLimit2);
            }

            // convert into point in constraint space:
            // note: twist is x-axis, swing 1 and 2 are along the z and y axes respectively
            var vSwingAxis = md.v3Build(0, xEllipse, -yEllipse);
            var qSwing = md.quatFromAxisRotation(vSwingAxis, swingLimit);
            var vPointInConstraintSpace = md.v3Build(length, 0, 0);
            return md.quatTransformVector(qSwing, vPointInConstraintSpace);
        }

        // Assumes 3x3 matrix
        function matrixToEulerXYZ(mat)
        {
            var xyz = [];
            xyz.length = 3;
            var fi = mat[2];
            if (fi < 1.0)
            {
                if (fi > -1.0)
                {
                    xyz[0] = Math.atan2(-mat[5], mat[8]);
                    xyz[1] = Math.sin(mat[2]);
                    xyz[2] = Math.atan2(-mat[1], mat[0]);
                }
                else
                {
                    // WARNING.  Not unique.  XA - ZA = -atan2(r10,r11)
                    xyz[0] = -Math.atan2(mat[3], mat[4]);
                    xyz[1] = -1.57079633;
                    xyz[2] = 0.0;
                }
            }
            else
            {
                // WARNING.  Not unique.  XAngle + ZAngle = atan2(r10,r11)
                xyz[0] = Math.atan2(mat[3], mat[4]);
                xyz[1] = 1.57079633;
                xyz[2] = 0.0;
            }
            return xyz;
        }

        function drawConeFn(tr, swingSpan1, swingSpan2, scale)
        {
            setupGd();

            if (!scale)
            {
                scale = 3;
            }
            var nSegments = 32;
            var angleInRadians = 6.28318531 * ((nSegments - 1) / nSegments);
            var pos = md.m43Pos(tr);

            var writer = gd.beginDraw(
                gd.PRIMITIVE_LINES,
                (2 * nSegments) + ((nSegments / (nSegments / 8)) * 2),
                ['FLOAT3',   'FLOAT3'],
                posColSem);

            var pPrev = pointForAngleFn(angleInRadians, scale, swingSpan1, swingSpan2);
            pPrev = md.v3Add(pos, md.m43TransformVector(tr, pPrev, pPrev), pPrev);

            for (var i = 0; i < nSegments; i += 1)
            {
                angleInRadians = 6.28318531 * (i / nSegments);
                var pCur = pointForAngleFn(angleInRadians, scale, swingSpan1, swingSpan2);
                pCur = md.v3Add(pos, md.m43TransformVector(tr, pCur, pCur), pCur);

                drawLineFn(writer, pPrev, pCur, [0, 0, 0]);

                if (i % (nSegments / 8) === 0)
                {
                    drawLineFn(writer, pos, pCur, [0, 0, 0]);
                }

                pPrev = pCur;
            }

            gd.endDraw(writer);
        }

        function drawBoxFn(bbMin, bbMax, tr, color)
        {
            var hx = (Math.abs(bbMin[0]) + Math.abs(bbMax[0])) / 2;
            var hy = (Math.abs(bbMin[1]) + Math.abs(bbMax[1])) / 2;
            var hz = (Math.abs(bbMin[2]) + Math.abs(bbMax[2])) / 2;

            var p0 = md.m43TransformPoint(tr, md.v3Build(- hx, - hy, - hz));
            var p1 = md.m43TransformPoint(tr, md.v3Build(+ hx, - hy, - hz));
            var p2 = md.m43TransformPoint(tr, md.v3Build(+ hx, - hy, + hz));
            var p3 = md.m43TransformPoint(tr, md.v3Build(- hx, - hy, + hz));
            var p4 = md.m43TransformPoint(tr, md.v3Build(- hx, + hy, - hz));
            var p5 = md.m43TransformPoint(tr, md.v3Build(+ hx, + hy, - hz));
            var p6 = md.m43TransformPoint(tr, md.v3Build(+ hx, + hy, + hz));
            var p7 = md.m43TransformPoint(tr, md.v3Build(- hx, + hy, + hz));

            setupGd();

            var writer = gd.beginDraw(gd.PRIMITIVE_LINES,
                                      24,
                                      ['FLOAT3',   'FLOAT3'],
                                      posColSem);

            drawLineFn(writer, p0, p1, color);
            drawLineFn(writer, p1, p2, color);
            drawLineFn(writer, p2, p3, color);
            drawLineFn(writer, p3, p0, color);
            drawLineFn(writer, p0, p4, color);
            drawLineFn(writer, p1, p5, color);
            drawLineFn(writer, p2, p6, color);
            drawLineFn(writer, p3, p7, color);
            drawLineFn(writer, p4, p5, color);
            drawLineFn(writer, p5, p6, color);
            drawLineFn(writer, p6, p7, color);
            drawLineFn(writer, p7, p4, color);

            gd.endDraw(writer);
        }

        debug.drawSliderConstraintLimits = function drawSliderConstraintLimitsFn(constraint, scale)
        {
            if (!constraint || constraint.type !== "SLIDER")
            {
                return;
            }

            if (!scale)
            {
                scale = 3;
            }

            var trA = md.m43Mul(constraint.transformA, constraint.bodyA.transform, trA);
            drawTransform(trA, scale); // FrameA

            var trB = md.m43Mul(constraint.transformB, constraint.bodyB.transform, trB);
            drawTransform(trB, scale); // FrameB

            var basis = trA.slice(0, 9);
            var pos = md.m43Pos(trA);
            var linearLower = md.v3Build(constraint.linearLowerLimit, 0, 0);
            var linearUpper = md.v3Build(constraint.linearUpperLimit, 0, 0);
            var li_min = md.v3Add(md.m43TransformVector(trA, linearLower), pos, li_min);
            var li_max = md.v3Add(md.m43TransformVector(trA, linearUpper), pos, li_max);

            drawSingleLineFn(li_min, li_max, [0, 0, 0]);

            var normal = basis.slice(0, 3);
            var axis = basis.slice(3, 6);
            var a_min = constraint.angularLowerLimit;
            var a_max = constraint.angularUpperLimit;
            var center = md.m43Pos(trB);
            drawArcFn(center, normal, axis, scale, scale, a_min, a_max, [0, 0, 0]);
        };

        debug.drawHingeConstraintLimits = function drawHingeConstraintLimitsFn(constraint, scale)
        {
            if (!constraint || constraint.type !== "HINGE")
            {
                return;
            }

            if (!scale)
            {
                scale = 3;
            }

            var trA = md.m43Mul(constraint.transformA, constraint.bodyA.transform);
            var trB = null;

            if (constraint.bodyB && constraint.transformB)
            {
                trB = md.m43Mul(constraint.transformB, constraint.bodyB.transform);
            }
            else
            {
                trB = constraint.transformB;
            }

            drawTransform(trA, scale); // FrameA
            drawTransform(trB, scale); // FrameB

            var basis = trB.slice(0, 9);
            var minAng = constraint.low;
            var maxAng = constraint.high;

            if (minAng === maxAng)
            {
                return;
            }

            var center = md.m43Pos(trB);
            var normal = basis.slice(6, 9); //  Column 2
            var axis = basis.slice(0, 3); // Column 0
            drawArcFn(center, normal, axis, scale, scale, minAng, maxAng, [0, 0, 0]);
        };

        debug.drawP2PConstraintLimits = function drawP2PConstraintLimitsFn(constraint, scale)
        {
            if (!constraint || constraint.type !== "POINT2POINT")
            {
                return;
            }

            if (!scale)
            {
                scale = 3;
            }

            var pivot = constraint.pivotA;
            pivot = md.v3Add(md.m43TransformVector(constraint.bodyA.transform, pivot, pivot),
                             md.m43Pos(constraint.bodyA.transform), pivot);

            var tr = md.m43BuildTranslation(pivot, tr);
            drawTransform(tr, scale);

            // that ideally should draw the same frame
            pivot = constraint.pivotB;
            pivot = md.v3Add(md.m43TransformVector(constraint.bodyB.transform, pivot, pivot),
                             md.m43Pos(constraint.bodyB.transform), pivot);

            md.m43SetPos(tr, pivot);
            drawTransform(tr, scale);
        };

        debug.drawConeTwistConstraintLimits = function drawConeTwistConstraintLimitsFn(constraint, scale)
        {
            if (!constraint || constraint.type !== "CONETWIST")
            {
                return;
            }

            if (!scale)
            {
                scale = 3;
            }

            var trA = md.m43Mul(constraint.transformA, constraint.bodyA.transform, trA);
            drawTransform(trA, scale);

            var trB = md.m43Mul(constraint.transformB, constraint.bodyB.transform, trB);
            drawTransform(trB, scale);

            drawConeFn(trB, constraint.swingSpan1, constraint.swingSpan2, scale);

            var tws = constraint.twistSpan;
            var twa = constraint.twistAngle;

            var pivot = md.m43Pos(trA);
            var normal = trA.slice(0, 3); // tr.getBasis().getColumn(0);
            var axis1 = trA.slice(3, 6); // tr.getBasis().getColumn(1);
            drawArcFn(pivot, normal, axis1, scale, scale, -twa - tws, -twa + tws, [0, 0, 0]);
        };

        debug.draw6DOFConstraintLimits = function draw6DOFConstraintLimitsFn(constraint, scale)
        {
            if (!constraint || constraint.type !== "D6")
            {
                return;
            }

            if (!scale)
            {
                scale = 3;
            }

            var trA = md.m43Mul(constraint.transformA, constraint.bodyA.transform, trA);
            drawTransform(trA, scale);

            var trB = md.m43Mul(constraint.transformB, constraint.bodyB.transform, trB);
            drawTransform(trB, scale);

            var center = md.m43Pos(trB);

            var axis = trA.slice(3, 6);

            var basisA = md.m43InverseOrthonormal(trA).slice(0, 9);
            var basisB = trB.slice(0, 9);
            var eulerangles =  matrixToEulerXYZ(md.m33Mul(basisB, basisA, basisA));

            var ay = eulerangles[1]; // p6DOF->getAngle(1); - complicated
            var az = eulerangles[2]; // p6DOF->getAngle(2); - complicated
            var cy = Math.cos(ay);
            var sy = Math.sin(ay);
            var cz = Math.cos(az);
            var sz = Math.sin(az);
            var ref = md.v3Build((cy * cz * axis[0]) + (cy * sz * axis[1]) - (sy * axis[2]),
                                 (-sz * axis[0]) + (cz * axis[1]),
                                 (cz * sy * axis[0]) + (sz * sy * axis[1]) + (cy * axis[2]),
                                 ref);

            var normal = md.v3Neg(trB.slice(0, 3), normal);

            var minFi = constraint.angularLowerLimit[0];
		    var maxFi = constraint.angularUpperLimit[0];
            drawArcFn(center, normal, ref, scale, scale, minFi, maxFi, [0, 0, 0]);

            var bbMin = constraint.linearLowerLimit;
            var bbMax = constraint.linearUpperLimit;
            drawBoxFn(bbMin, bbMax, trA, [0, 0, 0]);
        };

        return debug;
    }
}
