// Copyright (c) 2010-2012 Turbulenz Limited

/*global Geometry: false*/
/*global GeometryInstance: false*/

interface Particle
{
    velocity    : any; // v3
    position    : any; // v3
    dieTime     : number;
    size        : number;
    color       : any; // v4
    invlifeTime : number;
};

//
//  ParticleSystem Object
//
class ParticleSystem
{
    static version = 1;

    md                 : MathDevice;
    numActiveParticles : number;
    spawnNextParticle  : number;
    worldPosition      : any; // v3
    particles          : Particle[];
    dirtyWorldExtents  : boolean;
    colorList          : any[]; // v4[]
    v3temp             : any; // v3
    extents            : Float32Array;

    maxSpawnTime       : number;
    minSpawnTime       : number;
    diffSpawnTime      : number;

    maxLifetime        : number;
    minLifetime        : number;
    diffLifetime       : number;

    size               : number;
    growRate           : number;
    maxParticles       : number;
    gravity            : number;

    geometryInstance   : GeometryInstance;

    // on prototype
    indexBuffer        : IndexBuffer;

    setWorldPosition(worldPosition)
    {
        this.worldPosition = worldPosition;
    }

    createParticle(particle)
    {
        var md = this.md;
        var random = Math.random;
        var worldPosition = this.worldPosition;
        var colorList = this.colorList;
        var spawnTime = this.spawnNextParticle;
        var colorCount = colorList.length;
        var floor = Math.floor;
        var velocity = particle.velocity;

        particle.spawned = spawnTime;

        // Select a random lifetime variation
        var lifeTime = this.minLifetime + (random() * this.diffLifetime);
        particle.dieTime = spawnTime + lifeTime;
        particle.invlifeTime = 1.0 / lifeTime;

        // Start at the particleSystem spawn position
        particle.position = md.m43Pos(worldPosition, particle.position);

        // Select a random velocity variation
        velocity[0] = -2 + random() * 4;
        velocity[1] =  6 + random() * 4;
        velocity[2] = -2 + random() * 4;

        particle.size = this.size;

        // Select a random color from the list
        particle.color = md.v4Copy(colorList[floor(colorCount * random())], particle.color);

        // Set the next particle spawn time
        this.spawnNextParticle = spawnTime + this.minSpawnTime + (random() * this.diffSpawnTime);
    }

    initialize()
    {
        var md = this.md;
        var maxParticles = this.maxParticles;
        var particles = this.particles;

        var v3Zero = md.v3BuildZero();
        var v4One = md.v4BuildOne();

        for (var i = 0; i < maxParticles; i += 1)
        {
            particles[i] = <Particle> {
                velocity : v3Zero.slice(),
                position : v3Zero.slice(),
                color : v4One.slice()
            };
        }
    }

    update(currentTime, deltaTime)
    {
        var md = this.md;
        var numActiveParticles = this.numActiveParticles;
        var particles = this.particles;
        var maxParticles = this.maxParticles;
        var deltaSize = (this.growRate * deltaTime);
        var deltaVelocity = (this.gravity * deltaTime);
        var velocity, position;
        var dirtyWorldExtents = false;
        var i = 0;

        // clamp for missing updates
        if ((this.spawnNextParticle + deltaTime) < currentTime)
        {
            this.spawnNextParticle = (currentTime - deltaTime);
        }

        while (i < numActiveParticles)
        {
            var p = particles[i];
            var dieTime = p.dieTime;
            if (dieTime < currentTime)
            {
                if (this.spawnNextParticle < currentTime)
                {
                    this.createParticle(p);

                    dirtyWorldExtents = true;
                    i += 1;
                }
                else
                {
                    numActiveParticles -= 1;
                    if (i < numActiveParticles)
                    {
                        particles[i] = particles[numActiveParticles];
                        particles[numActiveParticles] = p;
                    }
                }
            }
            else
            {
                p.size += deltaSize;
                velocity = p.velocity;
                position = p.position;
                p.position = md.v3AddScalarMul(position, velocity, deltaTime, position);

                if (deltaVelocity)
                {
                    velocity[1] -= deltaVelocity;
                }

                // Modify the alpha channel to fade out
                p.color[3] = ((dieTime - currentTime) * p.invlifeTime);

                dirtyWorldExtents = true;
                i += 1;
            }
        }

        // At this point 'i' points to the first dead particle
        while (this.spawnNextParticle < currentTime)
        {
            if (i < maxParticles)
            {
                this.createParticle(particles[i]);
                numActiveParticles += 1;
                dirtyWorldExtents = true;
                i += 1;
            }
            else
            {
                break;
            }
        }

        this.numActiveParticles = numActiveParticles;
        this.dirtyWorldExtents = dirtyWorldExtents;
    }

