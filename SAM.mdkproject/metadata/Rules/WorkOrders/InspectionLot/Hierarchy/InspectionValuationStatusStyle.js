import libVal from '../../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionValuationStatusStyle(context) {
    if (!libVal.evalIsEmpty(context.binding.ValuationStatus) && context.binding.ValuationStatus === 'A') {
        return '#107E3E';
    } else if (!libVal.evalIsEmpty(context.binding.ValuationStatus) && context.binding.ValuationStatus === 'R') {
        return '#BB0000';
    }
    return '';
}
