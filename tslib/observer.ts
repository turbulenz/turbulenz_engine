// Copyright (c) 2010-2011 Turbulenz Limited

//
// Observer
//
class Observer
{
    subscribers: { (): void; }[];

    subscribe(subscriber)
    {
        //Check for duplicates
        var subscribers = this.subscribers;
        var length = subscribers.length;
        for (var index = 0; index < length; index += 1)
        {
            if (subscribers[index] === subscriber)
            {
                return;
            }
        }

        subscribers.push(subscriber);
    };

    unsubscribe(subscriber)
    {
        var subscribers = this.subscribers;
        var length = subscribers.length;
        for (var index = 0; index < length; index += 1)
        {
            if (subscribers[index] === subscriber)
            {
                subscribers.splice(index, 1);
                break;
            }
        }
    };

    unsubscribeAll(/* subscriber */)
    {
        this.subscribers.length = 0;
    };

    // this function can take any number of arguments
    // they are passed on to the subscribers

    // NOTE: if we write (... args: any[]), TSC inserts code to copy
    // the args into an array.

    notify(a0?, a1?, a2?, a3?, a4?, a5?, a6?, a7?, a8?, a9?, a10?, a11?)
    {
        // Note that the callbacks might unsubscribe
        var subscribers = this.subscribers;
        var length = this.subscribers.length;
        var index = 0;

        while (index < length)
        {
            subscribers[index].apply(null, arguments);
            if (subscribers.length === length)
            {
                index += 1;
            }
            else
            {
                length = subscribers.length;
            }
        }
    };

    static create(): Observer
    {
        var observer = new Observer();
        observer.subscribers = [];
        return observer;
    };
};
