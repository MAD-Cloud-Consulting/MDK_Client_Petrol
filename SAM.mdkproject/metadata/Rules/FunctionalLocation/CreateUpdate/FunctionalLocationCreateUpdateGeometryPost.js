import GetGeometryType from '../../Geometries/GetGeometryType';
import GetObjectGroup from '../../Geometries/GetObjectGroup';
import ObjectKeyFromMap from '../../Geometries/ObjectKeyFromMap';
import GeometryType from '../../Geometries/GeometryType';
import IsGefEnabled from '../../Geometries/IsGefEnabled';
import libVal from '../../Common/Library/ValidationLibrary';


export default function FunctionalLocationCreateUpdateGeometryPost(context) {
    let binding = context.binding;
    let readLink;
    let funcLoc;
    let objectKey;

    if (context.getPageProxy().currentPage.id === 'FunctionalLocationCreateUpdatePage') {
        binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    } else if (context.getPageProxy().currentPage.id === 'FunctionalLocationDetails') {
        binding = context.binding;
    } else if (context.currentPage.funcLocBinding) {
        binding = context.currentPage.funcLocBinding;
        context.currentPage.readLink = binding['@odata.editLink'];
        context.currentPage.objectKey = context.currentPage.funcLocBinding.FuncLocIdIntern;
        funcLoc = context.currentPage.funcLocBinding;
        readLink = binding['@odata.editLink'];
    } else {
        objectKey = ObjectKeyFromMap(context);
        if (!libVal.evalIsEmpty(objectKey)) {
            readLink = 'MyFunctionalLocations(\'' + objectKey + '\')';
        } else {
            return false;
        }
    }
 
    if (!readLink) {
        readLink = binding['@odata.readLink'];
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/FuncLocGeometries', [], '$expand=Geometry').then(function(results) {
        if (results && results.getItem(0)) {
            context.getPageProxy().setActionBinding(results.getItem(0).Geometry);
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryUpdate.action', 'Properties': {
                'Headers': {
                    'OfflineOData.TransactionID': objectKey ? objectKey : '#Page:FunctionalLocationDetails/#Property:FuncLocIdIntern',
                },
            }});
        } else {
            objectKey = funcLoc ? '/SAPAssetManager/Rules/Geometries/ObjectKeyFromPage.js' :
                                  '#Page:FunctionalLocationDetails/#Property:FuncLocIdIntern';
            const readLinks = funcLoc ? '/SAPAssetManager/Rules/Geometries/ReadLinkFromPage.js' :
                                        '#Page:FunctionalLocationDetails/#Property:@odata.readLink';
            const onSuccessHandler = funcLoc ? '/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateNewFuncLocGeometry.js' :
                                               '/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationCreateFuncLocGeometry.js';
            const name = funcLoc ? 'CreateNewGeometry' : 'CreateGeometry';

            const properties = {
                'Properties': {
                    'ObjectType': 'IFL',
                    'ObjectKey': objectKey,
                    'OutputFormat': 'json',
                    'GeometryValue': '/SAPAssetManager/Rules/Geometries/GeometryValueFromPage.js',
                },
                'CreateLinks': [{
                    'Property': 'FuncLoc_Nav',
                    'Target': {
                        'EntitySet' : 'MyFunctionalLocations', 
                        'ReadLink' : readLinks,
                    },
                }],
                'OnSuccess': onSuccessHandler,
                'ActionResult': {
                    '_Name': name,
                },
            };

            return IsGefEnabled(context).then((enabled) => {
                if (enabled !== undefined && enabled === true) {
                    var objectGroupPromise = GetObjectGroup(context, 'IFL');
                    var geometryTypePromise = GetGeometryType(context, GeometryType(context));
                    return Promise.all([objectGroupPromise, geometryTypePromise]).then(function(promiseResults) {
                        properties.Properties.ObjectGroup = promiseResults[0];
                        properties.Properties.GeometryType = promiseResults[1];
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                            if (context.currentPage.funcLocBinding) {
                                context.currentPage.funcLocBinding = null;
                            }
                        });
                    });
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                    if (context.currentPage.funcLocBinding) {
                        context.currentPage.funcLocBinding = null;
                    }
                });
            });
        }
    });
}
