import libCommon from '../../../../Common/Library/CommonLibrary';

export default function NotificationItemTaskCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemTaskCreateUpdateNav.action');
}
