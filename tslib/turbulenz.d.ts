// Copyright (c) 2013 Turbulenz Limited

/// <reference path="base.d.ts" />

// -----------------------------------------------------------------------------
// MathDevice
// -----------------------------------------------------------------------------

interface MathDevice
{
    version : number;
    // Default precision for equality comparations
    precision : number;
    FLOAT_MAX : number;

    select(m, a, b);
    reciprocal(a);
    truncate(value);

    // Vector2
    v2BuildZero(dst?);
    v2BuildOne(dst?);
    v2BuildXAxis(dst?);
    v2BuildYAxis(dst?);
    v2Build(a, b, dst?);
    v2Copy(src, dst?);
    v2Set(v, a);
    v2Neg(a, dst?);
    v2Add(a, b, dst?);
    v2Add3(a, b, c, dst?);
    v2Add4(a, b, c, d, dst?);
    v2Sub(a, b, dst?);
    v2Mul(a, b, dst?);
    v2MulAdd(a, b, c, dst?);
    v2Dot(a, b);
    v2PerpDot(a, b);
    v2LengthSq(a);
    v2Length(a);
    v2Reciprocal(a, dst?);
    v2Normalize(a, dst?);
    v2Abs(a, dst?);
    v2Max(a, b, dst?);
    v2Min(a, b, dst?);
    v2Equal(a, b, precision?);

    v2MaskEqual(a, b);
    v2MaskLess(a, b);
    v2MaskGreater(a, b);
    v2MaskGreaterEq(a, b);
    v2MaskNot(a);
    v2MaskOr(a, b);
    v2MaskAnd(a, b);
    v2Select(m, a, b, dst?);

    v2ScalarBuild(a, dst?);
    v2ScalarMax(a, b, dst?);
    v2ScalarMin(a, b, dst?);
    v2ScalarAdd(a, b, dst?);
    v2ScalarSub(a, b, dst?);
    v2ScalarMul(a, b, dst?);
    v2AddScalarMul(a, b, c, dst?);

    v2EqualScalarMask(a, b);
    v2LessScalarMask(a, b);
    v2GreaterScalarMask(a, b);
    v2GreaterEqScalarMask(a, b);
    v2Lerp(a, b, t, dst?);

    // Vector3
    v3BuildZero(dst?);
    v3BuildOne(dst?);
    v3BuildXAxis(dst?);
    v3BuildYAxis(dst?);
    v3BuildZAxis(dst?);
    v3Build(a, b, c, dst?);
    v3Copy(src, dst?);
    v3Set(v, a);
    v3Neg(a, dst?);
    v3Add(a, b, dst?);
    v3Add3(a, b, c, dst?);
    v3Add4(a, b, c, d, dst?);
    v3Sub(a, b, dst?);
    v3Mul(a, b, dst?);
    v3MulAdd(a, b, c, dst?);
    v3Dot(a, b);
    v3Cross(a, b, dst?);
    v3LengthSq(a);
    v3Length(a);
    v3Reciprocal(a, dst?);
    v3Normalize(a, dst?);
    v3Abs(a, dst?);
    v3Max(a, b, dst?);
    v3Min(a, b, dst?);
    v3Equal(a, b, precision?);

    v3MaskEqual(a, b);
    v3MaskLess(a, b);
    v3MaskGreater(a, b);
    v3MaskGreaterEq(a, b);
    v3MaskNot(a);
    v3MaskOr(a, b);
    v3MaskAnd(a, b);
    v3Select(m, a, b, dst?);

    v3ScalarBuild(a, dst?);
    v3ScalarMax(a, b, dst?);
    v3ScalarMin(a, b, dst?);
    v3ScalarAdd(a, b, dst?);
    v3ScalarSub(a, b, dst?);
    v3ScalarMul(a, b, dst?);
    v3AddScalarMul(a, b, c, dst?);

    v3EqualScalarMask(a, b);
    v3LessScalarMask(a, b);
    v3GreaterScalarMask(a, b);
    v3GreaterEqScalarMask(a, b);
    v3Lerp(a, b, t, dst?);

    // Vector4
    v4BuildZero(dst?);
    v4BuildOne(dst?);
    v4Build(a, b, c, d, dst?);
    v4Copy(src, dst?);
    v4Set(v, a);
    v4Neg(a, dst?);
    v4Add(a, b, dst?);
    v4Add3(a, b, c, dst?);
    v4Add4(a, b, c, d, dst?);
    v4Sub(a, b, dst?);
    v4Mul(a, b, dst?);
    v4MulAdd(a, b, c, dst?);
    v4Dot(a, b);
    v4LengthSq(a);
    v4Length(a);
    v4Reciprocal(a, dst?);
    v4Normalize(a, dst?);
    v4Abs(a, dst?);
    v4Max(a, b, dst?);
    v4Min(a, b, dst?);
    v4Equal(a, b, precision?);
    // Vector3 'masks'
    v4MaskEqual(a, b);
    v4MaskLess(a, b);
    v4MaskGreater(a, b);
    v4MaskGreaterEq(a, b);
    v4MaskNot(a);
    v4MaskOr(a, b);
    v4MaskAnd(a, b);
    v4Many(m);
    v4MaskAll(m);
    v4Select(m, a, b, dst?);

