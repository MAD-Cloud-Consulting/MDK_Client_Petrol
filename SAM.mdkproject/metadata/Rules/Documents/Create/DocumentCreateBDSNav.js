import libDocument from '../DocumentLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libNotifStatus from '../../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import libOpStatus from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libSubOpStatus from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
export default function DocumentCreateBDSNav(context) {

    switch (libDocument.getParentObjectType(context)) {
        case libDocument.ParentObjectType.WorkOrder:
            return libWOStatus.isOrderComplete(context).then(status => {
                if (!status) {
                    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDSNav.action');
                }
                return '';
            });
        case libDocument.ParentObjectType.Notification:
            return libNotifStatus.isNotificationComplete(context).then(status => {
                if (!status) {
                    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDSNav.action');
                }
                // Need to send this because linter expected to return a value at the end of arrow function
                return ''; 
            });
        case libDocument.ParentObjectType.Operation:
            return libOpStatus.isOperationComplete(context).then(isCompleted => {
                if (!isCompleted) {
                    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDSNav.action');
                }
                return ''; 
                // Need to send this because linter expected to return a value at the end of arrow function
            });
        case libDocument.ParentObjectType.SubOperation:
            return libSubOpStatus.isSubOperationComplete(context).then(isCompleted => {
                if (!isCompleted) {
                    return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDSNav.action');
                }
                return ''; 
                // Need to send this because linter expected to return a value at the end of arrow function
            });    
        case libDocument.ParentObjectType.Equipment:
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDSNav.action');
        case libDocument.ParentObjectType.FunctionalLocation:
            return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateBDSNav.action');
        default:
            break;
    }
}
