import libCommon from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

export default function EquipmentCreateNewEquipGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreateNewEquipGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyEquipments',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentReadLink.js',
            },
            'CreateLinks': [
                {
                    'Property': 'Geometry_Nav',
                    'Target':
                    {
                        'EntitySet' : 'Geometries', 
                        'ReadLink' : '/SAPAssetManager/Rules/Geometries/NewGeometryReadLink.js',
                    },
                },
            ],
        }}).then(function() {
            return CreateEntitySuccessMessageNoClosePageWithAutoSync(context);
        });
    });
}
