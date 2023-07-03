import notification from '../../NotificationLibrary';

export default function NotificationActivityDetailsGroup(context) {
    var code = context.binding.ActivityCode;
    var codeGroup = context.binding.ActivityCodeGroup;
    var binding = context.binding.Notification;

    if (!binding) {
        binding = context.binding.Item.Notification;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${binding.NotificationType}')`, [], '').then(notifType => {
        if (notifType.getItem(0).NotifCategory === '02') { // QM Notification
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${notifType.getItem(0).CatTypeActivities}',CodeGroup='${codeGroup}', Code='${code}')`, [], '').then(result => {
                if (result.length > 0) {
                    return result.getItem(0).CodeGroupDesc;
                } else {
                    return '-';
                }
            });
        } else { // PM Notification
            return notification.NotificationCodeGroupStr(context, 'CatTypeActivities', codeGroup);
        }
    });
}
