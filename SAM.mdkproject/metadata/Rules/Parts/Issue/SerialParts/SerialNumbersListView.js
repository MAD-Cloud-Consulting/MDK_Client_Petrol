import issuedSerialNumberQuery from './SerialNumbersIssuedQuery';


/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SerialNumbersListView(context) {

    return issuedSerialNumberQuery(context).then((serialNumsArray) => {
        let binding = context.binding;
        if (serialNumsArray && serialNumsArray.length > 0) {
            binding.SerialNumsArray = serialNumsArray;
        } else {
            binding.SerialNumsArray = [];
        }
        context.getPageProxy().setActionBinding(binding);
        return context.executeAction('/SAPAssetManager/Actions/Parts/SerialPartsListViewNav.action');  
    });
}
