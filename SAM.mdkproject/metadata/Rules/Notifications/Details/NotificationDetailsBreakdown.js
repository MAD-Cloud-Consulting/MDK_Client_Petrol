import libNotif from '../NotificationLibrary';

export default function NotificationDetailsBreakdown(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libNotif.notificationDetailsFieldFormat(pageClientAPI, 'Breakdown');

}
