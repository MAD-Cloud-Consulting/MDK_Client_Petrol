
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueDisplayCharDescription(context) {
    let binding = context.binding.Characteristic;

    if (!libVal.evalIsEmpty(binding.CharDesc)) {
        return binding.CharDesc;
    } else {
        return '-';
    }
    
}
