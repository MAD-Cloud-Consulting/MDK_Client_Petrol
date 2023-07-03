import libCom from '../../Common/Library/CommonLibrary';

export default function OperationsListViewNav(context) {
    libCom.setStateVariable(context,'FromSubOperationsList', true);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationsListViewNav.action');
}
