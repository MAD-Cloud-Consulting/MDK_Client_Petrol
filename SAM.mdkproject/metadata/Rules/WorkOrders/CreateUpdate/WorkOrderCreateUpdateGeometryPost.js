import GetGeometryType from '../../Geometries/GetGeometryType';
import GetObjectGroup from '../../Geometries/GetObjectGroup';
import ObjectKeyFromMap from '../../Geometries/ObjectKeyFromMap';
import GeometryType from '../../Geometries/GeometryType';
import IsGefEnabled from '../../Geometries/IsGefEnabled';
import libVal from '../../Common/Library/ValidationLibrary';


export default function WorkOrderCreateUpdateGeometryPost(context) {
    let binding = context.binding;
    let readLink;
    let workOrder;
    let objectKey;

    if (context.getPageProxy().currentPage.id === 'WorkOrderCreateUpdatePage') {
        binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    } else if (context.currentPage.woBinding) {
        binding = context.currentPage.woBinding;
        context.currentPage.readLink = binding['@odata.editLink'];
        context.currentPage.objectKey = context.currentPage.woBinding.OrderId;
        workOrder = context.currentPage.woBinding;
        readLink = binding['@odata.editLink'];
    } else {
        objectKey = ObjectKeyFromMap(context);
        if (!libVal.evalIsEmpty(objectKey)) {
            readLink = 'MyWorkOrderHeaders(\'' + objectKey + '\')';
        } else {
            return false;
        }
    }
 
    if (!readLink) {
        readLink = binding['@odata.readLink'];
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/WOGeometries', [], '$expand=Geometry').then(function(results) {
        if (results && results.getItem(0)) {
            context.getPageProxy().setActionBinding(results.getItem(0).Geometry);
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryUpdate.action', 'Properties': {
                'Headers': {
                    'OfflineOData.TransactionID': objectKey ? objectKey : '#Page:WorkOrderDetailsPage/#Property:OrderId',
                },
            }});
        } else {
            objectKey = workOrder ? '/SAPAssetManager/Rules/Geometries/ObjectKeyFromPage.js' :
                                    '#Page:WorkOrderDetailsPage/#Property:OrderId';
            const readLinks = workOrder ? '/SAPAssetManager/Rules/Geometries/ReadLinkFromPage.js' :
                                          '#Page:WorkOrderDetailsPage/#Property:@odata.readLink';
            const onSuccessHandler = workOrder ? '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateNewWOGeometry.js' :
                                                 '/SAPAssetManager/Rules/WorkOrders/CreateUpdate/WorkOrderCreateWOGeometry.js';
            const name = workOrder ? 'CreateNewGeometry' : 'CreateGeometry';

            const properties = {
                'Properties': {
                    'ObjectType': 'ORH',
                    'ObjectKey': objectKey,
                    'OutputFormat': 'json',
                    'GeometryValue': '/SAPAssetManager/Rules/Geometries/GeometryValueFromPage.js',
                },
                'CreateLinks': [{
                    'Property': 'WOHeader_Nav',
                    'Target': {
                        'EntitySet' : 'MyWorkOrderHeaders', 
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
                    var objectGroupPromise = GetObjectGroup(context, 'ORH');
                    var geometryTypePromise = GetGeometryType(context, GeometryType(context));
                    return Promise.all([objectGroupPromise, geometryTypePromise]).then(function(promiseResults) {
                        properties.Properties.ObjectGroup = promiseResults[0];
                        properties.Properties.GeometryType = promiseResults[1];
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                            if (context.currentPage.woBinding) {
                                context.currentPage.woBinding = null;
                            }
                        });
                    });
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                    if (context.currentPage.woBinding) {
                        context.currentPage.woBinding = null;
                    }
                });
            });
        }
    });
}
