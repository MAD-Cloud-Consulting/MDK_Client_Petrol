import libNotifMobile from '../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import Logger from '../Log/Logger';

export default function MapNotificationStatus(context) {
    try {
        return libNotifMobile.getHeaderMobileStatus(context).then(result =>{
            return context.localizeText(result);
        });
    } catch (e) {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), e);
        return '';
    }
}
