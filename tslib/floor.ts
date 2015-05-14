// Copyright (c) 2009-2014 Turbulenz Limited

class Floor
{
    /* tslint:disable:no-unused-variable */
    static version = 1;
    /* tslint:enable:no-unused-variable */

    render      : { (gd: GraphicsDevice, camera: Camera): void; };
    color       : any; // v4
    fadeToColor : any; // v4
    numLines    : number;

    _frustumPoints: any[];

    // Constructor function
    static create(gd: any, md: any): Floor
    {
        var f = new Floor();

        var technique = null;
        var primitive = gd.PRIMITIVE_LINES;
        var vertexFormats = [gd.VERTEXFORMAT_FLOAT2];
        var semantics = gd.createSemantics([gd.SEMANTIC_POSITION]);
        var techniqueParameters = gd.createTechniqueParameters({
            worldViewProjection: md.m44BuildIdentity(),
            color: md.v4BuildZero(),
            fadeToColor: md.v4BuildZero()
        });

        var maxValue = Number.MAX_VALUE;
        var abs = Math.abs;
        var floor = Math.floor;
        var ceil = Math.ceil;

        var frustumMinX = maxValue;
        var frustumMinZ = maxValue;
        var frustumMaxX = -maxValue;
        var frustumMaxZ = -maxValue;

        var addPoint = function addPointFn(px, pz)
        {
            if (frustumMinX > px)
            {
                frustumMinX = px;
            }
            if (frustumMinZ > pz)
            {
                frustumMinZ = pz;
            }
            if (frustumMaxX < px)
            {
                frustumMaxX = px;
            }
            if (frustumMaxZ < pz)
            {
                frustumMaxZ = pz;
            }
        };

        var intersect = function intersetFn(s, e)
        {
            var sy = s[1];
            var ey = e[1];
            var t;
            if (sy > 0.0)
            {
                if (ey < 0.0)
                {
                    t = ((-sy) / (ey - sy));
                    addPoint(s[0] + t * (e[0] - s[0]),
                             s[2] + t * (e[2] - s[2]));
                }
                else if (ey === 0.0)
                {
                    addPoint(e[0], e[2]);
                }
            }
            else if (sy < 0.0)
            {
                if (ey > 0.0)
                {
                    t = ((-sy) / (ey - sy));
                    addPoint(s[0] + t * (e[0] - s[0]),
                             s[2] + t * (e[2] - s[2]));
                }
                else if (ey === 0.0)
                {
                    addPoint(e[0], e[2]);
                }
            }
            else //if (sy == 0.0)
            {
                addPoint(s[0], s[2]);
                if (ey === 0.0)
                {
                    addPoint(e[0], e[2]);
                }
            }
        };

        f.render = function floorRenderFn(gd, camera)
        {
            // Calculate intersection with floor
            frustumMinX = maxValue;
            frustumMinZ = maxValue;
            frustumMaxX = -maxValue;
            frustumMaxZ = -maxValue;

            var frustumPoints = camera.getFrustumPoints(camera.farPlane,
                                                        camera.nearPlane,
                                                        (<Floor><any>this)._frustumPoints);
            intersect(frustumPoints[0], frustumPoints[4]);
            intersect(frustumPoints[1], frustumPoints[5]);
            intersect(frustumPoints[2], frustumPoints[6]);
            intersect(frustumPoints[3], frustumPoints[7]);
            intersect(frustumPoints[0], frustumPoints[3]);
            intersect(frustumPoints[1], frustumPoints[2]);
            intersect(frustumPoints[4], frustumPoints[7]);
            intersect(frustumPoints[5], frustumPoints[6]);

            if ((<Floor><any>this).numLines > 0 &&
                frustumMinX < frustumMaxX &&
                frustumMinZ < frustumMaxZ)
            {
                var halfNumLines = ((<Floor><any>this).numLines / 2.0);
                var farPlane = camera.farPlane;
                var metersPerLine = floor(floor(2.0 * farPlane) / floor(halfNumLines));
                if (metersPerLine === 0.0)
                {
                    metersPerLine = 1;
                }

                var cm = camera.matrix;
                var posX = (floor(cm[9] / metersPerLine) * metersPerLine);
                var posZ = (floor(cm[11] / metersPerLine) * metersPerLine);

                var vp = camera.viewProjectionMatrix;
                var vpRight = md.m44Right(vp);
                var vpAt = md.m44At(vp);
                var vpPos = md.m44Pos(vp);

                var worldRight = md.v4ScalarMul(vpRight, farPlane);
                var worldUp = md.m44Up(vp);
                var worldAt = md.v4ScalarMul(vpAt, farPlane);
                var worldPos = md.v4Add3(md.v4ScalarMul(vpRight, posX), md.v4ScalarMul(vpAt, posZ), vpPos);

                techniqueParameters.worldViewProjection = md.m44Build(worldRight,
                                                                      worldUp,
                                                                      worldAt,
                                                                      worldPos,
                                                                      techniqueParameters.worldViewProjection);

                techniqueParameters.color = md.v4Copy((<Floor><any>this).color,
                                                      techniqueParameters.color);

                techniqueParameters.fadeToColor = md.v4Copy((<Floor><any>this).fadeToColor,
                                                            techniqueParameters.fadeToColor);

                gd.setTechnique(technique);

                gd.setTechniqueParameters(techniqueParameters);

                // Try to draw minimum number of lines
                var invMetersPerLine = 1.0 / metersPerLine;
                var invMaxDistance = 1.0 / farPlane;
                var minX = ((floor(frustumMinX * invMetersPerLine) * metersPerLine) - posX) * invMaxDistance;
                var minZ = ((floor(frustumMinZ * invMetersPerLine) * metersPerLine) - posZ) * invMaxDistance;
                var maxX = ((ceil(frustumMaxX * invMetersPerLine) * metersPerLine) - posX) * invMaxDistance;
                var maxZ = ((ceil(frustumMaxZ * invMetersPerLine) * metersPerLine) - posZ) * invMaxDistance;

                var deltaLine = 2.0 / halfNumLines;
                var maxlinesX = (floor(halfNumLines * (abs(maxZ - minZ) / 2.0)) + 1);
                var maxlinesZ = (floor(halfNumLines * (abs(maxX - minX) / 2.0)) + 1);

                var writer;
                var current;
                var n;

                writer = gd.beginDraw(primitive,
                                      ((maxlinesX * 2) + (maxlinesZ * 2)),
                                      vertexFormats,
                                      semantics);
                if (writer)
                {
                    current = minZ;
                    for (n = 0; n < maxlinesX; n += 1)
                    {
                        writer(minX, current);
                        writer(maxX, current);
                        current += deltaLine;
                    }

                    current = minX;
                    for (n = 0; n < maxlinesZ; n += 1)
                    {
                        writer(current, minZ);
                        writer(current, maxZ);
                        current += deltaLine;
                    }

                    gd.endDraw(writer);

                    writer = null;
                }
            }
        };

        // Generated from assets/shaders/floor.cgfx
        var shader = gd.createShader(floor_cgfx);
        if (shader)
        {
            technique = shader.getTechnique(0);
            return f;
        }

        return null;
    }
}

Floor.prototype.color       = [0.1, 0.1, 1.0, 1.0],
Floor.prototype.fadeToColor = [0.95, 0.95, 1.0, 1.0],
Floor.prototype.numLines    = 200;
Floor.prototype._frustumPoints = [];
