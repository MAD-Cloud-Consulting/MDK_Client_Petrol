import libCommon from '../../../Common/Library/CommonLibrary';
export default function CharacteristicsMaximumLength(context, value, control) {
    if (value.length > context.binding.Characteristic.NumofChar && context.binding.Characteristic.DataType === 'CHAR') {
        let charLimit = context.binding.Characteristic.NumofChar;
        let dynamicParams = [charLimit];
        let message = context.localizeText('validation_maximum_field_length', dynamicParams);
        return libCommon.executeInlineControlError(context, control, message);
    }
    return true;
}
