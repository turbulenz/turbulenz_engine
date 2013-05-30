// Copyright (c) 2011-2013 Turbulenz Limited

/*global TurbulenzServices: false*/
/*global TurbulenzEngine: false*/
/*global TurbulenzBridge: false*/
/*global debug: false*/

/// <reference path="turbulenzservices.ts" />

interface DataShareManagerCreateDataShareCB
{
    (datashare: DataShare): void;
};

interface DataShareManagerErrorCB
{
    (msg: string, status?: number, fn_called?: any, parameters_given?: any[]): void;
};

interface DataShareManagerFindDataSharesCB
{
    user?: string;
    friendsOnly?: bool;
    callback: {
        (dataShares: DataShare[]): void;
    };
    errorCallback?: DataShareManagerErrorCB;
};

interface DataShareJoinCB
{
    (success: bool): void;
};

interface DataShareGetCBData
{
    value: string;
    access: number;
};

interface DataShareGetCB
{
    (data: DataShareGetCBData): void;
};

interface DataShareKeysSummary
{
    key: string;
    ownedBy: string;
    access: number;
};

interface DataShareGetKeysCB
{
    (keys: DataShareKeysSummary[]): void;
};

interface DataShareCompareAndSetParams
{
    key: string;
    value: string;
    access?: number;
    callback?: {
        (wasSet: bool, reason?: string): void; // reason - either 'changed' or 'read_only'
    };
    errorCallback?: DataShareManagerErrorCB;
};

interface DataShareCreateParams
{
    id: string;
    created: number;
    owner: string;
    users: string[];
    joinable: bool;
};

//
// DataShare
//
class DataShare
{
    static version = 1;

    static keyValidate = new RegExp('[A-Za-z0-9]+([\-\.][A-Za-z0-9]+)*');

    static publicReadOnly = 0;
    static publicReadAndWrite = 1;

    static notSetReason = {
        changed: 'changed',
        readOnly: 'readOnly',
        readAndWrite: 'readAndWrite'
    };

    gameSession: GameSession;
    gameSessionId: string;
    errorCallbackFn: DataShareManagerErrorCB;
    service: ServiceRequester;
    requestHandler: RequestHandler;

    id: string;
    tokens: {
        [key: string]: string;
    };
    created: number;
    owner: string;
    users: string[];
    joinable: bool;

    validateKey(key: string): void
    {
        if (!key || typeof(key) !== "string")
        {
            throw new Error("Invalid key string (Key string is empty or not a string)");
        }

        if (!DataShare.keyValidate.test(key))
        {
            throw new Error("Invalid key string (Only alphanumeric characters and .- are permitted)");
        }
    }

    getKey(params: any): string
    {
        var key;
        if (params.hasOwnProperty('key'))
        {
            key = params.key;
            this.validateKey(key);
        }
        else
        {
            throw new Error('Key missing from parameters');
        }
        return key;
    };

    getAccess(params: any): bool
    {
        var access;
        if (params.hasOwnProperty('access'))
        {
            access = params.access;
            if (access !== DataShare.publicReadOnly && access !== DataShare.publicReadAndWrite)
            {
                throw new Error('Access must be publicReadOnly or publicReadAndWrite');
            }
        }
        else
        {
            access = null; // default value is set server-side
        }
        return access;
    };

    isJoined(username: string): bool
    {
        var users = this.users;
        var usersLength = users.length;
        var usersIndex;
        var lowerUsername = username.toLowerCase();

        for (usersIndex = 0; usersIndex < usersLength; usersIndex += 1)
        {
            if (lowerUsername === users[usersIndex].toLowerCase())
            {
                return true;
            }
        }
        return false;
    };

    join(callbackFn?: DataShareJoinCB, errorCallbackFn?: DataShareManagerErrorCB): void
    {
        var that = this;
        var dataShareJoinCallback =
            function dataShareJoinCallbackFn(jsonResponse, status)
        {
            var errorCallback = errorCallbackFn || that.errorCallbackFn;
            if (status === 200)
            {
                that.users = <string[]> jsonResponse.data.users;
                that.joinable = true;
                if (callbackFn)
                {
                    callbackFn(true);
                }
            }
            else if (status === 403) // 403 Forbidden
            {
                that.joinable = false;
                if (callbackFn)
                {
                    callbackFn(false);
                }
            }
            else if (errorCallback)
            {
                errorCallback("DataShare.join failed with " +
                              "status " + status + ": " + jsonResponse.msg,
                              status,
                              that.join,
                              [callbackFn]);
            }
        };

        this.service.request({
                url: '/api/v1/data-share/join/' + this.gameSession.gameSlug + '/' + this.id,
                method: 'POST',
                callback: dataShareJoinCallback,
                requestHandler: this.requestHandler
            });
    };

