import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationItemCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    if (context.constructor.name === 'SectionedTableProxy') {
        context.getPageProxy().setActionBinding(context.getPageProxy().getExecutedContextMenuItem().getBinding());
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCreateUpdateNav.action');
}
