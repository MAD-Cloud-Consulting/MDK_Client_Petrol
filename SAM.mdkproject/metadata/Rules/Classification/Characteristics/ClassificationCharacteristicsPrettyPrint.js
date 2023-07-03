

import libVal from '../../Common/Library/ValidationLibrary';
export default function ClassificationCharacteristicsPrettyPrint(charValues) {
    if (!libVal.evalIsEmpty(charValues)) {
        return charValues.join(', ');
    }
    return '-';
}
