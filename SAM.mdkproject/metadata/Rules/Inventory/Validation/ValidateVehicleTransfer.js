import libCom from '../../Common/Library/CommonLibrary';
import showMaterialTransferToFields from './ShowMaterialTransferToFields';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function ValidateVehicleTransfer(context) {

    var dict = libCom.getControlDictionaryFromPage(context);

    dict.QuantitySimple.clearValidation();
    dict.MaterialLstPkr.clearValidation();
    dict.StorageLocationLstPkr.clearValidation();
    dict.PlantLstPkr.clearValidation();
    dict.MaterialUOMLstPkr.clearValidation();
    
    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict));
    validations.push(validateQuantityLowerThanUnrestrictedQuantity(context, dict));
    validations.push(validateMaterialNotBlank(context, dict));
    validations.push(validateStorageLocationNotBlank(context, dict));
    validations.push(validateMovePlantNotBlank(context, dict));
    validations.push(validateUOMNotBlank(context, dict));

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
    if (libLocal.toNumber(context, dict.QuantitySimple.getValue()) > 0) {
        return Promise.resolve(true);
    } 
    let message = context.localizeText('quantity_must_be_greater_than_zero');
    libCom.executeInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}
/**
 * Quantity must be <= unrestricted quantity
 */
function validateQuantityLowerThanUnrestrictedQuantity(context, dict) {
    if (dict.QuantitySimple.getValue() <= dict.AvailableQuantity.getValue()) {
        return Promise.resolve(true);
    }

    let message = context.localizeText('validation_greater_than_available_quantity');
    libCom.executeInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}

/**
 * Material cannot be blank
 */
function validateMaterialNotBlank(context, dict) {
    if ((!(libCom.getPreviousPageName(context) === 'StockDetailsPage')) && showMaterialTransferToFields(context) || libCom.getPageName(context) === 'VehicleIssueOrReceiptCreatePage') {
        if (libCom.getListPickerValue(dict.MaterialLstPkr.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.MaterialLstPkr, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}

/**
 * Material cannot be blank
 */
function validateUOMNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.MaterialUOMLstPkr.getValue())) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('field_is_required');
    libCom.executeInlineControlError(context, dict.MaterialUOMLstPkr, message);
    return Promise.reject();
}

/**
 * Move Plant cannot be blank
 */
function validateMovePlantNotBlank(context, dict) {
    if (showMaterialTransferToFields(context)) {
        if (libCom.getListPickerValue(dict.PlantLstPkr.getValue())) {
            return Promise.resolve(true);
        }
        let message = context.localizeText('field_is_required');
        libCom.executeInlineControlError(context, dict.PlantLstPkr, message);
        return Promise.reject();
    }
    return Promise.resolve(true);
}


/**
 * Storage Location cannot be blank
 */
 function validateStorageLocationNotBlank(context, dict) {
    if (libCom.getListPickerValue(dict.StorageLocationLstPkr.getValue())) {
        return Promise.resolve(true);
    }
    let message = context.localizeText('field_is_required');
    libCom.executeInlineControlError(context, dict.StorageLocationLstPkr, message);
    return Promise.reject();
}