    setJoinable(joinable, callbackFn?: {(): void;}, errorCallbackFn?: DataShareManagerErrorCB): void
    {
        var that = this;
        var dataShareSetJoinableCallback =
            function dataShareSetJoinableCallbackFn(jsonResponse, status)
        {
            var errorCallback = errorCallbackFn || that.errorCallbackFn;
            if (status === 200)
            {
                if (callbackFn)
                {
                    callbackFn();
                }
            }
            else if (errorCallback)
            {
                errorCallback("DataShare.setJoinable failed with " +
                              "status " + status + ": " + jsonResponse.msg,
                              status,
                              that.setJoinable,
                              [joinable, callbackFn]);
            }
        };

        if (joinable)
        {
            joinable = 1;
        }
        else
        {
            joinable = 0;
        }

        this.service.request({
                url: '/api/v1/data-share/set-properties/' + this.gameSession.gameSlug + '/' + this.id,
                method: 'POST',
                data: {
                    joinable: joinable
                },
                callback: dataShareSetJoinableCallback,
                requestHandler: this.requestHandler
            });
    };

    leave(callbackFn?: {(): void;}, errorCallbackFn?: DataShareManagerErrorCB): void
    {
        var that = this;
        var dataShareLeaveCallback =
            function dataShareLeaveCallbackFn(jsonResponse, status)
        {
            var errorCallback = errorCallbackFn || that.errorCallbackFn;
            // 403 Forbidden - the player is not joined to the data share
            // 404 Missing - the data share no longer exists
            if (status === 200 || status === 403 || status === 404)
            {
                if (callbackFn)
                {
                    callbackFn();
                }
            }
            else if (errorCallback)
            {
                errorCallback("DataShare.leave failed with " +
                              "status " + status + ": " + jsonResponse.msg,
                              status,
                              that.leave,
                              [callbackFn]);
            }
        };

        this.service.request({
                url: '/api/v1/data-share/leave/' + this.gameSession.gameSlug + '/' + this.id,
                method: 'POST',
                callback: dataShareLeaveCallback,
                requestHandler: this.requestHandler
            });
    };