    getWorldExtents()
    {
        // Extents calculated from particles
        var extents = this.extents;

        var numActiveParticles = this.numActiveParticles;
        if (numActiveParticles === 0)
        {
            extents[0] = 0;
            extents[1] = 0;
            extents[2] = 0;
            extents[3] = 0;
            extents[4] = 0;
            extents[5] = 0;
            return extents;
        }

        var particles = this.particles;
        var halfSize = this.size * 0.5;

        var p = particles[0];
        var position = p.position;
        var p0 = position[0];
        var p1 = position[1];
        var p2 = position[2];
        var xMax = p0;
        var xMin = p0;
        var yMax = p1;
        var yMin = p1;
        var zMax = p2;
        var zMin = p2;

        for (var i = 1; i < numActiveParticles; i += 1)
        {
            p = particles[i];
            position = p.position;
            p0 = position[0];
            p1 = position[1];
            p2 = position[2];

            xMax = (p0 > xMax) ? p0: xMax;
            xMin = (p0 < xMin) ? p0: xMin;
            yMax = (p1 > yMax) ? p1: yMax;
            yMin = (p1 < yMin) ? p1: yMin;
            zMax = (p2 > zMax) ? p2: zMax;
            zMin = (p2 < zMin) ? p2: zMin;
        }

        extents[0] = xMin - halfSize;
        extents[1] = yMin - halfSize;
        extents[2] = zMin - halfSize;
        extents[3] = xMax + halfSize;
        extents[4] = yMax + halfSize;
        extents[5] = zMax + halfSize;
        return extents;
    }

    destroy()
    {}

    // ParticleSystem Constructor function
    static create(md: MathDevice, gd: GraphicsDevice,
                  parameters): ParticleSystem
    {
        var p = new ParticleSystem();

        p.md = md;
        p.numActiveParticles = 0;
        p.spawnNextParticle = -Number.MAX_VALUE;
        p.worldPosition = md.v3BuildZero();
        p.particles = [];
        p.dirtyWorldExtents = false;
        p.colorList = [ md.v4BuildOne()];
        p.v3temp = md.v3BuildZero();

        // Required parameters
        var maxLifetime = parameters.maxLifetime;
        var maxSpawnTime = parameters.maxSpawnTime;
        var size = parameters.size;

        // Optional parameters
        var minSpawnTime;
        var minLifetime;
        var growRate;
        var gravity;

        // Set defaults if not specified
        if (parameters.gravity)
        {
            gravity = parameters.gravity;
        }
        else
        {
            // No gravity
            gravity = 0;
        }

        if (parameters.minSpawnTime)
        {
            minSpawnTime = parameters.minSpawnTime;
        }
        else
        {
            minSpawnTime = 0.01;
        }

        if (parameters.minLifetime)
        {
            minLifetime = parameters.minLifetime;
        }
        else
        {
            minLifetime = 1;
        }

        if (parameters.growRate)
        {
            growRate = parameters.growRate;
        }
        else
        {
            growRate = 0;
        }

        // Calculated parameters
        var maxParticles = maxLifetime / minSpawnTime;
        var diffSpawnTime = maxSpawnTime - minSpawnTime;
        var diffLifetime = maxLifetime - minLifetime;

        p.maxSpawnTime = maxSpawnTime;
        p.maxLifetime = maxLifetime;
        p.size = size;

        p.growRate = growRate;
        p.minSpawnTime = minSpawnTime;
        p.diffSpawnTime = diffSpawnTime;
        p.minLifetime = minLifetime;
        p.diffLifetime = diffLifetime;
        p.maxParticles = maxParticles;
        p.gravity = gravity;

        // Create an index buffer for the particle system

        var numIndexBufferIndices = 6 * maxParticles;

        if (!ParticleSystem.prototype.indexBuffer || (ParticleSystem.prototype.indexBuffer.numIndices < numIndexBufferIndices))
        {
            var indexData = new Uint16Array(numIndexBufferIndices);

            var v0, v1, v2, v3;
            for (var i = 0, n = 0; i < maxParticles; i += 1)
            {
                v0 = 4 * i + 0;
                v1 = 4 * i + 1;
                v2 = 4 * i + 2;
                v3 = 4 * i + 3;
                indexData[n + 0] = v0;
                indexData[n + 1] = v1;
                indexData[n + 2] = v2;
                indexData[n + 3] = v2;
                indexData[n + 4] = v3;
                indexData[n + 5] = v0;
                n += 6;
            }

            var indexBufferParameters = {
                numIndices: numIndexBufferIndices,
                format: 'USHORT',
                data: indexData
            };

            var indexBuffer =
                gd.createIndexBuffer(indexBufferParameters);

            ParticleSystem.prototype.indexBuffer = indexBuffer;
        }

        p.initialize();

        return p;
    }
}

