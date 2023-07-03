import libCommon from '../../Common/Library/CommonLibrary';
import CreateEntitySuccessMessageNoClosePageWithAutoSync from '../../ApplicationEvents/AutoSync/actions/CreateEntitySuccessMessageNoClosePageWithAutoSave';

export default function FunctionalLocationCreateNewFuncLocGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateNewFuncLocGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyFunctionalLocations',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationReadLink.js',
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