    getKeys(callbackFn: DataShareGetKeysCB, errorCallbackFn?: DataShareManagerErrorCB): void
    {
        var that = this;

        var dataShareGetKeysCallback =
            function dataShareGetKeysCallbackFn(jsonResponse, status)
        {
            var errorCallback = errorCallbackFn || that.errorCallbackFn;
            if (status === 200)
            {
                var keys = <DataShareKeysSummary[]> jsonResponse.data.keys;
                callbackFn(keys);
            }
            else if (errorCallback)
            {
                errorCallback("DataShare.getKeys failed with " +
                              "status " + status + ": " + jsonResponse.msg,
                              status,
                              that.getKeys,
                              [callbackFn]);
            }
        };

        this.service.request({
                url: '/api/v1/data-share/read/' + this.id,
                method: 'GET',
                data: {
                    gameSessionId: this.gameSessionId
                },
                callback: dataShareGetKeysCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
    };

    get(key: string, callbackFn: DataShareGetCB, errorCallbackFn?: DataShareManagerErrorCB): void
    {
        var that = this;
        this.validateKey(key);

        var dataShareGetCallback =
            function dataShareGetCallbackFn(jsonResponse, status)
        {
            var errorCallback = errorCallbackFn || that.errorCallbackFn;
            if (status === 200)
            {
                var responseData = jsonResponse.data;
                if (responseData === null)
                {
                    delete that.tokens[key];
                    callbackFn(responseData);
                }
                else
                {
                    that.tokens[key] = responseData.token;
                    callbackFn(<DataShareGetCBData> responseData);
                }
            }
            else if (errorCallback)
            {
                errorCallback("DataShare.get failed with " +
                              "status " + status + ": " + jsonResponse.msg,
                              status,
                              that.get,
                              [key, callbackFn]);
            }
        };

        this.service.request({
                url: '/api/v1/data-share/read/' + this.id + '/' + key,
                method: 'GET',
                data: {
                    gameSessionId: this.gameSessionId
                },
                callback: dataShareGetCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
    };

    checkUnauthoizedError(jsonResponse: any, status: number): string
    {
        // 403 - Forbidden
        if (status === 403 && jsonResponse.data && jsonResponse.data.reason)
        {
            if (jsonResponse.data.reason === 'read_only')
            {
                return DataShare.notSetReason.readOnly;
            }
            if (jsonResponse.data.reason === 'read_and_write')
            {
                return DataShare.notSetReason.readAndWrite;
            }
        }
        return null;
    };

    set(params: DataShareCompareAndSetParams): void
    {
        var that = this;
        var key = this.getKey(params);

        var dataShareSetCallback = function dataShareSetCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                var token = jsonResponse.data.token;
                if (token)
                {
                    that.tokens[key] = token;
                }
                else
                {
                    delete that.tokens[key];
                }
                if (params.callback)
                {
                    params.callback(true);
                }
            }
            else
            {
                var reason = that.checkUnauthoizedError(jsonResponse, status);
                if (reason)
                {
                    if (params.callback)
                    {
                        params.callback(false, reason);
                    }
                }
                else
                {
                    var errorCallback = params.errorCallback || that.errorCallbackFn;
                    if (errorCallback)
                    {
                        errorCallback("DataShare.set failed with " +
                                      "status " + status + ": " + jsonResponse.msg,
                                      status,
                                      that.set,
                                      [params]);
                    }
                }
            }
        };

        var dataSpec:any = {
            gameSessionId: this.gameSessionId,
            value: params.value
        };

        this.service.request({
                url: '/api/v1/data-share/set/' + this.id + '/' + key,
                method: 'POST',
                data: dataSpec,
                callback: dataShareSetCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
    };

    compareAndSet(params: DataShareCompareAndSetParams): void
    {
        var that = this;
        var key = this.getKey(params);

        var dataShareCompareAndSetCallback =
            function dataShareCompareAndSetCallbackFn(jsonResponse, status)
        {
            var errorCallback = params.errorCallback || that.errorCallbackFn;
            if (status === 200)
            {
                var responseData = jsonResponse.data;
                if (responseData.wasSet)
                {
                    if (responseData.token)
                    {
                        that.tokens[key] = responseData.token;
                    }
                    else
                    {
                        delete that.tokens[key];
                    }
                    if (params.callback)
                    {
                        params.callback(true);
                    }
                }
                else if (params.callback)
                {
                    params.callback(false, DataShare.notSetReason.changed);
                }
            }
            else
            {
                var reason = that.checkUnauthoizedError(jsonResponse, status);
                if (reason)
                {
                    if (params.callback)
                    {
                        params.callback(false, reason);
                    }
                }
                else
                {
                    var errorCallback = params.errorCallback || that.errorCallbackFn;
                    errorCallback("DataShare.compareAndSet failed with " +
                                  "status " + status + ": " + jsonResponse.msg,
                                  status,
                                  that.compareAndSet,
                                  [params]);
                }
            }
        };

        var dataSpec:any = {
            gameSessionId: this.gameSessionId,
            token: this.tokens[key] || '',
            value: params.value
        };
        var access = this.getAccess(params);
        if (access !== null)
        {
            dataSpec.access = access;
        }

        this.service.request({
                url: '/api/v1/data-share/compare-and-set/' + this.id + '/' + key,
                method: 'POST',
                data: dataSpec,
                callback: dataShareCompareAndSetCallback,
                requestHandler: this.requestHandler,
                encrypt: true
            });
    };

    static create(requestHandler: RequestHandler,
                  gameSession: GameSession,
                  params: DataShareCreateParams,
                  errorCallbackFn?: DataShareManagerErrorCB): DataShare
    {
        if (!TurbulenzServices.available())
        {
            debug.log("dataShareCreateFn: !! TurbulenzServices not available");

            // Call error callback on a timeout to get the same behaviour as the ajax call
            TurbulenzEngine.setTimeout(function () {
                if (errorCallbackFn)
                {
                    errorCallbackFn('DataShare.create requires Turbulenz services');
                }
            }, 0);
            return null;
        }

        var dataShare = new DataShare();

        dataShare.gameSession = gameSession;
        dataShare.gameSessionId = gameSession.gameSessionId;
        dataShare.errorCallbackFn = errorCallbackFn || TurbulenzServices.defaultErrorCallback;
        dataShare.service = TurbulenzServices.getService('datashare');
        dataShare.requestHandler = requestHandler;

        dataShare.id = params.id;
        dataShare.created = params.created;
        dataShare.owner = params.owner;
        dataShare.users = params.users;
        dataShare.joinable = params.joinable;

        dataShare.tokens = {};

        return dataShare;
    };
}

//
// DataShareManager
//
class DataShareManager
{
    static version = 1;

    gameSession: GameSession;
    gameSessionId: string;
    errorCallbackFn: DataShareManagerErrorCB;
    service: ServiceRequester;
    requestHandler: RequestHandler;

    createDataShare(callbackFn: DataShareManagerCreateDataShareCB, errorCallbackFn?: DataShareManagerErrorCB)
    {
        var that = this;

        var createDataShareCallback =
            function createDataShareCallbackFn(jsonResponse, status)
        {
            if (status === 200)
            {
                var dataShare = DataShare.create(that.requestHandler,
                                                 that.gameSession,
                                                 <DataShareCreateParams> jsonResponse.data.datashare,
                                                 errorCallback);
                callbackFn(dataShare);
            }
            else
            {
                var errorCallback = errorCallbackFn || that.errorCallbackFn;
                if (errorCallback)
                {
                    errorCallback("DataShareManager.createDataShare failed with " +
                                  "status " + status + ": " + jsonResponse.msg,
                                  status,
                                  that.createDataShare,
                                  [callbackFn, errorCallbackFn]);
                }
            }
        };

        var dataSpec = {
            gameSessionId: this.gameSessionId
        };

        this.service.request({
                url: '/api/v1/data-share/create/' + this.gameSession.gameSlug,
                method: 'POST',
                data: dataSpec,
                callback: createDataShareCallback,
                requestHandler: this.requestHandler
            });
    };

    findDataShares(params: DataShareManagerFindDataSharesCB)
    {
        var that = this;
        if (!params.callback)
        {
            throw new Error('findDataShares missing callback parameter');
        }

        var findDataSharesCallback =
            function findDataSharesCallbackFn(jsonResponse, status)
        {
            var errorCallback = params.errorCallback || that.errorCallbackFn;
            if (status === 200)
            {
                var id;
                var dataShareMeta = jsonResponse.data.datashares;
                var dataShares = [];

                var dataShareMetaLength = dataShareMeta.length;
                var dataShareMetaIndex;
                for (dataShareMetaIndex = 0; dataShareMetaIndex < dataShareMetaLength; dataShareMetaIndex += 1)
                {
                    dataShares.push(DataShare.create(that.requestHandler,
                                                     that.gameSession,
                                                     <DataShareCreateParams> dataShareMeta[dataShareMetaIndex],
                                                     errorCallback));
                }
                params.callback(dataShares);
            }
            else if (errorCallback)
            {
                errorCallback("DataShareManager.findDataShares failed with " +
                              "status " + status + ": " + jsonResponse.msg,
                              status,
                              that.findDataShares,
                              [params]);
            }
        };

        var dataSpec: any = {};

        if (params.user)
        {
            dataSpec.username = params.user;
        }

        if (params.friendsOnly)
        {
            dataSpec.friendsOnly = 1;
        }

        this.service.request({
                url: '/api/v1/data-share/find/' + this.gameSession.gameSlug,
                method: 'GET',
                data: dataSpec,
                callback: findDataSharesCallback,
                requestHandler: this.requestHandler
            });
    };

    static create(requestHandler: RequestHandler,
                  gameSession: GameSession,
                  errorCallbackFn?: DataShareManagerErrorCB): DataShareManager
    {
        if (!TurbulenzServices.available())
        {
            debug.log("dataShareManagerCreateFn: !! TurbulenzServices not available");

            // Call error callback on a timeout to get the same behaviour as the ajax call
            if (errorCallbackFn)
            {
                TurbulenzEngine.setTimeout(function () {
                    errorCallbackFn('DataShareManager.create requires Turbulenz services');
                }, 0);
            }
            return null;
        }

        var dataShareManager = new DataShareManager();

        dataShareManager.gameSession = gameSession;
        dataShareManager.gameSessionId = gameSession.gameSessionId;
        dataShareManager.errorCallbackFn = errorCallbackFn || TurbulenzServices.defaultErrorCallback;
        dataShareManager.service = TurbulenzServices.getService('datashare');
        dataShareManager.requestHandler = requestHandler;

        return dataShareManager;
    };
};
