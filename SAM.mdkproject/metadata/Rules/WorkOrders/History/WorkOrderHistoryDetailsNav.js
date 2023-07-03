import Logger from '../../Log/Logger';

export default function WorkOrderHistoryDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();

    //Rebind the necessary history record data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionContext['@odata.readLink'], [], '$expand=HistoryPriority').then(Result => {
        pageProxy.setActionBinding(Result.getItem(0));
        return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderHistoryDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(), error);
    });
}
