/**
* Create Link to Object Overall status by defining profile and status
* @param {IClientAPI} context
*/
import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

export default function MobileStatusNotificationOverallStatusConfig(context) {
    let notificationType = libCommon.getStateVariable(context, 'NotificationType');
    if (libVal.evalIsEmpty(notificationType) && !(libVal.evalIsEmpty(context.binding.NotificationType))) { // If notification is empty, get it from binding
        notificationType = context.binding.NotificationType;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], '$filter=(NotifType eq \'' + notificationType + '\')').then((types) => {
        if (types.getItem(0)) {
            let statusProfile = types.getItem(0).EAMOverallStatusProfile;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], '$filter=(EAMOverallStatusProfile eq \'' + statusProfile + '\')' + '&$orderby=SequenceNum asc').then((results) => {
                if (results.getItem(0)) {
                    return "EAMOverallStatusConfigs(Status='" + results.getItem(0).EAMOverallStatus + "'" + ',' +  "EAMOverallStatusProfile='" + statusProfile+ "')";
                }
                return '';
            }).catch((failure) => {
                Logger.error('Failed to read EAMOverallStatusConfigs with status profile ' + statusProfile + failure);
            });
        }
        return '';
    }).catch((failure) => {
        Logger.error('Failed to read Notification Type', failure);
    });
}
