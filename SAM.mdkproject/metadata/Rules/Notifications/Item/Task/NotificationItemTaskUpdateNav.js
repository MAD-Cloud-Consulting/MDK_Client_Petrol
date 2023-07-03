import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationItemTaskUpdateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemTaskCreateUpdateNav.action');
}
