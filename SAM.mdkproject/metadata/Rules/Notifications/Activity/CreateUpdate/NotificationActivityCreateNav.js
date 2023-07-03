import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationActivityCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    context.executeAction('/SAPAssetManager/Actions/Notifications/Activity/NotificationActivityCreateUpdateNav.action');
}
