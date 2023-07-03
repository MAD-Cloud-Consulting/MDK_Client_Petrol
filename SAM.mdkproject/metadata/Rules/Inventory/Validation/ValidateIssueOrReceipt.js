import libCom from '../../Common/Library/CommonLibrary';
import showBatch from './ShowMaterialBatchField';
// import showAuto from './ShowAutoSerialNumberField';
import ShowSerialNumberField from './ShowSerialNumberField';
import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import showMaterialNumberListPicker from './ShowMaterialNumberListPicker';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';

export default function ValidateIssueOrReceipt(context) {

    var dict = libCom.getControlDictionaryFromPage(context);

    dict.QuantitySimple.clearValidation();
    dict.MatrialListPicker.clearValidation();
    dict.MovementReasonPicker.clearValidation();
    dict.StorageLocationPicker.clearValidation();
    dict.MovementTypePicker.clearValidation();
    dict.MovementReasonPicker.clearValidation();
    dict.BatchSimple.clearValidation();
    dict.ConfirmedQuantitySimple.clearValidation();
    dict.AutoSerialNumberSwitch.clearValidation();
    
    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict));
    validations.push(validatePrecisionWithinLimit(context, dict));
    validations.push(validateMaterialNotBlank(context, dict));
    validations.push(validateStorageLocationNotBlank(context, dict));
    validations.push(validateMovePlantNotBlank(context, dict));
    validations.push(validateMoveStorageLocationNotBlank(context, dict));
    validations.push(validateMovementTypeNotBlank(context, dict));
    validations.push(validateMovementReasonNotBlank(context, dict));
    validations.push(validateQuantityIsValid(context, dict));
    validations.push(validateBatchNotBlank(context, dict));
    validations.push(validateBatchToNotBlank(context, dict));
    // validations.push(validateAutoSerialNotBlank(context, dict));
    //validations.push(validateSerialNumListPickerNotBlank(context, dict));
    validations.push(validateCostCenterNotBlank(context, dict));
    validations.push(validateCostCenterNotBlank(context, dict));
    validations.push(validateWBSElementNotBlank(context, dict));
    validations.push(validateOrderNotBlank(context, dict));
    validations.push(validateNetworkNotBlank(context, dict));
    validations.push(validateActivityNotBlank(context, dict));
    validations.push(validateMovReasonNotBlank(context, dict));

    return Promise.all(validations).then(function() {
        return Promise.resolve(true);
    }).catch(function() {
        // Errors exist
        return Promise.resolve(false);
    });
}

/**
 * Quantity must be > 0
 */
function validateQuantityGreaterThanZero(context, dict) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const error = {message: 'quantity_must_be_greater_than_zero', field: dict.QuantitySimple};

    return ShowSerialNumberField(context).then(show => {
        if (objectType === 'ADHOC' || objectType === 'TRF') {
            if (libLocal.toNumber(context, dict.QuantitySimple.getValue())) {
                return Promise.resolve(true);
            }
        } else {
            if (!show) {
                if (libLocal.toNumber(context, dict.QuantitySimple.getValue())) {
                    return Promise.resolve(true);
                }
            } else {
                if (dict.AutoSerialNumberSwitch.getValue()) {
                    if (libLocal.toNumber(context, dict.QuantitySimple.getValue())) {
                        return Promise.resolve(true);
                    }
                } else {
                    const actualNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual;
                    const serialNumbers = actualNumbers && actualNumbers.filter(item => item.selected).length;

                    if (type === 'MaterialDocItem') {
                        if (serialNumbers !== 0) {
                            return Promise.resolve(true);
                        }
                    } else {
                        if (serialNumbers) {
                            return Promise.resolve(true);
                        }
                    }
    
                    error.message = 'confirmed_quantity_change';
                    error.field = dict.ConfirmedQuantitySimple;
                }
            }
        }

        const message = context.localizeText(error.message);
        libCom.executeInlineControlError(context, error.field, message);
        return Promise.reject();
    });
}

/**
 * Material cannot be blank
 */
