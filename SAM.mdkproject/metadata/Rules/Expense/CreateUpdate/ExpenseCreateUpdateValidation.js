import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidateActualWorkValue from './ValidateActualWorkValue';
import ValidateDatePickerValue from './ValidateDatePickerValue';

export default function ExpenseCreateUpdateValidation(context) {
    let amountControl = CommonLibrary.getControlProxy(context,'AmountProperty');
    let amountMaxLength = context.getGlobalDefinition('/SAPAssetManager/Globals/Expense/ExpenseMaxLength.global').getValue();

    return ValidateActualWorkValue(context, amountControl, amountMaxLength, 2).then(() => {
        let dateControl = CommonLibrary.getControlProxy(context, 'CreateDatePicker');
        return ValidateDatePickerValue(context, dateControl);
    });
}
