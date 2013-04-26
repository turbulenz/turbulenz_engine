// Copyright (c) 2010-2012 Turbulenz Limited
/*global TurbulenzEngine:false*/
/*global VMath:false*/

/// <reference path="turbulenz.d.ts" />
/// <reference path="requesthandler.ts" />
/// <reference path="vmath.ts" />

interface LoadParameters
{
    nodesNamePrefix?: string;
    shapesNamePrefix?: string;
    request?: any; // TODO:

    nodes: SceneNodeParameters[];
    parentNode: any; // TODO: SceneNode / SceneNodeParameters;
    requestHandler?: RequestHandler;
    isReference: bool;

    data: any; // TODO: SceneData?

};

interface SceneParameters extends LoadParameters
{
    append: bool;
    skin: any; // TODO:
};

interface GeometryInstanceParameters // extends GeometryInstance
{
    geometry: string;
}

interface SceneNodeParameters // extends SceneNode
{
    reference?: string;
    geometryinstances?: { [name: string]: GeometryInstanceParameters; };
    inplace: bool;
    skin: any; // ?
    nodes: { [name: string]: SceneNodeParameters; };
    matrix: number[];
};

//
// ResourceLoader
//
class ResourceLoader
{
    static version = 1;

    nodesMap             : { [name: string]: SceneNodeParameters; };
    referencesPending    : { [name: string]: any[]; }; // TODO
    numReferencesPending : number;
    animationsPending    : { [name: string]: bool; };
    skeletonNames        : { [name: string]: string; };
    data                 : any;

    //
    // clear
    //
    clear()
    {
        this.nodesMap = {};
        this.referencesPending = {};
        this.numReferencesPending = 0;
        this.animationsPending = {};
    };

    //
    // endLoading
    //
    endLoading(onload)
    {
        this.referencesPending = {};
        this.animationsPending = {};

        if (onload)
        {
            onload(this.data);
        }
    };

    resolveShapes(loadParams)
    {
        var copyObject = function copyObjectFn(o)
        {
            var newObj = { };
            for (var p in o)
            {
                if (o.hasOwnProperty(p))
                {
                    newObj[p] = o[p];
                }
            }
            return newObj;
        };

        var shapesNamePrefix = loadParams.shapesNamePrefix;
        // we reuse shapesNamePrefix to save adding prefixes for everything
        var skeletonNamePrefix = loadParams.shapesNamePrefix;
        var sceneData = loadParams.data;
        var fileShapes = sceneData.geometries;
        var targetShapes = this.data.geometries;
        if (!targetShapes)
        {
            targetShapes = {};
            this.data.geometries = targetShapes;
        }

        for (var fileShapeName in fileShapes)
        {
            if (fileShapes.hasOwnProperty(fileShapeName))
            {
                var fileShape = fileShapes[fileShapeName];
                var targetShapeName = (shapesNamePrefix ? (shapesNamePrefix + "-" + fileShapeName) : fileShapeName);

                // Update the skeleton reference
                var fileSkeletonName = fileShape.skeleton;
                if (fileSkeletonName)
                {
                    // the shape has to be copied if it has a skeleton as the same shape
                    // can be used with multiple skeletons
                    targetShapes[targetShapeName] = copyObject(fileShape);
                    targetShapes[targetShapeName].skeleton = (skeletonNamePrefix ? (skeletonNamePrefix + "-" + fileSkeletonName) : fileSkeletonName);
                }
                else
                {
                    targetShapes[targetShapeName] = fileShape;
                }
            }
        }
    };

    resolveSkeletons(loadParams)
    {
        // we reuse shapesNamePrefix to save adding prefixes for everything
        var skeletonNamePrefix = loadParams.shapesNamePrefix;
        var sceneData = loadParams.data;
        var fileSkeletons = sceneData.skeletons;
        var targetSkeletons = this.data.skeletons;
        if (!targetSkeletons)
        {
            targetSkeletons = {};
            this.data.skeletons = targetSkeletons;
        }

        for (var fileSkeletonName in fileSkeletons)
        {
            if (fileSkeletons.hasOwnProperty(fileSkeletonName))
            {
                var fileSkeleton = fileSkeletons[fileSkeletonName];
                var targetSkeletonName = (skeletonNamePrefix ? (skeletonNamePrefix + "-" + fileSkeletonName) : fileSkeletonName);
                targetSkeletons[targetSkeletonName] = fileSkeleton;
            }
        }
    };

