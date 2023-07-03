import Logger from '../Log/Logger';
export default function PushNotificationUserIdReadLink(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(function(userInfo) {
        return 'UserGeneralInfos'+ '(\'' + userInfo.getItem(0).UserGuid +'\')';
    }).catch((error) => {
        return Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue() , error);
    });    
}
