import NotificationItemCauseUpdateNav from '../Notifications/Item/Cause/NotificationItemCauseUpdateNav';
import WorkOrderUpdateNav from '../WorkOrders/WorkOrderUpdateNav';
import WorkOrderOperationUpdateNav from '../WorkOrders/Operations/WorkOrderOperationUpdateNav';
import NotificationUpdateNav from '../Notifications/NotificationUpdateNav';
import NotificationItemUpdateNav from '../Notifications/Item/NotificationItemUpdateNav';
import NotificationTaskUpdateNav from '../Notifications/Task/NotificationTaskUpdateNav';
import NotificationActivityUpdateNav from '../Notifications/Activity/CreateUpdate/NotificationActivityUpdateNav';
import NotificationItemTaskUpdateNav from '../Notifications/Item/Task/NotificationItemTaskUpdateNav';
import NotificationItemActivityUpdateNav from '../Notifications/Item/Activity/NotificationItemActivityUpdateNav';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../Notes/NoteLibrary';
import SubOperationUpdateNav from '../SubOperations/SubOperationUpdateNav';
import MeasurementDocumentUpdateNav from '../Measurements/Document/MeasurementDocumentUpdateNav';
import Logger from '../Log/Logger';
import MaterialDocumentUpdateNav from '../Inventory/MaterialDocument/MaterialDocumentUpdateNav';
import MaterialDocumentItemUpdateNav from '../Inventory/MaterialDocument/MaterialDocumentItemUpdateNav';
import ConfirmationUpdateNav from '../Confirmations/CreateUpdate/ConfirmationUpdateNav';
import PRTEquipmentUpdateNav from '../WorkOrders/Operations/PRT/PRTEquipmentUpdateNav';
import EquipmentUpdateNav from '../Equipment/EquipmentUpdateNav';
import libValid from '../Common/Library/ValidationLibrary';
import MeterCreateUpdateNavFromDevices from '../Meter/CreateUpdate/MeterCreateUpdateNavFromDevices';
import MeterCreateUpdateNav from '../Meter/CreateUpdate/MeterCreateUpdateNav';
import MeterDisconnectNav from '../Meter/DisconnectReconnect/MeterDisconnectNav';
import ActivityUpdateNav from '../Meter/DisconnectReconnect/ActivityUpdateNav';
import MeterReadingMultipleNav from '../Meter/Reading/MeterReadingMultipleNav';
import libCom from '../Common/Library/CommonLibrary';
import InboundDeliveryUpdateNav from '../Inventory/InboundDelivery/InboundDeliveryUpdateNav';
import InboundDeliveryItemUpdateNav from '../Inventory/InboundDelivery/InboundDeliveryItemUpdateNav';
import OutboundDeliveryUpdateNav from '../Inventory/OutboundDelivery/OutboundDeliveryUpdateNav';
import OutboundDeliveryItemUpdateNav from '../Inventory/OutboundDelivery/OutboundDeliveryItemUpdateNav';
import InboundDeliveryItemSerialUpdateNav from '../Inventory/InboundDelivery/InboundDeliveryItemSerialUpdateNav';
import OutboundDeliveryItemSerialUpdateNav from '../Inventory/OutboundDelivery/OutboundDeliveryItemSerialUpdateNav';
import FunctionalLocationUpdateNav from '../FunctionalLocation/CreateUpdate/FunctionalLocationOpenEditPage';
import InspectionLotSetUsageNav from '../WorkOrders/InspectionLot/SetUsage/InspectionLotSetUsageNav';
import OnlyExpenseEditNav from '../Expense/OnlyExpenseEditNav';
import MileageEditNav from '../ServiceOrders/Mileage/MileageEditNav';