    v4ScalarBuild(a, dst?);
    v4ScalarMax(a, b, dst?);
    v4ScalarMin(a, b, dst?);
    v4ScalarAdd(a, b, dst?);
    v4ScalarSub(a, b, dst?);
    v4ScalarMul(a, b, dst?);
    v4AddScalarMul(a, b, c, dst?);
    v4ScalarEqual(a, b);

    v4EqualScalarMask(a, b);
    v4LessScalarMask(a, b);
    v4GreaterScalarMask(a, b);
    v4GreaterEqScalarMask(a, b);
    v4Lerp(a, b, t, dst?);

    // AABB
    aabbBuild(a0, a1, a2, a3, a4, a5, dst?);
    aabbBuildEmpty(dst?);
    aabbCopy(aabb, dst?);
    aabbSet(dst, src);
    aabbIsEmpty(aabb);
    aabbMin(aabb, dst?);
    aabbMax(aabb, dst?);
    aabbGetCenterAndHalf(aabb, center, half);
    aabbIsInsidePlanes(aabb, planes);
    aabbIsFullyInsidePlanes(aabb, planes);
    aabbUnion(a, b, dst?);
    aabbUnionArray(aabbArray, dst?);
    aabbAddPoints(aabb, ps);
    aabbTransform(aabb, matrix, dst?);
    aabbIntercept(a, b, dst?);
    aabbOverlaps(a, b);
    aabbSphereOverlaps(aabb, center, radius);
    aabbIsInside(a, b);
    aabbTestInside(a, b);

    // Matrix
    m33BuildIdentity(dst?);
    m33Build(r, u, a, dst?);
    m33Copy(m, dst?);
    m33FromAxisRotation(axis, angle, dst?);
    m33FromQuat(q, dst?);
    m33Right(m, dst?);
    m33Up(m, dst?);
    m33At(m, dst?);
    m33SetRight(m, v);
    m33SetUp(m, v);
    m33SetAt(m, v);
    m33Transpose(m, dst?);
    m33Determinant(m);
    m33Inverse(m, dst?);
    m33InverseTranspose(m, dst?);
    m33Mul(a, b, dst?);
    m33Transform(m, v, dst?);
    m33Equal(a, b, precision?);
    m33MulM43(a, b, dst?);
    m33MulM44(a, b, dst?);

    m33ScalarAdd(m, s, dst?);
    m33ScalarSub(m, s, dst?);
    m33ScalarMul(m, s, dst?);

    // Matrix34
    m34BuildIdentity(dst?);
    m34Pos(m, dst?);
    m34Scale(m, scale, dst?);

    // Matrix43
    m43BuildIdentity(dst?);
    m43Build(r, u, a, p, dst?, a21?, a02?, a12?, a22?, a03?, a13?, a23?, _dst?);
    m43BuildTranslation(p, dst?, z?, w?);
    m43Copy(m, dst?);
    m43FromM33V3(m, v, dst?);
    m43FromAxisRotation(axis, angle, dst?);
    m43FromQuatPos(qp, dst?);
    m43FromRTS(quat, pos, scale, dst?);
    m43FromRT(quat, pos, dst?);
    m43Right(m, dst?);
    m43Up(m, dst?);
    m43At(m, dst?);
    m43Pos(m, dst?);
    m43SetRight(m, v);
    m43SetUp(m, v);
    m43SetAt(m, v);
    m43SetPos(m, v);
    m43SetAxisRotation(m, axis, angle);
    m43InverseOrthonormal(m, dst?);
    m43Orthonormalize(m, dst?);
    m43Determinant(m);
    m43Inverse(m, dst?);
    m43Translate(matrix, pos);
    m43Scale(m, scale, dst?);
    m43TransformVector(m, v, dst?);
    m43TransformPoint(m, v, dst?);
    m43Mul(a, b, dst?);
    m43MulM44(a, b, dst?);
    m43Transpose(m, dst?);
    m43MulTranspose(a, b, dst?);
    m43Offset(m, o, dst?);
    m43NegOffset(m, o, dst?);
    m43InverseTransposeProjection(m, s, dst?);

    m43ScalarAdd(m, s, dst?);
    m43ScalarSub(m, s, dst?);
    m43ScalarMul(m, s, dst?);