function validateMaterialNotBlank(context, dict) {
    if (
        ((!(libCom.getPreviousPageName(context) === 'StockDetailsPage')) && showMaterialTransferToFields(context))
        || showMaterialNumberListPicker(context)
    ) {
        if (libCom.getListPickerValue(dict.MatrialListPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.MatrialListPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Movement reason cannot be blank of movement type is 122
 */
 function validateMovReasonNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.MovementTypePicker.getValue())) {
        let value = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
        if (value === '122' && !libCom.getListPickerValue(dict.MovementReasonPicker.getValue())) {
            let message = context.localizeText('field_is_required');
            libCom.executeInlineControlError(context, dict.MovementReasonPicker, message);
            return Promise.reject();
        }
    }
    return Promise.resolve(true);
}

/**
 * Move Plant cannot be blank
 */
function validateMovePlantNotBlank(context, dict) {
    if (showMaterialTransferToFields(context)) {
        if (libCom.getListPickerValue(dict.PlantToListPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.PlantToListPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Move Storage Location cannot be blank
 */
 function validateMoveStorageLocationNotBlank(context, dict) {
    if (showMaterialTransferToFields(context)) {
        if (libCom.getListPickerValue(dict.StorageLocationToListPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.StorageLocationToListPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Storage Location cannot be blank
 */
 function validateStorageLocationNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.StorageLocationPicker.getValue())) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('field_is_required');
    libCom.executeInlineControlError(context, dict.StorageLocationPicker, message);
    return Promise.reject();
}

/**
 * Movement Type cannot be blank
 */
 function validateMovementTypeNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.MovementTypePicker.getValue())) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('field_is_required');
    libCom.executeInlineControlError(context, dict.MovementTypePicker, message);
    return Promise.reject();
}

/**
 * Movement Reason cannot be blank
 */
 function validateMovementReasonNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '551') {
        if (libCom.getListPickerValue(dict.MovementReasonPicker.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.MovementReasonPicker, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Quantity cannot be greater than open
 */
function validateQuantityIsValid(context, dict) {
    let qty = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let open;
    let openRequired = false;
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (context.binding) {
        let binding = context.binding;
        if (type === 'PO' || (type === 'PRD' && move === 'R')) {
            open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
            openRequired = true;
        } else if (type === 'STO') {
            if (move === 'R') { //Receipt
                open = Number(binding.TempItem_IssuedQuantity) - Number(binding.TempItem_ReceivedQuantity) + Number(binding.TempLine_OldQuantity);
            } else { //Issue
                open = Number(binding.TempItem_OrderQuantity) - Number(binding.TempItem_IssuedQuantity) + Number(binding.TempLine_OldQuantity);
            }
            openRequired = true;
        } else if (type === 'RES' || (type === 'PRD' && move === 'I')) {
            open = Number(binding.TempItem_OpenQuantity);
            openRequired = true;
        } else if (type === 'REV') {
            open = Number(binding.TempLine_OldQuantity);
            openRequired = true;
        }
    }
    if (qty <= open || !openRequired) {
        return Promise.resolve(true);
    }
    
    let message = context.localizeText('po_item_receiving_quantity_failed_validation_message',[open]);
    libCom.executeInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}

/**
 * 
 * Check that batch is provided when material is batch enabled
 */
function validateBatchNotBlank(context, dict) {
    return showBatch(context, true).then(function(show) {
        if (!show || (show && dict.BatchSimple.getValue())) {
            return Promise.resolve(true); //Not batch enabled or batch enabled and provided
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.BatchSimple, message);
        return Promise.reject();
    });
}

/**
 * 
 * Check that batch to is provided when material is batch enabled
 */
 function validateBatchToNotBlank(context, dict) {
    return showBatch(context, true).then(function(show) {
        if (!show || !showMaterialTransferToFields(context) || (show && dict.BatchNumTo.getValue())) {
            return Promise.resolve(true); //Not batch enabled or batch enabled and provided
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.BatchNumTo, message);
        return Promise.reject();
    });
}

/**
 * 
 * Check that auto serial is provided when material is serialized
 */
// function validateAutoSerialNotBlank(context, dict) {
//     return showAuto(context).then(function(show) {
//         const serialNumbers = libCom.getStateVariable(context, 'SerialNumbers').actual || (context.binding && context.binding.SerialNum) || [];
//         if (!show || (show && dict.AutoSerialNumberSwitch.getValue())) {
//             return Promise.resolve(true); //Not serialized or serialized and true
//         } else if (serialNumbers.length > 0) {
//             return Promise.resolve(true); 
//         }

//         let message = context.localizeText('field_is_required');
//         libCom.setInlineControlError(context, dict.AutoSerialNumberSwitch, message);
//         return Promise.reject();
//     });
// }

/**
 * 
 * Check that cost center is provided based on movement type 
 */
function validateCostCenterNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if ((movementTypeValue === '201' || movementTypeValue === '551') && !dict.CostCenterSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.CostCenterSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that WBS element is provided based on movement type 
 */
function validateWBSElementNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '221' && !dict.WBSElementSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.WBSElementSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that order is provided based on movement type 
 */
function validateOrderNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '261' && !dict.OrderSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.OrderSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that network is provided based on movement type 
 */
function validateNetworkNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '281' && !dict.NetworkSimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.NetworkSimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * 
 * Check that activity is provided based on movement type 
 */
function validateActivityNotBlank(context, dict) {
    let movementTypeValue = libCom.getListPickerValue(dict.MovementTypePicker.getValue());
    if (movementTypeValue === '281' && !dict.ActivitySimple.getValue()) {
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.ActivitySimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * quantity decimal precision must be within limits
 */
function validatePrecisionWithinLimit(context, dict) {

    let num = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let target = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    if (target < 0) {
        target = 0;
    }

    //Did user provide allowed decimal precision for quantity?
    if (Number(libMeasure.evalPrecision(num) > target)) {
        let message;
        if (target > 0) {
            let dynamicParams = [target];
            message = context.localizeText('quantity_decimal_precision_of',dynamicParams);
        } else {
            message = context.localizeText('quantity_integer_without_decimal_precision');
        }
        libCom.executeInlineControlError(context, dict.QuantitySimple, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}
