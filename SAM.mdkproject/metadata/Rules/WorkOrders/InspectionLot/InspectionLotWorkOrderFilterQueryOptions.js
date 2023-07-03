export default function InspectionLotWorkOrderFilterQueryOptions(context) {
    var filter = '$orderby=OrderId&$filter=sap.entityexists(EAMChecklist_Nav)';
    if (context.binding && context.binding.OrderId) {
        filter += "&$filter=OrderId eq '" + context.binding.OrderId + "'";
    }
    return filter;
}

