import libNotif from '../NotificationLibrary';

export default function NotificationDetailsMalfunctionEndDate(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libNotif.notificationDetailsFieldFormat(pageClientAPI, 'MalfunctionEndDate');

}
