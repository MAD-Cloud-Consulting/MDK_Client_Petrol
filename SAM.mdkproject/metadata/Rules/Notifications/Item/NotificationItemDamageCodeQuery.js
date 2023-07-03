import notification from '../NotificationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import common from '../../Common/Library/CommonLibrary';

export default function NotificationItemDamageCodeQuery(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue())) {
        let binding = context.getPageProxy().binding;
        let codeGroup = context.getPageProxy().binding.CodeGroup;
        context.setEditable(!!codeGroup);

        let notifLookup = Promise.resolve(binding.NotificationType);

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
                binding = binding.Notification;
                notifLookup = Promise.resolve(binding.NotificationType);
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '').then(result => {
                    return result.getItem(0).QMNotifType;
                });
            } else {
                binding = common.getStateVariable(context, 'CreateNotification');
                notifLookup = Promise.resolve(binding.NotificationType);
            }
        }
        return notifLookup.then(type => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${type}')`, [], '').then(notifType => {
                let defect = (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || (binding.InspectionLot && Number(binding.InspectionLot) !== 0)); // Are we working with a Defect Notification or not?
                if (notifType.getItem(0).NotifCategory === '01' && !defect) { // PM Notification
                    return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeDefects', 'CodeGroup');
                } else if (notifType.getItem(0).NotifCategory === '02' || defect) { // QM/PM Notification, Defect
                    return `$filter=CodeGroup eq '${codeGroup}' and Catalog eq '${notifType.getItem(0).CatTypeDefects}'`;
                } else {
                    return '';
                }

            });
        });
    } else {
        return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeDefects', 'CodeGroup');
    }
}
