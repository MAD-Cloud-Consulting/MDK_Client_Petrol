import libCommon from '../../../../Common/Library/CommonLibrary';

export default function NotificationItemActivityCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemActivityCreateUpdateNav.action');
}
