// Copyright (c) 2011 Turbulenz Limited

/*global TurbulenzServices: false*/

/// <reference path="turbulenzservices.ts" />

interface MappingTableErrorCB { (errMsg: string, status?: number): void; };
interface MappingTableOnloadCB { (mappingTable: MappingTable): void; };

interface MappingTableDataURNMapping
{
    [logical: string]: string;
};

interface MappingTableDataOverride
{
    urnmapping : MappingTableDataURNMapping;
    parent?    : string;
};

interface MappingTableData
{
    urnmapping    : MappingTableDataURNMapping;
    overrides?    : { [profile: string]: MappingTableDataOverride; };

    urnremapping? : MappingTableDataURNMapping; // legacy?
    version?      : number;
};

interface MappingTableParameters
{
    mappingTableURL?   : string;
    mappingTableData?  : string;

    requestHandler?    : RequestHandler;
    mappingTablePrefix : string; // Added to all physical paths
    assetPrefix        : string; // Added to paths not found in table

    onload             : MappingTableOnloadCB;
    errorCallback?     : MappingTableErrorCB;
};

class MappingTable
{
    static version = 1;

    private mappingTableURL : string;
    private tablePrefix     : string;
    private assetPrefix     : string;

    private urlMapping      : MappingTableDataURNMapping;
    private overrides       : { [profile: string]: MappingTableDataOverride; };
    private errorCallbackFn : MappingTableErrorCB;
    private currentProfile  : string;

    getURL(assetPath: string, missingCallbackFn: MappingTableErrorCB): string
    {
        var overrides = this.overrides;
        var profile = this.currentProfile;
        var override = overrides[profile];

        var url;
        while (override)
        {
            url = override.urnmapping[assetPath];
            if (url)
            {
                return url;
            }

            override = overrides[override.parent];
        }

        url = this.urlMapping[assetPath];
        if (url)
        {
            return url;
        }
        else
        {
            if (missingCallbackFn)
            {
                missingCallbackFn(assetPath);
            }
            return (this.assetPrefix + assetPath);
        }
    };

    // Overides and previously set mapping
    setMapping(mapping: MappingTableDataURNMapping)
    {
        this.urlMapping = mapping;
    };

    map(logicalPath: string, physicalPath: string)
    {
        this.urlMapping[logicalPath] = physicalPath;
    };

    alias(alias: string, logicalPath: string)
    {
        var urlMapping = this.urlMapping;
        urlMapping[alias] = urlMapping[logicalPath];
    };

    getCurrentProfile(): string
    {
        return this.currentProfile;
    };

    setProfile(profile: string)
    {
        if (this.overrides.hasOwnProperty(profile))
        {
            this.currentProfile = profile;
        }
        else
        {
            this.currentProfile = undefined;
        }
    };

    static create(params: MappingTableParameters): MappingTable
    {
        var mappingTable = new MappingTable();

        mappingTable.mappingTableURL = params.mappingTableURL;
        mappingTable.tablePrefix = params.mappingTablePrefix;
        mappingTable.assetPrefix = params.assetPrefix;
        mappingTable.overrides = {};

        mappingTable.errorCallbackFn = params.errorCallback || TurbulenzServices.defaultErrorCallback;
        mappingTable.currentProfile =
            TurbulenzEngine.getSystemInfo().platformProfile;

        var onMappingTableLoad =
            function onMappingTableLoadFn(tableData: MappingTableData)
        {
            var urlMapping =
                tableData.urnmapping || tableData.urnremapping || {};
            var overrides = tableData.overrides || {};

            mappingTable.urlMapping = urlMapping;
            mappingTable.overrides = overrides;

            // Prepend all the mapped physical paths with the asset server

            var tablePrefix = mappingTable.tablePrefix;
            if (tablePrefix)
            {
                var appendPrefix =
                    function appendPrefix(map: MappingTableDataURNMapping)
                {
                    var source;
                    for (source in map)
                    {
                        if (map.hasOwnProperty(source))
                        {
                            map[source] = tablePrefix + map[source];
                        }
                    }
                }

                // Apply the prefix to the main runmapping table, and
                // any override tables.

                appendPrefix(urlMapping);
                var o;
                for (o in overrides)
                {
                    if (overrides.hasOwnProperty(o))
                    {
                        appendPrefix(overrides[o].urnmapping);
                    }
                }
            }

            params.onload(mappingTable);
        };

        // For testing purposes we support creation from immediate
        // strings, but at least one of 'mappingTableURL' and
        // 'mappingTableData' must be present.

        if (!mappingTable.mappingTableURL)
        {
            if (params.mappingTableData)
            {
                TurbulenzEngine.setTimeout(function () {
                    onMappingTableLoad(<MappingTableData>
                                       JSON.parse(params.mappingTableData));
                }, 0);
            }
            else
            {
                TurbulenzEngine.setTimeout(function () {
                    mappingTable.errorCallbackFn(
                        "!! mappingtable params contain no url or data");
                }, 0);
            }
        }
        else
        {
            params.requestHandler.request({
                src: mappingTable.mappingTableURL,
                onload: function jsonifyResponse(jsonResponse, status) {
                    if (status === 200)
                    {
                        var obj = <MappingTableData>JSON.parse(jsonResponse);
                        onMappingTableLoad(obj);
                    }
                    else
                    {
                        mappingTable.urlMapping = {};
                        jsonResponse = jsonResponse || { msg: "(no response)"};
                        mappingTable.errorCallbackFn(
                            "MappingTable.create: HTTP status " + status + ": "
                                + jsonResponse.msg, status);
                    }
                }
            });
        }

        return mappingTable;
    };

};