    //
    // Resolve animations
    //
    resolveAnimations(loadParams)
    {
        var sceneData = loadParams.data;

        var fileAnims = sceneData.animations;
        if (!fileAnims)
        {
            return;
        }

        var currentLoader = this;
        var anims = currentLoader.data.animations;
        if (!anims)
        {
            anims = {};
            currentLoader.data.animations = anims;
        }

        var postLoadReference = function postLoadReferenceFn(sceneText)
        {
            if (sceneText)
            {
                var sceneData = JSON.parse(sceneText);
                var animations = sceneData.animations;
                for (var anim in animations)
                {
                    if (animations.hasOwnProperty(anim))
                    {
                        anims[anim] = animations[anim];
                    }
                }
            }
            //Utilities.log("resolved ref for " + anim + " count now " + (currentLoader.numReferencesPending-1));
            currentLoader.numReferencesPending -= 1;
            if (currentLoader.numReferencesPending <= 0)
            {
                currentLoader.endLoading(loadParams.onload);
            }
        };

        // Import animations
        var requestOwner = (loadParams.request ? loadParams : TurbulenzEngine);
        for (var a in fileAnims)
        {
            if (fileAnims.hasOwnProperty(a))
            {
                var reference = fileAnims[a].reference;
                if (reference)
                {
                    if (!this.animationsPending[a])
                    {
                        this.animationsPending[a] = true;
                        this.numReferencesPending += 1;
                        //Utilities.log("adding ref for " + a + " count now " + this.numReferencesPending);
                        delete fileAnims[a].reference;

                        loadParams.requestHandler.request({
                            src: reference,
                            requestOwner: requestOwner,
                            onload: postLoadReference
                        });
                    }
                }
                else
                {
                    anims[a] = fileAnims[a];
                }
            }
        }
    };

