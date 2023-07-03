import libMobile from '../../MobileStatus/MobileStatusLibrary';
import Logger from '../../Log/Logger';
import libCommon from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import NotificationMobileStatus from '../../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

const notificationDetailsPage = 'NotificationDetailsPage';
const notificationTaskDetailsPage = 'NotificationTaskDetailsPage';

export default class {

    static startTask(context) {
        var pageContext = libMobile.getPageContext(context, notificationTaskDetailsPage);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskStartUpdate.action').then(function() {
            libMobile.setStartStatus(context);
            pageContext.setToolbarItemCaption('StartTaskTbI', context.localizeText('end_task'));
            context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static completeTask(context) {
        var pageContext = libMobile.getPageContext(context, notificationTaskDetailsPage);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskCompleteUpdate.action').then(function() {
            libMobile.setCompleteStatus(context);
            pageContext.setToolbarItemCaption('StartTaskTbI', context.localizeText('task_success'));
            context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
            HideActionItems(context.getPageProxy(), 2);
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static successTask(context) {
        var pageContext = libMobile.getPageContext(context, notificationTaskDetailsPage);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskSuccessUpdate.action').then(function() {
            libMobile.setStartStatus(context);
            pageContext.setToolbarItemCaption('StartTaskTbI', pageContext.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/SuccessText.global').getValue());
            context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
            libCommon.enableToolBar(context, notificationTaskDetailsPage, 'StartTaskTbI', false);
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static completeTaskWithoutSuccessFlag(context) {
        var pageContext = libMobile.getPageContext(context, notificationTaskDetailsPage);
        return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/Task/TaskCompleteUpdate.action').then(function() {
            libMobile.setCompleteStatus(context);
            libCommon.enableToolBar(context, notificationTaskDetailsPage, 'StartTaskTbI', false);
            HideActionItems(context.getPageProxy(), 2);
            context.dismissActivityIndicator();
            return ExecuteActionWithAutoSync(pageContext, '/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
        }).catch(err => {
            context.dismissActivityIndicator();
            /**Implementing our Logger class*/
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), err);
            return '';
        });
    }

    static readTaskMobileStatus(context) {
        let msLink = 'TaskMobileStatus_Nav';
        if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
            msLink = 'ItemTaskMobileStatus_Nav';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], `$expand=${msLink}&$select=${msLink}/MobileStatus`).then(status => {
            if (status) {
                var taskMobileStatus = status.getItem(0);
                return taskMobileStatus.TaskMobileStatus_Nav.MobileStatus;
            } else {
                return '';
            }
      });
    }

    static readHeaderMobileStatus(context) {
        return NotificationMobileStatus.getHeaderMobileStatus(context).then(status => {
            return status;
        });
    }


    static getMobileStatus(context) {
        return libMobile.mobileStatus(context, context.binding).then(status => {
                return status;
        });
    }

    static getHeaderMobileStatus(context) {
        var pageContext = libMobile.getPageContext(context, notificationDetailsPage);
        return this.getMobileStatus(pageContext);
    }
}
