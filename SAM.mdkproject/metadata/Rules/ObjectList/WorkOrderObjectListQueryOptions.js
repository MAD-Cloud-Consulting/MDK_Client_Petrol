/**
 * Creates the query that is used by the ObjectListView.page to show the list of work order objects.
 * We are filtering out assembly objects because they are currently not supported on the client. They are supported by the backend AddOn pack only right now.
 */
export default function WorkOrderObjectListQueryOptions() {
    let orderby = '$orderby=ObjectListCounter';
    let expand = '$expand=Equipment_Nav,Equipment_Nav/FunctionalLocation,' +
        'FuncLoc_Nav,Material_Nav,WOOperation_Nav,' +
        'NotifHeader_Nav,NotifHeader_Nav/Equipment,NotifHeader_Nav/Equipment/FunctionalLocation,' +
        'NotifHeader_Nav/FunctionalLocation,NotifHeader_Nav/Equipment/SerialNumber,NotifHeader_Nav/Equipment/SerialNumber/Material';
    
    let queryOptions = expand + '&' + orderby;
    return queryOptions;
}
