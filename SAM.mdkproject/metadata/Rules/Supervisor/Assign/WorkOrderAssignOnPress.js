import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderAssignOnPress(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            return context.executeAction('/SAPAssetManager/Rules/Supervisor/UnAssign/WorkOrderUnAssignChangeSet.js');
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPageRequiredFields.action');
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            return context.executeAction('/SAPAssetManager/Actions/Supervisor/ReAssign/WorkOrderReAssignPageRequiredFields.action');
        }
    } catch (error) {
        return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignPageRequiredFields.action');
    }
}
