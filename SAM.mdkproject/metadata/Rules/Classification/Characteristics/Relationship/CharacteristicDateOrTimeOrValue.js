
export default function CharacteristicDateOrTimeOrValue(context) {
    let dataType = context.binding.Characteristic.DataType;
    switch (dataType) {
        case 'DATE':
            return context.localizeText('date');
        case 'TIME':
            return context.localizeText('time');
        default:
            return context.localizeText('value');
    }
}
