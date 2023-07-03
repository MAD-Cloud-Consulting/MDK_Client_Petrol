import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueFrom(context) {
    let value = '';
    let dataType = context.binding.Characteristic.DataType;
    if (context.binding.ValueRel === '6' || context.binding.ValueRel === '7' ) {
        value = context.binding.CharValTo.toString();
    } else if (libVal.evalIsEmpty(context.binding.CharValFrom)) {
        value = '';
    } else {
        value =  context.binding.CharValFrom.toString();
    }
    if (dataType === 'NUM' || dataType === 'CURR') {
        if (value.includes(',')) {
            value.replace(',', '.');
        }
    }
    return value;
}
