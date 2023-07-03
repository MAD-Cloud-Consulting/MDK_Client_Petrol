
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueDisplayCharDatatype(context) {
    let binding = context.binding.Characteristic;

    if (!libVal.evalIsEmpty(binding.DataType)) {
        return binding.DataType;
    } else {
        return '-';
    }
    
}
