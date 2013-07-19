// Copyright (c) 2011-2012 Turbulenz Limited

/*jshint nomen: false*/
/*global TurbulenzBridge: false*/
/*exported TurbulenzUI*/

// requires jQuery

/**
 * The DynamicUI manager sends events to the DynamicUI server to create instances of UI elements on the host website. It
 * then manages updates to the UI either responding to requests for the value for a specific UI element, or pushing
 * values to elements referenced by id.
 */
class DynamicUIManager
{
    _objects    : any; // TODO
    _setters    : any; // TODO
    _getters    : any; // TODO
    _watchGroup : number;

    /**
     * Generates a new id for use in the dynamicUI system
     *
     * @return A new unique id to use
     */
    _newId: { (): number; };

    /**
     * Helper function to add a new UI element. Sends an event to the dynamicUI server and sets up listeners to
     * handle requests to get and set the value that come form the UI.
     *
     * @param {String} type The type of the UI element used
     * @param {String} title The title to use for the UI element
     * @param {Function} getValue A callback that gets the value for the UI element
     * @param {Function} setValue A callback that is called when the value in the UI is changed
     * @param [groupId] The group id of the parent group. If not defined then the default group is used
     * @param [options] An object containing UI specific options. The details of this will depend on the implementation
     * of the DynamicUI server
     * @returns The id of the new element to use to push values to this UI element
     */
    _addUI(type, title, getValue, setValue, groupId, options)
    {
        var id = this._newId();
        TurbulenzBridge.emit('dynamicui.add-item', JSON.stringify({
            id: id,
            type: type,
            title: title,
            groupId: groupId || null,
            options: options || {}
        }));

        this._setters[id] = setValue;
        this._getters[id] = getValue;
        return id;
    }

    /**
     * Utility function to handle "watch stashed object" events.
     *
     * @param paramstring The JSONified request
     */
    _watchStashedObject(paramstring) {
        var params = JSON.parse(paramstring);
        var id = params.id;
        var property = params.property;
        var title = params.title || id;
        var ui = params.ui;
        var options = params.options || {};
        var groupId = params.groupId || this._watchGroup;
        this.watchVariable(title, this._objects[id], property, ui, groupId, options);
    }

    /**
     * Adds a slider to the specified group.
     *
     * @param {String} title The title to use for the UI element
     * @param {Function} getValue A callback that gets the value for the UI element
     * @param {Function} setValue A callback that is called when the value in the UI is changed
     * @param [groupId] The group id of the parent group. If not defined then the default group is used
     * @param [options] An object containing UI specific options. The details of this will depend on the implementation
     * of the DynamicUI server
     * @returns The id of the new element to use to push values to this UI element
     */
    addSlider(title, getValue, setValue, groupId, options)
    {
        return this._addUI('slider', title, getValue, setValue, groupId, options);
    }

    /**
     * Adds a checkbox to the specified group.
     *
     * @param {String} title The title to use for the UI element
     * @param {Function} getValue A callback that gets the value for the UI element
     * @param {Function} setValue A callback that is called when the value in the UI is changed
     * @param [groupId] The group id of the parent group. If not defined then the default group is used
     * @param [options] An object containing UI specific options. The details of this will depend on the implementation
     * of the DynamicUI server
     * @returns The id of the new element to use to push values to this UI element
     */
    addCheckbox(title, getValue, setValue, groupId, options)
    {
        return this._addUI('checkbox', title, getValue, setValue, groupId, options);
    }

    /**
     * Adds a drop-down selector to the specified group.
     *
     * @param {String} title The title to use for the UI element
     * @param {Function} getValue A callback that gets the value for the UI element
     * @param {Function} setValue A callback that is called when the value in the UI is changed
     * @param [groupId] The group id of the parent group. If not defined then the default group is used
     * @param [options] An object containing UI specific options. The details of this will depend on the implementation
     * of the DynamicUI server
     * @returns The id of the new element to use to push values to this UI element
     */
    addSelect(title, getValue, setValue, groupId, options)
    {
        return this._addUI('select', title, getValue, setValue, groupId, options);
    }

    /**
     * Adds an updatable label to the specified group.
     *
     * @param {String} title The title to use for the UI element
     * @param {Function} getValue A callback that gets the value for the UI element
     * @param {Function} setValue A callback that is called when the value in the UI is changed
     * @param [groupId] The group id of the parent group. If not defined then the default group is used
     * @param [options] An object containing UI specific options. The details of this will depend on the implementation
     * of the DynamicUI server
     * @returns The id of the new element to use to push values to this UI element
     */
    addWatch(title, getValue, setValue, groupId, options)
    {
        return this._addUI('watch', title, getValue, setValue, groupId, options);
    }

    /**
     * Adds a set of radio buttons to the specified group.
     *
     * @param {String} title The title to use for the UI element
     * @param {Function} getValue A callback that gets the value for the UI element
     * @param {Function} setValue A callback that is called when the value in the UI is changed
     * @param [groupId] The group id of the parent group. If not defined then the default group is used
     * @param [options] An object containing UI specific options. The details of this will depend on the implementation
     * of the DynamicUI server
     * @returns The id of the new element to use to push values to this UI element
     */
    addRadioButton(title, getValue, setValue, groupId, options)
    {
        return this._addUI('radio', title, getValue, setValue, groupId, options);
    }

    /**
     * Destroys the specified UI element.
     *
     * @param id The Id of the element to destroy. If the element is a group, the group and all its children are
     * destroyed
     */
    destroy(id)
    {
        TurbulenzBridge.emit('dynamicui.destroy', JSON.stringify({
            id: id
        }));
    }

