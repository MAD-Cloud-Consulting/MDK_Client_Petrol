import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicsCharacterValueDescription(context) {
    if (libVal.evalIsEmpty(context.binding.CharValDesc)) {
        return '';
    } else {
        return context.binding.CharValDesc;
    }
}
