import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import unassignOperation from '../UnAssign/OperationUnAssignChangeSet';

export default function OperationAssignOnPress(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            return unassignOperation(context).then(() => {
                return rebindObject(context).then(() => {
                    libAutoSync.autoSyncOnStatusChange(context);
                });
            });
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignPageRequiredFields.action').then(() => {
                return rebindObject(context).then(() => {
                    libAutoSync.autoSyncOnStatusChange(context);
                });
            });
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/ReAssign/OperationReAssignPageRequiredFields.action').then(() => {
                return rebindObject(context).then(() => {
                    libAutoSync.autoSyncOnStatusChange(context);
                });
            });
        }
    } catch (error) {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignPageRequiredFields.action');
    }
}

//Reload and rebind the operation details screen to refresh the assignee on screen
function rebindObject(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Employee_Nav', [], '').then(function(results) {        
        let page = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage');
        if (page) {
            if (results && results.length > 0) {
                page.getControl('SectionedTable')._context.binding.Employee_Nav = results.getItem(0);
            } else {
                delete page.getControl('SectionedTable')._context.binding.Employee_Nav; //Unassigned
            }
            page.getControl('SectionedTable').redraw();
            return Promise.resolve();
        }
        return Promise.resolve();
    });
}
