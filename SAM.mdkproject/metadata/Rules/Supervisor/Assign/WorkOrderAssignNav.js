export default function WorkOrderAssignNav(context) {
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsUnAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
