
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueDisplayCharUOM(context) {
    let binding = context.binding.Characteristic;

    if (!libVal.evalIsEmpty(binding.NumofChar)) {
        return binding.NumofChar;
    } else {
        return '-';
    }
    
}
