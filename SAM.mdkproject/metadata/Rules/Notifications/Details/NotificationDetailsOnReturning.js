import NotificationEnableMobileStatus from '../MobileStatus/NotificationEnableMobileStatus';
import libCom from '../../Common/Library/CommonLibrary';

//Set the enabled status of the toolbar
export default function NotificationDetailsOnReturning(context) {
    return  NotificationEnableMobileStatus(context).then(enable => {
        if (enable) {
            libCom.enableToolBar(context, 'NotificationDetailsPage', 'EndNotificationTbI', true);
        }
    });
}
