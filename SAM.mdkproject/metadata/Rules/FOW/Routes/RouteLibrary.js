export default class {

    /**
     * Gets the query options for routes list view. At the moment, only display Routes with Description that contains the word 'Route'
     */
    static getRoutesListViewQueryOptions() {
        return '$select=RouteID,Description,WorkOrder/DueDate,WorkOrder/OrderMobileStatus_Nav/MobileStatus&'
        + '$expand=Stops,WorkOrder/OrderMobileStatus_Nav&'
        + '$orderby=WorkOrder/DueDate desc';
    }

    /**
     * Gets the query options for navigation to route details.
     */
    static getRouteDetailsNavQueryOption() {
        return '$select=RouteID,Description';
    }

    static getEquipmentListQueryOptions() {
        return '$select=Equipment,FuncLocID,EquipDesc&'
        + '$orderby=Equipment asc&' + "$filter=Equipment ne ''";
    }

    static getFuncLocListQueryOptions() {
        return '$select=FuncLocID,FuncLocDesc&'
        + '$orderby=FuncLocID asc&' + "$filter=Equipment eq ''";
    }

    static getStopsListViewQueryOptions() {
        return '$select=Description,StopID&$expand=Operation/OperationMobileStatus_Nav&$orderby=StopID asc';
    }
}
