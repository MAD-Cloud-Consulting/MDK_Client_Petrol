import libCom from '../Common/Library/CommonLibrary';
import downloadPush from './PushNotificationsDownload';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';

export default function PushNotificationsDownloadFailureAlertMessage(context) {
    setSyncInProgressState(context, false);
    var binding = libCom.getClientDataForPage(context);
    let title = context.localizeText('download_incomplete');
    let technicalObjectName = binding.ObjectType === 'WorkOrder' ? context.localizeText('workorder') : context.localizeText('notification');
    return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownloadIncomplete.action').then(()=> {
        return libCom.showWarningDialog(context, context.localizeText('push_download_incomplete', [binding.TitleLocArgs,technicalObjectName]), title, context.localizeText('tryAgain'), context.localizeText('later')).then((result) => {
            if (result === true) {
                setSyncInProgressState(context, true);
                downloadPush(context, binding.ObjectType);
            }
            return '';
        });
    });  
   
}
