import libCommon from '../Library/CommonLibrary';
import libNotif from '../../Notifications/NotificationLibrary';

export default function ChangesetSwitchReadLink(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' && !libNotif.getAddFromMapFlag(context)) {
        return context.binding['@odata.readLink'];
    } else if (libCommon.isOnChangeset(context))	{
        return 'pending_1';
    } else if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        //We’ve started to record a new EAM Checklist defect by creating a new notification.
        //New notification object should be in state variable. 
         let notifObj = libCommon.getStateVariable(context, 'CreateNotification');
         if (libCommon.isDefined(notifObj['@odata.readLink'])) {
                return notifObj['@odata.readLink'];
         }
    }

    return '';
}
