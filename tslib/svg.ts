// Copyright (c) 2013 Turbulenz Limited

//
// SVGNode
//
interface SVGNode
{
    addChild: (child: SVGNode) => void;
    removeChild: (child: SVGNode) => void;
    getNumChildren: () => number;
    getChild: (i: number) => SVGNode;

    setFillStyle: (style: any) => void;
    getFillStyle: () => any;
    setStrokeStyle: (style: any) => void;
    getStrokeStyle: () => any;
    setLineWidth: (lineWidth: number) => void;
    getLineWidth: () => number;

    translate: (x: number, y: number) => void;
    scale: (x: number, y: number) => void;
    rotate: (angle: number, x: number, y: number) => void;
    transform: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    removeTransforms: () => void;

    draw: (ctx: CanvasContext) => void;
};

class SVGNodeTransform
{
    static Translate = 0;
    static Rotate    = 1;
    static Scale     = 2;
    static Matrix    = 3;
};

//
// SVGBaseNode
//
class SVGBaseNode implements SVGNode
{
    draw = < (ctx: CanvasContext) => void >null;

    _children: SVGNode[];
    _fill: any;
    _stroke: any;
    _lineWidth: number;
    _transforms: any[];

    constructor()
    {
        this.draw = this._drawShape;
    }

    addChild(child: SVGNode): void
    {
        var children = this._children;
        if (!children)
        {
            this._children = [child];
            if (this.draw === this._drawState)
            {
                this.draw = this._drawStateChildren;
            }
            else
            {
                debug.assert(this.draw === this._drawShape);
                this.draw = this._drawChildren;
            }
        }
        else
        {
            children.push(child);
        }
    }

    removeChild(child: SVGNode): void
    {
        var children = this._children;
        if (children)
        {
            var i = children.indexOf(child);
            if (i !== -1)
            {
                if (children.length === 1)
                {
                    this._children = <SVGNode[]>null;
                    if (this.draw === this._drawStateChildren)
                    {
                        this.draw = this._drawState;
                    }
                    else
                    {
                        debug.assert(this.draw === this._drawChildren);
                        this.draw = this._drawShape;
                    }
                }
                else
                {
                    children.splice(i, 1);
                }
            }
        }
    }

    getNumChildren(): number
    {
        return (this._children ? this._children.length : 0);
    }

    getChild(i: number): SVGNode
    {
        return (this._children ? this._children[i] : null);
    }

    setFillStyle(style: any): void
    {
        this._fill = style;
        this._checkState();
    }

    getFillStyle(): any
    {
        return this._fill;
    }

    setStrokeStyle(style: any): void
    {
        this._stroke = style;
        this._checkState();
    }

    getStrokeStyle(): any
    {
        return this._stroke;
    }

    setLineWidth(lineWidth: number): void
    {
        this._lineWidth = lineWidth;
        this._checkState();
    }

    getLineWidth(): number
    {
        return this._lineWidth;
    }

    translate(x: number, y: number): void
    {
        this._addTransform(SVGNodeTransform.Translate, [x, y]);
    }

    scale(x: number, y: number): void
    {
        this._addTransform(SVGNodeTransform.Scale, [x, y]);
    }

