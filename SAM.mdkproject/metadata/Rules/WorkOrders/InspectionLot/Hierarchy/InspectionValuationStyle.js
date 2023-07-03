import libVal from '../../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionValuationStyle(context) {
    if (!libVal.evalIsEmpty(context.binding.Valuation) && context.binding.Valuation === 'A') {
        return '#107E3E';
    } else if (!libVal.evalIsEmpty(context.binding.Valuation) && context.binding.Valuation === 'R') {
        return '#BB0000';
    }
    return '';
}
