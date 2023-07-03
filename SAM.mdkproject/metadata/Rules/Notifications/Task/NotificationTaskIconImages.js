import libCommon from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import Logger from '../../Log/Logger';
import isAndroid from '../../Common/IsAndroid';

export default function NotificationTaskIconImages(context) {
    var iconImage = [];

    // check if this Notification Task has been locally created
    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    // Check mobile status
    return libMobile.mobileStatus(context, context.binding).then(result => {
        if (result === 'COMPLETED' || result === 'SUCCESS') {
            iconImage.push('/SAPAssetManager/Images/stepCheckmarkIcon.png');
        }
        return iconImage;
    }).catch(err => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
    });
}
