import checkForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Asking clarification from user to close page (don't save changes)
* Then, if we're adding multiple items to doc (not first one), we change 
* close page action to redirection to the item list page
* @param {IClientAPI} context
*/
export default function CloseIssueOrReceipt(context) {
    let result = checkForChangesBeforeClose(context);
    let document = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId;
    let created = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().IsAlreadyCreatedDoc;
    if (document) {
        return result.then(({ data }) => {
            if (data === false) {
                return false;
            }
            if (created) {
                context.getPageProxy().setActionBinding({});
            }
            libCom.removeStateVariable(context, 'MaterialPlantValue');
            libCom.removeStateVariable(context, 'MaterialSLocValue');
            libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentModalListNav.action');
        });
    } else {
        return result.then(({ data }) => {
            if (data === false) {
                return false;
            }
            libCom.removeStateVariable(context, 'MaterialPlantValue');
            libCom.removeStateVariable(context, 'MaterialSLocValue');
            libCom.removeStateVariable(context, 'BatchRequiredForFilterADHOC');
            return true;
        });
    }
}
