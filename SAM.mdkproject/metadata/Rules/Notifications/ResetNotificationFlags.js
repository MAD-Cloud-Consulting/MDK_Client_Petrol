import notif from './NotificationLibrary';
import common from '../Common/Library/CommonLibrary';

export default function ResetNotificationFlags(context) {
    if (notif.getAddFromOperationFlag(context)) {
        notif.setAddFromOperationFlag(context, false);
    }

    if (notif.getAddFromSuboperationFlag(context)) {
        notif.setAddFromSuboperationFlag(context, false);
    }

    common.setOnCreateUpdateFlag(context, '');

    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
