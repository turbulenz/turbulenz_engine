// Copyright (c) 2012 Turbulenz Limited

/*global TurbulenzEngine: false*/
/*global Utilities: false*/

/// <reference path="turbulenz.d.ts" />
/// <reference path="utilities.ts" />

//
// NetworkLatencyBehaviour
//	Implement nextMessageDelay() that returns an integer value in ms
//
class NetworkLatencyBehaviour
{
    latency        : number;
    delayPeriod    : number;
    delayDuration  : number;
    startDelayTime : number;
    endDelayTime   : number;

	nextMessageDelay(): number
	{
		var timeNow =  TurbulenzEngine.time;
		var result = Math.floor((0.9 + 0.2 * Math.random()) * this.latency);
		var resultTime = timeNow + result / 1000;
		if (resultTime > this.startDelayTime)
		{
			if (resultTime > this.endDelayTime)
			{
				this.scheduleNextDelay(Math.max(this.endDelayTime, timeNow));
			}
			else
			{
				result = Math.floor((this.endDelayTime - timeNow) * 1000);
			}
		}
		return result;
	};

	scheduleNextDelay(baseTime)
	{
		this.startDelayTime = baseTime + Math.random() * this.delayPeriod / 1000;
		this.endDelayTime = this.startDelayTime + Math.random() * this.delayDuration / 1000;
	};

    static create(config) : NetworkLatencyBehaviour
    {
	    var result = new NetworkLatencyBehaviour();
	    result.latency = config.latency;
	    result.delayPeriod = config.delayPeriod;
	    result.delayDuration = config.delayDuration;
	    result.scheduleNextDelay(TurbulenzEngine.time);
	    return result;
    };
};

//
// NetworkLatencySimulator
//
class NetworkLatencySimulator
{
	queueMap    : {
        send    : any[];
		receive : any[];
    };
    behaviour   : NetworkLatencyBehaviour;

	queueMessage(messageFunction, queueName)
	{
		// Note if we want to randomize latency per message we still need to guarentee order remains consistant
		var that = this;
		var queue = this.queueMap[queueName];

		var processCallback = function processCallbackFn()
		{
			that.processMessage(queue);
		};

		var delay = this.behaviour.nextMessageDelay();

		queue.push(messageFunction);
		TurbulenzEngine.setTimeout(processCallback, delay);
	};

	processMessage(queue)
	{
		if (queue.length)
		{
			var messageFn = queue.shift();
			messageFn.call();
		}
	};

	flushQueues()
	{
		var queueMap = this.queueMap;
		var queue;
		for (var q in queueMap)
		{
			if (queueMap.hasOwnProperty(q))
			{
				queue = queueMap[q];
				while (queue.length)
				{
					this.processMessage(queue);
				}
			}
		}
	};

	addMultiplayerSession(multiplayerSession)
	{
		var that = this;

		var oldSendTo = multiplayerSession.sendTo;
		multiplayerSession.sendTo = function sendToFn(to, id, data)
		{
			var delayedSendTo = function delayedSendToFn()
			{
				if (multiplayerSession)
				{
					oldSendTo.call(multiplayerSession, to, id, data);
				}
			};
			that.queueMessage(delayedSendTo, "send");
		};

		var oldSendToGroup = multiplayerSession.sendToGroup;
		multiplayerSession.sendToGroup = function sendToGroupFn(inGroup, id, data)
		{
			var group = inGroup.slice(0);
			var delayedSendToGroup = function delayedSendToGroupFn()
			{
				if (multiplayerSession)
				{
					oldSendToGroup.call(multiplayerSession, group, id, data);
				}
			};

			that.queueMessage(delayedSendToGroup, "send");
		};

		var oldSendToAll = multiplayerSession.sendToAll;
		multiplayerSession.sendToAll = function sendToAllFn(id, data)
		{
			var delayedSendToAll = function delayedSendToAllFn()
			{
				if (multiplayerSession)
				{
					oldSendToAll.call(multiplayerSession, id, data);
				}
			};
			that.queueMessage(delayedSendToAll, "send");
		};

		var oldOnMessage = multiplayerSession.onmessage;
		multiplayerSession.onmessage = function onMessageFn(senderID, messageType, messageData)
		{
			var delayedOnMessage = function delayedOnMessageFn()
			{
				if (multiplayerSession)
				{
					oldOnMessage.call(multiplayerSession, senderID, messageType, messageData);
				}
			};

			that.queueMessage(delayedOnMessage, "receive");
		};

		var oldDestroy = multiplayerSession.destroy;
		multiplayerSession.destroy = function destroyFn()
		{
			that.flushQueues();
			oldDestroy.call(multiplayerSession);
		};
	};

    static create(behaviour) : NetworkLatencySimulator
    {
	    var simulator = new NetworkLatencySimulator();
	    simulator.queueMap = { send : [],
							   receive: []};

	    simulator.behaviour = behaviour;

	    var oldAjax = Utilities.ajax;
	    Utilities.ajax = function ajaxFn(inParams)
	    {
		    var cloneData = function cloneDataFn(object)
		    {
			    if (!object || typeof(object) !== "object")
			    {	// boolean, numbers, strings, undefined, null
				    return object;
			    }

			    var result;

			    if (object instanceof Array)
			    {
				    result = new Array(object.length);
				    var index;
				    for (index = 0; index < object.length; index += 1)
				    {
					    result[index] = cloneData(object[index]);
				    }
				    return result;
			    }

			    if (object instanceof Date)
			    {
				    result = new Date(object.getTime());
				    return result;
			    }

			    var property;
			    result = {}; // This does not clone the prototype. See Object.create() if you want that behaviour.
			    for (property in object)
			    {
				    if (object.hasOwnProperty(property))
				    {
					    result[property] = cloneData(object[property]);
				    }
			    }
			    return result;
		    };

		    var params = Object.create(inParams);
		    if (params.data)
		    {
			    params.data = cloneData(params.data);
		    }

		    var delayedAjax = function delayedAjaxFn()
		    {
			    oldAjax.call(Utilities, params);
		    };
		    simulator.queueMessage(delayedAjax, "send");
	    };

	    return simulator;
    };
};