    m44BuildIdentity(dst?);
    m44Build(r, u, a, p, dst?);
    m44Build(... elements: any[]);
    m44Copy(m, dst?);
    m44Right(m, dst?);
    m44Up(m, dst?);
    m44At(m, dst?);
    m44Pos(m, dst?);
    m44SetRight(m, v);
    m44SetUp(m, v);
    m44SetAt(m, v);
    m44SetPos(m, v);
    m44Translate(m, v);
    m44Scale(m, scale, dst?);
    m44Transform(m, v, dst?);
    m44Mul(a, b, dst?);
    m44Inverse(m, dst?);
    m44Transpose(m, dst?);

    m44ScalarAdd(m, s, dst?);
    m44ScalarSub(m, s, dst?);
    m44ScalarMul(m, s, dst?);

    // Quaternion
    quatBuild(x, y, z, w, dst?);
    quatCopy(src, dst?);
    quatIsSimilar(q1, q2, precision);
    quatLength(q);
    quatDot(q1, q2);
    quatMul(q1, q2, dst?);
    quatMulTranslate(qa, va, qb, vb, qr, vr);
    quatNormalize(q, dst?);
    quatConjugate(q, dst?);
    quatLerp(q1, q2, t, dst?);

    cosMinSlerpAngle : number;

    quatSlerp(q1, q2, t, dst?);
    quatFromM43(m, dst?);
    quatFromAxisRotation(axis, angle, dst?);
    quatToAxisRotation(q, dst?);
    quatTransformVector(q, v, dst?);
    quatEqual(q1, q2, precision?);

    // quatPos
    quatPosBuild(x, y, z, w, px, py, pz, dst?);
    quatPosTransformVector(qp, n, dst?);
    quatPosTransformPoint(qp, p);
    quatPosMul(qp1, qp2);

    // Visibility queries
    isVisibleBox(center, halfDimensions, vpm);
    isVisibleBoxOrigin(halfDimensions, vpm);
    isVisibleSphere(center, radius, vpm);
    isVisibleSphereOrigin(radius, vpm);
    isVisibleSphereUnit(vpm);
    transformBox(center, halfExtents, matrix);

    // Planes
    planeNormalize(plane, output);
    extractFrustumPlanes(m, p);
    isInsidePlanesPoint(p, planes);
    isInsidePlanesSphere(c, r, planes);
    isInsidePlanesBox(c, h, planes);
    extractIntersectingPlanes(extents, planes);
};

// -----------------------------------------------------------------------------
// GraphicsDevice
// -----------------------------------------------------------------------------

interface Pass
{
    name: string;
    parameters: any;
};

interface Technique
{
    initialized: bool;
    shader: Shader;
    name: string;

    passes: Pass[];
    numPasses: number;

    numParameters: number;
    device: any;
};

interface ShaderParameter
{
    name    : string;
    type    : string;
    rows    : number;
    columns : number;
};

interface Shader
{
    gd             : GraphicsDevice;
    name           : string;
    initialized    : bool;
    programs       : any;
    linkedPrograms : any;

    numTechniques  : number;
    techniques     : {}; // Technique[];

    numParameters  : number;
    parameters     : any;

    samplers       : any;

    // Methods

    getTechnique(name: any): Technique;
    setTechnique(technique: Technique): void;
    getParameter(index: number): ShaderParameter;
    getParameter(name: string): ShaderParameter;
};

interface TechniqueParameters
{
    [paramName: string]: any;
};

interface ParameterWriteIterator
{
    (... data: any[]): void;
    write(... data: any[]): void;
}

interface TechniqueParameterBuffer
{
    numFloats: number;
    dynamic: bool;
    data: number[];

    map(firstValueToMap?: number,
        numValuesToMap?: number): ParameterWriteIterator;
    unmap(writer: ParameterWriteIterator): void;
    setData(data: any, offset: number, numVertices: number): void;
};

interface RenderBuffer
{
    width  : number;
    height : number;
    format : number;

    // Methods

    destroy();
};

interface TextureParameters
{
    src?: string;
    onload?: { (t: Texture, status?: number): void; };

    width?: number;
    height?: number;
    format?: any; // number (gd.PIXELFORMAT_R8G8B8A8) or string ('R8G8B8A8')

    name?: string;
    depth?: number;
    mipmaps?: bool;
    cubemap?: bool;
    renderable?: bool;
    dynamic?: bool;
    data?: any;
};

interface Texture
{
    name: string;
    width: number;
    height: number;
    depth: number;
    format: number;
    numDataLevels: number;
    mipmaps: bool;
    cubemap: bool;
    dynamic: bool;
    renderable: bool;

    // Methods

    setData(data: any);
    typedArrayIsValid(array: any);
    destroy();
};

interface RenderTargetParameters
{
    colorTexture0  : Texture;
    colorTexture1? : Texture;
    colorTexture2? : Texture;
    colorTexture3? : Texture;
    depthBuffer?   : RenderBuffer;
    depthTexture?  : RenderBuffer;
};