ParticleSystem.prototype.indexBuffer = null;

//
//  ParticleSystemRenderer Object
//
class ParticleSystemRenderer
{
    static version = 1;

    gd: GraphicsDevice;
    md: MathDevice;

    update(particleSystem, camera)
    {
        // Basic updates rewrites the whole vertexBuffer
        var md = this.md;
        var numParticles = particleSystem.numActiveParticles;
        var numVerticesChanged = particleSystem.numVerticesPerParticle * numParticles;

        var geometryInstance = particleSystem.geometryInstance;
        var surface = geometryInstance.surface;
        var geometry = geometryInstance.geometry;
        var vertexBuffer = geometry.vertexBuffer;

        var particles = particleSystem.particles;
        var vertexData = particleSystem.vertexData;

        surface.numVertices = numVerticesChanged;
        geometry.numVertices = numVerticesChanged;
        geometry.numIndices = surface.numIndices = 6 * numParticles;

        var cameraMatrix = camera.matrix;

        var right0 = cameraMatrix[0];
        var right1 = cameraMatrix[1];
        var right2 = cameraMatrix[2];

        var up0 = cameraMatrix[3];
        var up1 = cameraMatrix[4];
        var up2 = cameraMatrix[5];

        for (var i = 0, n = 0; i < numParticles; i += 1)
        {
            var p = particles[i];
            var color = p.color;
            var position = p.position;
            var position0 = position[0];
            var position1 = position[1];
            var position2 = position[2];

            var size = p.size;

            var sizeRight0 = right0 * size;
            var sizeRight1 = right1 * size;
            var sizeRight2 = right2 * size;

            var sizeUp0 = up0 * size;
            var sizeUp1 = up1 * size;
            var sizeUp2 = up2 * size;

            var color0 = color[0];
            var color1 = color[1];
            var color2 = color[2];
            var color3 = color[3];

            vertexData[n + 0] = position0 - sizeRight0 - sizeUp0;
            vertexData[n + 1] = position1 - sizeRight1 - sizeUp1;
            vertexData[n + 2] = position2 - sizeRight2 - sizeUp2;
            vertexData[n + 3] = 0;
            vertexData[n + 4] = 1;
            vertexData[n + 5] = color0;
            vertexData[n + 6] = color1;
            vertexData[n + 7] = color2;
            vertexData[n + 8] = color3;
            n += 9;

            vertexData[n + 0] = position0 + sizeRight0 - sizeUp0;
            vertexData[n + 1] = position1 + sizeRight1 - sizeUp1;
            vertexData[n + 2] = position2 + sizeRight2 - sizeUp2;
            vertexData[n + 3] = 0;
            vertexData[n + 4] = 0;
            vertexData[n + 5] = color0;
            vertexData[n + 6] = color1;
            vertexData[n + 7] = color2;
            vertexData[n + 8] = color3;
            n += 9;

            vertexData[n + 0] = position0 + sizeRight0 + sizeUp0;
            vertexData[n + 1] = position1 + sizeRight1 + sizeUp1;
            vertexData[n + 2] = position2 + sizeRight2 + sizeUp2;
            vertexData[n + 3] = 1;
            vertexData[n + 4] = 0;
            vertexData[n + 5] = color0;
            vertexData[n + 6] = color1;
            vertexData[n + 7] = color2;
            vertexData[n + 8] = color3;
            n += 9;

            vertexData[n + 0] = position0 - sizeRight0 + sizeUp0;
            vertexData[n + 1] = position1 - sizeRight1 + sizeUp1;
            vertexData[n + 2] = position2 - sizeRight2 + sizeUp2;
            vertexData[n + 3] = 1;
            vertexData[n + 4] = 1;
            vertexData[n + 5] = color0;
            vertexData[n + 6] = color1;
            vertexData[n + 7] = color2;
            vertexData[n + 8] = color3;
            n += 9;
        }

        vertexBuffer.setData(vertexData, 0, numVerticesChanged);
    }

    updateRenderableWorldExtents(particleSystem)
    {
        if (particleSystem.dirtyWorldExtents)
        {
            var geometryInstance = particleSystem.geometryInstance;
            var worldExtents = particleSystem.getWorldExtents();

            geometryInstance.addCustomWorldExtents(worldExtents);
            particleSystem.dirtyWorldExtents = false;
        }
    }

