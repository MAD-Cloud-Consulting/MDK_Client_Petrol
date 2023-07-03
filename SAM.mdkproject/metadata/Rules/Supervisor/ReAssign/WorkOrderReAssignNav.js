export default function WorkOrderReAssignNav(context) {
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsReAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
