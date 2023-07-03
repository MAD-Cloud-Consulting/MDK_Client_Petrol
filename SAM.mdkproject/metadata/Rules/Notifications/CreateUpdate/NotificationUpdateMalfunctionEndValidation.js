import libNotif from '../NotificationLibrary';

export default function NotificationUpdateMalfunctionEndValidation(context) {

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libNotif.NotificationUpdateMalfunctionEndValidation(context).then(result => {
        return result;
    });
}
