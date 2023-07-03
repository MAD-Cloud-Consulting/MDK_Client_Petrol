import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationTaskCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    context.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskCreateUpdateNav.action');
}
