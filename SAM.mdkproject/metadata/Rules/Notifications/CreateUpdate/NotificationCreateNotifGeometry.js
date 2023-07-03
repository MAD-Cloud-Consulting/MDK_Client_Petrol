import libCommon from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

export default function NotificationCreateNotifGeometry(context) {
    libCommon.setStateVariable(context, 'CreateGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateNotifGeometry.action').then(function() {
        return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateGeometry.action').then(function() {
            return CreateEntitySuccessMessageNoClosePageWithAutoSync(context);
        });
    });
}
