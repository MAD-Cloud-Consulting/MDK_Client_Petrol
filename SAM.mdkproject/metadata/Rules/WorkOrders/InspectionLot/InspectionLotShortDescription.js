import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotShortDescription(context) {
    if (context.binding.hasOwnProperty('ShortDesc') && !libVal.evalIsEmpty(context.binding.ShortDesc)) {
        return context.binding.ShortDesc;
    }
    return '-';
}
