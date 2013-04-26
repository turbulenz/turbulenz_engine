// Copyright (c) 2011 Turbulenz Limited

/*global TurbulenzServices: false*/

/// <reference path="turbulenzservices.ts" />

//
// API
//
interface UserDataManagerDataSpec
{
    gameSessionId: string;
    value?: any;
    key?: string;
};
interface UserDataErrorFn
{
    (msg: string, status?: number, fn?: any, cb?: any[]): void;
}

class UserDataManager
{
    static version = 1;

    keyValidate = new RegExp("^[A-Za-z0-9]+([\\-\\.][A-Za-z0-9]+)*$");

    requestHandler: RequestHandler;
    errorCallbackFn: UserDataErrorFn;
    gameSessionId: string;
    service: ServiceRequester;

    validateKey(key): bool
    {
        if (!key || typeof(key) !== "string")
        {
            this.errorCallbackFn("Invalid key string (Key string is empty or not a string)");
            return false;
        }

        if (!this.keyValidate.test(key))
        {
            this.errorCallbackFn("Invalid key string (Only alphanumeric characters and .- are permitted)");
            return false;
        }

        return key;
    };

    getKeys(callbackFn, errorCallbackFn)
    {
        var that = this;
        var getKeysCallback = function getKeysCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(jsonResponse.keys || jsonResponse.array);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("UserDataManager.getKeys failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              that.getKeys,
                              [callbackFn]);
            }
        };

        var dataSpec : UserDataManagerDataSpec = {
            gameSessionId: that.gameSessionId,
        };

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.callOnBridge('userdata.getkeys', null, callbackFn);
        }
        else
        {
            this.service.request({
                url: '/api/v1/user-data/get-keys',
                method: 'GET',
                data: dataSpec,
                callback: getKeysCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    exists(key, callbackFn, errorCallbackFn)
    {
        if (!this.validateKey(key))
        {
            return;
        }

        var that = this;
        var existsCallback = function existsCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(key, jsonResponse.exists);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("UserDataManager.exists failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              that.exists,
                              [key, callbackFn]);
            }
        };

        var dataSpec = {
            gameSessionId: that.gameSessionId
        };

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.callOnBridge('userdata.exists', key, function unpackResponse(exists)
            {
                callbackFn(key, exists);
            });
        }
        else
        {
            this.service.request({
                url: '/api/v1/user-data/exists/' + key,
                method: 'GET',
                data: dataSpec,
                callback: existsCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    get(key, callbackFn, errorCallbackFn)
    {
        if (!this.validateKey(key))
        {
            return;
        }

        var that = this;
        var getCallback = function getCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(key, jsonResponse.value);
            }
            else if (status === 404)
            {
                callbackFn(key, null);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("UserDataManager.get failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              that.get,
                              [key, callbackFn]);
            }
        };

        var dataSpec = {
            gameSessionId: that.gameSessionId,
        };

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.callOnBridge('userdata.get', key, function unpackResponse(value)
            {
                callbackFn(key, value);
            });
        }
        else
        {
            this.service.request({
                url: '/api/v1/user-data/get/' + key,
                method: 'GET',
                data: dataSpec,
                callback: getCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    set(key, value, callbackFn, errorCallbackFn)
    {
        if (!this.validateKey(key))
        {
            return;
        }

        if (!value)
        {
            this.remove(key, callbackFn);
            return;
        }

        var that = this;
        var setCallback = function setCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(key);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("UserDataManager.set failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              that.set,
                              [key, value, callbackFn]);
            }
        };

        var dataSpec : UserDataManagerDataSpec = {
            gameSessionId: that.gameSessionId,
            value: value
        };

        var url = '/api/v1/user-data/set/' + key;

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.addSignature(dataSpec, url);
            dataSpec.key = key;
            TurbulenzServices.callOnBridge('userdata.set', dataSpec, function sendResponse()
            {
                callbackFn(key);
            });
        }
        else
        {
            this.service.request({
                url: url,
                method: 'POST',
                data : dataSpec,
                callback: setCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    remove(key, callbackFn, errorCallbackFn?)
    {
        if (!this.validateKey(key))
        {
            return;
        }

        var that = this;
        var removeCallback = function removeCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn(key);
            }
            else if (status === 404)
            {
                callbackFn(key);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("UserDataManager.remove failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              that.remove,
                              [key, callbackFn]);
            }
        };

        var dataSpec : UserDataManagerDataSpec = {
            gameSessionId: that.gameSessionId,
        };

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.callOnBridge('userdata.remove', key, function sendResponse()
            {
                callbackFn(key);
            });
        }
        else
        {
            this.service.request({
                url: '/api/v1/user-data/remove/' + key,
                method: 'POST',
                data: dataSpec,
                callback: removeCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    removeAll(callbackFn, errorCallbackFn)
    {
        var that = this;
        var removeAllCallback = function removeAllCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                callbackFn();
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                errorCallback("UserDataManager.removeAll failed with status " + status + ": " + jsonResponse.msg,
                              status,
                              that.removeAll,
                              [callbackFn]);
            }
        };

        var dataSpec : UserDataManagerDataSpec = {
            gameSessionId: that.gameSessionId,
        };

        if (TurbulenzServices.bridgeServices)
        {
            TurbulenzServices.callOnBridge('userdata.removeall', null, callbackFn);
        }
        else
        {
            this.service.request({
                url: '/api/v1/user-data/remove-all',
                method: 'POST',
                data: dataSpec,
                callback: removeAllCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
        }
    };

    // Constructor function
    static create(requestHandler: RequestHandler,
                  gameSession: GameSession,
                  errorCallbackFn: UserDataErrorFn): UserDataManager
    {
        var userdataManager;
        if (!TurbulenzServices.available())
        {
            return null;
        }

        userdataManager = new UserDataManager();
        userdataManager.requestHandler = requestHandler;
        userdataManager.errorCallbackFn = errorCallbackFn || TurbulenzServices.defaultErrorCallback;
        userdataManager.gameSessionId = gameSession.gameSessionId;

        userdataManager.service = TurbulenzServices.getService('userdata');

        return userdataManager;
    };
};