interface RenderTarget
{
    width         : number;
    height        : number;
    face          : number;
    colorTexture0 : Texture;
    colorTexture1 : Texture;
    colorTexture2 : Texture;
    colorTexture3 : Texture;
    depthBuffer   : RenderBuffer;
    depthTexture  : Texture;

    // Methods

    destroy();
};

interface Semantics
{
    length: number;
    [index: number]: any;
};

interface VertexBufferParameters
{
    numVertices : number;
    attributes  : any[];

    dynamic?    : bool;
    transient?  : bool;
    data?       : any; // ArrayBufferView or Array
};

interface VertexWriteIterator
{
    (... data: any[]): void;
    write(... data: any[]): void;
};

interface VertexBuffer
{
    numVertices : number;
    usage       : number;
    stride      : number;
    transient   : bool;
    dynamic     : bool;

    // Methods

    setData(data: any, offset: number, numVertices: number): void;
    setAttributes(attributes: number[]): number; // Returns stride
    map(offset?: number, count?: number): VertexWriteIterator;
    unmap(writer: VertexWriteIterator): void;
    destroy(): void;
};

interface IndexBufferParameters
{
    numIndices : number;
    format     : any; // gd.INDEXFORMAT_USHORT (number) or 'USHORT' (string)

    dynamic?   : bool;
    transient? : bool;
    data?      : any; // ArrayBufferView or Array
}

// TODO: How are functions IndexBufferWriter assigned to
interface IndexWriteIterator
{
    (... data: any[]): void;
    write(... data: any[]): void;
};

interface IndexBuffer
{
    numIndices : number;
    format     : number;
    stride     : number;
    length     : number;
    dynamic    : bool;
    usage      : number;

    // Methods

    setData(data: any, offset: number, numIndices: number): void;
    map(offset?: number, count?: number): IndexWriteIterator;
    unmap(writer: IndexWriteIterator): void;

    destroy(): void;
};

interface DrawParameters
{
    technique       : Technique;
    primitive       : number;
    indexBuffer     : IndexBuffer;
    count           : number;
    firstIndex      : number;
    sortKey         : number;
    userData        : any;
    [index: number] : any; // TODO

    // Methods

    setTechniqueParameters(index: number,
                           techniqueParameters: TechniqueParameters): void;
    setVertexBuffer(index: number, vertexBuffer: VertexBuffer): void;
    setSemantics(index: number, semantics: Semantics): void;
    setOffset(index: number, offset: number): void;
    getTechniqueParameters(index: number): TechniqueParameters;
    getVertexBuffer(index: number): VertexBuffer;
    getSemantics(index: number): Semantics;
    getOffset(index: number): number;
};

interface OcclusionQuery
{
};

interface VideoParameters
{
    src: string;
    looping?: bool;
    onload: { (v: Video): void; };
};

interface Video
{
    looping : bool;
    playing : bool;
    paused  : bool;
    tell    : number;

    // Methods

    play(position?: number): bool;
    stop(): bool;
    pause(): bool;
    resume(position?: number): bool;
    rewind(): bool;
    destroy(): void;
}

interface GraphicsDevice
{
    //
    PIXELFORMAT_A8           : number;
    PIXELFORMAT_L8           : number;
    PIXELFORMAT_L8A8         : number;
    PIXELFORMAT_R5G5B5A1     : number;
    PIXELFORMAT_R5G6B5       : number;
    PIXELFORMAT_R8G8B8A8     : number;
    PIXELFORMAT_R8G8B8       : number;
    PIXELFORMAT_D24S8        : number;
    PIXELFORMAT_D16          : number;
    PIXELFORMAT_DXT1         : number;
    PIXELFORMAT_DXT3         : number;
    PIXELFORMAT_DXT5         : number;
    PIXELFORMAT_S8           : number;

    //
    PRIMITIVE_POINTS         : number;
    PRIMITIVE_LINES          : number;
    PRIMITIVE_LINE_LOOP      : number;
    PRIMITIVE_LINE_STRIP     : number;
    PRIMITIVE_TRIANGLES      : number;
    PRIMITIVE_TRIANGLE_STRIP : number;
    PRIMITIVE_TRIANGLE_FAN   : number;

    //
    INDEXFORMAT_UBYTE        : number;
    INDEXFORMAT_USHORT       : number;
    INDEXFORMAT_UINT         : number;

    //
    VERTEXFORMAT_BYTE4       : any;
    VERTEXFORMAT_BYTE4N      : any;
    VERTEXFORMAT_UBYTE4      : any;
    VERTEXFORMAT_UBYTE4N     : any;
    VERTEXFORMAT_SHORT2      : any;
    VERTEXFORMAT_SHORT2N     : any;
    VERTEXFORMAT_SHORT4      : any;
    VERTEXFORMAT_SHORT4N     : any;
    VERTEXFORMAT_USHORT2     : any;
    VERTEXFORMAT_USHORT2N    : any;
    VERTEXFORMAT_USHORT4     : any;
    VERTEXFORMAT_USHORT4N    : any;
    VERTEXFORMAT_FLOAT1      : any;
    VERTEXFORMAT_FLOAT2      : any;
    VERTEXFORMAT_FLOAT3      : any;
    VERTEXFORMAT_FLOAT4      : any;

