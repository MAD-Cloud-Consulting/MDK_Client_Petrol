import libVal from '../../Common/Library/ValidationLibrary';

export default function OperationAssignButtonCaption(context) {
    try {
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            return context.localizeText('unassign');
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            return context.localizeText('assign');
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            return context.localizeText('reassign');
        }
        return context.localizeText('assign');
    } catch (error) {
        return context.localizeText('assign');
    } 
}
