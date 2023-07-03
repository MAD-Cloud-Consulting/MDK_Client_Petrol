import Logger from '../../Log/Logger';
import OperationsListViewWithResetFiltersNav from '../../WorkOrders/Operations/OperationsListViewWithResetFiltersNav';

export default function supervisorOperationsListView(context) {
    Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderOperationsListViewNav called');
    
    let actionBinding = {
        isSupervisorOperationsList: true,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    return OperationsListViewWithResetFiltersNav(context);
}


