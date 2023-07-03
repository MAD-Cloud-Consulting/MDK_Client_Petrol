import libCom from '../../Common/Library/CommonLibrary';

/**
* This function reset OPERATIONS_FILTER state variable before navigation to Operations List
* @param {IClientAPI} context
*/
export default function OperationsListViewWithResetFiltersNav(context) {
    libCom.setStateVariable(context, 'OPERATIONS_FILTER', '');
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action');
}
