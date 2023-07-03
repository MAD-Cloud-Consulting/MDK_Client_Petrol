import Logger from '../../Log/Logger';

export default function supervisorWorkOrdersListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrdersListViewNav called');
    
    let actionBinding = {
        isSupervisorWorkOrdersList: true,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
}

  
