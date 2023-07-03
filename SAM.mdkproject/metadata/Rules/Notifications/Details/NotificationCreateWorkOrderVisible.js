import enabledWorkOrderCreate from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
export default function NotificationCreateWorkOrderVisible(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WorkOrder').then(result => {
        if (result && result.getItem(0)) {
            let notification = result.getItem(0);
            
            return (notification.OrderId || notification.WorkOrder) ? false : (enabledWorkOrderCreate(context));
        }
        return false;
    });
}
