import deleteMessage from '../../Common/DeleteEntityOnSuccess';

export default function CheckRelatedNotifications(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationHistories', [], `$filter=sap.islocal() and NotificationNumber eq '${context.binding.NotificationNumber}' and ReferenceType eq 'P'`).then(function(result) {
        if (result && result.length > 0) {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationDiscard.action');
        } else {
            return deleteMessage(context);
        }
    });
}
