import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionLotDetailsValuation(context) {
    if (context.binding.hasOwnProperty('InspValuation_Nav') && !libVal.evalIsEmpty(context.binding.InspectionCode_Nav)) {
        return context.binding.InspValuation_Nav.ShortText;
    }
    return '-';
}
