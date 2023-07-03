export default function WorkOrderUnAssignNav(context) {
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsReAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsAssign=false;
    context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData().IsUnAssign=true;
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
