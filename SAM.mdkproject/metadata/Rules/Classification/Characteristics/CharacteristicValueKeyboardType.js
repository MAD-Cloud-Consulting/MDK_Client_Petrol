export default function CharacteristicValueKeyboardType(context) {
    if (context.binding && context.binding.Characteristic.DataType) {
        let dataType = context.binding.Characteristic.DataType;
        if (dataType === 'NUM' || dataType === 'CURR') {
            return 'Number';
        } else if (dataType === 'DATE' || dataType === 'TIME') {
            return 'DateTime';
        }
    }
    return 'Default';
}
