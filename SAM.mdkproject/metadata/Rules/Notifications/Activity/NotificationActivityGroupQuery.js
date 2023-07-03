import notification from '../NotificationLibrary';
import common from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function NotificationActivityGroupQuery(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        let binding = context.getPageProxy().binding;

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem' || binding['@odata.type'] === '#sap_mobile.MyNotificationActivity') {
                binding = binding.Notification;
            } else if (binding['@odata.type'] === '#sap_mobile.MyNotificationItemActivity') {
                binding = binding.Item.Notification;
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                binding.NotificationType = 'QM';
                binding.MainWorkCenter = binding.InspectionLot_Nav.WOHeader_Nav.WorkCenterInternalId;
            } else {
                let createNotification = common.getStateVariable(context, 'CreateNotification');
                if (createNotification) {
                    binding = createNotification;
                }
            }
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${binding.NotificationType}')`, [], '').then(notifType => {
            if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], `$filter=WorkCenterId eq '${binding.MainWorkCenter}'`).then(workcenter => {
                    if (workcenter.length > 0 && workcenter.getItem(0).QNotifTypeFlag !== 'X') { // Read from Workcenter
                        return `$filter=CatalogProfile eq '${workcenter.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeActivities}'&$orderby=Catalog,CatalogProfile,CodeGroup`;
                    } else { // Read from Notification Type
                        return `$filter=CatalogProfile eq '${notifType.getItem(0).CatalogProfile}' and Catalog eq '${notifType.getItem(0).CatTypeActivities}'&$orderby=Catalog,CatalogProfile,CodeGroup`;
                    }
                });
            } else { // PM Notification
                return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeActivities');
            }

        });
    } else {
        return notification.NotificationTaskActivityGroupQuery(context, 'CatTypeActivities');
    }
}
