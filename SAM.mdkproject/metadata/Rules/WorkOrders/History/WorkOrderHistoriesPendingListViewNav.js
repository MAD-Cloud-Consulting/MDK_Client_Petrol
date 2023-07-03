
export default function WorkOrderHistoriesPendingListViewNav(context) {
    context.getPageProxy().getClientData().ReferenceType = 'P';
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderHistoriesListViewNav.action');
}
