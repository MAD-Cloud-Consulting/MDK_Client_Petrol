import libCommon from '../../../Common/Library/CommonLibrary';
export default function CharacteristicsNegative(context, value, control) {
    if (value < 0 && context.binding.Characteristic.ValueSign !== 'X' && context.binding.Characteristic.DataType !== 'CHAR') {
        let message = context.localizeText('negative_not_allowed');
        return libCommon.executeInlineControlError(context, control, message);
    }
    return true;
}
