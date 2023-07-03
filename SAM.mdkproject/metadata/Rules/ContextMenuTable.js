import libComm from './Common/Library/CommonLibrary';
import { getWorkOrderMenuItems }  from './ContextMenuItems';
import { getOperationMenuItems }  from './ContextMenuItems';
import { getSubOperationMenuItems }  from './ContextMenuItems';
import { getNotificationMenuItems }  from './ContextMenuItems';
import { getFunctionalLocationMenuItems }  from './ContextMenuItems';
import { getEquipmentMenuItems }  from './ContextMenuItems';
import { getTimesheetsMenuItems }  from './ContextMenuItems';
import { getConfirmationsMenuItems }  from './ContextMenuItems';
import { getDocumentsMenuItems }  from './ContextMenuItems';
import { getMeasurementDocumentsMenuItems }  from './ContextMenuItems';
import { getRemindersMenuItems }  from './ContextMenuItems';
import { getErrorArchiveMenuItems }  from './ContextMenuItems';

/**
 * Gets the control field table for the given entity ```type``` given the assignment type
 * @param {String} type one of 'WorkOrder', 'Notification', 'FunctionalLocation', or 'Asset'
 */
export default function ContextMenuTable(context) {
    let fieldparams = [];
    let entity = libComm.getEntitySetName(context);
    switch (entity) {
        case 'MyWorkOrderHeaders':
            fieldparams = getWorkOrderMenuItems();
            break;
        case 'MyWorkOrderOperations':
            fieldparams = getOperationMenuItems();
            break;
        case 'MyWorkOrderSubOperations':
            fieldparams = getSubOperationMenuItems();
            break;
        case 'MyNotificationHeaders':
            fieldparams = getNotificationMenuItems();
            break;
        case 'MyFunctionalLocations':
            fieldparams = getFunctionalLocationMenuItems();
            break;
        case 'MyEquipments':
            fieldparams = getEquipmentMenuItems();
            break;
        case 'CatsTimesheetOverviewRows':
            fieldparams = getTimesheetsMenuItems();
            break;
        case 'Confirmations':
            fieldparams = getConfirmationsMenuItems();
            break;
        case 'MyFuncLocDocuments':
        case 'MyNotifDocuments':
        case 'MyEquipDocuments':
        case 'MyWorkOrderDocuments':
            fieldparams = getDocumentsMenuItems();
            break;
        case 'Documents':
            fieldparams = getDocumentsMenuItems();
            break;
        case 'MeasurementDocuments':
            fieldparams = getMeasurementDocumentsMenuItems();
            break;
        case 'UserPreferences':
            fieldparams = getRemindersMenuItems();
            break;
        case 'ErrorArchive':
            fieldparams = getErrorArchiveMenuItems();
            break;
        default:
            break;
    }

    return fieldparams;
}
