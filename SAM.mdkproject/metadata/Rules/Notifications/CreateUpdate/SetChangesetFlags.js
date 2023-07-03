import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import Logger from '../../Log/Logger';
import GenerateNotificationID from '../../Notifications/GenerateNotificationID';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

function notificationCreateOrItemAdd(context, notificationResults) {
    context.getClientData().notificationExists = false;
    if (notificationResults && notificationResults.length > 0) { //Notification exists. Just add new item.
        context.getClientData().notificationExists = true;
        //Set LocalNotificationID to the ID of the existing notification. This is needed for QMNotificationItemCreate.action.
        let actionBinding = context.binding;
        actionBinding.LocalNotificationID = notificationResults.getItem(0).NotificationNumber;
        context.setActionBinding(actionBinding);
        return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/QMNotificationItemCreate.action').then(() => {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Notifications/CreateUpdate/QMNotificationSuccess.action');
        });
    } else { //Create new notification with new item
        //Set LocalNotificationID to the generated local notification ID. This is needed for NotificationQMCreateChangeSet.action.
        return GenerateNotificationID(context).then(newNotificationID => {
            let actionBinding = context.binding;
            actionBinding.LocalNotificationID = newNotificationID;
            context.setActionBinding(actionBinding);
            common.setOnChangesetFlag(context, true);
            return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationQMCreateChangeSet.action');
        });
    }
}

export default function SetChangesetFlags(context) {
    let planningPlant = context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant;
    let orderType = context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType;

    if (!libVal.evalIsEmpty(orderType) && !libVal.evalIsEmpty(planningPlant)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [],
        `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then(orderTypeResults => {
            if (orderTypeResults.getItem(0).OneQNotifPerLotFlag === 'X') {
                 //Search for existing notification by inspection lot.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [],
                `$filter=Items/any(itm: itm/InspectionChar_Nav/InspectionLot eq '${context.binding.InspectionLot}')`).then(result => {
                    notificationCreateOrItemAdd(context, result);
                });
            } else {
                //Search for existing notification by inspection point.
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [],
                `$filter=Items/any(itm: itm/InspectionPoint_Nav/InspectionLot eq '${context.binding.InspectionLot}'
                and itm/InspectionPoint_Nav/InspectionNode eq '${context.binding.InspectionNode}' and itm/InspectionPoint_Nav/SampleNum eq '${context.binding.SampleNum}')`).then(result => {
                    notificationCreateOrItemAdd(context, result);
                });
            }
        }).catch((error) => {
            Logger.error('QM', `SetChangesetFlags(context): ${error}`);
        });
    }
    Logger.error('QM', 'Planning plant and order type cannot be undefined or empty.');
}