    //
    SEMANTIC_POSITION: number;
    SEMANTIC_POSITION0: number;
    SEMANTIC_BLENDWEIGHT: number;
    SEMANTIC_BLENDWEIGHT0: number;
    SEMANTIC_NORMAL: number;
    SEMANTIC_NORMAL0: number;
    SEMANTIC_COLOR: number;
    SEMANTIC_COLOR0: number;
    SEMANTIC_COLOR1: number;
    SEMANTIC_SPECULAR: number;
    SEMANTIC_FOGCOORD: number;
    SEMANTIC_TESSFACTOR: number;
    SEMANTIC_PSIZE0: number;
    SEMANTIC_BLENDINDICES: number;
    SEMANTIC_BLENDINDICES0: number;
    SEMANTIC_TEXCOORD: number;
    SEMANTIC_TEXCOORD0: number;
    SEMANTIC_TEXCOORD1: number;
    SEMANTIC_TEXCOORD2: number;
    SEMANTIC_TEXCOORD3: number;
    SEMANTIC_TEXCOORD4: number;
    SEMANTIC_TEXCOORD5: number;
    SEMANTIC_TEXCOORD6: number;
    SEMANTIC_TEXCOORD7: number;
    SEMANTIC_TANGENT: number;
    SEMANTIC_TANGENT0: number;
    SEMANTIC_BINORMAL0: number;
    SEMANTIC_BINORMAL: number;
    SEMANTIC_PSIZE: number;
    SEMANTIC_ATTR0: number;
    SEMANTIC_ATTR1: number;
    SEMANTIC_ATTR2: number;
    SEMANTIC_ATTR3: number;
    SEMANTIC_ATTR4: number;
    SEMANTIC_ATTR5: number;
    SEMANTIC_ATTR6: number;
    SEMANTIC_ATTR7: number;
    SEMANTIC_ATTR8: number;
    SEMANTIC_ATTR9: number;
    SEMANTIC_ATTR10: number;
    SEMANTIC_ATTR11: number;
    SEMANTIC_ATTR12: number;
    SEMANTIC_ATTR13: number;
    SEMANTIC_ATTR14: number;
    SEMANTIC_ATTR15: number;

    DEFAULT_SAMPLER: {
        minFilter: number;
        magFilter: number;
        wrapS: number;
        wrapT: number;
        wrapR: number;
        maxAnisotropy: number;
    };

    // Members
    width: number;
    height: number;
    extensions: string;
    shadingLanguageVersion: number;

    fullscreen: bool;

    rendererVersion: number;
    renderer: string;
    vendor: string;
    videoRam: number;
    desktopWidth: number;
    desktopHeight: number;
    fps: number;

    // Methods

    createVertexBuffer(params: VertexBufferParameters): VertexBuffer;
    createIndexBuffer(params: IndexBufferParameters): IndexBuffer;
    createTexture(params: TextureParameters): Texture;
    createShader(params: any): Shader;
    createSemantics(attributes: any[]): Semantics;
    createDrawParameters(): DrawParameters;
    createTechniqueParameters(params?: any): TechniqueParameters;
    createTechniqueParameterBuffer(params: any): TechniqueParameterBuffer;
    createRenderBuffer(params: any): RenderBuffer;
    createRenderTarget(params: RenderTargetParameters): RenderTarget;
    createOcclusionQuery(): OcclusionQuery;
    createVideo(params: VideoParameters): Video;

    isSupported(feature: string): bool;
    maxSupported(feature: string): number;

    requestFullScreen(fullscreen: bool): bool;

    beginFrame(): bool;
    endFrame(): void;

    beginRenderTarget(renderTarget: RenderTarget): bool;
    endRenderTarget(): void;

    beginOcclusionQuery(occlusionQuery: OcclusionQuery): bool;
    endOcclusionQuery(): void;

    clear(clearColor: number[], clearDepth?: number,
          clearStencil?: number): void;

    setViewport(x: number, y: number, width: number, height: number): void;
    setScissor(x: number, y: number, width: number, height: number): void;
    setStream(vertexBuffer: VertexBuffer, semantics: Semantics);
    setTechnique(technique: Technique);
    setTechniqueParameters(techniqueParameters: TechniqueParameters): void;
    setIndexBuffer(indexBuffer: IndexBuffer): void;

    drawIndexed(primitive: number, numIndices: number, first?: number): void;
    draw(primitive: number, numVertices: number, first?: number): void;
    drawArray(drawParametersArray: DrawParameters[],
              globalTechniqueParametersArray: TechniqueParameters[],
              sortMode?: number): void;

