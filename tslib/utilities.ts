// Copyright (c) 2010-2013 Turbulenz Limited

/*global window: false*/
/*global Observer: false*/
/*global TurbulenzEngine: false*/
/*exported MathDeviceConvert*/

/// <reference path="turbulenz.d.ts" />

/// <reference path="observer.ts" />

interface Utilities
{
    skipAsserts: bool;
    assert: { (test: any, msg?: string): void; };
    beget: { (o: any): any; };
    log: { (... arguments: any[]): void; };
    nearestLowerPow2: { (num: number): number; };
    nearestUpperPow2: { (num: number): number; };
    ajax: { (params: any): void; };
    ajaxStatusCodes: any;
};
var Utilities : Utilities = {

    //
    // assert
    //
    skipAsserts: false,

    assert: function assertFn(test: any, message?: string)
    {
        if (!test)
        {
            if (!this.skipAsserts)
            {
                this.breakInDebugger.doesNotExist(); //Use a function that does not exist. This is caught in the debuggers.
            }
        }
    },

    //
    // beget
    //
    beget: function begetFn(o)
    {
        var F = function () { };
        F.prototype = o;
        return new F();
    },

    //
    // log
    //
    log: function logFn(a: any, b: any)
    {
        var console = window.console;
        if (console)
        {
            // "console.log.apply" will crash when using the plugin on Chrome...
            switch (arguments.length)
            {
            case 1:
                console.log(arguments[0]);
                break;
            case 2:
                console.log(arguments[0], arguments[1]);
                break;
            case 3:
                console.log(arguments[0], arguments[1], arguments[2]);
                break;
            case 4:
                console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
                break;
            default:
                // Note: this will fail if using printf-style string formatting
                var args = [].splice.call(arguments, 0);
                console.log(args.join(' '));
                break;
            }
        }
    },

    nearestLowerPow2: function UtilitiesNearestLowerPow2(num)
    {
        num = num | (num >>> 1);
        num = num | (num >>> 2);
        num = num | (num >>> 4);
        num = num | (num >>> 8);
        num = num | (num >>> 16);
        return (num - (num >>> 1));
    },

    nearestUpperPow2: function UtilitiesNearestUpperPow2(num)
    {
        /*jshint bitwise: false*/
        num = num - 1;
        num = num | (num >>> 1);
        num = num | (num >>> 2);
        num = num | (num >>> 4);
        num = num | (num >>> 8);
        num = num | (num >>> 16);
        return (num + 1);
    },

    //
    // ajax
    //
    ajax: function utilitiesAjaxFn(params)
    {
        // parameters
        var requestText = "";
        var method = params.method;
        var data = params.data || {};
        var encrypted = params.encrypt;
        var signature = null;
        var url = params.url;
        var requestHandler = params.requestHandler;
        var callbackFn = params.callback;

        if (encrypted)
        {
            data.requestUrl = url;

            var str = JSON.stringify(data);

            if (method === "POST")
            {
                str = TurbulenzEngine.encrypt(str);
            }

            requestText += "data=" + encodeURIComponent(str) + "&";

            requestText += "gameSessionId=" + encodeURIComponent(data.gameSessionId);

            signature = TurbulenzEngine.generateSignature(str);
        }
        else if (data)
        {
            var key;
            for (key in data)
            {
                if (data.hasOwnProperty(key))
                {
                    if (requestText.length !== 0)
                    {
                        requestText += "&";
                    }
                    if (method === "POST")
                    {
                        requestText += key + "=" + data[key];
                    }
                    else
                    {
                        requestText += encodeURIComponent(key) + "=" +
                            encodeURIComponent(data[key]);
                    }
                }
            }
        }

        var httpResponseCallback = function httpResponseCallbackFn(xhrResponseText, xhrStatus)
        {
            // break circular reference
            var xhr = this.xhr;
            this.xhr.onreadystatechange = null;
            this.xhr = null;

            var response;

            response = JSON.parse(xhrResponseText);
            if (encrypted)
            {
                var sig = xhr.getResponseHeader("X-TZ-Signature");
                var validSignature = TurbulenzEngine.verifySignature(xhrResponseText, sig);
                xhrResponseText = null;

                TurbulenzEngine.setTimeout(function () {
                    var receivedUrl = response.requestUrl;

                    if (validSignature)
                    {
                        if (!TurbulenzEngine.encryptionEnabled || receivedUrl === url)
                        {
                            callbackFn(response, xhrStatus);
                            callbackFn = null;
                            return;
                        }
                    }

                    // If it was a server-side verification fail then pass through the actual message
                    if (xhrStatus === 400)
                    {
                        callbackFn(response, xhrStatus, "Verification Failed");
                    }
                    else
                    {
                        // Else drop reply
                        callbackFn({msg: "Verification failed", ok: false}, 400, "Verification Failed");
                    }
                    callbackFn = null;
                }, 0);
            }
            else
            {
                xhrResponseText = null;

                TurbulenzEngine.setTimeout(function () {
                    callbackFn(response, xhrStatus);
                    callbackFn = null;
                }, 0);
            }
        };

        var httpRequest = function httpRequestFn(url, onload, callContext)
        {
            var xhr;
            if (window.XMLHttpRequest)
            {
                xhr = new window.XMLHttpRequest();
            }
            else if (window.ActiveXObject)
            {
                xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
            }
            else
            {
                if (params.error)
                {
                    params.error("No XMLHTTPRequest object could be created");
                }
                return;
            }
            callContext.xhr = xhr;

            var httpCallback = function httpCallbackFn()
            {
                if (xhr.readyState === 4 && TurbulenzEngine && !TurbulenzEngine.isUnloading()) /* 4 == complete */
                {
                    var xhrResponseText = xhr.responseText;
                    var xhrStatus = xhr.status;
                    // Checking xhrStatusText when xhrStatus is 0 causes a silent error!
                    var xhrStatusText = (xhrStatus !== 0 && xhr.statusText) || "No connection or cross domain request";

                    // Sometimes the browser sets status to 200 OK when the connection is closed
                    // before the message is sent (weird!).
                    // In order to address this we fail any completely empty responses.
                    // Hopefully, nobody will get a valid response with no headers and no body!
                    if (xhr.getAllResponseHeaders() === "" && xhrResponseText === "" && xhrStatus === 200 && xhrStatusText === 'OK')
                    {
                        onload('', 0);
                        return;
                    }

                    onload.call(callContext, xhrResponseText, xhrStatus);
                }
            };

            // Send request
            xhr.open(method, ((requestText && (method !== "POST")) ? url + "?" + requestText : url), true);
            if (callbackFn)
            {
                xhr.onreadystatechange = httpCallback;
            }

            if (signature)
            {
                xhr.setRequestHeader("X-TZ-Signature", signature);
            }

            if (method === "POST")
            {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                xhr.send(requestText);
            }
            else // method === 'GET'
            {
                xhr.send();
            }
        };

        if (requestHandler)
        {
            requestHandler.request({
                src: url,
                requestFn: httpRequest,
                responseFilter: params.responseFilter,
                onload: httpResponseCallback
            });
        }
        else
        {
            var callContext = {
                src: url
            };
            httpRequest(url, httpResponseCallback, callContext);
        }
    },


    //
    // ajaxStatusCodes
    //

    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html#sec6.1
    ajaxStatusCodes: {
        0: "No Connection, Timeout Or Cross Domain Request",
        100: "Continue",
        101: "Switching Protocols",
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Time-out",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Large",
        415: "Unsupported Media Type",
        416: "Requested range not satisfiable",
        417: "Expectation Failed",
        429: "Too Many Requests",
        480: "Temporarily Unavailable",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Time-out",
        505: "HTTP Version not supported"
    },
};

