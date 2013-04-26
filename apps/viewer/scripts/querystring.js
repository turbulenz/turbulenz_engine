// Copyright (c) 2012 Turbulenz Limited

/*exported updateDictFromQueryString*/

function getQueryStringDict()
{
    var qs = null;

    if (window.location && window.location.search)
    {
        qs = window.location.search;
    }
    else if (window.parent && window.parent.location && window.parent.location.search)
    {
        qs = window.parent.location.search;
    }

    if (!qs)
    {
        return {};
    }

    qs = qs.substring(1);
    if (qs === '')
    {
        return {};
    }

    function isNumber(n)
    {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var dict = {};

    var parts = qs.split('&');
    var numParts = parts.length;
    for (var i = 0; i < numParts; i += 1)
    {
        var part = parts[i].split('=');
        var key = part[0];
        var value = part[1];
        if (value === 'true')
        {
            value = true;
        }
        else if (value === 'false')
        {
            value = false;
        }
        else if (value)
        {
            value = decodeURIComponent(value);
            if (isNumber(value))
            {
                value = parseFloat(value);
            }
            else
            {
                value = value.replace(/\+/g, " ");
            }
        }
        //console.log('%s: %s', key, value);
        dict[key] = value;
    }

    return dict;
}


function updateDictFromQueryString(dict)
{
    var queryRes = getQueryStringDict();
    for (var q in queryRes)
    {
        if (queryRes.hasOwnProperty(q))
        {
            dict[q] = queryRes[q];
        }
    }
}
