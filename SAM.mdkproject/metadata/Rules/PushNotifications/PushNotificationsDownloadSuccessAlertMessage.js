import libCom from '../Common/Library/CommonLibrary';
import viewEntity from './PushNotificationsViewEntityNav';
import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import notificationNavQuery from '../Notifications/NotificationsListViewQueryOption';
import Logger from '../Log/Logger';
import downloadFailure from './PushNotificationsDownloadFailureAlertMessage';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import PersonaLibrary from '../Persona/PersonaLibrary';
export default function PushNotificationsDownloadSuccessAlertMessage(context) {
    setSyncInProgressState(context, false);
    var binding = libCom.getClientDataForPage(context);
    let view = context.localizeText('view');
    let dismiss = context.localizeText('cancel');
    let entity = '';
    let queryOptions = '';
    let technicalObjectName = '';
    if (binding.ObjectType === 'WorkOrder') {
        entity =  'MyWorkOrderHeaders('+ '\'' + binding.TitleLocArgs +'\''+')';
        queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
        technicalObjectName = context.localizeText(`${PersonaLibrary.isFieldServiceTechnician ? 'serviceorder' : 'workorder'}`);
    } else if (binding.ObjectType === 'Notification') {
        entity =  'MyNotificationHeaders('+ '\'' + binding.TitleLocArgs +'\''+')';
        queryOptions =  notificationNavQuery(context);
        technicalObjectName = context.localizeText('notification');
    } else {
        return Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue() , 'Push is not implemented for ' + binding.ObjectType + ' entity set');
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then((result) => {
        if (result && result.getItem(0)) {
            return libCom.showWarningDialog(context,context.localizeText('push_download_complete',[binding.TitleLocArgs, technicalObjectName]),context.localizeText('download_complete'),view, dismiss).then(() => {
                return viewEntity(context);
            }).catch(() => {
                return '';
            });
        }
        return '';
    }).catch(() => {
        return downloadFailure(context);
    });
}
