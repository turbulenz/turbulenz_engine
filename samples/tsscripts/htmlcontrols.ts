// Copyright (c) 2010-2011 Turbulenz Limited

interface Window
{
    $: JQueryStatic;
};

interface JQuery
{
    value: string;
};

/*global $*/

//
// HTML Controls
//
class HTMLControls
{
    version = 1;

    radioControls: any; // Created by group
    checkboxControls: any; // Created by value
    buttonControls: any; // Created by value
    sliderControls: any; // Created by id
    registered: boolean;

    setSelectedRadio(groupName, index)
    {
        var controlGroup = this.radioControls[groupName];
        var control;
        if (controlGroup)
        {
            control = controlGroup.controls[index];
            if (control)
            {
                // Only set if the control at that index exists
                controlGroup.selected = index;
                this.updateRadio(control.id, true);
            }
        }
    }

    addRadioControl(radioControlOptions)
    {
        var radioControls = this.radioControls;
        var groupName = radioControlOptions.groupName;
        var radioIndex = radioControlOptions.radioIndex;
        var radioID = radioControlOptions.id;
        //var value = radioControlOptions.value;
        var fn = radioControlOptions.fn;
        var isDefault = radioControlOptions.isDefault;

        if (groupName === undefined ||
            groupName === null ||
            radioIndex < 0 ||
            radioID === undefined ||
            radioID === null ||
            fn === undefined ||
            fn === null) // Assumes (isDefault === undefined) -> false , value is not used
        {
            return;
        }

        var controlGroup = radioControls[groupName];
        if (!controlGroup)
        {
            radioControls[groupName] = {};
            controlGroup = radioControls[groupName];
            controlGroup.controls = [];
            controlGroup.selected = 0;
        }
        controlGroup.controls[radioIndex] = radioControlOptions;
        if (isDefault)
        {
            controlGroup.selected = radioIndex;
        }

        this.updateRadio(radioID, isDefault);
    }

    addCheckboxControl(checkboxControlOptions)
    {
        var checkboxControls = this.checkboxControls;
        var id = checkboxControlOptions.id;
        var value = checkboxControlOptions.value;
        checkboxControls[value] = checkboxControlOptions;
        this.updateCheckbox(id, checkboxControlOptions.isSelected);
    }

    addButtonControl(buttonControlOptions)
    {
        var buttonControls = this.buttonControls;
        var id = buttonControlOptions.id;
        buttonControls[id] = buttonControlOptions;
    }

    addSliderControl(sliderControlOptions)
    {
        var sliderControls = this.sliderControls;
        sliderControls[sliderControlOptions.id] = sliderControlOptions;
    }

    getSliderValue(id)
    {
        var value = window.$('#' + id).value;
        if (value)
        {
            return parseInt(value, 10);
        }
        return undefined;
    }

    getHandler()
    {
        var radioControls = this.radioControls;
        var checkboxControls = this.checkboxControls;
        var buttonControls = this.buttonControls;
        return function (e) {
            var target;
            if (!e)
            {
                //IE
                e = window.event;
            }
            if (e.target)
            {
                //W3C
                target = e.target;
            }
            else if (e.srcElement)
            {
                //IE
                target = e.srcElement;
            }

            if (target.nodeType === 3)
            {
                // Safari fix
                target = target.parentNode;
            }

            var id = target.id;
            var control;
            switch (target.type)
            {
            case "radio":
                for (var g in radioControls)
                {
                    if (radioControls.hasOwnProperty(g))
                    {
                        var index = 0;
                        var controls = radioControls[g].controls;
                        var length = controls.length;
                        while (index < length)
                        {
                            control = controls[index];
                            if (control.id === id)
                            {
                                control.fn();
                                return;
                            }
                            index += 1;
                        }
                    }
                }
                break;
            case "checkbox":
                for (var c in checkboxControls)
                {
                    if (checkboxControls.hasOwnProperty(c))
                    {
                        control = checkboxControls[c];
                        if (control.id === id)
                        {
                            var result = control.fn();

                            if (result !== undefined)
                            {
                                (<HTMLInputElement>document.getElementById(control.id)).checked = !!result;
                            }

                            return;
                        }
                    }
                }
                break;
            case "button":
                for (var b in buttonControls)
                {
                    if (buttonControls.hasOwnProperty(b))
                    {
                        control = buttonControls[b];
                        if (b === id)
                        {
                            control.fn();
                            return;
                        }
                    }
                }
                break;
            default:
                // Unsupported
            }
        };
    }

