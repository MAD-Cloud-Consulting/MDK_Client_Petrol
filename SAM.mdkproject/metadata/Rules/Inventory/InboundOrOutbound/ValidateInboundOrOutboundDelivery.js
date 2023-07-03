import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';

export default function ValidateInboundOrOutboundDelivery(context) {

    var dict = libCom.getControlDictionaryFromPage(context);

    dict.ConfirmedQuantitySimple.clearValidation();
    dict.StorageLocationPicker.clearValidation();
    dict.BatchSimple.clearValidation();
    
    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict));
    validations.push(validatePrecisionWithinLimit(context, dict));
    validations.push(validateStorageLocationNotBlank(context, dict));
    validations.push(validateQuantityIsValid(context, dict));

    return Promise.all(validations).then(function() {
        return Promise.resolve(true);
    }).catch(function() {
        // Errors exist
        return Promise.resolve(false);
    });
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
 * Quantity must be > 0
 */
function validateQuantityGreaterThanZero(context, dict) {
    if (Number(dict.QuantitySimple.getValue()) === Number(dict.ConfirmedQuantitySimple.getValue())) {
        return Promise.resolve(true);
    }
    const message = context.localizeText('open_confirmed_validation');
    libCom.executeInlineControlError(context, dict.ConfirmedQuantitySimple, message);
    return Promise.reject();
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
            open = Number(binding.TempItem_OpenQuantity) + Number(binding.TempLine_OldQuantity);
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

