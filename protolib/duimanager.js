// Copyright (c) 2013 Turbulenz Limited
var DynamicUIManager = (function () {
    function DynamicUIManager() { }
    DynamicUIManager.prototype._addUI = function (type, title, getValue, setValue, groupId, options) {
        var id = this._newId();
        TurbulenzBridge.emit('dynamicui.add-item', JSON.stringify({
            id: id,
            type: type,
            title: title,
            groupId: groupId || null,
            options: options || {
            }
        }));
        this._setters[id] = setValue;
        this._getters[id] = getValue;
        return id;
    };
    DynamicUIManager.prototype._watchStashedObject = function (paramstring) {
        var params = JSON.parse(paramstring);
        var id = params.id;
        var property = params.property;
        var title = params.title || id;
        var ui = params.ui;
        var options = params.options || {
        };
        var groupId = params.groupId || this._watchGroup;
        this.watchVariable(title, this._objects[id], property, ui, groupId, options);
    };
    DynamicUIManager.prototype.addSlider = function (title, getValue, setValue, groupId, options) {
        return this._addUI('slider', title, getValue, setValue, groupId, options);
    };
    DynamicUIManager.prototype.addCheckbox = function (title, getValue, setValue, groupId, options) {
        return this._addUI('checkbox', title, getValue, setValue, groupId, options);
    };
    DynamicUIManager.prototype.addSelect = function (title, getValue, setValue, groupId, options) {
        return this._addUI('select', title, getValue, setValue, groupId, options);
    };
    DynamicUIManager.prototype.addWatch = function (title, getValue, setValue, groupId, options) {
        return this._addUI('watch', title, getValue, setValue, groupId, options);
    };
    DynamicUIManager.prototype.addRadioButton = function (title, getValue, setValue, groupId, options) {
        return this._addUI('radio', title, getValue, setValue, groupId, options);
    };
    DynamicUIManager.prototype.destroy = function (id) {
        TurbulenzBridge.emit('dynamicui.destroy', JSON.stringify({
            id: id
        }));
    };
    DynamicUIManager.prototype.pushValue = function (id, value) {
        TurbulenzBridge.emit('dynamicui.pushvalue', JSON.stringify({
            id: id,
            value: value
        }));
    };
    DynamicUIManager.prototype.addGroup = function (title, groupId) {
        var id = this._newId();
        TurbulenzBridge.emit('dynamicui.group-create', JSON.stringify({
            id: id,
            title: title,
            groupId: groupId || null
        }));
        return id;
    };
    DynamicUIManager.prototype.addToGroup = function (id, groupId) {
        TurbulenzBridge.emit('dynamicui.group-add', JSON.stringify({
            id: id,
            groupId: groupId
        }));
    };
    DynamicUIManager.prototype.removeFromGroup = function (id, groupId) {
        TurbulenzBridge.emit('dynamicui.group-remove', JSON.stringify({
            id: id,
            groupId: groupId
        }));
    };
    DynamicUIManager.prototype.watchVariable = function (title, object, property, ui, group, options) {
        var uiType = ui || 'watch';
        var groupId = group || null;
        var id = -1;
        var getVal = function getValFn() {
            if(property) {
                return object[property];
            } else {
                return object;
            }
        };
        var setVal = function setValFn(value) {
            object[property] = value;
        };
        switch(uiType) {
            case 'slider':
                id = this.addSlider(title, getVal, setVal, groupId, options);
                break;
            case 'checkbox':
                id = this.addCheckbox(title, getVal, setVal, groupId, options);
                break;
            case 'radio':
                id = this.addRadioButton(title, getVal, setVal, groupId, options);
                break;
            case 'select':
                id = this.addSelect(title, getVal, setVal, groupId, options);
                break;
            case 'watch':
                id = this.addWatch(title, getVal, setVal, groupId, options);
                break;
        }
        return id;
    };
    DynamicUIManager.prototype.showObject = function (title, object, editable, group) {
        var objectGroup = this.addGroup(title, group);
        var propertyName, property;
        for(propertyName in object) {
            if(object.hasOwnProperty(propertyName)) {
                property = object[propertyName];
                if(typeof property === "object") {
                    this.showObject(propertyName, property, editable, objectGroup);
                } else {
                    if(editable) {
                        this.watchVariable(propertyName, object, propertyName, 'watch', objectGroup);
                    } else {
                        this.watchVariable(propertyName, object, propertyName, 'watch', objectGroup);
                    }
                }
            }
        }
        return objectGroup;
    };
    DynamicUIManager.prototype.stashObject = function (object, path) {
        var id = this._newId();
        this._objects[id] = object;
        TurbulenzBridge.emit('dynamicui.stash-add', id + ':' + path);
        return id;
    };
    DynamicUIManager.create = function create() {
        var uiMan = new DynamicUIManager();
        uiMan._objects = {
        };
        uiMan._setters = {
        };
        uiMan._getters = {
        };
        uiMan._watchGroup = uiMan.addGroup('watches');
        TurbulenzBridge.setListener('dynamicui.stash-watch', function (paramstring) {
            uiMan._watchStashedObject(paramstring);
        });
        TurbulenzBridge.setListener('dynamicui.changevalue', function (jsonstring) {
            var options = JSON.parse(jsonstring);
            var setter = uiMan._setters[options.id];
            if(setter) {
                setter(options.value);
            }
        });
        TurbulenzBridge.setListener('dynamicui.requestvalue', function (jsonstring) {
            var options = JSON.parse(jsonstring);
            var getter = uiMan._getters[options.id];
            if(getter) {
                TurbulenzBridge.emit('dynamicui.pushvalue', JSON.stringify({
                    id: options.id,
                    value: getter()
                }));
            }
        });
        return uiMan;
    };
    return DynamicUIManager;
})();
;
DynamicUIManager.prototype._newId = ((function () {
    var id = 0;
    return function getId() {
        id += 1;
        return id;
    };
})());
var TurbulenzUI = DynamicUIManager.create();
