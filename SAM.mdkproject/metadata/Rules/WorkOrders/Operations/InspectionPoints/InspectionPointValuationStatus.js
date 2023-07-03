import libVal from '../../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionPointValuationStatus(context) {
    if (context.binding.hasOwnProperty('InspValuation_Nav') && !libVal.evalIsEmpty(context.binding.InspValuation_Nav)) {
        return context.binding.InspValuation_Nav.ShortText;
    }
    return '-';
}
