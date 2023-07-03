export default function RouteDetailsMapNavQueryOptions(context) {
    let routeID = context.binding.RouteID;
    return `$select=RouteID,Description,WorkOrder/DueDate,WorkOrder/OrderMobileStatus_Nav/MobileStatus&$expand=Stops,WorkOrder/OrderMobileStatus_Nav&$filter=RouteID eq '${routeID}'`;
}
