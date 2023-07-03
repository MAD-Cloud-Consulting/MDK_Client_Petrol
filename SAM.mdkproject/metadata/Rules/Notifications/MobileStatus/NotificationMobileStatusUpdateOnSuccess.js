import libNotifMobile from './NotificationMobileStatusLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import Logger from '../../Log/Logger';
import NotificationMobileStatusToolBarCaption from './NotificationMobileStatusToolBarCaption';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import NotificationEnableMobileStatus from './NotificationEnableMobileStatus';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function NotificationMobileStatusUpdateOnSuccess(context) {

    let mobileStatusUpdateActionResult = context.getActionResult('MobileStatusUpdate');

    if (mobileStatusUpdateActionResult) {
        let mobileStatusUpdateActionResultObject = JSON.parse(mobileStatusUpdateActionResult.data);

        const notificationDetailsPage = 'NotificationDetailsPage';
        const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        let pageContext = MobileStatusLibrary.getPageContext(context, notificationDetailsPage);

        if (mobileStatusUpdateActionResultObject.MobileStatus === COMPLETE) {
            //Only allow notification complete if all header and item level tasks are complete
            let tasksPromises = [];
            tasksPromises.push(libNotifMobile.isAllTasksComplete(context));
            tasksPromises.push(libNotifMobile.isAllItemTasksComplete(context));

            return Promise.all(tasksPromises).then(results => {
                if (results[0] && results[1]) {
                    return libNotifMobile.completeNotification(context).then(() => {
                        LocationUpdate(context);
                        return NotificationMobileStatusToolBarCaption(pageContext, mobileStatusUpdateActionResultObject.MobileStatus).then(caption => {
                            pageContext.setToolbarItemCaption('EndNotificationTbI', caption);
                            CommonLibrary.enableToolBar(context, notificationDetailsPage, 'EndNotificationTbI', false);
                            HideActionItems(pageContext.getPageProxy(), 2);
                            return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                                return AutoSyncLibrary.autoSyncOnStatusChange(context);
                            });
                        });
                    });
                } else {
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action').then(() => {
                        //Rollback mobile status update on any errors
                        return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
                    });
                }
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action').then(() => {
                    //Rollback mobile status update on any errors
                    return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
                });
            });
        } else {
            LocationUpdate(context);
            let toolbarPromises = [];
            toolbarPromises.push(NotificationMobileStatusToolBarCaption(pageContext, mobileStatusUpdateActionResultObject.MobileStatus));
            toolbarPromises.push(NotificationEnableMobileStatus(context));
            return Promise.all(toolbarPromises).then(results => {
                pageContext.setToolbarItemCaption('EndNotificationTbI', results[0]);
                CommonLibrary.enableToolBar(context, notificationDetailsPage, 'EndNotificationTbI', results[1]);
                return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                    return AutoSyncLibrary.autoSyncOnStatusChange(context);
                });
            });
        }
    }

}