var MathDeviceConvert =
{
    v2ToArray : function v2ToJavaScriptArrayFn(v2)
    {
        return [v2[0], v2[1]];
    },

    arrayToV2 : function arrayToV2Fn(mathDevice, v2Array, v2Dest)
    {
        return mathDevice.v2Build(v2Array[0], v2Array[1], v2Dest);
    },

    v3ToArray : function v3ToJavaScriptArrayFn(v3)
    {
        return [v3[0], v3[1], v3[2]];
    },

    arrayToV3 : function arrayToV3Fn(mathDevice, v3Array, v3Dest)
    {
        return mathDevice.v3Build(v3Array[0], v3Array[1], v3Array[2], v3Dest);
    },

    v4ToArray : function v4ToJavaScriptArrayFn(v4)
    {
        return [v4[0], v4[1], v4[2], v4[3]];
    },

    arrayToV4 : function arrayToV4Fn(mathDevice, v4Array, v4Dest)
    {
        return mathDevice.v4Build(v4Array[0], v4Array[1], v4Array[2], v4Array[3], v4Dest);
    },

    quatToArray : function quatToJavaScriptArrayFn(quat)
    {
        return [quat[0], quat[1], quat[2], quat[3]];
    },

    arrayToQuat : function arrayToQuatFn(mathDevice, quatArray, quatDest)
    {
        return mathDevice.quatBuild(quatArray[0], quatArray[1], quatArray[2], quatArray[3], quatDest);
    },

    aabbToArray : function aabbToJavaScriptArrayFn(aabb)
    {
        return [aabb[0], aabb[1], aabb[2],
                aabb[3], aabb[4], aabb[5]];
    },

    arrayToAABB : function arrayToQuatFn(mathDevice, aabbArray, aabbDest)
    {
        return mathDevice.aabbBuild(aabbArray[0], aabbArray[1], aabbArray[2],
                                    aabbArray[3], aabbArray[4], aabbArray[5], aabbDest);
    },

    quatPosToArray : function quatPosToJavaScriptArrayFn(quatPos)
    {
        return [quatPos[0], quatPos[1], quatPos[2], quatPos[3],
                quatPos[4], quatPos[5], quatPos[6]];
    },

    arrayToQuatPos : function arrayToQuatPosFn(mathDevice, quatPosArray, quatPosDest)
    {
        return mathDevice.quatPosBuild(quatPosArray[0], quatPosArray[1], quatPosArray[2], quatPosArray[3],
                                       quatPosArray[4], quatPosArray[5], quatPosArray[6], quatPosDest);
    },

    m33ToArray : function m33ToJavaScriptArrayFn(m33)
    {
        return [m33[0], m33[1], m33[2],
                m33[3], m33[4], m33[5],
                m33[6], m33[7], m33[8]];
    },

    arrayToM33 : function arrayToM33Fn(mathDevice, m33Array, m33Dest)
    {
        return mathDevice.m33Build(m33Array[0], m33Array[1], m33Array[2],
                                   m33Array[3], m33Array[4], m33Array[5],
                                   m33Array[6], m33Array[7], m33Array[8], m33Dest);
    },

    m43ToArray : function m43ToJavaScriptArrayFn(m43)
    {
        return [m43[0], m43[ 1], m43[ 2],
                m43[3], m43[ 4], m43[ 5],
                m43[6], m43[ 7], m43[ 8],
                m43[9], m43[10], m43[11]];
    },

    arrayToM43 : function arrayToM43Fn(mathDevice, m43Array, m43Dest)
    {
        return mathDevice.m43Build(m43Array[0], m43Array[ 1], m43Array[ 2],
                                   m43Array[3], m43Array[ 4], m43Array[ 5],
                                   m43Array[6], m43Array[ 7], m43Array[ 8],
                                   m43Array[9], m43Array[10], m43Array[11], m43Dest);
    },

    m34ToArray : function m34ToJavaScriptArrayFn(m34)
    {
        return [m34[0], m34[1], m34[ 2], m34[ 3],
                m34[4], m34[5], m34[ 6], m34[ 7],
                m34[8], m34[9], m34[10], m34[11]];
    },

    m44ToArray : function m44ToJavaScriptArrayFn(m44)
    {
        return [m44[ 0], m44[ 1], m44[ 2], m44[ 3],
                m44[ 4], m44[ 5], m44[ 6], m44[ 7],
                m44[ 8], m44[ 9], m44[10], m44[11],
                m44[12], m44[13], m44[14], m44[15]];
    },

    arrayToM44 : function arrayToM44Fn(mathDevice, m44Array, m44Dest)
    {
        return mathDevice.m44Build(m44Array[ 0], m44Array[ 1], m44Array[ 2], m44Array[ 3],
                                   m44Array[ 4], m44Array[ 5], m44Array[ 6], m44Array[ 7],
                                   m44Array[ 8], m44Array[ 9], m44Array[10], m44Array[11],
                                   m44Array[12], m44Array[13], m44Array[14], m44Array[15], m44Dest);
    }
};


