import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionLotSetUsageInitialValue(context) {
    if (context.binding.hasOwnProperty('InspectionCode_Nav') && !libVal.evalIsEmpty(context.binding.InspectionCode_Nav)) {
        context.getPageProxy().getClientData().InspectionCode = context.binding.InspectionCode_Nav;
        return context.binding.InspectionCode_Nav['@odata.readLink'];
    }
}
