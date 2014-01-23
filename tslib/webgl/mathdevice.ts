declare var WebGLMathDevice : MathDevice;
// Copyright (c) 2011-2013 Turbulenz Limited
/* global debug: false*/
/* global VMath: false*/
/* global WebGLMathDevice: true*/
WebGLMathDevice = VMath;

debug.evaluate(function debugSetupMathDevice () {

WebGLMathDevice =
{
    _vmath: VMath,

    version: VMath.version,
    precision: VMath.precision,
    FLOAT_MAX: VMath.FLOAT_MAX,

    select : VMath.select,
    reciprocal : VMath.reciprocal,
    truncate : VMath.truncate,

    v2BuildZero : VMath.v2BuildZero,
    v2BuildOne : VMath.v2BuildOne,
    v2BuildXAxis : VMath.v2BuildXAxis,
    v2BuildYAxis : VMath.v2BuildYAxis,

    v2Build : function v2Fn(a, b, dst?)
    {
        debug.assert(debug.isNumber(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2Build(a, b, dst);
    },

    v2Copy : VMath.v2Copy,

    v2Set : function v2SetFn(v, a)
    {
        debug.assert(debug.isMathType(v));
        debug.assert(debug.isNumber(a));
        return this._vmath.v2Set(v, a);
    },

    v2Neg : function v2NegFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2Neg(a, dst);
    },

    v2Add : function v2AddFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Add(a, b, dst);
    },

    v2Add3 : function v2Add3Fn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        return this._vmath.v2Add3(a, b, c, dst);
    },

    v2Add4 : function v2Add4Fn(a, b, c, d, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        debug.assert(debug.isMathType(d));
        return this._vmath.v2Add4(a, b, c, d, dst);
    },

    v2Sub : function v2SubFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Sub(a, b, dst);
    },

    v2Mul : function v2MulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Mul(a, b, dst);
    },

    v2MulAdd : function v2MulAddFn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        return this._vmath.v2MulAdd(a, b, c, dst);
    },

    v2Dot : function v2DotFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Dot(a, b);
    },

    v2PerpDot : function v2PerpDot(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2PerpDot(a, b);
    },

    v2LengthSq : function v2LengthSqFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2LengthSq(a);
    },

    v2Length : function v2LengthFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2Length(a);
    },

    v2Reciprocal : function v2ReciprocalFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2Reciprocal(a, dst);
    },

    v2Normalize : function v2NormalizeFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2Normalize(a, dst);
    },

    v2Abs : function v2AbsFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2Abs(a, dst);
    },

    v2Max : function v2MaxFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Max(a, b, dst);
    },

    v2Min : function v2MinFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Min(a, b, dst);
    },

    v2Equal : function v2EqualFn(a, b, precision?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Equal(a, b, precision);
    },

    v2MaskEqual : function v2MaskEqualFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2MaskEqual(a, b);
    },

    v2MaskLess : function v2MaskLessFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2MaskLess(a, b);

        return [(a[0] < b[0]),
                (a[1] < b[1])];
    },

    v2MaskGreater : function v2MaskGreaterFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2MaskGreater(a, b);

        return [(a[0] > b[0]),
                (a[1] > b[1])];
    },

    v2MaskGreaterEq : function v2MaskGreaterEqFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2MaskGreaterEq(a, b);

        return [(a[0] >= b[0]),
                (a[1] >= b[1])];
    },

    v2MaskNot : function v2MaskNotFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2MaskNot(a);

        return [!a[0],
                !a[1]];
    },

    v2MaskOr : function v2MaskOrFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2MaskOr(a, b);

        return [(a[0] || b[0]),
                (a[1] || b[1])];
    },

    v2MaskAnd : function v2MaskAndFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2MaskAnd(a, b);

        return [(a[0] && b[0]),
                (a[1] && b[1])];
    },

    v2Select : function v2SelectFn(m, a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v2Select(m, a, b, dst);
    },

    v2ScalarBuild : function v2ScalarBuildFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v2ScalarBuild(a, dst);
    },

    v2ScalarMax : function v2ScalarMaxFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2ScalarMax(a, b, dst);
    },

    v2ScalarMin : function v2ScalarMinFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2ScalarMin(a, b, dst);
    },

    v2ScalarAdd : function v2ScalarAddFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2ScalarAdd(a, b, dst);
    },

    v2ScalarSub : function v2ScalarSubFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2ScalarSub(a, b, dst);
    },

    v2ScalarMul : function v2ScalarMulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2ScalarMul(a, b, dst);
    },

    v2AddScalarMul : function v2AddScalarMulFn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(c));
        return this._vmath.v2AddScalarMul(a, b, c, dst);
    },

    v2EqualScalarMask : function v2EqualScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2EqualScalarMask(a, b);
    },

    v2LessScalarMask : function v2LessScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2LessScalarMask(a, b);
    },

    v2GreaterScalarMask : function v2GreaterScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2GreaterScalarMask(a, b);
    },

    v2GreaterEqScalarMask : function v2GreaterEqScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v2GreaterEqScalarMask(a, b);
    },

    v2Lerp : function v2LerpFn(a, b, t, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(t));
        return this._vmath.v2Lerp(a, b, t, dst);
    },

    // ------------------------------------------------------------------

    v3BuildZero : VMath.v3BuildZero,

    v3BuildOne  :VMath.v3BuildOne,

    v3BuildXAxis : VMath.v3BuildXAxis,

    v3BuildYAxis : VMath.v3BuildYAxis,

    v3BuildZAxis : VMath.v3BuildZAxis,

    v3Build : function v3Fn(a, b, c, dst?)
    {
        debug.assert(debug.isNumber(a));
        debug.assert(debug.isNumber(b));
        debug.assert(debug.isNumber(c));
        return this._vmath.v3Build(a, b, c, dst);
    },

    v3Copy : VMath.v3Copy,

    v3Set : function v3SetFn(v, a)
    {
        debug.assert(debug.isMathType(v));
        return this._vmath.v3Set(v, a);
    },

    v3Neg : function v3NegFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3Neg(a, dst);
    },

    v3Add : function v3AddFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Add(a, b, dst);
    },

    v3Add3 : function v3Add3Fn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        return this._vmath.v3Add3(a, b, c, dst);
    },

    v3Add4 : function v3Add4Fn(a, b, c, d, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        debug.assert(debug.isMathType(d));
        return this._vmath.v3Add4(a, b, c, d, dst);
    },

    v3Sub : function v3SubFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Sub(a, b, dst);
    },

    v3Mul : function v3MulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Mul(a, b, dst);
    },

    v3MulAdd : function v3MulAddFn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        return this._vmath.v3MulAdd(a, b, c, dst);
    },

    v3Dot : function v3DotFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Dot(a, b);
    },

    v3Cross : function v3CrossFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Cross(a, b, dst);
    },

    v3LengthSq : function v3LengthSqFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3LengthSq(a);
    },

    v3Length : function v3LengthFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3Length(a);
    },

    v3Reciprocal : function v3ReciprocalFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3Reciprocal(a, dst);
    },

    v3Normalize : function v3NormalizeFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3Normalize(a, dst);
    },

    v3Abs : function v3AbsFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3Abs(a, dst);
    },

    v3Max : function v3MaxFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Max(a, b, dst);
    },

    v3Min : function v3MinFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Min(a, b, dst);
    },

    v3Equal : function v3EqualFn(a, b, precision?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Equal(a, b, precision);
    },

    v3MaskEqual : function v3MaskEqualFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3MaskEqual(a, b);
    },

    v3MaskLess : function v3MaskLessFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3MaskLess(a, b);
    },

    v3MaskGreater : function v3MaskGreaterFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3MaskGreater(a, b);
    },

    v3MaskGreaterEq : function v3MaskGreaterEqFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3MaskGreaterEq(a, b);
    },

    v3MaskNot : function v3MaskNotFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v3MaskNot(a);
    },

    v3MaskOr : function v3MaskOrFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3MaskOr(a, b);
    },

    v3MaskAnd : function v3MaskAndFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3MaskAnd(a, b);
    },

    v3Select : function v3SelectFn(m, a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v3Select(m, a, b, dst);
    },

    v3ScalarBuild : function v3ScalarBuildFn(a, dst?)
    {
        debug.assert(debug.isNumber(a));
        return this._vmath.v3ScalarBuild(a, dst);
    },

    v3ScalarMax : function v3ScalarMaxFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3ScalarMax(a, b, dst);
    },

    v3ScalarMin : function v3ScalarMinFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3ScalarMin(a, b, dst);
    },

    v3ScalarAdd : function v3ScalarAddFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3ScalarAdd(a, b, dst);
    },

    v3ScalarSub : function v3ScalarSubFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3ScalarSub(a, b, dst);
    },

    v3ScalarMul : function v3ScalarMulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3ScalarMul(a, b, dst);
    },

    v3AddScalarMul : function v3AddScalarMulFn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(c));
        return this._vmath.v3AddScalarMul(a, b, c, dst);
    },

    v3EqualScalarMask : function v3EqualScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3EqualScalarMask(a, b);
    },

    v3LessScalarMask : function v3LessScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3LessScalarMask(a, b);
    },

    v3GreaterScalarMask : function v3GreaterScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3GreaterScalarMask(a, b);
    },

    v3GreaterEqScalarMask : function v3GreaterEqScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v3GreaterEqScalarMask(a, b);
    },

    v3Lerp : function v3LerpFn(a, b, t, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(t));
        return this._vmath.v3Lerp(a, b, t, dst);
    },

    // ------------------------------------------------------------------

    v4BuildZero : VMath.v4BuildZero,

    v4BuildOne  :VMath.v4BuildOne,

    v4Build : function v4BuildFn(a, b, c, d, dst?)
    {
        debug.assert(debug.isNumber(a));
        debug.assert(debug.isNumber(b));
        debug.assert(debug.isNumber(c));
        debug.assert(debug.isNumber(d));
        return this._vmath.v4Build(a, b, c, d, dst);
    },

    v4Copy : VMath.v4Copy,

    v4Set : function v4SetFn(v, a)
    {
        debug.assert(debug.isMathType(v));
        return this._vmath.v4Set(v, a);
    },

    v4Neg : function v4NegFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4Neg(a, dst);
    },

    v4Add : function v4AddFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Add(a, b, dst);
    },

    v4Add3 : function v4Add3Fn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        return this._vmath.v4Add3(a, b, c, dst);
    },

    v4Add4 : function v4Add4Fn(a, b, c, d, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        debug.assert(debug.isMathType(d));
        return this._vmath.v4Add4(a, b, c, d, dst);
    },

    v4Sub : function v4SubFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Sub(a, b, dst);
    },

    v4Mul : function v4MulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Mul(a, b, dst);
    },

    v4MulAdd : function v4MulAddFn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isMathType(c));
        return this._vmath.v4MulAdd(a, b, c, dst);
    },

    v4Dot : function v4DotFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Dot(a, b);
    },

    v4LengthSq : function v4LengthSqFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4LengthSq(a);
    },

    v4Length : function v4LengthFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4Length(a);
    },

    v4Reciprocal : function v4ReciprocalFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4Reciprocal(a, dst);
    },

    v4Normalize : function v4NormalizeFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4Normalize(a, dst);
    },

    v4Abs : function v4AbsFn(a, dst?)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4Abs(a, dst);
    },

    v4Max : function v4MaxFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Max(a, b, dst);
    },

    v4Min : function v4MinFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Min(a, b, dst);
    },

    v4Equal : function v4EqualFn(a, b, precision?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(precision));
        return this._vmath.v4Equal(a, b, precision);
    },

    v4MaskEqual : function v4MaskEqualFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4MaskEqual(a, b);
    },

    v4MaskLess : function v4MaskLessFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4MaskLess(a, b);
    },

    v4MaskGreater : function v4MaskGreaterFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4MaskGreater(a, b);
    },

    v4MaskGreaterEq : function v4MaskGreaterEqFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4MaskGreaterEq(a, b);
    },

    v4MaskNot : function v4MaskNotFn(a)
    {
        debug.assert(debug.isMathType(a));
        return this._vmath.v4MaskNot(a);
    },

    v4MaskOr : function v4MaskOrFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4MaskOr(a, b);
    },

    v4MaskAnd : function v4MaskAndFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4MaskAnd(a, b);
    },

    v4Many : function v4ManyFn(m)
    {
        return this._vmath.v4Many(m);
    },

    v4MaskAll : function v4MaskAllFn(m)
    {
        return this._vmath.v4MaskAll(m);
    },

    v4Select : function v4SelectFn(m, a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.v4Select(m, a, b, dst);
    },

    v4ScalarBuild : function v4ScalarBuildFn(a, dst?)
    {
        debug.assert(debug.isNumber(a));
        return this._vmath.v4ScalarBuild(a, dst);
    },

    v4ScalarMax : function v4ScalarMaxFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4ScalarMax(a, b, dst);
    },

    v4ScalarMin : function v4ScalarMinFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4ScalarMin(a, b, dst);
    },

    v4ScalarAdd : function v4ScalarAddFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4ScalarAdd(a, b, dst);
    },

    v4ScalarSub : function v4ScalarSubFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4ScalarSub(a, b, dst);
    },

    v4ScalarMul : function v4ScalarMulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4ScalarMul(a, b, dst);
    },

    v4AddScalarMul : function v4AddScalarMulFn(a, b, c, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(c));
        return this._vmath.v4AddScalarMul(a, b, c, dst);
    },

    v4ScalarEqual : function v4ScalarEqualFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4ScalarEqual(a, b);
    },

    v4EqualScalarMask : function v4EqualScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4EqualScalarMask(a, b);
    },

    v4LessScalarMask : function v4LessScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4LessScalarMask(a, b);
    },

    v4GreaterScalarMask : function v4GreaterScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4GreaterScalarMask(a, b);
    },

    v4GreaterEqScalarMask : function v4GreaterEqScalarMaskFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isNumber(b));
        return this._vmath.v4GreaterEqScalarMask(a, b);
    },

    v4Lerp : function v4LerpFn(a, b, t, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(t));
        return this._vmath.v4Lerp(a, b, t, dst);
    },

    // ------------------------------------------------------------------

    aabbBuild : function aabbBuildFn(a0, a1, a2, a3, a4, a5, dst?)
    {
        debug.assert(debug.isNumber(a0));
        debug.assert(debug.isNumber(a1));
        debug.assert(debug.isNumber(a2));
        debug.assert(debug.isNumber(a3));
        debug.assert(debug.isNumber(a4));
        debug.assert(debug.isNumber(a5));
        return this._vmath.aabbBuild(a0, a1, a2, a3, a4, a5, dst);
    },

    aabbBuildEmpty : VMath.aabbBuildEmpty,

    aabbCopy : VMath.aabbCopy,

    aabbSet : VMath.aabbSet,

    aabbIsEmpty : VMath.aabbIsEmpty,

    aabbMin : function aabbMinFn(aabb, dst?)
    {
        debug.assert(debug.isMathType(aabb));
        return this._vmath.aabbMin(aabb, dst);
    },

    aabbMax : function aabbMaxFn(aabb, dst?)
    {
        debug.assert(debug.isMathType(aabb));
        return this._vmath.aabbMax(aabb, dst);
    },

    aabbGetCenterAndHalf : function aabbGetCenterAndHalfFn(aabb, center, half)
    {
        debug.assert(debug.isMathType(aabb));
        debug.assert(debug.isMathType(center));
        debug.assert(debug.isMathType(half));
        return this._vmath.aabbGetCenterAndHalf(aabb, center, half);
    },

    aabbIsInsidePlanes : function aabbIsInsidePlanesFn(aabb, planes)
    {
        debug.assert(debug.isMathType(aabb));
        return this._vmath.aabbIsInsidePlanes(aabb, planes);
    },

    aabbIsFullyInsidePlanes : function aabbIsFullyInsidePlanesFn(aabb, planes)
    {
        debug.assert(debug.isMathType(aabb));
        return this._vmath.aabbIsFullyInsidePlanes(aabb, planes);
    },

    aabbUnion : function aabbUnionFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.aabbUnion(a, b, dst);
    },

    aabbUnionArray : VMath.aabbUnionArray,

    aabbAddPoints : function aabbAddPointFn(aabb, ps)
    {
        debug.assert(debug.isMathType(aabb));
        return this._vmath.aabbAddPoints(aabb, ps);
    },

    aabbTransform : function aabbTransformFn(aabb, matrix, dst?)
    {
        debug.assert(debug.isMathType(aabb));
        debug.assert(debug.isMathType(matrix));
        return this._vmath.aabbTransform(aabb, matrix, dst);
    },

    aabbIntercept : function aabbInterceptFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.aabbIntercept(a, b, dst);
    },

    aabbOverlaps : function aabbOverlapsFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.aabbOverlaps(a, b);
    },

    aabbSphereOverlaps : function aabbSphereOverlapsFn(aabb, center, radius)
    {
        debug.assert(debug.isMathType(aabb));
        debug.assert(debug.isMathType(center));
        debug.assert(debug.isNumber(radius));
        return this._vmath.aabbSphereOverlaps(aabb, center, radius);
    },

    aabbIsInside : function aabbIsInsideFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.aabbIsInside(a, b);
    },

    aabbTestInside : function aabbTestInsideFn(a, b)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.aabbTestInside(a, b);
    },

    // ------------------------------------------------------------------

    m33BuildIdentity : VMath.m33BuildIdentity,

    m33Build : VMath.m33Build,

    m33Copy : VMath.m33Copy,

    m33FromAxisRotation : function m33FromAxisRotationFn(axis, angle, dst?)
    {
        debug.assert(debug.isMathType(axis));
        debug.assert(debug.isNumber(angle));
        return this._vmath.m33FromAxisRotation(axis, angle, dst);
    },

    m33FromQuat: function m33FromQuatFn(q, dst?)
    {
        debug.assert(debug.isMathType(q));
        return this._vmath.m33FromQuat(q, dst);
    },

    m33Right : function m33RightFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33Right(m, dst);
    },

    m33Up : function m33UpFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33Up(m, dst);
    },

    m33At : function m33AtFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33At(m, dst);
    },

    m33SetRight : function m33SetRightFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m33SetRight(m, v);
    },

    m33SetUp : function m33SetUpFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m33SetUp(m, v);
    },

    m33SetAt : function m33SetAtFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m33SetAt(m, v);
    },

    m33Transpose : function m33TransposeFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33Transpose(m, dst);
    },

    m33Determinant : function m33DeterminantFn(m)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33Determinant(m);
    },

    m33Inverse : function m33InverseFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33Inverse(m, dst);
    },

    m33InverseTranspose : function m33InverseTransposeFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m33InverseTranspose(m, dst);
    },

    m33Mul : function m33MulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m33Mul(a, b, dst);
    },

    m33Transform : function m33TransformFn(m, v, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m33Transform(m, v, dst);
    },

    m33Equal : function m33EqualFn(a, b, precision?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        debug.assert(debug.isNumber(precision));
        return this._vmath.m33Equal(a, b, precision);
    },

    m33MulM43 : function m33MulM43Fn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m33MulM43(a, b, dst);
    },

    m33MulM44 : function m33MulM44Fn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m33MulM44(a, b, dst);
    },

    m33ScalarAdd : function m33ScalarAddFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m33ScalarAdd(m, s, dst);
    },

    m33ScalarSub : function m33ScalarSubFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m33ScalarSub(m, s, dst);
    },

    m33ScalarMul : function m33ScalarMulFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m33ScalarMul(m, s, dst);
    },

    // ------------------------------------------------------------------

    m34BuildIdentity : VMath.m34BuildIdentity,

    m34Pos : function m34PosFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m34Pos(m, dst);
    },

    m34Scale : function m34ScaleFn(m, scale, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(scale));
        return this._vmath.m34Scale(m, scale, dst);
    },

    // ------------------------------------------------------------------

    m43BuildIdentity : VMath.m43BuildIdentity,

    m43Build : VMath.m43Build,

    m43BuildTranslation : VMath.m43BuildTranslation,

    m43Copy : VMath.m43Copy,

    m43FromM33V3: function m43FromM33V3Fn(m, v, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43FromM33V3(m, v, dst);
    },

    m43FromAxisRotation : function m43FromAxisRotationFn(axis, angle, dst?)
    {
        debug.assert(debug.isMathType(axis));
        debug.assert(debug.isNumber(angle));
        return this._vmath.m43FromAxisRotation(axis, angle, dst);
    },

    m43FromQuatPos : function m43FromQuatPosFn(qp, dst?)
    {
        debug.assert(debug.isMathType(qp));
        return this._vmath.m43FromQuatPos(qp, dst);
    },

    m43FromRTS : function m43FromRTSFn(quat, pos, scale, dst?)
    {
        debug.assert(debug.isMathType(quat));
        debug.assert(debug.isMathType(pos));
        debug.assert(debug.isMathType(scale));
        return this._vmath.m43FromRTS(quat, pos, scale, dst);
    },

    m43FromRT : function m43FromRTFn(quat, pos, dst?)
    {
        debug.assert(debug.isMathType(quat));
        debug.assert(debug.isMathType(pos));
        return this._vmath.m43FromRT(quat, pos, dst);
    },

    m43Right : function m43RightFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Right(m, dst);
    },

    m43Up : function m43UpFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Up(m, dst);
    },

    m43At : function m43AtFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43At(m, dst);
    },

    m43Pos : function m43PosFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Pos(m, dst);
    },

    m43SetRight : function m43SetRightFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43SetRight(m, v);
    },

    m43SetUp : function m43SetUpFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43SetUp(m, v);
    },

    m43SetAt : function m43SetAtFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43SetAt(m, v);
    },

    m43SetPos : function m43SetPosFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43SetPos(m, v);
    },

    m43SetAxisRotation : function m43SetAxisRotationFn(m, axis, angle)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(axis));
        debug.assert(debug.isNumber(angle));
        return this._vmath.m43SetAxisRotation(m, axis, angle);
    },

    m43InverseOrthonormal : function m43InverseOrthonormalFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43InverseOrthonormal(m, dst);
    },

    m43Orthonormalize : function m43OrthonormalizeFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Orthonormalize(m, dst);
    },

    m43Determinant : function m43DeterminantFn(m)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Determinant(m);
    },

    m43Inverse : function m43InverseFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Inverse(m, dst);
    },

    m43Translate : function m43TranslateFn(matrix, pos)
    {
        debug.assert(debug.isMathType(matrix));
        debug.assert(debug.isMathType(pos));
        return this._vmath.m43Translate(matrix, pos);
    },

    m43Scale : function m43ScaleFn(m, scale, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(scale));
        return this._vmath.m43Scale(m, scale, dst);
    },

    m43TransformVector : function m43TransformVectorFn(m, v, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43TransformVector(m, v, dst);
    },

    m43TransformPoint : function m43TransformPointFn(m, v, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m43TransformPoint(m, v, dst);
    },

    m43Mul : function m43MulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m43Mul(a, b, dst);
    },

    m43MulM44 : function m43MulM44Fn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m43MulM44(a, b, dst);
    },

    m43Transpose : function m43TransposeFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m43Transpose(m, dst);
    },

    m43MulTranspose: function m43MulTransposeFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m43MulTranspose(a, b, dst);
    },

    m43Offset: function m43OffsetFn(m, o, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(o));
        return this._vmath.m43Offset(m, o, dst);
    },

    m43NegOffset: function m43NegOffsetFn(m, o, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(o));
        return this._vmath.m43NegOffset(m, o, dst);
    },

    m43InverseTransposeProjection: function m43InverseTransposeProjectionFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(s));
        return this._vmath.m43InverseTransposeProjection(m, s, dst);
    },

    m43ScalarAdd : function m43ScalarAddFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m43ScalarAdd(m, s, dst);
    },

    m43ScalarSub : function m43ScalarSubFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m43ScalarSub(m, s, dst);
    },

    m43ScalarMul : function m43ScalarMulFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m43ScalarMul(m, s, dst);
    },

    // ------------------------------------------------------------------

    m44BuildIdentity : VMath.m44BuildIdentity,

    m44Build : VMath.m44Build,

    m44Copy : VMath.m44Copy,

    m44Right : function m44RightFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m44Right(m, dst);
    },

    m44Up : function m44UpFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m44Up(m, dst);
    },

    m44At : function m44AtFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m44At(m, dst);
    },

    m44Pos : function m44PosFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m44Pos(m, dst);
    },

    m44SetRight : function m44SetRightFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m44SetRight(m, v);
    },

    m44SetUp : function m44SetUpFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m44SetUp(m, v);
    },

    m44SetAt : function m44SetAtFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m44SetAt(m, v);
    },

    m44SetPos : function m44SetPosFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m44SetPos(m, v);
    },

    m44Translate : function m44TranslateFn(m, v)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m44Translate(m, v);
    },

    m44Scale : function m44ScaleFn(m, scale, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(scale));
        return this._vmath.m44Scale(m, scale, dst);
    },

    m44Transform : function m44TransformFn(m, v, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isMathType(v));
        return this._vmath.m44Transform(m, v, dst);
    },

    m44Mul : function m44MulFn(a, b, dst?)
    {
        debug.assert(debug.isMathType(a));
        debug.assert(debug.isMathType(b));
        return this._vmath.m44Mul(a, b, dst);
    },

    m44Inverse : function m44InverseFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m44Inverse(m, dst);
    },

    m44Transpose : function m44TransposeFn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.m44Transpose(m, dst);
    },

    m44ScalarAdd : function m44ScalarAddFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m44ScalarAdd(m, s, dst);
    },

    m44ScalarSub : function m44ScalarSubFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m44ScalarSub(m, s, dst);
    },

    m44ScalarMul : function m44ScalarMulFn(m, s, dst?)
    {
        debug.assert(debug.isMathType(m));
        debug.assert(debug.isNumber(s));
        return this._vmath.m44ScalarMul(m, s, dst);
    },

    // ------------------------------------------------------------------

    quatBuild : VMath.quatBuild,

    quatCopy : VMath.quatCopy,

    quatIsSimilar : function quatIsSimilarFn(q1, q2, precision)
    {
        debug.assert(debug.isMathType(q1));
        debug.assert(debug.isMathType(q2));
        debug.assert(debug.isNumber(precision));
        return this._vmath.quatIsSimilar(q1, q2, precision);
    },

    quatLength : function quatLengthFn(q)
    {
        debug.assert(debug.isMathType(q));
        return this._vmath.quatLength(q);
    },

    quatDot : function quatDotFn(q1, q2)
    {
        debug.assert(debug.isMathType(q1));
        debug.assert(debug.isMathType(q2));
        return this._vmath.quatDot(q1, q2);
    },

    quatMul : function quatMulFn(q1, q2, dst?)
    {
        debug.assert(debug.isMathType(q1));
        debug.assert(debug.isMathType(q2));
        return this._vmath.quatMul(q1, q2, dst);
    },

    quatMulTranslate : function quatMulTranslateFn(qa, va, qb, vb, qr, vr)
    {
        debug.assert(debug.isMathType(qa));
        debug.assert(debug.isMathType(va));
        debug.assert(debug.isMathType(qb));
        debug.assert(debug.isMathType(vb));
        debug.assert(debug.isMathType(qr));
        debug.assert(debug.isMathType(vr));
        return this._vmath.quatMulTranslate(qa, va, qb, vb, qr, vr);
    },

    quatNormalize : function quatNormalizeFn(q, dst?)
    {
        debug.assert(debug.isMathType(q));
        return this._vmath.quatNormalize(q, dst);
    },

    quatConjugate : function quatConjugateFn(q, dst?)
    {
        debug.assert(debug.isMathType(q));
        return this._vmath.quatConjugate(q, dst);
    },

    quatLerp : function quatLerpFn(q1, q2, t, dst?)
    {
        debug.assert(debug.isMathType(q1));
        debug.assert(debug.isMathType(q2));
        debug.assert(debug.isNumber(t));
        return this._vmath.quatLerp(q1, q2, t, dst);
    },

    cosMinSlerpAngle : VMath.cosMinSlerpAngle,

    quatSlerp : function quatSlerpFn(q1, q2, t, dst?)
    {
        debug.assert(debug.isMathType(q1));
        debug.assert(debug.isMathType(q2));
        debug.assert(debug.isNumber(t));
        return this._vmath.quatSlerp(q1, q2, t, dst);
    },

    quatFromM43 : function quatFromM43Fn(m, dst?)
    {
        debug.assert(debug.isMathType(m));
        return this._vmath.quatFromM43(m, dst);
    },

    quatFromAxisRotation : function quatFromAxisRotationFn(axis, angle, dst?)
    {
        debug.assert(debug.isMathType(axis));
        debug.assert(debug.isNumber(angle));
        return this._vmath.quatFromAxisRotation(axis, angle, dst);
    },

    quatToAxisRotation : function quatToAxisRotation(q, dst?)
    {
        debug.assert(debug.isMathType(q));
        return this._vmath.quatToAxisRotation(q, dst);
    },

    quatTransformVector : function quatTransformVectorFn(q, v, dst?)
    {
        debug.assert(debug.isMathType(q));
        debug.assert(debug.isMathType(v));
        return this._vmath.quatTransformVector(q, v, dst);
    },

    quatEqual : function quatEqual(q1, q2, precision?)
    {
        debug.assert(debug.isMathType(q1));
        debug.assert(debug.isMathType(q2));
        debug.assert(debug.isNumber(precision));
        return this._vmath.quatEqual(q1, q2, precision);
    },

    quatPosBuild : function quatPosBuildFn(x, y, z, w, px, py, pz, dst?)
    {
        if (arguments.length < 7)
        {
            debug.assert(debug.isMathType(x));
            debug.assert(debug.isMathType(y));
            return this._vmath.quatPosBuild(x, y, z);
        }
        return this._vmath.quatPosBuild(x, y, z, w, px, py, pz, dst);
    },

    quatPosTransformVector : function quatPosTransformVectorFn(qp, n, dst?)
    {
        debug.assert(debug.isMathType(qp));
        return this._vmath.quatPosTransformVector(qp, n, dst);
    },

    quatPosTransformPoint : function quatPosTransformPointFn(qp, p)
    {
        debug.assert(debug.isMathType(qp));
        return this._vmath.quatPosTransformPoint(qp, p);
    },

    quatPosMul : function quatPosMulFn(qp1, qp2)
    {
        debug.assert(debug.isMathType(qp1));
        debug.assert(debug.isMathType(qp2));
        return this._vmath.quatPosMul(qp1, qp2);
    },

    // ------------------------------------------------------------------

    isVisibleBox : VMath.isVisibleBox,
    isVisibleBoxOrigin : VMath.isVisibleBoxOrigin,
    isVisibleSphere : VMath.isVisibleSphere,
    isVisibleSphereOrigin : VMath.isVisibleSphereOrigin,
    isVisibleSphereUnit : VMath.isVisibleSphereUnit,
    transformBox : VMath.transformBox,
    planeNormalize : VMath.planeNormalize,
    extractFrustumPlanes : VMath.extractFrustumPlanes,
    isInsidePlanesPoint : VMath.isInsidePlanesPoint,
    isInsidePlanesSphere : VMath.isInsidePlanesSphere,
    isInsidePlanesBox : VMath.isInsidePlanesBox,
    extractIntersectingPlanes : VMath.extractIntersectingPlanes

};


});