//
//Reference
//

// Proxy reference class allowing weak reference to the object
class Reference
{
    static version = 1;

    object            : any;
    referenceCount    : number;
    destroyedObserver : Observer;

    //
    // add
    //
    add()
    {
        this.referenceCount += 1;
    };

    //
    // remove
    //
    remove()
    {
        this.referenceCount -= 1;
        if (this.referenceCount === 0)
        {
            if (this.destroyedObserver)
            {
                this.destroyedObserver.notify(this.object);
            }
            this.object.destroy();
            this.object = null;
        }
    };

    //
    //subscribeDestroyed
    //
    subscribeDestroyed(observerFunction)
    {
        if (!this.destroyedObserver)
        {
            this.destroyedObserver = Observer.create();
        }
        this.destroyedObserver.subscribe(observerFunction);
    };

    //
    //unsubscribeDestroyed
    //
    unsubscribeDestroyed(observerFunction)
    {
        this.destroyedObserver.unsubscribe(observerFunction);
    };

    //
    // create
    //
    static create(object) : Reference
    {
        var result = new Reference();
        result.object = object;
        result.referenceCount = 0;
        return result;
    };
};

//
// Profile
//
var Profile =
{
    profiles: {},

    sortMode: {alphabetical: 0, duration: 1, max: 2, min: 3, calls: 4},

    //
    // start
    //
    start: function profileStartFn(name)
    {
        var data = this.profiles[name];
        if (!data)
        {
            data = {name: name, calls: 0, duration: 0.0, min: Number.MAX_VALUE, max: 0.0, sumOfSquares: 0.0};
            this.profiles[name] = data;
        }
        data.start = TurbulenzEngine.time;
    },

    //
    // stop
    //
    stop: function profileStopFn(name)
    {
        var end = TurbulenzEngine.time;
        var data = this.profiles[name];
        if (data)
        {
            var duration = end - data.start;
            data.duration += duration;
            data.calls += 1;
            data.sumOfSquares += duration * duration;

            if (duration > data.max)
            {
                data.max = duration;
            }

            if (duration < data.min)
            {
                data.min = duration;
            }
        }
    },

    //
    // reset
    //
    reset: function profileResetFn()
    {
        this.profiles = {};
    },

    //
    // getReport
    //
    getReport: function profileGetReportFn(sortMode, format)
    {
        var dataArray = [];
        var data;
        var maxDuration = 0.0;
        var name;
        for (name in this.profiles)
        {
            if (this.profiles.hasOwnProperty(name))
            {
                data = this.profiles[name];
                if (maxDuration < data.duration)
                {
                    maxDuration = data.duration;
                }
                dataArray.push(data);
            }
        }

        var compareFunction;

        if (sortMode === Profile.sortMode.alphabetical)
        {
            compareFunction = function compareName(left, right)
                            {
                                return (left.name < right.name) ? -1 : (left.name > right.name) ? 1 : 0;
                            };
        }
        else if (sortMode === Profile.sortMode.max)
        {
            compareFunction = function compareMax(left, right)
                            {
                                return right.max - left.max;
                            };
        }
        else if (sortMode === Profile.sortMode.min)
        {
            compareFunction = function compareMin(left, right)
                            {
                                return right.min - left.min;
                            };
        }
        else if (sortMode === Profile.sortMode.calls)
        {
            compareFunction = function compareCalls(left, right)
                            {
                                return right.calls - left.calls;
                            };
        }
        else // Profile.sortMode.duration or undefined
        {
            compareFunction = function compareDuration(left, right)
                            {
                                return right.duration - left.duration;
                            };
        }

        dataArray.sort(compareFunction);

        var line;
        var text = "";
        var precision = format ? format.precision : 8;
        var percentagePrecision = format ? format.percentagePrecision : 1;
        var seperator = format ? format.seperator : " ";
        var length = dataArray.length;
        var standardDeviation;
        var mean;
        var index;
        for (index = 0; index < length; index += 1)
        {
            data = dataArray[index];
            line = data.name;
            line += seperator + data.calls;
            line += seperator + data.duration.toFixed(precision);
            line += seperator + data.max.toFixed(precision);
            line += seperator + data.min.toFixed(precision);
            mean = data.duration / data.calls;
            line += seperator + mean.toFixed(precision);
            standardDeviation = Math.sqrt(data.sumOfSquares / data.calls - mean * mean);
            line += seperator + standardDeviation.toFixed(precision);
            line += seperator + (100 * data.duration / maxDuration).toFixed(percentagePrecision) + "%\n";
            text += line;
        }
        return text;
    }
};