    /**
     * Updates the specified UI element with a new value.
     *
     * @param id The Id of the element to update
     * @param value The value to send to the UI
     */
    pushValue(id, value)
    {
        TurbulenzBridge.emit('dynamicui.pushvalue', JSON.stringify({
            id: id,
            value: value
        }));
    }

    /**
     * Adds a group to the dynamid UI.
     *
     * @param {String} title The title of the group
     * @param groupId The parent group to add this new group to
     * @returns The id of the newly created group.
     */
    addGroup(title, groupId?)
    {
        var id = this._newId();
        TurbulenzBridge.emit('dynamicui.group-create', JSON.stringify({
            id: id,
            title: title,
            groupId: groupId || null
        }));
        return id;
    }

    /**
     * Adds a UI element to an existing group. The element is moved, so if it is already a member of a group it
     * will be removed from that group and added to the group specified in the function call.
     *
     * @param id The id of the element to move
     * @param groupId The parent group to add this new group to
     */
    addToGroup(id, groupId)
    {
        TurbulenzBridge.emit('dynamicui.group-add', JSON.stringify({
            id: id,
            groupId: groupId
        }));
    }

    /**
     * Removes a UI element from a group. This does not destroy the UI element so it can be used to temporarily hide
     * a UI element which can then be re-shown by calling addToGroup
     *
     * @param id The id of the UI element to remove
     * @param groupId The id of the group to remove it from
     */
    removeFromGroup(id, groupId)
    {
        TurbulenzBridge.emit('dynamicui.group-remove', JSON.stringify({
            id: id,
            groupId: groupId
        }));
    }

    /**
     * Helper function to watch the specified property of an object. This automatically sets up the getter and setter
     * callbacks on the property to tie it to the state of the UI.
     *
     * @param {String} title The title of the UI element to create
     * @param {Object} object The object whose property will be watched
     * @param {String} property The name of the property to watch
     * @param {String} [ui = "watch"] The UI to use to show the variable
     * @param [group] The group to add this watch element to
     * @param [options] The UI creation options to use
     * @returns The id of the newly created element
     */
    watchVariable(title: string, object, property, ui?: string, group?: number,
                  options?): number
    {
        var uiType = ui || 'watch';
        var groupId = group || null;
        var id = -1;

        var getVal = function getValFn()
        {
            if (property)
            {
                return object[property];
            }
            else
            {
                return object;
            }
        };

        var setVal = function setValFn(value)
        {
            object[property] = value;
        };

        switch (uiType)
        {
        case 'slider' :
            id = this.addSlider(title, getVal, setVal, groupId, options);
            break;
        case 'checkbox' :
            id = this.addCheckbox(title, getVal, setVal, groupId, options);
            break;
        case 'radio' :
            id = this.addRadioButton(title, getVal, setVal, groupId, options);
            break;
        case 'select' :
            id = this.addSelect(title, getVal, setVal, groupId, options);
            break;
        case 'watch' :
            id = this.addWatch(title, getVal, setVal, groupId, options);
            break;
        }

        return id;
    }

    showObject(title, object, editable, group)
    {
        var objectGroup = this.addGroup(title, group);
        var propertyName, property;
        for (propertyName in object)
        {
            if (object.hasOwnProperty(propertyName))
            {
                property = object[propertyName];
                if (typeof property === "object")
                {
                    this.showObject(propertyName, property, editable, objectGroup);
                }
                else
                {
                    if (editable)
                    {
                        // TODO: parse type and provide appropriate UI
                        this.watchVariable(propertyName, object, propertyName, 'watch', objectGroup);
                    }
                    else
                    {
                        this.watchVariable(propertyName, object, propertyName, 'watch', objectGroup);
                    }
                }
            }
        }
        return objectGroup;
    }

    /**
     * Registers a named path to an object so that the object can be referenced from another context for the creation of
     * watch UI
     *
     * @param {Object} object The object to stash
     * @param {String} path The path to use to access the object in the form "folder/folder/folder/item", for example
     * "actors/npcs/enemies/bots/ed209"
     * @returns The id of the stashed object - currently for internal use only
     */
    stashObject(object, path) {
        var id = this._newId();
        this._objects[id] = object;
        TurbulenzBridge.emit('dynamicui.stash-add', id + ':' + path);
        return id;
    }

    /**
     * Creates a DynamicUI manager and initialises it, registering against events.
     *
     * @param title
     * @returns {DynamicUIManager} The UI Manager
     */
    static create(/* title */): DynamicUIManager
    {
        var uiMan = new DynamicUIManager();
        uiMan._objects = {};
        uiMan._setters = {};
        uiMan._getters = {};

        uiMan._watchGroup = uiMan.addGroup('watches');

        // Watch for calls from the console to watch stashed objects
        TurbulenzBridge.setListener('dynamicui.stash-watch', function (paramstring) {
            uiMan._watchStashedObject(paramstring);
        });

        TurbulenzBridge.setListener('dynamicui.changevalue', function (jsonstring) {
            var options = JSON.parse(jsonstring);
            var setter = uiMan._setters[options.id];
            if (setter)
            {
                setter(options.value);
            }
        });

        TurbulenzBridge.setListener('dynamicui.requestvalue', function (jsonstring) {
            var options = JSON.parse(jsonstring);
            var getter = uiMan._getters[options.id];
            if (getter)
            {
                TurbulenzBridge.emit('dynamicui.pushvalue', JSON.stringify({
                    id: options.id,
                    value: getter()
                }));
            }
        });

        return uiMan;
    }
}

DynamicUIManager.prototype._newId = (function () {
    var id = 0;

    return function getId()
    {
        id += 1;
        return id;
    };
}());

/**
 * The instance of the DynamicUI manager
 */
var TurbulenzUI = DynamicUIManager.create();
