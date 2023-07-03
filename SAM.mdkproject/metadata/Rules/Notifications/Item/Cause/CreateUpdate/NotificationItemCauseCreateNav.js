import libCommon from '../../../../Common/Library/CommonLibrary';

export default function NotificationItemCauseCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreateUpdateNav.action');
}
