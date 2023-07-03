import inspCharLib from '../../../InspectionCharacteristics/Update/InspectionCharacteristics';
import libVal from '../../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsValue(context) {
    if (inspCharLib.isQualitative(context.binding)) {
        if (!libVal.evalIsEmpty(context.binding.InspectionCode_Nav)) {
            return context.binding.InspectionCode_Nav.CodeDesc;
        }
        return '-';
    }
    return String(context.binding.ResultValue);
}
