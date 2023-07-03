import notif from './NotificationLibrary';
import libCom from '../Common/Library/CommonLibrary';

export default function ResetNotificationFlagsContinue(context) {
    libCom.setOnCreateUpdateFlag(context, '');
    if (notif.getAddFromOperationFlag(context)) {
        notif.setAddFromOperationFlag(context, false);
    }

    if (notif.getAddFromSuboperationFlag(context)) {
        notif.setAddFromSuboperationFlag(context, false);
    }
    libCom.setStateVariable(context, 'CancelActionFlag', true); //We are cancelling a transaction, so set flag to use elsewhere to stop actions
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'); //Continue pending actions
}
