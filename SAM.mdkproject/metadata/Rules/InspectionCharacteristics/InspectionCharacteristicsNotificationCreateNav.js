
import common from '../../Rules/Common/Library/CommonLibrary';
import NotificationTypeLstPkrDefault from '../Notifications/NotificationTypePkrDefault';
import QMNotificationDefectType from '../Notifications/QMNotificationDefectType';

export default function InspectionCharacteristicsNotificationCreateNav(context) {
    common.setOnCreateUpdateFlag(context, 'CREATE');
    let notifTypePromise = context.binding.EAMChecklist_Nav ? NotificationTypeLstPkrDefault(context) : QMNotificationDefectType(context);
    return notifTypePromise.then(type => {
        // Add HeaderFunctionLocation and HeaderEquipment to new binding
        // Forces Notification Create page to default pickers
        let newBinding = context.binding;
        newBinding.HeaderFunctionLocation = context.binding.InspectionLot_Nav.FunctionalLocation;
        newBinding.HeaderEquipment = context.binding.InspectionLot_Nav.Equipment;
        newBinding.NotificationType = type;
        context.getPageProxy().setActionBinding(newBinding);
        if (context.binding.EAMChecklist_Nav) {
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsNotificationCreateNav.action');
        } else {
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/QMDefectCreateNav.action');
        }
    });
}