    beginDraw(primitive: number, numVertices: number, formats: any[],
              semantics: Semantics): VertexWriteIterator;
    endDraw(writer: VertexWriteIterator): void;

    loadTexturesArchive(params: any): void;
    getScreenshot(compress: bool, x?: number, y?: number,
                  width?: number, height?: number): number[];
};

// -----------------------------------------------------------------------------
// PhysicsDevice
// -----------------------------------------------------------------------------

interface PhysicsShape
{
    margin: number;
    radius: number;
    halfExtents: any; // v3
    inertia: any; // v3
    type: string;
};

interface PhysicsTriangleArray
{
    vertices : Float32Array; // getter for _private.vertices
    indices  : any;          // Uint16Array / Uint32Array
};

interface PhysicsCollisionObject
{
    transform   : any; // m43
    shape       : PhysicsShape;
    group       : number;
    mask        : number;
    userData    : any;
    friction    : number;
    restitution : number;
    kinematic   : bool;

    calculateTransform(transfrom: any, // m43
                       origin: any // v3 / v4
                      ): void;
    calculateExtents(): void;
    clone(): PhysicsCollisionObject;
};

interface PhysicsRigidBody extends PhysicsCollisionObject
{
    linearVelocity  : any; // v3
    angularVelocity : any; // v3
    linearDamping   : number;
    angularDamping  : number;
    active          : bool;
    mass            : number;
    inertia         : any; // v3

    clone(): PhysicsRigidBody;
};

interface PhysicsCharacter
{
    velocity      : any; // v3
    position      : any; // v3
    onGround      : bool;
    crouch        : bool;
    dead          : bool;
    maxJumpHeight : number;
    userData      : any;

    calculateTransform(transfrom : any, // m43
                       origin    : any  // v3 / v4
                      )          : any; // m43
    calculateExtents(extents: any /* array?  typed array? */): void;
    jump(): void;
};

interface PhysicsConstraint
{
    bodyA: PhysicsCollisionObject;
    bodyB: PhysicsCollisionObject;
    transformA: any; // m43
    transformB: any; // m43
    type: string;
};

interface PhysicsPoint2PointConstraint extends PhysicsConstraint
{
    pivotA: any; // v3
    pivotB: any; // v3
    force: number;
    damping: number;
    impulseClamp: number;
}

interface PhysicsHingeConstraint extends PhysicsConstraint
{
    low: number;
    high: number;
};

interface PhysicsConeTwistConstraint extends PhysicsConstraint
{
    swingSpan1: number;
    swingSpan2: number;
    twistSpan: number;
    twistAngle: number;
};

interface Physics6DOFConstraint extends PhysicsConstraint
{
    linearLowerLimit: any; // v3
    linearUpperLimit: any; // v3
    angularLowerLimit: any; // v3
    angularUpperLimit: any; // v3
};

interface PhysicsSliderConstraint extends PhysicsConstraint
{
    linearLowerLimit: number;
    linearUpperLimit: number;
    angularLowerLimit: number;
    angularUpperLimit: number;
};

interface RayTestParameters
{
    from: any; // v3
    to: any; // v3
    group?: number;
    mask?: number;
    exclude?: PhysicsCollisionObject;
};

interface ConvexSweepTestParameters extends RayTestParameters
{
    shape: PhysicsShape;
};

interface RayHit
{
    collisionObject : PhysicsCollisionObject;
    body            : PhysicsRigidBody;
    hitPoint        : any; // v3
    hitNormal       : any; // v3
};

interface PhysicsWorld
{
    gravity           : any; // v3
    maxSubSteps       : number;
    fixedTimeStep     : number;
    maxGiveUpTimeStep : number;
    minimumTimeStep   : number;
    maximumTimeStep   : number;
    performanceData   : any;

    update(): void;
    rayTest(rayTest: RayTestParameters): RayHit;
    convexSweepTest(params: ConvexSweepTestParameters): RayHit;
    addCollisionObject(collisionObject: PhysicsCollisionObject): void;
    removeCollisionObject(collisionObject: PhysicsCollisionObject): void;
    addRigidBody(rigidBody: PhysicsRigidBody): void;
    removeRigidBody(rigidBody: PhysicsRigidBody): void;
    addConstraint(contraint: PhysicsConstraint): void;
    removeConstraint(contraint: PhysicsConstraint): void;
    addCharacter(character: PhysicsCharacter): void;
    removeCharacter(character: PhysicsCharacter): void;
    flush(): void;
}

interface PhysicsDevice
{
    FILTER_DYNAMIC: number;
    FILTER_STATIC: number;
    FILTER_KINEMATIC: number;
    FILTER_DEBRIS: number;
    FILTER_TRIGGER: number;
    FILTER_CHARACTER: number;
    FILTER_PROJECTILE: number;
    FILTER_USER_MIN: number;
    FILTER_USER_MAX: number;
    FILTER_ALL: number;

