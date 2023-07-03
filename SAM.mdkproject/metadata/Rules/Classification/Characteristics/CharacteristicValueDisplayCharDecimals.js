

import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicValueDisplayCharDecimals(context) {
    let binding = context.binding.Characteristic;

    if (!libVal.evalIsEmpty(binding.NumofDecimal)) {
        return binding.NumofDecimal;
    } else {
        return '-';
    }
    
}
