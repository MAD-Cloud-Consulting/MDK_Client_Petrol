import libNotif from '../Notifications/NotificationLibrary';
import notifCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';

export default function SubOperationNotificationCreateNav(context) {

    libNotif.setAddFromOperationFlag(context, true);
    
    let bindingObject = {
        HeaderEquipment: context.binding.OperationEquipment,
        HeaderFunctionLocation: context.binding.OperationFunctionLocation,
        ExternalWorkCenterId: context.binding.MainWorkCenter,
        MainWorkCenterPlant: context.binding.MainWorkCenterPlant,
    };

    // Return the result of the change set nav
    return notifCreateChangeSetNav(context, bindingObject);
}