    version: number;
    vendor: string;

    // Methods

    createDynamicsWorld(params) : PhysicsWorld;
    createPlaneShape(params) : PhysicsShape;
    createBoxShape(params) : PhysicsShape;
    createSphereShape(params) : PhysicsShape;
    createCapsuleShape(params) : PhysicsShape;
    createCylinderShape(params) : PhysicsShape;
    createConeShape(params) : PhysicsShape;
    createTriangleMeshShape(params) : PhysicsShape;
    createConvexHullShape(params) : PhysicsShape;
    createTriangleArray(params) : PhysicsTriangleArray;
    createCollisionObject(params) : PhysicsCollisionObject;
    createRigidBody(params) : PhysicsRigidBody;
    createPoint2PointConstraint(params) : PhysicsPoint2PointConstraint;
    createHingeConstraint(params) : PhysicsHingeConstraint;
    createConeTwistConstraint(params) : PhysicsConeTwistConstraint;
    create6DOFConstraint(params) : Physics6DOFConstraint;
    createSliderConstraint(params) : PhysicsSliderConstraint;
    createCharacter(params) : PhysicsCharacter;
};

// -----------------------------------------------------------------------------
// SoundDevice
// -----------------------------------------------------------------------------

// Sound

// Should return an Array or ArrayBufferView
interface SoundDataFn { (amplitude: number, frequency: number,
                         wavefrequency: number, length: number): any; };

interface SoundParameters
{
    src?        : string;
    uncompress? : bool;

    name?       : string;
    data?       : SoundDataFn;
    channels?   : number;
    frequency?  : number;

    onload?     : { (sound: Sound): void; };
};

interface Sound
{
    name       : string;
    frequency  : number;
    channels   : number;
    bitrate    : number;
    length     : number;
    compressed : bool;


    destroy(): void;
};

// SoundEffect

interface SoundEffectParameters
{
    name                 : string;
    type                 : string;

    // Echo
    delay?               : number;
    lrdelay?             : number;
    damping?             : number;
    feedback?            : number;
    spread?              : number;

    // Reverb
    density?             : number;
    diffusion?           : number;
    gain?                : number;
    gainHF?              : number;
    decayTime?           : number;
    decayHFRatio?        : number;
    reflectionsGain?     : number;
    reflectionsDelay?    : number;
    lateReverbGain?      : number;
    lateReverbDelay?     : number;
    roomRollOffFactor?   : number;
    airAbsorptionGainHF? : number;
    decayHFLimit?        : number;
};

interface SoundEffect
{
    name: string;
    type: string;
    density: number;
    diffusion: number;
    gain: number;
    gainHF: number;
    decayTime: number;
    decayHFRatio: number;
    reflectionsGain: number;
    reflectionsDelay: number;
    lateReverbGain: number;
    lateReverbDelay: number;
    roomRollOffFactor: number;
    airAbsorptionGainHF: number;
    decayHFLimit: bool;
    delay: number;
    lrdelay: number;
    damping: number;
    feedback: number;
    spread: number;
};

// SoundEffectSlot

interface SoundEffectSlotParameters
{
    effect : SoundEffect;
    gain   : number;
};

interface SoundEffectSlot
{
    effect            : SoundEffect;
    gain              : number;
    auxiliarySendAuto : bool;
};

// SoundFilter

interface SoundFilterParameters
{
    name    : string;
    type    : string;

    // Lowpass
    gain?   : number;
    gainHF? : number;
};

interface SoundFilter
{
    name: string;
    type: string;
    gain: number;
    gainHF: number;
};

// SoundSource

// TODO: Are any of these required?
interface SoundSourceParameters
{
    position?    : any; // v3
    direction?   : any; // v3
    velocity?    : any; // v3
    gain?        : number;
    minDistance? : number;
    maxDistance? : number;
    rollOff?     : number;
    relative?    : bool;
    looping?     : bool;
    pitch?       : number;
};

interface SoundSource
{
    position    : any; // v3
    velocity    : any; // v3
    direction   : any; // v3
    gain        : number;
    minDistance : number;
    maxDistance : number;
    rollOff     : number;
    relative    : bool;
    looping     : bool;
    pitch       : number;
    playing     : bool;
    paused      : bool;
    tell        : number;

    play(sound: Sound, position?: number): bool;
    stop(): void;
    pause(): void;
    resume(position?: number): bool;
    rewind(): bool;
    seek(seek: number): bool;
    clear(): void;
    setAuxiliarySendFilter(index: number,
                           effectSlot: SoundEffectSlot,
                           filter: SoundFilter): bool;
    setDirectFilter(filter: SoundFilter): bool;
    destroy(): void;
};

// SoundArchiveParameters

interface SoundArchiveParameters
{
    src         : string;
    onsoundload : { (sound: Sound): void; };
    onload      : { (success: bool, status: number): void; };
    uncompress  : bool;
};

