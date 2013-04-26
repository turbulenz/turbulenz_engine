/*{# Copyright (c) 2011-2012 Turbulenz Limited #}*/

/*
 * @title: Chat
 * @description:
 * A sample showing how to create and use websockets with the Turbulenz network device.
*/

/*{# Import additional JS files here #}*/
/*{{ javascript("scripts/htmlcontrols.js") }}*/

/*global window: false */
/*global TurbulenzEngine: true */

TurbulenzEngine.onload = function onloadFn()
{
    var errorCallback = function errorCallback(msg)
    {
        window.alert(msg);
    };
    TurbulenzEngine.onerror = errorCallback;

    // Prepare WebSocket
    var host = document.location.host;
    if (host.indexOf('.com') !== -1)
    {
        window.alert('This example works only on the Turbulenz Local Server.');
        return;
    }

    var id = Math.floor(Math.random() * 999).toString();
    var alias = "User" + id;
    var chatURL = "ws://" + host + "/multiplayer/multichat/" + id;
    var websocket;

    var networkDeviceParameters = { };
    var networkDevice = TurbulenzEngine.createNetworkDevice(networkDeviceParameters);


    function htmlEncode(text)
    {
        var EN_AMP_RE = /&/g;
        var EN_LT_RE  = /</g;
        var EN_GT_RE  = />/g;
        var EN_QUOT_RE = /"/g;
        var EN_SINGLE_RE = /'/g;

        text = "" + text;
        text = text.toString().replace(EN_AMP_RE, "&amp;");
        text = text.replace(EN_LT_RE, "&lt;");
        text = text.replace(EN_GT_RE, "&gt;");
        text = text.replace(EN_QUOT_RE, "&quot;");
        text = text.replace(EN_SINGLE_RE, "&#39;");
        return text;
    }

    // Logging window
    var logElement = document.getElementById("log");
    var logListElement = document.getElementById("loglist");
    if (!logListElement)
    {
        // Probably running on TZJS only mode
        window.alert('Please run the HTML version of this sample.');
        return;
    }

    function padNumber(value)
    {
        return ("0" + value).slice(-2);
    }

    function getTimeString()
    {
        var d = new Date();
        return "[" + d.getFullYear() + "-" + padNumber(d.getMonth() + 1) + "-" + padNumber(d.getDate()) + " " +
                     padNumber(d.getHours()) + ":" + padNumber(d.getMinutes()) + ":" + padNumber(d.getSeconds()) + "] ";
    }

    function addToLog(message)
    {
        var newEntry = document.createElement('li');
        var content = '<div class="time-message">' + getTimeString() + '</div>';
        var usernameEnd = message.indexOf(">>>");
        if (usernameEnd === -1)
        {
            content += ('<div class="system-message">' + message + '</div>');
        }
        else
        {
            var username = message.slice(0, usernameEnd);
            message = message.slice(usernameEnd + 3);
            content += ('<div class="user-message">' + username + '</div>' +
                        '<div class="text-message">' + message + '</div>');
        }
        newEntry.innerHTML += content;
        logListElement.appendChild(newEntry);
        logElement.scrollTop = logElement.scrollHeight;
    }

    var messageElement = <HTMLInputElement>
        (document.getElementById("messageinput"));
    if (messageElement)
    {
        messageElement.focus();

        var sendElement = <HTMLInputElement>
            (document.getElementById("sendmessage"));
        if (sendElement)
        {
            var sendMessage = function sendMessageFn()
            {
                var messageText = messageElement.value;
                if (messageText)
                {
                    messageText = (alias + ">>>" + htmlEncode(messageText));
                    websocket.send(":" + messageText);
                    addToLog(messageText);
                    messageElement.value = "";
                    messageElement.focus();
                }
            };

            messageElement.onkeyup = function (evt) {
                if (!evt)
                {
                    if (typeof event === "undefined")
                    {
                        if (!window.event)
                        {
                            return false;
                        }
                        evt = <any>window.event;
                    }
                    else
                    {
                        evt = <any>event;
                    }
                }
                if (evt.keyCode === 13)
                {
                    sendMessage();
                }
                return false;
            };

            sendElement.onclick = function ()
            {
                sendMessage();
            };
            sendElement = null;
        }
    }

    // Change alias
    var aliasElement = <HTMLInputElement>
        (document.getElementById("buttonaliasinput"));
    if (aliasElement)
    {
        aliasElement.value = alias;
    }

    var changeAliasElement = <HTMLInputElement>
        (document.getElementById("buttonalias"));
    if (changeAliasElement)
    {
        changeAliasElement.onclick = function ()
        {
            if (aliasElement)
            {
                var newAlias = htmlEncode(aliasElement.value);
                if (alias !== newAlias)
                {
                    websocket.send(':"' + alias + '" is now "' + newAlias + '"');
                    addToLog('You are now "' + newAlias + '"');
                    alias = newAlias;
                }
            }
        };
        changeAliasElement = null;
    }

    //
    // Connect to the chat room
    //
    function connect()
    {
        try
        {
            websocket = networkDevice.createWebSocket(chatURL);

            if (!websocket)
            {
                window.alert("Sorry, but your browser does not support WebSocket or does not have it enabled.");
                return;
            }

            websocket.onopen = function () {
                websocket.send(':"' + alias + '" has joined');
                addToLog('Connected to chat room as "' + alias + '"');
            };

            websocket.onerror = function () {
                addToLog('Connection to the chat room is broken! Trying again in 10 seconds.');
                TurbulenzEngine.setTimeout(connect, 10000);
                websocket.onopen = null;
                websocket.onerror = null;
                websocket.onclose = null;
                websocket.onmessage = null;
                websocket = null;
            };

            websocket.onclose = function () {
                addToLog('Connection to the chat room was closed! Trying again in 1 second.');
                TurbulenzEngine.setTimeout(connect, 1000);
                websocket.onopen = null;
                websocket.onerror = null;
                websocket.onclose = null;
                websocket.onmessage = null;
                websocket = null;
            };

            websocket.onmessage = function (message) {
                message = message.data;
                var sourceSplitIndex = message.indexOf(':'); // (senderID : message)
                message = message.slice(sourceSplitIndex + 1);
                addToLog(message);
            };
        }
        catch (exp)
        {
            addToLog('Connection to the chat room failed! Trying again in 10 seconds.');
            TurbulenzEngine.setTimeout(connect, 10000);
        }
    }

    connect();

    //
    // Update:
    //
    function update()
    {
        networkDevice.update();
    }

    var intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);

    TurbulenzEngine.onunload = function destroyScene()
    {
        // Clear the interval to stop update from being called
        TurbulenzEngine.clearInterval(intervalID);

        // Send goodbye message
        if (websocket)
        {
            // Order is important for a clean shutdown
            websocket.onopen = null;
            websocket.onerror = null;
            websocket.onclose = null;
            websocket.onmessage = null;
            websocket.send(':"' + alias + '" has left');
            websocket = null;
        }

        // Clear any references to memory
        messageElement = null;
        logListElement = null;
        logElement = null;
        aliasElement = null;
        networkDevice = null;

        // Tell the Turbulenz Engine to force the js virtual machine
        // to free as much memory as possible
        TurbulenzEngine.flush();

        TurbulenzEngine.onunload = null;
    };
};
