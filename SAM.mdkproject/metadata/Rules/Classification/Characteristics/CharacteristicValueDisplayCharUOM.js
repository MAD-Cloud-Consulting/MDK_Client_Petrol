
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueDisplayCharUOM(context) {
    let binding = context.binding.Characteristic;

    if (!libVal.evalIsEmpty(binding.UoM)) {
        return binding.UoM;
    } else {
        return '-';
    }
    
}
