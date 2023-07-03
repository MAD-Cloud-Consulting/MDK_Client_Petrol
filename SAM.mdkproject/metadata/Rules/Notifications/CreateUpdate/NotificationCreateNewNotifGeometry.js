import libCommon from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

export default function NotificationCreateNewNotifGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateNewNotifGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyNotificationHeaders',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationReadLink.js',
            },
            'CreateLinks':
            [{
                'Property': 'Geometry_Nav',
                'Target':
                {
                    'EntitySet' : 'Geometries', 
                    'ReadLink' : '/SAPAssetManager/Rules/Geometries/NewGeometryReadLink.js',
                },
            }],
        }}).then(function() {
            return CreateEntitySuccessMessageNoClosePageWithAutoSync(context);
        });
    });
}
