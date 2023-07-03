/**
 * Validate that the mileage value is numeric and 
 * that it is not longer than 6 digits which is the max value accepted in the backend
 */
import CommonLibrary from '../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';
import ValidateActualWorkValue from '../../Expense/CreateUpdate/ValidateActualWorkValue';

export default function MileageAddEditValidation(context) {
    let dict = CommonLibrary.getControlDictionaryFromPage(context);
    let mileageControl = dict.MileageSim;
    mileageControl.clearValidation();

    let mileageValue = mileageControl.getValue();
    let mileageMaxLength = context.getGlobalDefinition('/SAPAssetManager/Globals/Mileage/MileageMaxLength.global').getValue();

    if (!LocalizationLibrary.isNumber(context, mileageValue)) {
        let message = context.localizeText('validation_reading_is_numeric');
        CommonLibrary.executeInlineControlError(context, mileageControl, message);
        return Promise.reject(false);
    }

    return ValidateActualWorkValue(context, mileageControl, mileageMaxLength);
}
