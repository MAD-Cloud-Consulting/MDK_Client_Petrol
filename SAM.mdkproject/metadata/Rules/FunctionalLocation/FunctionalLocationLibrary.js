import libCommon from '../Common/Library/CommonLibrary';
import validation from '../Common/Library/ValidationLibrary';
import ODataDate from '../Common/Date/ODataDate';
import libDoc from '../Documents/DocumentLibrary';

/**
 * This stores the Functional Location Create/Update page's event related methods
 */
 export class CreateUpdateFunctionalLocationEventLibrary {

    /**
     * Triggered when the page is loaded
     * @param {IPageProxy} pageClientAPI
     * @static
     */
    static onPageLoad(pageClientAPI) {
        if (!pageClientAPI.getClientData().LOADED) {
            let onCreate = libCommon.IsOnCreate(pageClientAPI);

            this._setTitle(pageClientAPI, onCreate);
            this.setDefaultValues(pageClientAPI);

            pageClientAPI.getClientData().LOADED = true;
        }
    }

    /** 
     * set the default values of the page's control
     * @param {IPageProxy} pageProxy
     * @static
     * 
     */
    static setDefaultValues(pageProxy) {
        libCommon.setStateVariable(pageProxy, 'LocalId', '');
        libCommon.setStateVariable(pageProxy, 'CopyValues', []);
        libCommon.setStateVariable(pageProxy, 'EditMask', '');

        if (!pageProxy.binding) {
            pageProxy.getClientData().DefaultValuesLoaded = true;
            return;
        }
        
        libCommon.getControlProxy(pageProxy, 'MaintenacePlantLstPkr').setValue(pageProxy.binding.MaintPlant || '');
        libCommon.getControlProxy(pageProxy, 'ManufactureNameProperty').setValue(pageProxy.binding.Manufacturer || ''); 
        libCommon.getControlProxy(pageProxy, 'ModelNumberProperty').setValue(pageProxy.binding.ModelNumber || ''); 
        libCommon.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(pageProxy.binding.SerialNumber || '');
        libCommon.getControlProxy(pageProxy, 'RoomProperty').setValue(pageProxy.binding.Room || ''); 
        libCommon.getControlProxy(pageProxy, 'IdProperty').setHelperText('');
        libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue(pageProxy.binding.FuncLocType || '');

        if (pageProxy.binding.FuncLocStructInd) {
            pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `FuncLocStructInds('${pageProxy.binding.FuncLocStructInd}')`, [], '')
                .then(response => {
                    let structure = response.getItem(0);
                    libCommon.setStateVariable(pageProxy, 'EditMask', structure.EditMask);
                    libCommon.getControlProxy(pageProxy, 'IdProperty').setHelperText(structure.EditMask);
            });
        }

        if (pageProxy.binding.ConstMonth && pageProxy.binding.ConstYear) {
            let date = new Date();
            date.setFullYear(pageProxy.binding.ConstYear);
            date.setMonth((pageProxy.binding.ConstMonth - 1).toString());
            libCommon.getControlProxy(pageProxy, 'ManufactureDatePicker').setValue(date);
        }

        const locationPicker = libCommon.getControlProxy(pageProxy, 'LocationLstPkr');

        if (pageProxy.binding.PlanningPlant) {
            let controlSpecifier = locationPicker.getTargetSpecifier();
            controlSpecifier.setQueryOptions(`$filter=Plant eq '${pageProxy.binding.PlanningPlant}'`);
            locationPicker.setTargetSpecifier(controlSpecifier);
        }
        
        if (pageProxy.binding.Location && pageProxy.binding.PlanningPlant) {
            locationPicker.setEditable(true);
            locationPicker.setValue([`Locations(Location='${pageProxy.binding.Location}',Plant='${pageProxy.binding.PlanningPlant}')`]);
        } else if (pageProxy.binding.PlanningPlant) {
            locationPicker.setEditable(true);
            libCommon.getControlProxy(pageProxy, 'LocationLstPkr').setValue('');
        } else {
            locationPicker.setEditable(false);
            libCommon.getControlProxy(pageProxy, 'LocationLstPkr').setValue('');
        }

        let aCopyFlags = [];
        if (pageProxy.binding.CopyClassification) { 
            aCopyFlags.push('CLASSIFICATIONS_TO_COPY');
        }

        if (pageProxy.binding.CopyDocuments) { 
            aCopyFlags.push('DOCUMENT_TO_COPY');
        }

        if (pageProxy.binding.CopyMeasuringPoints) { 
            aCopyFlags.push('MEASURING_POINTS_TO_COPY');
        }

        if (pageProxy.binding.CopyPartners) { 
            aCopyFlags.push('PARTNERS_TO_COPY');
        }

        if (pageProxy.binding.CopyNote) { 
            aCopyFlags.push('LONG_TEXT_TO_COPY');
        }

        libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue(aCopyFlags);

        pageProxy.getClientData().DefaultValuesLoaded = true;
    }

    /** 
     * set values of the page's control
     * @param {IPageProxy} pageProxy
     * @param {Object} functional location data object
     * @static
     * 
     */
     static setValues(pageProxy, FLOC) {
        libCommon.getControlProxy(pageProxy, 'MaintenacePlantLstPkr').setValue(FLOC.MaintPlant || '');
        this.setSuperioir(pageProxy, FLOC.SuperiorFuncLocInternId || '');
        libCommon.getControlProxy(pageProxy, 'ManufactureNameProperty').setValue(FLOC.Manufacturer || '');
        libCommon.getControlProxy(pageProxy, 'ModelNumberProperty').setValue(FLOC.ModelNumber || '');
        libCommon.getControlProxy(pageProxy, 'SerialNumberProperty').setValue(FLOC.SerialNumber || '');
        libCommon.getControlProxy(pageProxy, 'DescriptionNote').setValue(FLOC.FuncLocDesc || '');
        libCommon.getControlProxy(pageProxy, 'RoomProperty').setValue(FLOC.Room || '');

        if (FLOC.ConstMonth && FLOC.ConstYear) {
            let date = new Date();
            date.setFullYear(FLOC.ConstYear);
            date.setMonth((FLOC.ConstMonth - 1).toString());

            libCommon.getControlProxy(pageProxy, 'ManufactureDatePicker').setValue(date);
        }

        if (FLOC.StartDate) {
            let startDate = new ODataDate().toLocalDateString(FLOC.StartDate);
            libCommon.getControlProxy(pageProxy, 'StartDatePicker').setValue(startDate);
        }

        libCommon.getControlProxy(pageProxy, 'CategoryLstPkr').setValue(FLOC.FuncLocType || '');
        libCommon.getControlProxy(pageProxy, 'StrcutureIndLstPkr').setValue(FLOC.FuncLocStructInd || '');
        libCommon.getControlProxy(pageProxy, 'LocationLstPkr').setValue(FLOC.Location_Nav ? [FLOC.Location_Nav['@odata.readLink']] : '');
        libCommon.getControlProxy(pageProxy, 'IdProperty').setHelperText('');
        libCommon.setStateVariable(pageProxy, 'LocalId', '');
        libCommon.setStateVariable(pageProxy, 'CopyValues', []);
        libCommon.getControlProxy(pageProxy, 'IncludeFormReferenceLstPkr').setValue([]);
        libCommon.setStateVariable(pageProxy, 'EditMask', '');

        if (pageProxy.binding.FuncLocStructInd) {
            pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `FuncLocStructInds('${pageProxy.binding.FuncLocStructInd}')`, [], '')
                .then(response => {
                    let structure = response.getItem(0);
                    libCommon.setStateVariable(pageProxy, 'EditMask', structure.EditMask);
                    libCommon.getControlProxy(pageProxy, 'IdProperty').setHelperText(structure.EditMask);
            });
        }
    }

    /**
     * Private method of setting title when the page is loaded
     * @param {IPageProxy} context
     * @param {boolean} onCreate flag of the current page state (create/edit)
     * @private
     * @static
     */
    static _setTitle(context, onCreate) {
        let title = '';
        if (onCreate) {
            title = context.localizeText('add_floc');
        } else {
            title = context.localizeText('edit_functional_location');
        }
        context.setCaption(title);
    }

    /**
     * Validate fields values
     * @param {IPageProxy} context 
     * @return {Promise} 
     */
    static validateValues(context, createFlag) {
        const idControl = libCommon.getControlProxy(context, 'IdProperty');
        const id = libCommon.getControlValue(idControl);
        const mask = libCommon.getStateVariable(context, 'EditMask');

        if (this.validateId(id, mask)) {
            const flocId = idControl.getValue();
            idControl.clearValidation();
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocId eq '${flocId}'`).then(function(result) {
                // If we have entry with same id
                if (!validation.evalIsEmpty(result.getItem(0)) && createFlag) { 
                    return Promise.reject('existing_floc');
                }

                // check attachment count, run the validation rule if there is an attachment
                if (libDoc.attachmentSectionHasData(context)) {
                    return libDoc.createValidationRule(context).then(valid => {
                        if (valid) {
                            return Promise.resolve(flocId);
                        }
                        return Promise.reject();
                    });
                }

                return Promise.resolve(flocId);
            });
        } else {
            libCommon.setInlineControlError(context, idControl, context.localizeText('wrong_value', [mask]));
            idControl.applyValidation();
            return Promise.reject('wrong_value');
        }
    }

    /**
     * Validate if value by mask
     * @param {String} value 
     * @param {String} mask 
     * @return {boolean} 
     */
    static validateId(value, mask) {
        let arrayOfEnteredValue = value.split('');
        let arrayOfMaskCharacters = mask.split('');

        let valid = false;
        if (arrayOfMaskCharacters.length) {
            let didNotMatch = false;

            for (let i = 0; i < arrayOfMaskCharacters.length; i++) {
                let character = arrayOfEnteredValue[i];
                let regRul = '';

                switch (arrayOfMaskCharacters[i]) {
                    case 'A': {
                        regRul=/[A-Z]/g;
                        break;
                    }
                    case 'N': {
                        regRul=/[\d]/g;
                        break;
                    }
                    case 'X': {
                        regRul=/[A-Z|\d]/g;
                        break;
                    }
                    case 'S': {
                        regRul=/[\w&()+,./:;<=>]/g;
                        break;
                    }
                    case '-': {
                        regRul=/[-]/g;
                        break;
                    }
                    case '/': {
                        regRul=/[/]/g;
                        break;
                    }
                }

                if (regRul && character) { 
                    didNotMatch = !character.match(regRul);
                } else {
                    didNotMatch = true;
                } 

                if (didNotMatch) {
                    break;
                }
            }

            if (!didNotMatch) {
                valid = true;
            }
        }

        if (arrayOfEnteredValue.length !== arrayOfMaskCharacters.length) {
            valid = false;
        }

        return valid;
    }

    /**
     * Get page control value
     * @param {IPageProxy} pageProxy 
     * @param {String} name 
     * @return {String} 
     */
    static getControlValue(pageProxy, name) {
        let control = pageProxy.evaluateTargetPath('#Page:FunctionalLocationCreateUpdatePage/#Control:' + name);
        if (control !== undefined && control.getValue() !== undefined) {
            return control.getValue();
        }
        return '';
    }

    /**
     * Set superior value
     * @param {IPageProxy} context 
     * @param {String} superior
     */
    static setSuperioir(context, superior) {
        let formCellContainer = context.getControl('FormCellContainer');
        var extension;
        var value = formCellContainer.getControl('SuperiorFuncLocHierarchyExtensionControl').getValue();
        if (!value) {
            value = superior;
        }
        if (value) {
            extension = formCellContainer.getControl('SuperiorFuncLocHierarchyExtensionControl')._control._extension;
        }
        
        if (extension) {
            extension.setData(value);
        }
    }
}