    rotate(angle: number, x: number, y: number): void
    {
        this._addTransform(SVGNodeTransform.Rotate, [angle, x, y]);
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void
    {
        this._addTransform(SVGNodeTransform.Matrix, [a, b, c, d, e, f]);
    }

    _addTransform(type: number, values: number[]): void
    {
        var transforms = this._transforms;
        if (!transforms)
        {
            this._transforms = [type, values];
        }
        else
        {
            var numTransforms = transforms.length;
            var lastValues = transforms[numTransforms - 1];
            var lastType = transforms[numTransforms - 2];
            var doAdd = false;
            if (lastType === SVGNodeTransform.Translate)
            {
                if (type === SVGNodeTransform.Translate)
                {
                    lastValues[0] += values[0];
                    lastValues[1] += values[1];
                }
                else
                {
                    doAdd = true;
                }
            }
            else if (lastType === SVGNodeTransform.Scale)
            {
                if (type === SVGNodeTransform.Scale)
                {
                    lastValues[0] *= values[0];
                    lastValues[1] *= values[1];
                }
                else
                {
                    doAdd = true;
                }
            }
            else if (lastType === SVGNodeTransform.Rotate)
            {
                if (type === SVGNodeTransform.Rotate &&
                    lastValues[1] === values[1] &&
                    lastValues[2] === values[2])
                {
                    lastValues[0] += values[0];
                }
                else
                {
                    doAdd = true;
                }
            }
            else if (lastType === SVGNodeTransform.Matrix)
            {
                if (type === SVGNodeTransform.Translate)
                {
                    lastValues[4] += values[0];
                    lastValues[5] += values[1];
                }
                else if (type === SVGNodeTransform.Scale)
                {
                    lastValues[0] *= values[0];
                    lastValues[1] *= values[0];
                    lastValues[2] *= values[1];
                    lastValues[3] *= values[1];
                }
                else
                {
                    doAdd = true;
                }
            }

            if (doAdd)
            {
                transforms.push(type, values);
            }
        }
        this._checkState();
    }

    removeTransforms(): void
    {
        this._transforms = null;
        this._checkState();
    }

    private _checkState(): void
    {
        if (!this._fill &&
            !this._stroke &&
            !this._lineWidth &&
            !this._transforms)
        {
            if (this.draw === this._drawState)
            {
                this.draw = this._drawShape;
            }
            else if ((this.draw === this._drawStateChildren))
            {
                debug.assert;
                this.draw = this._drawChildren;
            }
            else
            {
                debug.assert(this.draw === this._drawShape ||
                             this.draw === this._drawChildren);
            }
        }
        else
        {
            if (this.draw === this._drawShape)
            {
                this.draw = this._drawState;
            }
            else if (this.draw === this._drawChildren)
            {
                this.draw = this._drawStateChildren;
            }
            else
            {
                debug.assert(this.draw === this._drawState ||
                             this.draw === this._drawStateChildren);
            }
        }
    }

    _setState(ctx: CanvasContext): void
    {
        var fill = this._fill;
        if (fill)
        {
            ctx.fillStyle = fill;
        }

        var stroke = this._stroke;
        if (stroke)
        {
            ctx.strokeStyle = stroke;
        }

        var lineWidth = this._lineWidth;
        if (lineWidth)
        {
            ctx.lineWidth = lineWidth;
        }

        var transforms = this._transforms;
        if (transforms)
        {
            var numTransforms = transforms.length;
            for (var t = 0; t < numTransforms; t += 2)
            {
                var type = transforms[t];
                var arg = transforms[t + 1];
                var ax, ay;
                switch (type)
                {
                case SVGNodeTransform.Translate:
                    ax = arg[0];
                    ay = arg[1];
                    if (ax !== 0 || ay !== 0)
                    {
                        ctx.translate(ax, ay);
                    }
                    break;

                case SVGNodeTransform.Scale:
                    ax = arg[0];
                    ay = arg[1];
                    if (ax !== 1 || ay !== 1)
                    {
                        ctx.scale(ax, ay);
                    }
                    break;

                case SVGNodeTransform.Rotate:
                    var angle = arg[0];
                    ax = arg[1];
                    ay = arg[2];
                    if (angle !== 0)
                    {
                        if (ax !== 0 || ay !== 0)
                        {
                            ctx.translate(ax, ay);
                            ctx.rotate(angle);
                            ctx.translate(-ax, -ay);
                        }
                        else
                        {
                            ctx.rotate(angle);
                        }
                    }
                    break;

                case SVGNodeTransform.Matrix:
                    ctx.transform(arg[0], arg[1], arg[2],
                                  arg[3], arg[4], arg[5]);
                    break;

                default:
                    break;
                }
            }
        }
    }

    _drawState(ctx: CanvasContext): void
    {
        ctx.save();

        this._setState(ctx);

        this._drawShape(ctx);

        ctx.restore();
    }

    _drawStateChildren(ctx: CanvasContext): void
    {
        ctx.save();

        this._setState(ctx);

        this._drawShape(ctx);

        var children = this._children;
        var numChildren = children.length;
        for (var n = 0; n < numChildren; n += 1)
        {
            children[n].draw(ctx);
        }

        ctx.restore();
    }

    _drawChildren(ctx: CanvasContext): void
    {
        this._drawShape(ctx);

        var children = this._children;
        var numChildren = children.length;
        for (var n = 0; n < numChildren; n += 1)
        {
            children[n].draw(ctx);
        }
    }

    _drawShape(ctx: CanvasContext): void
    {
    }
};

//
// SVGEmptyNode
//
class SVGEmptyNode extends SVGBaseNode
{
    _drawState(ctx: CanvasContext): void
    {
    }

    _drawStateChildren(ctx: CanvasContext): void
    {
        ctx.save();

        this._setState(ctx);

        var children = this._children;
        var numChildren = children.length;
        for (var n = 0; n < numChildren; n += 1)
        {
            children[n].draw(ctx);
        }

        ctx.restore();
    }

    _drawChildren(ctx: CanvasContext): void
    {
        var children = this._children;
        var numChildren = children.length;
        for (var n = 0; n < numChildren; n += 1)
        {
            children[n].draw(ctx);
        }
    }
};

//
// SVGPathNode
//
class SVGPathNode extends SVGBaseNode
{
    path: string;