//
// Utilities to use with TurbulenzEngine.stopProfiling() object.
//
declare var JSProfiling :
{
    createArray(rootNode: any): any[];
    sort(array: any[], propertyName: string, descending: bool): void;
}

var JSProfiling = {};

//
// createArray
//      Creates an array of nodes by merging all duplicate function references in the call profile tree together.
JSProfiling.createArray = function JSProfilingCreateArrayFn(rootNode)
{
    var map = {};
    var array = [];

    if (rootNode.head)
    {
        rootNode = rootNode.head; // Chrome native profiler.
    }

    var processNode = function processNodeFn(node)
    {
        var urlObject = map[node.url];
        if (!urlObject)
        {
            urlObject = {};
            map[node.url] = urlObject;
        }

        var functionName = node.functionName === "" ? "(anonymous)" : node.functionName;

        var functionObject = urlObject[functionName];
        if (!functionObject)
        {
            functionObject = {};
            urlObject[functionName] = functionObject;
        }

        var existingNode = functionObject[node.lineNumber];
        if (!existingNode)
        {
            var newNode = { functionName : functionName,
                            numberOfCalls : node.numberOfCalls,
                            totalTime : node.totalTime,
                            selfTime : node.selfTime,
                            url : node.url,
                            lineNumber : node.lineNumber
                           };

            array[array.length] = newNode;
            functionObject[node.lineNumber] = newNode;
        }
        else
        {
            existingNode.totalTime += node.totalTime;
            existingNode.selfTime += node.selfTime;
            existingNode.numberOfCalls += node.numberOfCalls;
        }

        var children = typeof node.children === 'function' ? node.children(): node.children;
        if (children)
        {
            var numberOfChildren = children.length;
            var childIndex;
            for (childIndex = 0; childIndex < numberOfChildren; childIndex += 1)
            {
                processNode(children[childIndex]);
            }
        }
    };

    processNode(rootNode);

    return array;
};

//
// sort
//
JSProfiling.sort = function JSProfilingSortFn(array, propertyName, descending)
{
    if (!propertyName)
    {
        propertyName = "totalTime";
    }

    var sorterAscending = function (left, right)
    {
        return left[propertyName] - right[propertyName];
    };

    var sorterDescending = function (left, right)
    {
        return right[propertyName] - left[propertyName];
    };

    if (descending === false)
    {
        array.sort(sorterAscending);
    }
    else
    {
        array.sort(sorterDescending);
    }
};
