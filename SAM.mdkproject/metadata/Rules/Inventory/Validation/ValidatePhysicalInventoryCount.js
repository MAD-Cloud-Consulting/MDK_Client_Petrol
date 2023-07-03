import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libMeasure from '../../Measurements/MeasuringPointLibrary';
import getBin from '../PhysicalInventory/Count/GetStorageBinAndBatchEnabled';

export default function ValidatePhysicalInventoryCount(context) {

    var dict = libCom.getControlDictionaryFromPage(context);

    dict.QuantitySimple.clearValidation();
    
    let validations = [];

    validations.push(validateQuantityGreaterThanZero(context, dict));
    validations.push(validatePrecisionWithinLimit(context, dict));
    validations.push(validateMaterialIsNotDuplicated(context, dict));
    validations.push(validateBatchNotEmptyIfRequired(context, dict));

    return Promise.all(validations).then(function() {
        return Promise.resolve(true);
    }).catch(function() {
        // Errors exist
        return Promise.resolve(false);
    });
}

/**
 * Quantity must be > 0 if not zero count
 */
function validateQuantityGreaterThanZero(context, dict) {
    if (dict.ZeroCountSwitch.getValue() === true || libLocal.toNumber(context, dict.QuantitySimple.getValue()) > 0) {
        return Promise.resolve(true);
    } 
    let message = context.localizeText('pi_quantity_must_be_greater_than_zero');
    libCom.executeInlineControlError(context, dict.QuantitySimple, message);
    return Promise.reject();
}

/**
 * quantity decimal precision must be within limits
 */
function validatePrecisionWithinLimit(context, dict) {

    let num = libLocal.toNumber(context, dict.QuantitySimple.getValue());
    let target = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (dict.ZeroCountSwitch.getValue() === true ) {
        return Promise.resolve(true);
    }

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

/**
 * material number for PI item cannot be duplicated over all items on device
 */
 function validateMaterialIsNotDuplicated(context, dict) {
    
    let onCreate = libCom.IsOnCreate(context);

    if (onCreate) {
        let material = libCom.getListPickerValue(dict.MatrialListPicker.getValue());
        let batch = dict.BatchSimple.getValue().toUpperCase();
        let plant;
        let storageLoc;

        if (dict.ItemPlantTitle) {
            plant = dict.ItemPlantTitle.getValue();
        } else {
            plant = libCom.getListPickerValue(dict.PlantLstPkr.getValue());
        }
        if (dict.ItemStorageLocationTitle) {
            storageLoc = dict.ItemStorageLocationTitle.getValue();
        } else {
            storageLoc = libCom.getListPickerValue(dict.StorageLocationPicker.getValue());
        }

        let query = "$filter=Material eq '" + material + "' and Plant eq '" + plant + "' and Batch eq '" + batch + "' and StorLocation eq '" + storageLoc + "'";
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocItems', query).then(count => {
            if (count > 0) {
                libCom.executeInlineControlError(context, dict.MatrialListPicker, context.localizeText('pi_duplicate_material'));
                return Promise.reject();
            }
            return Promise.resolve(true);
        });
    }
    return Promise.resolve(true);
 }

 /**
 * Batch field is required if material is batch enabled or valuation enabled
 */
function validateBatchNotEmptyIfRequired(context, dict) {
    if (libCom.IsOnCreate(context)) { //Only required if adding new PI
        return getBin(context).then(function(result) {
            if (result[1] || result[2]) {
                if (dict.BatchSimple.getValue()) {
                    return Promise.resolve(true); 
                }
                libCom.executeInlineControlError(context, dict.BatchSimple, context.localizeText('field_is_required'));
                return Promise.reject();
            } else {
                return Promise.resolve(true);
            }
        });
    }
    return Promise.resolve(true);
}