    //
    // resolveNodes
    //
    resolveNodes(loadParams: LoadParameters)
    {
        var sceneData = loadParams.data;

        var references = this.referencesPending;
        var numReferences = 0;
        var nodesMap = this.nodesMap;

        var currentLoader = this;

        var nodesNamePrefix = loadParams.nodesNamePrefix;
        var shapesNamePrefix = loadParams.shapesNamePrefix;

        var requestOwner =
            (loadParams.request ? <any>loadParams : <any>TurbulenzEngine);

        var copyObject = function copyObjectFn(o)
        {
            var newObj = { };
            for (var p in o)
            {
                if (o.hasOwnProperty(p))
                {
                    newObj[p] = o[p];
                }
            }
            return newObj;
        }

        var resolveNode =
            function resolveNodeFn(fileNode: SceneNodeParameters,
                                   nodeName: string,
                                   parentNodePath: string) : SceneNodeParameters
        {
            // We're changing a node which may be referenced multiple
            // times so take a copy
            var node = <SceneNodeParameters>(copyObject(fileNode));
            var nodePath = parentNodePath ? (parentNodePath + "/" + nodeName) : nodeName;

            var reference = node.reference;
            if (reference)
            {
                //Utilities.log("Reference resolve for " + nodePath);

                var internalReferenceIndex = reference.indexOf("#");
                if (internalReferenceIndex === -1)
                {
                    var referenceParameters = references[reference];
                    if (!referenceParameters || referenceParameters.length === 0 || !node.inplace)
                    {
                        numReferences += 1;
                        //Utilities.log("adding ref for " + nodePath + " numrefs now " + numReferences);

                        var sceneParameters = <SceneParameters>
                            copyObject(loadParams);
                        sceneParameters.append = true;
                        if (node.inplace)
                        {
                            sceneParameters.nodesNamePrefix = parentNodePath;
                            sceneParameters.shapesNamePrefix = null;
                            sceneParameters.parentNode = null;
                        }
                        else
                        {
                            sceneParameters.nodesNamePrefix = nodePath;
                            sceneParameters.shapesNamePrefix = reference;
                            sceneParameters.parentNode = node;
                        }
                        if (node.skin)
                        {
                            sceneParameters.skin = node.skin;
                        }

                        if (!referenceParameters || referenceParameters.length === 0)
                        {
                            referenceParameters = [sceneParameters];
                            references[reference] = referenceParameters;

                            var loadReference = function (sceneText)
                            {
                                var numInstances = referenceParameters.length;
                                var sceneData;
                                if (sceneText)
                                {
                                    sceneData = JSON.parse(sceneText);
                                }
                                else
                                {
                                    // Make sure we can call scene
                                    // load to correctly deal with
                                    // reference counts when a
                                    // reference is missing
                                    sceneData = {};
                                }
                                var params;
                                for (var n = 0; n < numInstances; n += 1)
                                {
                                    params = referenceParameters[n];
                                    params.data = sceneData;
                                    params.isReference = true;
                                    currentLoader.resolve(params);
                                }
                                referenceParameters.length = 0;
                            };

                            loadParams.requestHandler.request({
                                    src: reference,
                                    requestOwner: requestOwner,
                                    onload: loadReference
                                });
                        }
                        else
                        {
                            referenceParameters.push(sceneParameters);
                        }
                    }
                }
                delete node.reference;
                delete node.inplace;
            }

            var geometryinstances = node.geometryinstances;
            if (shapesNamePrefix && geometryinstances)
            {
                // Need to deep copy the geometry instances dictionary because we're prefixing the names
                node.geometryinstances = { };
                for (var gi in geometryinstances)
                {
                    if (geometryinstances.hasOwnProperty(gi))
                    {
                        node.geometryinstances[gi] = <GeometryInstanceParameters>
                            copyObject(geometryinstances[gi]);
                        var geometryInstance = node.geometryinstances[gi];

                        //Utilities.log("prefixing " + geometryInstance.geometry + " with " + shapesNamePrefix);
                        geometryInstance.geometry = shapesNamePrefix + "-" + geometryInstance.geometry;
                    }
                }
            }

            var fileChildren = fileNode.nodes;
            if (fileChildren)
            {
                node.nodes = {};
                for (var c in fileChildren)
                {
                    if (fileChildren.hasOwnProperty(c))
                    {
                        var childPath = nodePath + "/" + c;
                        if (!nodesMap[childPath])
                        {
                            node.nodes[c] = resolveNode(fileChildren[c], c, nodePath);
                            nodesMap[childPath] = node.nodes[c];
                        }
                    }
                }
            }

            return node;
        }

        var fileNodes = sceneData.nodes;
        var parentNode = loadParams.parentNode;
        for (var fn in fileNodes)
        {
            if (fileNodes.hasOwnProperty(fn) && fileNodes[fn])
            {
                var nodeName = fn;
                var fileNode =
                    resolveNode(fileNodes[fn], nodeName, nodesNamePrefix);
                var nodePath = (nodesNamePrefix ? (nodesNamePrefix + "/" + fn) : fn);
                var overloadedNode = nodesMap[nodePath];

                if (overloadedNode)
                {
                    //Utilities.log("Overloaded node '" + nodePath + "'");

                    var overloadedMatrix = overloadedNode.matrix;
                    if (overloadedMatrix && fileNode.matrix)
                    {
                        overloadedNode.matrix = VMath.m43Mul(fileNode.matrix, overloadedMatrix);
                        overloadedMatrix = null;
                    }

                    var overloadedChildren = overloadedNode.nodes;
                    if (overloadedChildren && fileNode.nodes)
                    {
                        //Utilities.log("Concat children of node '" + nodePath + "'");
                        for (var c in fileNode.nodes)
                        {
                            if (fileNode.nodes.hasOwnProperty(c))
                            {
                                overloadedChildren[c] = fileNode.nodes[c];
                            }
                        }
                    }
                    else if (fileNode.nodes)
                    {
                        overloadedNode.nodes = fileNode.nodes;
                    }

                    for (var on in fileNode)
                    {
                        if (fileNode.hasOwnProperty(on))
                        {
                            overloadedNode[on] = fileNode[on];
                        }
                    }
                    fileNode = overloadedNode;
                }
                else
                {
                    if (loadParams.isReference && parentNode)
                    {
                        if (!parentNode.nodes)
                        {
                            parentNode.nodes = {};
                        }
                        parentNode.nodes[fn] = fileNode;
                    }
                    else
                    {
                        this.data.nodes[fn] = fileNode;
                    }

                    nodesMap[nodePath] = fileNode;
                }
            }
        }

        this.numReferencesPending += numReferences;
        //Utilities.log("total refs now " + this.numReferencesPending);
    };