let ErrorMap = {
    Devices: {
        Action: MeterCreateUpdateNavFromDevices,
    },
    OrderISULinks: {
        Action: MeterCreateUpdateNav,
    },
    DisconnectionObjects: {
        Action: MeterDisconnectNav,
    },
    DisconnectionActivities: {
        Action: ActivityUpdateNav,
    },
    MeterReadings: {
        Action: MeterReadingMultipleNav,
    },
    MyWorkOrderHeaders: {
        Action: WorkOrderUpdateNav,
    },
    MyWorkOrderComponents: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateUpdateNav.action');
        },
    },
    MyWorkOrderOperations: {
        Action: WorkOrderOperationUpdateNav,
    },
    MyWorkOrderSubOperations: {
        Action: SubOperationUpdateNav,
    },
    MyNotificationHeaders: {
        Action: NotificationUpdateNav,
    },
    MyNotificationItems: {
        Action: NotificationItemUpdateNav,
    },
    MyNotificationTasks: {
        Action: NotificationTaskUpdateNav,
    },
    MyNotificationActivities: {
        Action: NotificationActivityUpdateNav,
    },
    MyNotificationItemCauses: {
        Action: NotificationItemCauseUpdateNav,
    },
    MyNotificationItemTasks: {
        Action: NotificationItemTaskUpdateNav,
    },
    MyNotificationItemActivities: {
        Action: NotificationItemActivityUpdateNav,
    },
    MyWorkOrderHeaderLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderOperationLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderSubOpLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyWorkOrderComponentLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.part());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifHeaderLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notification());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItem());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifTaskLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationTask());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifActivityLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationActivity());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemCauseLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemCause());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemTaskLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemTask());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MyNotifItemActivityLongTexts: {
        Action: (context) => {
            NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.notificationItemActivity());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        },
    },
    MeasurementDocuments: {
        Action: MeasurementDocumentUpdateNav,
    },
    WorkOrderTransfers: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action');
        },
    },
    MaterialDocuments: {
        Action: MaterialDocumentUpdateNav,
    },
    RelatedItem: {
        Action: MaterialDocumentItemUpdateNav,
    },
    UserPreferences: {
        Action: function() {},
    },
    CatsTimesheets: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryEditNav.action');
        },
    },
    CatsTimesheetTexts: {
        Action: function() {},
    },
    Confirmations: {
        Action: (context) => {
            const mileageActivityType = libCom.getMileageActivityType(context);
            const expenseActivityType = libCom.getExpenseActivityType(context);
            if (context.getBindingObject() && expenseActivityType && 
                context.getBindingObject().ActivityType === expenseActivityType) {
                    return OnlyExpenseEditNav(context);
            }
            if (context.getBindingObject() && mileageActivityType &&
                context.getBindingObject().ActivityType === mileageActivityType) {
                    context.getPageProxy().setActionBinding(context.binding);
                    return MileageEditNav(context);
            }
            return ConfirmationUpdateNav(context);
        },
    },
    MyWorkOrderTools: {
        Action: PRTEquipmentUpdateNav,
    },
    MyEquipments: {
        Action: EquipmentUpdateNav,
    },
    LAMObjectData: {
        Action: (context) => {
            libCom.setStateVariable(context, 'TransactionType', 'UPDATE');
            return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
        },
    },
    InboundDeliveries: {
        Action: InboundDeliveryUpdateNav,
    },
    OutboundDeliveries: {
        Action: OutboundDeliveryUpdateNav,
    },
    InboundDeliveryItems: {
        Action: InboundDeliveryItemUpdateNav,
    },
    OutboundDeliveryItems: {
        Action: OutboundDeliveryItemUpdateNav,
    },
    InboundDeliverySerials: {
        Action: InboundDeliveryItemSerialUpdateNav,
    },
    OutboundDeliverySerials: {
        Action: OutboundDeliveryItemSerialUpdateNav,
    },
    MyFunctionalLocations: {
        Action: FunctionalLocationUpdateNav,
    },
    InspectionCharacteristics: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsUpdateNav.action');
        },
    },
    InspectionPoints: {
        Action: (context) => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointsUpdateNav.action');
        },
    },
    InspectionLots: {
        Action: InspectionLotSetUsageNav,
    },
};

export default function ErrorArchiveAffectedEntityNav(context) {
    let errorObject = context.binding.ErrorObject;
    context.getClientData().FromErrorArchive = true;
    context.getClientData().ErrorObject = errorObject;

    let entity = getTargetEntity(errorObject.RequestURL);
    if (ErrorMap[entity]) {
        return ErrorMap[entity].Action(context);
    } else if (ErrorMap[entity.substring(0, entity.indexOf('('))]) {
        return ErrorMap[entity.substring(0, entity.indexOf('('))].Action(context);
    } else {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryErrorArchive.global').getValue(),'ErrorArchiveAffectedEntityNav: Unknown entity');
        return context.executeAction('/SAPAssetManager/Actions/ErrorArchive/ErrorArchiveUnkownEntity.action');
    }
}

/**
 * return the target entity from the url
 * @param {*} requestURL the request url, for example "MyWorkOrderHeaders('4002672')/Confirmations"
 */
function getTargetEntity(requestURL) {
    let entityNames = requestURL.split('/');
    let entity = '';
    for (let i=entityNames.length-1; i>=0; i--) {
        if (!libValid.evalIsEmpty(entityNames[i])) {
            entity = entityNames[i];
            break;
        }
    }

    return entity;
}

export function getErrorArchiveMap() {
    return ErrorMap;
}
