import Logger from '../../Log/Logger';

export default function technicianWorkOrdersListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrdersListViewNav called');
    
    let actionBinding = {
        isTechnicianWorkOrdersList: true,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
}

  