    register()
    {
        var radioControls = this.radioControls;
        var checkboxControls = this.checkboxControls;
        var buttonControls = this.buttonControls;
        var sliderControls = this.sliderControls;
        var control, element, id;
        for (var g in radioControls)
        {
            if (radioControls.hasOwnProperty(g))
            {
                var defaultIndex = radioControls[g].selected;
                var controls = radioControls[g].controls;
                var length = controls.length;
                for (var i = 0; i < length; i += 1)
                {
                    control = controls[i];
                    id = control.id;
                    element = document.getElementById(id);
                    if (element)
                    {
                        element.value = control.value;
                        element.name = control.groupName;
                        element.onclick = this.getHandler();
                        element.checked = (defaultIndex === control.radioIndex) ? "checked" : "";
                    }
                }
            }
        }

        for (var c in checkboxControls)
        {
            if (checkboxControls.hasOwnProperty(c))
            {
                control = checkboxControls[c];
                id = control.id;
                element = document.getElementById(id);
                if (element)
                {
                    element.value = control.value;
                    element.onclick = this.getHandler();
                    element.checked = control.isSelected ? "checked" : "";
                }
            }
        }

        for (var b in buttonControls)
        {
            if (buttonControls.hasOwnProperty(b))
            {
                control = buttonControls[b];
                id = b;
                element = document.getElementById(id);
                if (element)
                {
                    element.value = control.value;
                    element.onclick = this.getHandler();
                }
            }
        }

        function createSliderCallback(id)
        {
            return function (event, ui) {
                var input = window.$("#" + id + "input");
                input.val(ui.value);
                input.change();
            };
        }

        function createInputCallback(control, id)
        {
            return function () {
                var value = parseFloat((<HTMLInputElement><any>this).value);

                if (!window.$)
                {
                    return;
                }
                var slider = window.$("#" + id);
                var input = window.$("#" + id + "input");
                if (!slider || !input)
                {
                    return;
                }
                var sliderVal = <number><any>(slider.slider("value"));
                if (value === undefined || isNaN(value) ||
                    sliderVal === undefined || isNaN(sliderVal) || (sliderVal === value))
                {
                    // Don't update if not changed
                    return;
                }

                var min = slider.slider("option", "min");
                var max = slider.slider("option", "max");
                if (value < min)
                {
                    value = min;
                }
                else if (value > max)
                {
                    value = max;
                }


                input.val(<string><any>value);

                control.value = value;
                control.fn();
            };
        }

        for (var s in sliderControls)
        {
            if (sliderControls.hasOwnProperty(s))
            {
                control = sliderControls[s];
                id = control.id;

                if (!window.$)
                {
                    return;
                }
                var slider = window.$("#" + id);
                var input = window.$("#" + id + "input");
                if (!slider || !input)
                {
                    return;
                }
                // Use jquery for sliders

                slider.slider({
                    value: control.value,
                    min: control.min,
                    max: control.max,
                    step: control.step,
                    slide: createSliderCallback(id)
                });

                input.val(<string><any>slider.slider("value"));
                input.change(createInputCallback(control, id));
            }
        }

        this.registered = true;
    }

    updateRadio(elementID, isSelected)
    {
        if (!this.registered)
        {
            return;
        }

        var element = (<HTMLInputElement>document.getElementById(elementID));
        if (element)
        {
            element.checked = !!isSelected;
        }
    }

    updateCheckbox(elementID, isSelected)
    {
        if (!this.registered)
        {
            return;
        }

        var element = (<HTMLInputElement>document.getElementById(elementID));
        if (element)
        {
            element.checked = !!isSelected;
        }
    }

    updateSlider(elementID, value)
    {
        if (!this.registered)
        {
            return;
        }

        if (window.$)
        {
            var element = window.$("#" + elementID);
            if (element)
            {
                element.slider("option", "value", value);
            }
        }
    }

    // Constructor function
    static create()
    {
        var c = new HTMLControls();
        c.radioControls = {}; // Created by group
        c.checkboxControls = {}; // Created by value
        c.buttonControls = {}; // Created by value
        c.sliderControls = {}; // Created by id
        c.registered = false;
        return c;
    }
}
