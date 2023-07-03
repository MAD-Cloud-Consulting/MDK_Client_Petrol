import GetGeometryType from '../../Geometries/GetGeometryType';
import GetObjectGroup from '../../Geometries/GetObjectGroup';
import ObjectKeyFromMap from '../../Geometries/ObjectKeyFromMap';
import GeometryType from '../../Geometries/GeometryType';
import IsGefEnabled from '../../Geometries/IsGefEnabled';
import libVal from '../../Common/Library/ValidationLibrary';

export default function EquipmentCreateUpdateGeometryPost(context) {
    let binding = context.binding;
    let readLink;
    let equipment;
    let objectKey;

    if (context.getPageProxy().currentPage.id === 'EquipmentCreateUpdatePage') {
        binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    } else if (context.currentPage.equipBinding) {
        binding = context.currentPage.equipBinding;
        context.currentPage.readLink = binding['@odata.editLink'];
        context.currentPage.objectKey = context.currentPage.equipBinding.EquipId;
        equipment = context.currentPage.equipBinding;
        readLink = binding['@odata.editLink'];
    } else {
        objectKey = ObjectKeyFromMap(context);
        if (!libVal.evalIsEmpty(objectKey)) {
            readLink = 'MyEquipments(\'' + objectKey + '\')';
        } else {
            return false;
        }
    }
 
    if (!readLink) {
        readLink = binding['@odata.readLink'];
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/EquipGeometries', [], '$expand=Geometry').then(function(results) {
        if (results && results.getItem(0)) {
            context.getPageProxy().setActionBinding(results.getItem(0).Geometry);
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryUpdate.action', 'Properties': {
                'Headers': {
                    'OfflineOData.TransactionID': objectKey ? objectKey : '#Page:EquipmentDetailsPage/#Property:EquipId',
                },
            }});
        } else {
            objectKey = equipment ? '/SAPAssetManager/Rules/Geometries/ObjectKeyFromPage.js' :
                                    '#Page:EquipmentDetailsPage/#Property:EquipId';
            const readLinks = equipment ? '/SAPAssetManager/Rules/Geometries/ReadLinkFromPage.js' :
                                          '#Page:EquipmentDetailsPage/#Property:@odata.readLink';
            const onSuccessHandler = equipment ? '/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentCreateNewEquipGeometry.js' :
                                                 '/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentCreateEquipGeometry.js';
            const name = equipment ? 'CreateNewGeometry' : 'CreateGeometry';

            const properties = {
                'Properties': {
                    'ObjectType': 'IEQ',
                    'ObjectKey': objectKey,
                    'OutputFormat': 'json',
                    'GeometryValue': '/SAPAssetManager/Rules/Geometries/GeometryValueFromPage.js',
                },
                'CreateLinks': [{
                    'Property': 'Equip_Nav',
                    'Target': {
                        'EntitySet' : 'MyEquipments', 
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
                    var objectGroupPromise = GetObjectGroup(context, 'IEQ');
                    var geometryTypePromise = GetGeometryType(context, GeometryType(context));
                    return Promise.all([objectGroupPromise, geometryTypePromise]).then(function(promiseResults) {
                        properties.Properties.ObjectGroup = promiseResults[0];
                        properties.Properties.GeometryType = promiseResults[1];
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                            if (context.currentPage.equipBinding) {
                                context.currentPage.equipBinding = null;
                            }
                        });
                    });
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                    if (context.currentPage.equipBinding) {
                        context.currentPage.equipBinding = null;
                    }
                });
            });
        }
    });
}
