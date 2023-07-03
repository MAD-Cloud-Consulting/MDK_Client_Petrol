export default function StopDetailsMapNavQueryOptions(context) {
    let routeID = context.binding.RouteID;
    let stopID = context.binding.StopID;
    return `$select=Description,StopID&$expand=Operation/OperationMobileStatus_Nav&$filter=RouteID eq '${routeID}' and StopID eq '${stopID}'`;
}
