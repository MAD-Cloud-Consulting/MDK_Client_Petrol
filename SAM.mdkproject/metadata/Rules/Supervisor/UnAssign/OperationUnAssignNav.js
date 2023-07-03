export default function OperationUnAssignNav(context) {
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsUnAssign=true;
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderOperationDetailsPage').getClientData().IsAssign=false;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
