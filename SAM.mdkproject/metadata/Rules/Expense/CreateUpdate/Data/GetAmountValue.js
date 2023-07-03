import CommonLibrary from '../../../Common/Library/CommonLibrary';
import LocalizationLibrary from '../../../Common/Library/LocalizationLibrary';

export default function GetAmountValue(context) {
    let amountControl = CommonLibrary.getControlProxy(context, 'AmountProperty');
    let controlValue = amountControl.getValue().replace(' ', '') + '';
    let separator = LocalizationLibrary.getDecimalSeparator(context);
    let amount = '';

    if (separator === ',') {
        amount = controlValue.replace('.', '');
    } else {
        amount = controlValue.replace(',', '');
    }

    return LocalizationLibrary.toNumber(context, amount, '', false);
}
