// Copyright (c) 2012 Turbulenz Limited

/*jshint nomen: false*/
/*global Turbulenz: false*/
/*global $*/
/*global window*/

// requires jQuery

/**
 * This closure is loaded after the page is ready using jQuery and then registers all the handlers that create and
 * manage the dynamic UI.
 */
$(function ()
{
    var bridge = window.top.Turbulenz && window.top.Turbulenz.Services && window.top.Turbulenz.Services.bridge;
    var groups = {};
    var items = {};
    var values = {};
    var active = {};
    var interval = null;
    var uiFactory = {};
    var duiElement = $('#dynamicui');

    /**
     * Helper function that creates a new UI item and adds it to the requested group
     *
     * @param {Object} params Parameters for the object to create
     * @return {Object} The created item - a dictionary containing callbacks, HTML elements and other useful things
     */
    function createItem(params)
    {
        // Parse the options
        var id = params.id;
        var groupId = params.groupId;
        var title = params.title || id;
        var updateValues;

        // Create an item which is a collection of useful information for the UI object
        var item = {
            id: id,
            element: $('<div class="dui-control"><div class="dui-control-title">' + title +
                '</div><div class="dui-control-widget" ></div></div>'),
            params: params,
            setValue: function (value)
            {
                values[id] = value;
                bridge.emit('dynamicui.changevalue', JSON.stringify({id: id, value: value}));
            }
        };
        items[id] = item;

        // Add the item to the list of active UI elements, and add it to the requested group
        addToGroup(id, groupId);

        // This is here so that in the future we can disable the polling interval if no objects are shown
        // and it will automatically start up again if a new item is added
        if (!interval)
        {
            updateValues = function updateValuesFn()
            {
                var id;
                for (id in active)
                {
                    if (active.hasOwnProperty(id))
                    {
                        bridge.emit('dynamicui.requestvalue', JSON.stringify({id: id}));
                    }
                }
            };
            interval = window.setInterval(updateValues, 1000);
        }

        return item;
    }

    /**
     * Helper function to destroy an object specified by id
     *
     * @param id the id of the object to destroy
     */
    function destroyItem(id)
    {
        var item = items[id];
        var group = groups[id];
        var children;
        var i;

        if (item)
        {
            delete active[id];
            // Remove the HTML element from the document and finally remove our handle on the object
            $(item.element).remove();
            delete items[id];
            delete values[id];
        }
        if (group)
        {
            // This just stops us recursing for ever if we somehow end up with a loop in the hierarchy
            children = group.children;
            group.children = [];
            // Recursively destroy all children
            for (i = 0; i < children.length; i += 1)
            {
                destroyItem(children[i].id);
            }
            // Remove the HTML element from the document and finally remove our handle on the object
            $(group.element).remove();
            delete groups[id];
        }
    }

    /**
     * Helper function to add an item to a group
     *
     * @param id The item to add to the group
     * @param groupId The group to add it to. If a string starting with a '#' is provided, this will attach the
     * group to an element in the page specified by its id.
     * @return Boolean indicating success of operation
     */
    function addToGroup(id, groupId)
    {
        var uiItem = items[id];
        var item = uiItem || groups[id];
        var parent = groups[groupId];

        // Remove item from active list
        delete active[id];

        // Create a pseudo-group referencing an existing element specified by id.
        if (!parent && typeof groupId === 'string' && groupId[0] === '#')
        {
            parent = {
                id: groupId,
                title: "",
                children: [],
                element: $(groupId),
                contents: $(groupId)
            };
            groups[groupId] = parent;
        }
        if (parent && item)
        {
            parent.children.push(id);
            parent.contents.append(item.element);
            parent.element.removeClass('hidden');

            if (uiItem && !parent.element.hasClass('collapsed'))
            {
                active[id] = true;
            }

            return true;
        }
        return false;
    }

    /**
     * Creates a slider using HTML5 sliders
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addSliderHandler(paramstring)
    {
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var slideroptions = params.options || {};
        var sliderElement = item.element.find('.dui-control-widget').first();
        var opt;
        var inputElement;
        var valueElement;

        // Create an HTML object, pass through options in the "options" object. We are creating a slider
        // and a span to show the numerical value.
        var htmlString = '<input type="range"';
        for (opt in slideroptions)
        {
            if (slideroptions.hasOwnProperty(opt))
            {
                htmlString += opt + '="' + slideroptions[opt] + '"';
            }
        }
        htmlString += '"/><span class="dui-control-value"></span>';
        sliderElement.append(htmlString);

        // Respond to changes from the slider and set the value of the slider and the value element when requested
        inputElement = sliderElement.find('input').first();
        valueElement = item.element.find('.dui-control-value').first();
        inputElement.change(function ()
        {
            item.setValue(Number(this.value));
            valueElement.html(this.value);
        });
        item.pushValue = function (value)
        {
            inputElement.attr('value', value);
            valueElement.html(value);
        };
    }

    /**
     * Creates a checkbox using HTML checkboxes
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addCheckboxHandler(paramstring)
    {
        // Parse options
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var checkoptions = params.options || {};
        var checkElement = item.element.find('.dui-control-widget').first();
        var opt;
        var inputElement;

        // Create the HTML for a checkbox
        var htmlString = '<input type="checkbox"';
        for (opt in checkoptions)
        {
            // Pass through any options from the options object
            if (checkoptions.hasOwnProperty(opt))
            {
                htmlString += opt + '="' + checkoptions[opt] + '"';
            }
        }
        htmlString += '"/>';
        checkElement.append(htmlString);

        // Respond to change events from the UI and from game code
        inputElement = checkElement.find('input').first();
        inputElement.change(function ()
        {
            item.setValue(this.checked);
        });
        item.pushValue = function (value)
        {
            inputElement.attr('checked', value);
        };
    }

    /**
     * Creates a selector using an HTML select control
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addSelectHandler(paramstring)
    {
        // Parse options
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var selectoptions = params.options || {};
        var selectElement = item.element.find('.dui-control-widget').first();
        var opt;
        var i;
        var inputElement;

        // Create the HTML for a selector
        var htmlString = '<select ';
        var values = selectoptions.values;
        for (opt in selectoptions)
        {
            if (selectoptions.hasOwnProperty(opt) && opt !== "values")
            {
                htmlString += opt + '="' + selectoptions[opt] + '"';
            }
        }
        htmlString += '>';
        for (i = 0; i < values.length; i += 1)
        {
            htmlString += '<option value="' + values[i] + '">' + values[i] + '</option>';
        }
        htmlString += '</select>';

        // Respond to change events from the UI and from game code
        selectElement.append(htmlString);
        inputElement = selectElement.find('select').first();
        inputElement.change(function ()
        {
            item.setValue(this.value);
        });
        item.pushValue = function (value)
        {
            inputElement.attr('value', value);
        };
    }

    /**
     * Creates a text input box using an HTML input
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addTextHandler(paramstring)
    {
        // Parse options
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var textElement = item.element.find('.dui-control-widget').first();
        var inputElement;

        // Create the HTML for a text input box
        var htmlString = '<input />';

        // Respond to change events from the UI and from game code
        textElement.append(htmlString);
        inputElement = textElement.find('input').first();
        inputElement.keyup(function (event)
        {
            if (event.keyCode === 13)
            {
                item.setValue(inputElement[0].value);
            }
        });
        item.pushValue = function (value)
        {
            inputElement[0].value = value;
        };
    }

    /**
     * Creates a button using an HTML button
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addButtonHandler(paramstring)
    {
        // Parse options
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var buttonoptions = params.options || {};
        var buttonElement = item.element.find('.dui-control-widget').first();
        var inputElement;

        // Create the HTML for a text input box
        var htmlString = '<button type="button">';
        htmlString += buttonoptions.value;
        htmlString += '</button>';

        // Respond to change events from the UI and from game code
        buttonElement.append(htmlString);
        inputElement = buttonElement.find('button').first();
        inputElement[0].onClick = function ()
        {
            item.setValue(buttonoptions.value);
        };
        item.pushValue = function (value)
        {
            buttonoptions.value = value;
        };
    }

    /**
     * Creates a watch label using an HTML div
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addWatchHandler(paramstring)
    {
        // Create a label that automatically updates when requested
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var watchElement = item.element.find('.dui-control-widget').first();
        item.pushValue = function (value)
        {
            watchElement.html(value);
        };
    }

    /**
     * Creates a radio button using an HTML radio type inpu
     *
     * @param {String} paramstring A JSON stringified option containing the request of the object to create
     */
    function addRadioButtonHandler(paramstring)
    {
        // Parse options
        var params = JSON.parse(paramstring);
        var item = createItem(params);
        var radioOptions = params.options || {};
        var checkElement = item.element.find('.dui-control-widget');
        var i;
        var inputElements;

        // Create the HTML for a set of radio buttons
        var htmlString = '';
        var values = radioOptions.values;
        for (i = 0; i < values.length; i += 1)
        {
            htmlString += '<input type="radio" name="dui-' + item.id +
                '" value="' + values[i] + '">' + values[i] + '</input>';
        }
        checkElement.append(htmlString);

        // Set values from UI changes and value change events from code
        inputElements = checkElement.find('input');
        inputElements.change(function ()
        {
            item.setValue(this.value);
        });
        item.pushValue = function (value)
        {
            for (i = 0; i < inputElements.length; i += 1)
            {
                if (inputElements[i].value === value)
                {
                    $(inputElements[i]).attr('checked', true);
                }
            }
        };
    }

    /**
     * Destroy an object specified by id
     *
     * @param {String} paramstring A JSON stringified option containing the id of the object to destroy
     */
    function destroyHandler(paramstring)
    {
        var id = JSON.parse(paramstring).id;
        destroyItem(id);
    }

    /**
     * Add a group to the UI using simple styled divs
     *
     * @param {String} paramstring A JSON stringified option containing the details of the group to create
     */
    function addGroupHandler(paramstring)
    {
        // Parse the parameters
        var params = JSON.parse(paramstring);
        var id = params.id;
        var title = params.title || "";
        var groupId = params.groupId;
        var expanded = params.expanded;

        // Create the group in a hidden, collapsed state. Group will be shown when first child is added
        // User will have to click to show the group
        var item = {
            id: id,
            title: title,
            children: [],
            element: $('<div class="dui-group hidden"><div class="dui-group-title" >' + title +
                '</div><div class="dui-group-contents"></div></div>')
        };
        item.title = item.element.find('.dui-group-title');
        item.contents = item.element.find('.dui-group-contents');
        groups[id] = item;

        if (!expanded)
        {
            item.element.addClass('collapsed');
        }

        // Toggle collapsed state of groups on click
        item.title.click(function ()
        {
            var children = item.children;
            var i;

            if (item.element.hasClass('collapsed'))
            {
                item.element.removeClass('collapsed');
                for (i = 0; i < children.length; i += 1)
                {
                    if (items[children[i]])
                    {
                        active[children[i]] = true;
                    }
                }
            }
            else
            {
                item.element.addClass('collapsed');
                for (i = 0; i < children.length; i += 1)
                {
                    delete active[children[i]];
                }
            }
        });

        // Don't let a user add a group to itself...
        if (id === groupId)
        {
            groupId = null;
        }
        addToGroup(id, groupId);
    }

    /**
     * Add a UI element (group or item) to a group
     *
     * @param {String} paramstring A JSON stringified option containing the details of the thing to add to the group
     */
    function addToGroupHandler(paramstring)
    {
        var params = JSON.parse(paramstring);
        var id = params.id;
        var groupId = params.groupId || null;
        addToGroup(id, groupId);
    }

    /**
     * Remove an element or group from another group
     *
     * @param {String} paramstring The jsonified string specifying the object to add and the group to add it to.
     */
    function removeFromGroupHandler(paramstring)
    {
        var params = JSON.parse(paramstring);
        var id = params.id;
        var groupId = params.groupId || null;
        var group = groups[groupId];
        var index;
        if (group)
        {
            index = $.inArray(id, group.children);
            group.children.splice(index, 1);
            $(items[id].element).detach();
        }
    }

    function register()
    {
        // Create default group attached to dynamicui element if it exists
        groups[null] = {
            id: null,
            title: "",
            children: [],
            element: duiElement,
            contents: duiElement
        };

        // Register all the different UI type creators
        uiFactory.slider = addSliderHandler;
        uiFactory.checkbox = addCheckboxHandler;
        uiFactory.watch = addWatchHandler;
        uiFactory.select = addSelectHandler;
        uiFactory.radio = addRadioButtonHandler;
        uiFactory.text = addTextHandler;
        uiFactory.button = addButtonHandler;

        // Listen to 'add' events and delegate to the correct factory
        bridge.gameListenerOn('dynamicui.add-item', function (stringvalue)
        {
            var type = JSON.parse(stringvalue).type;
            uiFactory[type](stringvalue);
        });

        // UI management functions
        bridge.gameListenerOn('dynamicui.group-create', addGroupHandler);
        bridge.gameListenerOn('dynamicui.group-add', addToGroupHandler);
        bridge.gameListenerOn('dynamicui.group-remove', removeFromGroupHandler);
        bridge.gameListenerOn('dynamicui.destroy', destroyHandler);

        // Listen to requests to put specific values into the UI
        bridge.gameListenerOn('dynamicui.pushvalue', function (stringvalue)
        {
            var options = JSON.parse(stringvalue);
            var id = options.id;
            var value = options.value;
            var item = items[id];
            if (item && value !== values[id])
            {
                // Cache to avoid unnecessary updates to UI
                values[id] = value;
                item.pushValue(options.value);
            }
        });
    }

    if (bridge)
    {
        register();
    }
});

