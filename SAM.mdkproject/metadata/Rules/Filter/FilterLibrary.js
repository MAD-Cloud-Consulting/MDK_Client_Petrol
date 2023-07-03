import libVal from '../Common/Library/ValidationLibrary';

export default class {

    static getFilterCount(context) {
        var count = 0;
        let controls = this.getFilterControls(context);
        if (controls) {
            for (let i = 0; i < controls.length; i++) {
                if (i > 0) {
                    count = count + this.getFilterValueCount(controls[i]);
                }
            }
        }
        return count;
    }

    static setFilterValue(control, value) {
        if (control) {
            control.setValue(value);
        }
    }

    static getFilterValue(control) {
        if (control && control.getType() === 'Control.Type.FormCell.ListPicker') {
            if (control.getValue().length > 0) {
                return control.getValue();
            } else {
                return [];
            }
        } else {
            if (control && control.getValue() && control.getValue().filterItems && control.getValue().filterItems[0]) {
                return control.getValue().filterItems[0];
            }
        }
        return '';
    }

    static getFilterValueCount(control) {
        if (control && control.getValue()) {
            switch (control.getType()) {
                case 'Control.Type.FormCell.ListPicker':
                    return control.getValue().length;
                case 'Control.Type.FormCell.Switch':
                    break;
                case 'Control.Type.FormCell.DatePicker':
                    return control.visible ? 1 : 0;
                default:
                    return control.getValue().filterItems.length;
            }
        }
        return 0;
    }

    static getFilterControls(context) {
        let formCellContainer = context.getControl('FormCellContainer');
        if (formCellContainer && formCellContainer.getControls()) {
            return formCellContainer.getControls();
        }
        return '';
    }

    static isDefaultFilter(context) {
        return this.isDefaultControl(this.getFilterControls(context));
    }

    static isDefaultControl(controls) {
        var defaultControl = false;
        if (controls) {
            for (let i = 0; i < controls.length; i++) {
                if (!(controls[i].getType() === 'Control.Type.FormCell.Button')) {
                    if (i === 0) {
                        if (this.getFilterValue(controls[i]) === controls[i].getCollection()[0].ReturnValue) {
                            defaultControl = true;
                        }
                    } else {
                        if (!libVal.evalIsEmpty(this.getFilterValue(controls[i]))) {
                            defaultControl = false;
                        }
                    }
                }

            }
        }
        return defaultControl;
    }

    static setDefaultFilter(context, allEmpty) {
        if (libVal.evalIsEmpty(allEmpty)) {
            allEmpty = false;
        }
        if (this.getFilterControls(context)) {
            let controls = this.getFilterControls(context);
            this.setDefaultControl(controls, allEmpty);
        }
    }

    static setDefaultControl(controls, allEmpty) {
        if (controls && controls.length > 0) {
            for (let i = 0; i < controls.length; i++) {
                if (i === 0 && !allEmpty) {
                    this.setFilterValue(controls[i], controls[i].getCollection()[0].ReturnValue);
                } else {
                    this.setFilterValue(controls[i], '');
                }
            }
        }
    }
}
