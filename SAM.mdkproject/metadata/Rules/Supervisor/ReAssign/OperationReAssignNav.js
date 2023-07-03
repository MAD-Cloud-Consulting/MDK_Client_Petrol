export default function OperationReAssignNav(context) {
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsReAssign=true;
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsAssign=false;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