    initialize(particleSystem, material, node)
    {
        // Renderer setup basic quad render method
        var gd = this.gd;
        var maxParticles = particleSystem.maxParticles;
        var numVerticesPerParticle = 4;
        var numVertexBufferVertices = numVerticesPerParticle * maxParticles;

        var geometryInstance;

        var vertexBufferParameters = {
            numVertices : numVertexBufferVertices,
            attributes : ['FLOAT3', 'FLOAT2', 'FLOAT4'],
            transient : true
        };

        // Dynamic vertexBuffer created for changing position and vertex color
        var vertexBuffer = gd.createVertexBuffer(vertexBufferParameters);
        var semantics = gd.createSemantics([gd.SEMANTIC_POSITION, gd.SEMANTIC_TEXCOORD, gd.SEMANTIC_COLOR]);

        var surface = {
                primitive : gd.PRIMITIVE_TRIANGLES,
                indexBuffer : particleSystem.indexBuffer,
                numIndices : particleSystem.indexBuffer.numIndices,
                first : 0,
                numVertices : 0
            };

        var geometry = Geometry.create();
        geometry.semantics = semantics;
        geometry.primitive = surface.primitive;
        geometry.indexBuffer = surface.indexBuffer;
        geometry.vertexBuffer = vertexBuffer;
        geometry.center = new Float32Array([0, 0, 0]);
        // Initial extents overwritten by custom extents
        geometry.halfExtents = new Float32Array([1, 1, 1]);

        geometryInstance = GeometryInstance.create(geometry,
                                                    surface,
                                                    material);
        node.addRenderable(geometryInstance);

        // Store for use with update
        particleSystem.numVerticesPerParticle = numVerticesPerParticle;
        particleSystem.numVertexBufferVertices = numVertexBufferVertices;
        particleSystem.geometryInstance = geometryInstance;
        particleSystem.node = node;
        particleSystem.extents = new Float32Array(6);
        particleSystem.vertexData = new Float32Array(numVertexBufferVertices * (3 + 2 + 4));
    }

    destroy(particleSystems)
    {
        for (var i = 0; i < particleSystems.length; i += 1)
        {
            var ps = particleSystems[i];
            var gi = ps.geometryInstance;
            var node = ps.node;
            if (node && gi)
            {
                node.removeRenderable(gi);
            }

            ps.geometryInstance.destroy();
            delete ps.geometryInstance;
        }
    }

    // ParticleSystemRenderer Constructor function
    static create(gd: GraphicsDevice, md: MathDevice): ParticleSystemRenderer
    {
        var p = new ParticleSystemRenderer();
        p.gd = gd;
        p.md = md;
        return p;
    }
}

//
//  Emitter Object
//
class Emitter
{
    static version = 1;

    gd                     : GraphicsDevice;
    md                     : MathDevice;
    particleSystem         : ParticleSystem;
    particleSystemRenderer : ParticleSystemRenderer;
    material               : Material;
    node                   : SceneNode;
    updateExtentsTime      : number;

    update(currentTime, deltaTime, camera)
    {
        var particleSystem = this.particleSystem;
        var particleSystemRenderer = this.particleSystemRenderer;

        particleSystem.setWorldPosition(this.node.getWorldTransform());

        particleSystem.update(currentTime, deltaTime);

        particleSystemRenderer.update(particleSystem, camera);

        particleSystemRenderer.updateRenderableWorldExtents(particleSystem);
    }

    setMaterial(material)
    {
        var particleSystem = this.particleSystem;
        var geometryInstance = particleSystem.geometryInstance;

        geometryInstance.setMaterial(material);
    }

    setParticleColors(colorList)
    {
        var particleSystem = this.particleSystem;
        particleSystem.colorList = colorList;
    }

    getNumActiveParticles()
    {
        return this.particleSystem.numActiveParticles;
    }

    destroy()
    {
        // Must destroy renderer first
        this.particleSystemRenderer.destroy([this.particleSystem]);
        this.particleSystem.destroy();
    }

    // Emitter Constructor function
    static create(gd: GraphicsDevice, md: MathDevice, material, node,
                  parameters): Emitter
    {
        var e = new Emitter();
        e.gd = gd;
        e.md = md;
        e.particleSystem = ParticleSystem.create(md, gd, parameters);
        e.particleSystemRenderer = ParticleSystemRenderer.create(gd, md);
        e.material = material;
        e.node = node;
        e.updateExtentsTime = 0;

        e.particleSystemRenderer.initialize(e.particleSystem, material, node);

        return e;
    }
}
