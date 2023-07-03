import libNotif from '../../NotificationLibrary';

export default function NotificationTaskCreateUpdateValidation(pageClientAPI) {

    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Check field data against business logic here
    //Return true if validation succeeded, or False if failed
    return libNotif.NotificationTaskCreateUpdateValidationRule(pageClientAPI).then(result => {
        return result;
    });
}
