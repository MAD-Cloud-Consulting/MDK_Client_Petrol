import notification from '../NotificationLibrary';
import common from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function NotificationActivityCodeQuery(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        let binding = context.getPageProxy().binding;
        let codeGroup = context.getPageProxy().binding.ActivityCodeGroup;
        context.setEditable(!!codeGroup);

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem' || binding['@odata.type'] === '#sap_mobile.MyNotificationActivity') {
                binding = binding.Notification;
            } else if (binding['@odata.type'] === '#sap_mobile.MyNotificationItemActivity') {
                binding = binding.Item.Notification;
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                binding.NotificationType = 'QM';
            } else {
                binding = common.getStateVariable(context, 'CreateNotification');
            }
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${binding.NotificationType}')`, [], '').then(notifType => {
            if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
                return `$filter=CodeGroup eq '${codeGroup}' and Catalog eq '${notifType.getItem(0).CatTypeActivities}'&$orderby=Code,CodeGroup,Catalog`;
            } else { // PM Notification
                return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeActivities', 'ActivityCodeGroup');
            }

        });
    } else {
        return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeActivities', 'ActivityCodeGroup');
    }

}
