
export default function WorkOrderHistoriesRecentListViewNav(context) {
    context.getPageProxy().getClientData().ReferenceType = 'H';
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderHistoriesListViewNav.action');
}
