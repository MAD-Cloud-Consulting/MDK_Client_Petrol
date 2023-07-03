import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrdersListViewNav(context) {
    libCom.setStateVariable(context, 'WorkOrderListFilter', 'ALL_JOBS');
    libCom.setStateVariable(context, 'WORKORDER_FILTER', '$filter=');
    libCom.setStateVariable(context,'FromOperationsList', false);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
}