    //
    // loadPhysicsNodes
    //
    resolvePhysicsNodes(loadParams)
    {
        var sceneData = loadParams.data;
        var nodesNamePrefix = loadParams.nodesNamePrefix;
        var shapesNamePrefix = loadParams.shapesNamePrefix;

        function begetFn(o)
        {
            var F = function () { };
            F.prototype = o;
            return new F();
        }

        var fileModels = sceneData.physicsmodels;
        var targetFileModels = this.data.physicsmodels;
        if (!targetFileModels)
        {
            targetFileModels = {};
            this.data.physicsmodels = targetFileModels;
        }

        for (var fm in fileModels)
        {
            if (fileModels.hasOwnProperty(fm))
            {
                var fileModel = fileModels[fm];

                if (shapesNamePrefix)
                {
                    var newModelName = shapesNamePrefix ? shapesNamePrefix + "-" + fm : fm;

                    var model = begetFn(fileModel);
                    targetFileModels[newModelName] = model;

                    var geometry = model.geometry;
                    if (geometry)
                    {
                        model.geometry = shapesNamePrefix ? shapesNamePrefix + "-" + geometry : geometry;
                    }
                }
                else
                {
                    targetFileModels[fm] = fileModel;
                }
            }
        }

        var fileNodes = sceneData.physicsnodes;
        var targetFileNodes = this.data.physicsnodes;
        if (!targetFileNodes)
        {
            targetFileNodes = {};
            this.data.physicsnodes = targetFileNodes;
        }

        for (var fn in fileNodes)
        {
            if (fileNodes.hasOwnProperty(fn))
            {
                var fileNode = fileNodes[fn];

                if (nodesNamePrefix || shapesNamePrefix)
                {
                    var targetName = fileNode.target;
                    targetName = nodesNamePrefix ? (nodesNamePrefix + "/" + targetName) : targetName;

                    var node = begetFn(fileNode);
                    node.target = targetName;

                    node.body = shapesNamePrefix ? shapesNamePrefix + "-" + fileNode.body : fileNode.body;

                    var newNodeName = nodesNamePrefix ? (nodesNamePrefix + "/" + fn) : fn;
                    targetFileNodes[newNodeName] = node;
                }
                else
                {
                    targetFileNodes[fn] = fileNode;
                }
            }
        }
    };

    //
    // loadAreas
    //
    resolveAreas(loadParams)
    {
        var sceneData = loadParams.data;

        var fileAreas = sceneData.areas;
        if (!fileAreas)
        {
            return;
        }

        var numFileAreas = fileAreas.length;
        if (numFileAreas <= 0)
        {
            return;
        }

        var targetAreas = this.data.areas;
        if (!targetAreas)
        {
            targetAreas = [];
            this.data.areas = targetAreas;
        }

        var nodesNamePrefix = loadParams.nodesNamePrefix;

        for (var fa = 0; fa < numFileAreas; fa += 1)
        {
            var fileArea = fileAreas[fa];

            if (nodesNamePrefix)
            {
                var targetName = fileArea.target;
                fileArea.target = (nodesNamePrefix + "/" + targetName);
            }
            targetAreas.push(fileArea);
        }
    };

    //
    // resolve
    //
    resolve(loadParams)
    {
        if (!loadParams.append)
        {
            this.data = { nodes: {} };
        }

        // Start by simply copying any dictionaries which we don't special case
        var appendData = loadParams.data;
        for (var d in appendData)
        {
            if (d !== "nodes" &&
                d !== "skeletons" &&
                d !== "geometries" &&
                d !== "animations" &&
                d !== "areas" &&
                d !== "physicsnodes" &&
                d !== "physicsmodels")
            {
                if (appendData.hasOwnProperty(d))
                {
                    var dict = appendData[d];
                    var targetDict = this.data[d];
                    if (!targetDict)
                    {
                        this.data[d] = dict;
                    }
                    else
                    {
                        for (var e in dict)
                        {
                            if (dict.hasOwnProperty(e) && !targetDict[e])
                            {
                                targetDict[e] = dict[e];
                            }
                        }
                    }
                }
            }
        }

        this.resolveShapes(loadParams);

        this.resolveSkeletons(loadParams);

        this.resolveAnimations(loadParams);

        this.resolveNodes(loadParams);

        this.resolvePhysicsNodes(loadParams);

        this.resolveAreas(loadParams);

        if (loadParams.isReference)
        {
            this.numReferencesPending -= 1;
            //Utilities.log("loaded ref now " + this.numReferencesPending);
        }

        if (this.numReferencesPending <= 0)
        {
            this.endLoading(loadParams.onload);
        }

    };

    //
    // load
    //
    load(assetPath, loadParams)
    {
        var loader = this;
        var dataReceived = function dataReceivedFn(text)
        {
            var sceneData = {};
            if (text)
            {
                sceneData = JSON.parse(text);
            }

            loadParams.data = sceneData;
            loadParams.append = false;
            loader.resolve(loadParams);
        };

        loadParams.requestHandler.request({
                src: assetPath,
                requestOwner: loadParams.request ? loadParams : TurbulenzEngine,
                onload: dataReceived
            });
    };

    // Constructor function
    static create() : ResourceLoader
    {
        var rl = new ResourceLoader();
        rl.clear();

        rl.skeletonNames = {};

        return rl;
    };
};