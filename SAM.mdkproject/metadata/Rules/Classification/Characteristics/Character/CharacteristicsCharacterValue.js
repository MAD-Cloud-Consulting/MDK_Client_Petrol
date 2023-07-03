import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicsCharacterValue(context) {
    if (libVal.evalIsEmpty(context.binding.CharValue)) {
        return '';
    } else {
        return context.binding.CharValue;
    }
}
