import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PlantMoveListPickerQueryOptions(context) {
    let type;
    
    if (!libVal.evalIsEmpty(context.binding)) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            return `$filter=Plant eq '${context.binding.MovePlant}'&$orderby=Plant`;
        }
    }

    return '$orderby=Plant';
}
