
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueCaption(context) {
    let binding = context.binding;

    if (!libVal.evalIsEmpty(binding.Characteristic) && !libVal.evalIsEmpty(binding.Characteristic.CharDesc)) {
        return binding.Characteristic.CharDesc;
    } else {
        return '-';
    }
}
