import libCom from './Library/CommonLibrary';
/**
* Function to display success message depending on the object created
*/
export default function CreateEntitySuccessMessage(context) {
    let objectCreatedName = libCom.getStateVariable(context, 'ObjectCreatedName');
    libCom.setStateVariable(context, 'ObjectCreatedName', '');

    switch (objectCreatedName) {
        case 'WorkOrder':
            return context.localizeText('object_successfully_created', [context.localizeText('workorder')]);
        case 'Notification':
            return context.localizeText('object_successfully_created', [context.localizeText('notification')]);
        case 'Signature':
            return context.localizeText('object_successfully_created', [context.localizeText('signature')]);
        case 'Item':
            return context.localizeText('object_successfully_created', [context.localizeText('item')]);
        case 'Reading':
            return context.localizeText('object_successfully_created', [context.localizeText('reading')]);
        case 'Document':
            return context.localizeText('object_successfully_created', [context.localizeText('document')]);
        case 'Confirmation':
            return context.localizeText('object_successfully_created', [context.localizeText('confirmation')]);
        case 'Partner':
            return context.localizeText('object_successfully_created', [context.localizeText('business_partner')]);
        case 'Reminder':
            return context.localizeText('object_successfully_created', [context.localizeText('reminder')]);
        case 'NotificationItem':
            return context.localizeText('object_successfully_created', [context.localizeText('notification_item')]);
        case 'Checklist':
            return context.localizeText('object_successfully_created', [context.localizeText('checklist')]);
        case 'Activity':
            return context.localizeText('object_successfully_created', [context.localizeText('notification_activity')]);
        case 'NotificationItemCause':
            return context.localizeText('object_successfully_created', [context.localizeText('notification_item_cause')]);
        case 'MeasurementPoint':
            return context.localizeText('object_successfully_created', [context.localizeText('point')]);
        case 'LinearData':
            return context.localizeText('object_successfully_created', [context.localizeText('linear_data')]);
        case 'Operation':
            return context.localizeText('object_successfully_created', [context.localizeText('operation')]);
        case 'NotificationTask':
            return context.localizeText('object_successfully_created', [context.localizeText('notification_task')]);
        case 'NotificationItemTask':
            return context.localizeText('object_successfully_created', [context.localizeText('notification_item_task')]);
        case 'SubOperation':
            return context.localizeText('object_successfully_created', [context.localizeText('suboperation')]);
        case 'Mileage':
            return context.localizeText('object_successfully_created', [context.localizeText('mileage')]);
        default:
            return context.localizeText('create_successful');
    }
}