    constructor(path: string)
    {
        super();

        this.path = path;

        debug.assert(path);
    }

    _drawShape(ctx: CanvasContext): void
    {
        var path = this.path;

        ctx.beginPath();

        ctx.path(path);

        if (ctx.fillStyle !== 'none')
        {
            ctx.fill();
        }

        if (ctx.strokeStyle !== 'none')
        {
            ctx.stroke();
        }
    }
};

//
// SVGPolygonNode
//
class SVGPolygonNode extends SVGBaseNode
{
    points: any[];

    constructor(points: any[])
    {
        super();

        this.points = points;

        debug.assert(points);
    }

    _drawShape(ctx: CanvasContext): void
    {
        var values = this.points;
        var numValues = values.length;

        ctx.beginPath();

        ctx.moveTo(values[0], values[1]);

        for (var n = 2; n < numValues; n += 2)
        {
            ctx.lineTo(values[n], values[n + 1]);
        }

        ctx.closePath();

        if (ctx.fillStyle !== 'none')
        {
            ctx.fill();
        }

        if (ctx.strokeStyle !== 'none')
        {
            ctx.stroke();
        }
    }
};

//
// SVGPolylineNode
//
class SVGPolylineNode extends SVGBaseNode
{
    points: any[];

    constructor(points: any[])
    {
        super();

        this.points = points;

        debug.assert(points);
    }

    _drawShape(ctx: CanvasContext): void
    {
        var values = this.points;
        if (values)
        {
            var numValues = values.length;

            ctx.beginPath();

            ctx.moveTo(values[0], values[1]);

            for (var n = 2; n < numValues; n += 2)
            {
                ctx.lineTo(values[n], values[n + 1]);
            }

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }
};

//
// SVGRectNode
//
class SVGRectNode extends SVGBaseNode
{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, w: number, h: number)
    {
        super();

        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    _drawShape(ctx: CanvasContext): void
    {
        var x = this.x;
        var y = this.y;
        var width = this.width;
        var height = this.height;

        if (ctx.fillStyle !== 'none')
        {
            ctx.fillRect(x, y, width, height);
        }

        if (ctx.strokeStyle !== 'none')
        {
            ctx.strokeRect(x, y, width, height);
        }

    }
};

//
// SVGCircleNode
//
class SVGCircleNode extends SVGBaseNode
{
    x: number;
    y: number;
    radius: number;

    constructor(x: number, y: number, r: number)
    {
        super();

        this.x = x;
        this.y = y;
        this.radius = r;
    }

    _drawShape(ctx: CanvasContext): void
    {
        var radius = this.radius;
        if (0 < radius)
        {
            var x = this.x;
            var y = this.y;

            ctx.beginPath();

            ctx.arc(x, y, radius, 0, (2 * Math.PI));

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }
};

//
// SVGEllipseNode
//
class SVGEllipseNode extends SVGBaseNode
{
    x: number;
    y: number;
    radiusX: number;
    radiusY: number;

    constructor(x: number, y: number, rx: number, ry: number)
    {
        super();

        this.x = x;
        this.y = y;
        this.radiusX = rx;
        this.radiusY = ry;
    }

    _drawShape(ctx: CanvasContext): void
    {
        var rx = this.radiusX;
        var ry = this.radiusY;
        if (rx > 0 && ry > 0)
        {
            var x = this.x;
            var y = this.y;

            ctx.beginPath();

            if (rx !== ry)
            {
                var r, sx, sy;
                if (rx > ry)
                {
                    r = rx;
                    sx = 1;
                    sy = ry / rx;
                }
                else //if (rx < ry)
                {
                    r = ry;
                    sx = rx / ry;
                    sy = 1;
                }

                ctx.translate(x, y);
                ctx.scale(sx, sy);
                ctx.arc(0, 0, r, 0, (2 * Math.PI));
                ctx.scale(1 / sx, 1 / sy);
                ctx.translate(-x, -y);
            }
            else
            {
                ctx.arc(x, y, rx, 0, (2 * Math.PI));
            }

            if (ctx.fillStyle !== 'none')
            {
                ctx.fill();
            }

            if (ctx.strokeStyle !== 'none')
            {
                ctx.stroke();
            }
        }
    }
};

//
// SVGLineNode
//
class SVGLineNode extends SVGBaseNode
{
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number)
    {
        super();

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    _drawShape(ctx: CanvasContext): void
    {
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2;
        var y2 = this.y2;

        ctx.beginPath();

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        if (ctx.strokeStyle !== 'none')
        {
            ctx.stroke();
        }
    }
};
