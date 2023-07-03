import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotKPIProgressForCharacteristics(context) {
    if (context.binding.hasOwnProperty('InspectionChars_Nav') && !libVal.evalIsEmpty(context.binding.InspectionChars_Nav)) {
        var chars = context.binding.InspectionChars_Nav;
        let nonEmpty = 0;
        for (let i = 0; i < chars.length; i++) {
            if (!libVal.evalIsEmpty(chars[i].Valuation )) {
                nonEmpty++;
            }
        }
        return nonEmpty/chars.length;
    }
    return 0;
}
