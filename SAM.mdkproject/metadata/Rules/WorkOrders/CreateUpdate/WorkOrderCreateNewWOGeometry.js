import libCommon from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

export default function WorkOrderCreateNewWOGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateNewWOGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyWorkOrderHeaders',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderReadLink.js',
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
