import {BusinessPartnerEditWrapper} from './BusinessPartnerEditWrapper';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import countryPickerVal from './BusinessPartnerEditCountryPickerValue';
import statePickerVal from './BusinessPartnerEditStatePickerValue';
import BusinessPartnerIsValid from './BusinessPartnerIsValid';
import IsAddressCommType from '../IsAddressCommType';

export default function BusinessPartnersEditOnCommit(context) {

    // If this business partner is invalid, return early
    return BusinessPartnerIsValid(context).then(isValid => {
        if (!isValid) {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
        }
        // Build the cascading action
        let cascadingAction = buildEditAction(context);

        return cascadingAction.execute(context).then(() => {
            return onUpdateSuccess(context);
        });
    });
}

function buildEditAction(context) {
    let entity = context.getBindingObject();
    // Wrap the entity for comparisons
    let wrapper = new BusinessPartnerEditWrapper(entity);

    let editActions = [];
    let code;
    if (isAddressChanged(context, wrapper)) {
        context.getClientData().country = countryPickerVal(context);
        context.getClientData().state = statePickerVal(context);
        editActions.push(wrapper.editAddressAction());
    }

    if (isCommPropertyChanged(context, wrapper, 'Email', 'Email')) {
        let email = controlValue(context, 'Email');
        editActions.push(wrapper.editEmailAction(email));
    }

    if (isCommPropertyChanged(context, wrapper, 'Phone', 'TelephoneShort') || isCommPropertyChanged(context, wrapper, 'Extension', 'Extension')) {
        let phone = controlValue(context, 'Phone');
        let extension = IsAddressCommType(context) ? controlValue(context, 'Extension') : '';
        if (libVal.evalIsEmpty(wrapper.communicationProperty('Telephone'))) {
            code = libCom.getStateVariable(context, 'DialingCode');
        } else {
            let codeLen = wrapper.communicationProperty('Telephone').length - (wrapper.communicationProperty('TelephoneShort').length + wrapper.communicationProperty('Extension').length);
            code = wrapper.communicationProperty('Telephone').substring(0, codeLen);
        }
        editActions.push(wrapper.editPhoneNumberAction(phone, 'Telephone', code, extension));
    }

    if (isCommPropertyChanged(context, wrapper, 'Mobile', 'MobileShort')) {
        let mobile = controlValue(context, 'Mobile');
        if (libVal.evalIsEmpty(wrapper.communicationProperty('Mobile'))) {
            code = libCom.getStateVariable(context, 'DialingCode');
        } else {
            let codeLen = wrapper.communicationProperty('Mobile').length - wrapper.communicationProperty('MobileShort').length;
            code = wrapper.communicationProperty('Mobile').substring(0, codeLen);
        }
        editActions.push(wrapper.editPhoneNumberAction(mobile, 'Mobile', code));
    }

    if (isCommPropertyChanged(context, wrapper, 'Fax', 'FaxShort') || isCommPropertyChanged(context, wrapper, 'FaxExtension', 'FaxExtension')) {
        let fax = controlValue(context, 'Fax');
        let faxExtension = IsAddressCommType(context) ? controlValue(context, 'FaxExtension') : ''; 
        if (libVal.evalIsEmpty(wrapper.communicationProperty('Fax'))) {
            code = libCom.getStateVariable(context, 'DialingCode');
        } else {
            let codeLen = wrapper.communicationProperty('Fax').length - (wrapper.communicationProperty('FaxShort').length + wrapper.communicationProperty('FaxExtension').length);
            code = wrapper.communicationProperty('Fax').substring(0, codeLen);
        }
        editActions.push(wrapper.editPhoneNumberAction(fax, 'Fax', code, faxExtension));
    }

    if (editActions.length === 0) {
        // No changes to be made
        // Notify the user?
        return onUpdateSuccess(context);
    } 

    let cascadingAction = editActions.shift();
    editActions.forEach(nextAction => {
        cascadingAction.pushLinkedAction(nextAction);
    });

    return cascadingAction;
}

/**
 * Retrieve the value from a control on the page
 * @param {*} context 
 * @param {*} controlName 
 */
function controlValue(context, controlName) {
    return libCom.getFieldValue(context, controlName, null);
}

/**
 * True if an address property has been changed by the user
 * @param {*} context 
 * @param {*} wrapper 
 */
function isAddressChanged(context, wrapper) {

    // Map all of the control names to address properties
    let controlPropertyMap = {
        'House': 'House',
        'Country': 'Country',
        'Street': 'Street',
        'City': 'City',
        'ZipCode': 'PostalCode',
        'State': 'Region',
        'Building': 'Building',
        'Floor': 'Floor',
        'Room': 'Room',
    };


    for (const [key, value] of Object.entries(controlPropertyMap)) {
        let controlVal = controlValue(context, key);
        let propertyVal = wrapper.addressProperty(value);
        if (controlVal !== propertyVal) {
            // Return true indicating an address property has changed
            // An update action should occur
            return true;
        }

    }

    return false;
}

/**
 * True if a property value does not match it's control value
 * @param {*} context - calling context
 * @param {*} wrapper - wrapper for the Business Partner
 * @param {*} control - Control for a given property
 * @param {*} property - Wrapper property depicted by control
 */
function isCommPropertyChanged(context, wrapper, control, property) {
    let controlVal = controlValue(context, control);
    let propVal = wrapper.communicationProperty(property);
    if (propVal === null) {
        return controlVal.length > 0;
    }
    return controlVal !== propVal;
}

/**
 * Successfully updated the business partner entity
 * 
 * @param {*} context - Calling context
 */
function onUpdateSuccess(context) {

    context.evaluateTargetPath('#Page:-Previous/#ClientData').didUpdateEntity = true;
    
    libCom.setStateVariable(context, 'ObjectCreatedName', 'Partner');
    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
}
