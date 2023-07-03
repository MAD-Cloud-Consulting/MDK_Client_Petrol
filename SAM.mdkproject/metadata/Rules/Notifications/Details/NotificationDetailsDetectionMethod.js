import libNotif from '../NotificationLibrary';

export default function NotificationDetailsDetectionMethod(pageClientAPI) {
 
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libNotif.notificationDetailsFieldFormat(pageClientAPI, 'DetectionMethod');
}
