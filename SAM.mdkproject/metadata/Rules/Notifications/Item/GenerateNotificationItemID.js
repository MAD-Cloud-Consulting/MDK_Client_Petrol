import libCommon from '../../Common/Library/CommonLibrary';
import libNotif from '../NotificationLibrary';
import GenerateLocalID from '../../Common/GenerateLocalID';

export default function GenerateNotificationItemID(context) {
    // If adding from a Job, our context will not be right
    if (context.getClientData().notificationExists) {
        let readLink = `MyNotificationHeaders('${context.binding.LocalNotificationID}')/Items`;
        return GenerateLocalID(context, readLink, 'ItemNumber', '0000', '', '').then(result => {
            libCommon.setStateVariable(context, 'lastLocalItemNumber', result);
            return result;
        }).catch(() => {
            return '';
        });
    }

    if (context.binding && !(libNotif.getAddFromJobFlag(context) || libNotif.getAddFromOperationFlag(context) || libNotif.getAddFromSuboperationFlag(context) || libNotif.getAddFromMapFlag(context))) {
        if (context.binding.ItemNumber) {
            libCommon.setStateVariable(context, 'lastLocalItemNumber', context.binding.ItemNumber);
            return context.binding.ItemNumber;
        } else if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationHeader' && libCommon.isDefined(context.binding['@odata.readLink'])) {
            // There is a notification in the context with a readlink
            return GenerateLocalID(context, context.binding['@odata.readLink'] + '/Items', 'ItemNumber', '0000', '', '').then(function(result) {
                libCommon.setStateVariable(context, 'lastLocalItemNumber', result);
                return result;
            });
        }
    }
    if (libCommon.isOnChangeset(context)) {
        libCommon.setStateVariable(context, 'lastLocalItemNumber', '0001');
        return '0001';
    }

    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        /**
         * We’ve started to record a new EAM Checklist defect by creating a new notification.
         * User has elected to create a new item for that notification by entering an item desc.
         * New notification object should be in state variable. 
         */
         let notifObj = libCommon.getStateVariable(context, 'CreateNotification');
         if (libCommon.isDefined(notifObj['@odata.readLink'])) {
            return GenerateLocalID(context, notifObj['@odata.readLink'] + '/Items', 'ItemNumber', '0000', '', '').then(function(result) {
                libCommon.setStateVariable(context, 'lastLocalItemNumber', result);
                return result;
            });
         }
    }

    return '';
}