// SoundDevice

interface SoundDevice
{
    vendor                : string;
    renderer              : string;
    version               : string;
    deviceSpecifier       : string;
    extensions            : string;
    listenerTransform     : any; // m43
    listenerVelocity      : any; // v3
    listenerGain          : number;
    frequency             : number;
    dopplerFactor         : number;
    dopplerVelocity       : number;
    speedOfSound          : number;
    alcVersion            : string;
    alcExtensions         : string;
    alcEfxVersion         : string;
    alcMaxAuxiliarySends  : number;

    createSource(params: SoundSourceParameters): SoundSource;
    createSound(params: SoundParameters): Sound;
    loadSoundsArchive(params: SoundArchiveParameters): void;
    createEffect(params: SoundEffectParameters): SoundEffect;
    createEffectSlot(params: SoundEffectSlotParameters): SoundEffectSlot;
    createFilter(params: SoundFilterParameters): SoundFilter;
    update(): void;
    isSupported(feature: string): bool;
};

// -----------------------------------------------------------------------------
// NetworkDevice
// -----------------------------------------------------------------------------

interface NetworkDevice
{
    createWebSocket(url: string): WebSocket;
    update(): void;
};

// -----------------------------------------------------------------------------
// InputDevice
// -----------------------------------------------------------------------------

interface TouchEvent
{
    gameTouches: any[];
    touches: any[];
    changedTouches: any;
};

interface InputDeviceEventListener
{
    (...arg0: any[]): void; //?, arg1?, arg2?, arg3?, arg4?, arg5?): void;
};

interface InputDevice
{
    keyCodes   : any; // { [keyName: string]: number; };
    mouseCodes : any; // { [keyName: string]: number; };
    padCodes   : any; // { [keyName: string]: number; };

    update(): void;
    addEventListener(eventType: string,
                     eventListener: InputDeviceEventListener): void;
    removeEventListener(eventType: string,
                        eventListener: InputDeviceEventListener): void;
    lockMouse(): bool;
    unlockMouse(): bool;
    isLocked(): bool;
    hideMouse(): bool;
    showMouse(): bool;
    isHidden(): bool;
    isFocused(): bool;
    convertToUnicode(keyCodes: number[]): string[];
    isSupported(feature: string): bool;
};

// -----------------------------------------------------------------------------
// TurbulenzEngine
// -----------------------------------------------------------------------------

interface SystemInfo
{
    architecture      : string;
    cpuDescription    : string;
    cpuVendor         : string;
    numPhysicalCores  : number;
    numLogicalCores   : number;
    ramInMegabytes    : number;
    frequencyInMegaHZ : number;

    osName            : string;
    osVersionMajor    : number;
    osVersionMinor    : number;
    osVersionBuild    : number;

    platformProfile   : string;

    userLocale        : string;
};

interface TurbulenzRequestCallback
{
    (asset: any, status: number): void;
};

interface TurbulenzEngine
{
    version            : string;
    time               : number;

    onload             : { (engine: TurbulenzEngine): void; };
    onunload           : { (): void; };
    onerror            : { (msg: string): void; };
    onwarning          : { (msg: string): void; };

    canvas?            : any;
    VMath?             : any;

    encryptionEnabled? : bool;

    // Methods

    updateTime(): void;
    getTime(): number;

    setTimeout(f: { (): void; }, t: number): any; // We use objs and IDs here
    clearTimeout(i: any): void;
    setInterval(f: { (): void; }, t: number): any;
    clearInterval(i: any);

    request(url: string, callback: TurbulenzRequestCallback): void;

    base64Encode(bytes: any): string;

    encrypt(plainText: string): string;
    decrypt(encrypted: string): string;
    generateSignature(str: string): string;
    verifySignature(originalStr: string, originalSignature: string): bool;

    getSystemInfo(): SystemInfo;

    createMathDevice(params: any): MathDevice;
    getMathDevice(): MathDevice;

    createGraphicsDevice(params: any): GraphicsDevice;
    getGraphicsDevice(): GraphicsDevice;

    createPhysicsDevice(params: any): PhysicsDevice;
    getPhysicsDevice(): PhysicsDevice;

    createSoundDevice(params: any): SoundDevice;
    getSoundDevice(): SoundDevice;

    createNetworkDevice(params: any): NetworkDevice;
    getNetworkDevice(): NetworkDevice;

    createInputDevice(params: any): InputDevice;
    getInputDevice(): InputDevice;

    flush(): void;

    getObjectStats(): void;
    enableProfiling(): void;
    startProfiling(): void;
    stopProfiling(): void;

    unload(): void;
    isUnloading(): void;
};

// -----------------------------------------------------------------------------
// TurbulenzEngine global
// -----------------------------------------------------------------------------

declare var TurbulenzEngine : TurbulenzEngine;
