export default function OperationAssignNav(context) {
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
