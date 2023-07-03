import LocalizationLibrary from '../../Common/Library/LocalizationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ValidateActualWorkValue(context, amountControl, amountMaxLength, digitsMaxLength = 1) {
    let controlValue = amountControl.getValue() + '';
    controlValue = controlValue.replace(' ', '');
    amountControl.clearValidation();

    let separator = LocalizationLibrary.getDecimalSeparator(context);
    let aNumbers = controlValue.split(separator);
    let amount = aNumbers[0].replace(',', '').replace('.', '');
    let amountLength = amount.length;

    if (amountLength > amountMaxLength) {
        let message = context.localizeText('validation_maximum_field_length', [amountMaxLength]);
        CommonLibrary.executeInlineControlError(context, amountControl, message);
        return Promise.reject(false);
    }

    let digits = aNumbers.length > 1 ? aNumbers[1] : '0';
    if (digits.length > digitsMaxLength) {
        let message = context.localizeText('validation_maximum_digits_length', [digitsMaxLength]);
        CommonLibrary.executeInlineControlError(context, amountControl, message);
        return Promise.reject(false);
    }

    let groupSeparator = separator === ',' ? '.' : ',';
    let groupSeparatorIndex = aNumbers[0].lastIndexOf(groupSeparator) + 1;
    if (groupSeparatorIndex !== 0 && aNumbers[0].length -  groupSeparatorIndex < 3) {
        let message = context.localizeText('wrong_digits_separator');
        CommonLibrary.executeInlineControlError(context, amountControl, message);
        return Promise.reject(false);
    }

    return Promise.resolve(true);
}
