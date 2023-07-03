import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';

/**
* Returns true if the confirmation indicator is not 3 (operation level only)
* @param {IClientAPI} context
*/
export default function IsTimeStepVisible(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    
    if (binding && binding.ControlKey
        && (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' 
        || binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation' )) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'ControlKeys', ['ConfirmationIndicator'], "$filter=ControlKey eq '" + binding.ControlKey + "'").then(function(result) {
            if (result.getItem(0) && result.getItem(0).ConfirmationIndicator === '3') {
                return false;
            }
            return true;
        });
    }

    return Promise.resolve(true);
}

