import libCommon from '../../../Common/Library/CommonLibrary';

export default function IsWONotificationVisible(context, woBinding, expandPath) {
    if (woBinding && woBinding.NotificationNumber) {
        let readLink = woBinding['@odata.readLink'];
        return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=' + expandPath + '/NotifMobileStatus_Nav').then(results => {
            if (results && results.length > 0) {
                let notif = results.getItem(0).Notification;
                let complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                if (notif && notif.NotifMobileStatus_Nav && notif.NotifMobileStatus_Nav.MobileStatus !== complete) {  // Notification is not already complete
                    return Promise.resolve(notif);
                }
            }
            return Promise.resolve(false);
        });
    }

    return Promise.resolve(false);
}
