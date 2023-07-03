import libVal from '../Common/Library/ValidationLibrary';

export default function LAMCharacteristicValueStringToNumber(context) {

    let name = context.getName();
    var valueString = context.binding[name];

    if (!libVal.evalIsEmpty(valueString)) {
        return valueString.trim();
    } else {
        return '';
    }

}
