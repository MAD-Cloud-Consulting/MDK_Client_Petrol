import common from './Common/Library/CommonLibrary';
import isSupervisorFeatureEnabled from './Supervisor/isSupervisorFeatureEnabled';
import EnableWorkOrderEdit from './UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import EnableNotificationEdit from './UserAuthorizations/Notifications/EnableNotificationEdit';
import userFeaturesLib from './UserFeatures/UserFeaturesLibrary';

export default function ContextMenuTrailingItems(context) {
    let trailing = [];

    let entityType = context.binding['@odata.type'];
    let isLocal = common.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    switch (entityType) {
        case '#sap_mobile.MyWorkOrderHeader':
            if (isSupervisorFeatureEnabled(context)) {//As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return trailing;
            }

            return EnableWorkOrderEdit(context).then( isEnabled => {
                if (isEnabled) {
                    trailing.push('Edit_WorkOrder');
                    if (isLocal) {
                        trailing.push('Delete_WorkOrder');
                    }
                }
                return trailing;
            });
        case '#sap_mobile.MyWorkOrderOperation':
            if (isSupervisorFeatureEnabled(context)) {//As per Kunal, for 2110.0.2 we will disable the context menu when the user is a supervisor. This will be revisited in 2205.
                return trailing;
            }
            if (isLocal) {
                trailing = ['Edit_Operation','Delete_Operation'];
            } else {
                trailing = ['Edit_Operation'];
            }
            break;
        case '#sap_mobile.MyWorkOrderSubOperation':
            if (isLocal) {
                trailing = ['Edit_SubOperation','Delete_SubOperation'];
            } else {
                trailing = ['Edit_SubOperation'];
            }
            break;
        case '#sap_mobile.MyNotificationHeader':
            if (EnableNotificationEdit(context)) {
                trailing.push('Edit_Notification');
                if (isLocal) {
                    trailing.push('Delete_Notification');
                }
            }
            return trailing;
        case '#sap_mobile.MyFunctionalLocation':
            if (context.binding.MeasuringPoints.length > 0 && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue())) 
                trailing = ['Take_Reading'];
            else
                trailing = [];
            break;
        case '#sap_mobile.MyEquipment':
            if (context.binding.MeasuringPoints.length > 0 && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue()))
                trailing = ['Take_Reading'];
            else
                trailing = [];
            break;
        case '#sap_mobile.CatsTimesheetOverviewRow':
                trailing = ['Delete_Timesheet'];
            break;
        case '#sap_mobile.Confirmation':
            if (isLocal) {
                trailing = ['Delete_Confirmation'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MyFuncLocDocument':
        case '#sap_mobile.MyNotifDocument':
        case '#sap_mobile.MyEquipDocument':
        case '#sap_mobile.MyWorkOrderDocument':
        case '#sap_mobile.Document':
            if (isLocal) {
                trailing = ['Delete_Document'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.MeasurementDocument':
            if (isLocal) {
                trailing = ['Delete_MeasurementDocument'];
            } else {
                trailing = [];
            }
            break;
        case '#sap_mobile.UserPreference':
            trailing = ['Delete_Entry'];
            break;
        case '#OfflineOData.ErrorArchiveEntity':
            trailing = ['Delete_Entry'];
            break;
        default:
            break;
    }
    return trailing;
}
