
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueDisplayCharDescription(context) {
    let binding = context.binding;

    if (!libVal.evalIsEmpty(binding.CharValDesc)) {
        return binding.CharValDesc;
    } else {
        return '-';
    }
    
}
