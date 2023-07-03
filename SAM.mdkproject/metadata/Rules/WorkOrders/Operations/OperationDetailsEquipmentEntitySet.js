import libCommon from '../../Common/Library/CommonLibrary';
export default function OperationDetailsEquipmentEntitySets(context) {
    // Based on some backend config a notification sometimes is auto-created when creating a work order. 
    //Typically it is linked to WO header only, but with Objects List Assignment setting being 3, the notification is also linked to the first operation.
    //For that reason we need to check the Notification associated with the operation first.
    if (libCommon.isDefined(context.binding.NotifNum)) {
        return `MyNotificationHeaders('${context.binding.NotifNum}')/Equipment`;
    } else {
        return context.binding['@odata.readLink'] + '/EquipmentOperation';
    }
}
