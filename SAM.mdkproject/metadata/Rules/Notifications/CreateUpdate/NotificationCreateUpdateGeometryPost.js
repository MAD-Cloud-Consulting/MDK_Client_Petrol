import GetGeometryType from '../../Geometries/GetGeometryType';
import GetObjectGroup from '../../Geometries/GetObjectGroup';
import ObjectKeyFromMap from '../../Geometries/ObjectKeyFromMap';
import GeometryType from '../../Geometries/GeometryType';
import IsGefEnabled from '../../Geometries/IsGefEnabled';
import libVal from '../../Common/Library/ValidationLibrary';

export default function NotificationCreateUpdateGeometryPost(context) {
    let binding = context.binding;
    let readLink;
    let notif;
    let objectKey;

    if (context.getPageProxy().currentPage.id === 'NotificationAddPage') {
        binding = context.evaluateTargetPathForAPI('#Page:-Previous').binding;
    } else if (context.currentPage.notifBinding) {
        binding = context.currentPage.notifBinding;
        context.currentPage.readLink = binding['@odata.editLink'];
        context.currentPage.objectKey = context.currentPage.notifBinding.NotificationNumber;
        notif = context.currentPage.notifBinding;
        readLink = binding['@odata.editLink'];
    } else {
        objectKey = ObjectKeyFromMap(context);
        if (!libVal.evalIsEmpty(objectKey)) {
            readLink = 'MyNotificationHeaders(\'' + objectKey + '\')';
        } else {
            return false;
        }
    }
 
    if (!readLink) {
        readLink = binding['@odata.readLink'];
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/NotifGeometries', [], '$expand=Geometry').then(function(results) {
        if (results && results.getItem(0)) {
            context.getPageProxy().setActionBinding(results.getItem(0).Geometry);
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryUpdate.action', 'Properties': {
                'Headers': {
                    'OfflineOData.TransactionID': objectKey ? objectKey : '#Page:NotificationDetailsPage/#Property:NotificationNumber',
                },
            }});
        } else {
            objectKey = notif ? '/SAPAssetManager/Rules/Geometries/ObjectKeyFromPage.js' :
                                '#Page:NotificationDetailsPage/#Property:NotificationNumber';
            const readLinks = notif ? '/SAPAssetManager/Rules/Geometries/ReadLinkFromPage.js' :
                                     '#Page:NotificationDetailsPage/#Property:@odata.readLink';
            const onSuccessHandler = notif ? '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateNewNotifGeometry.js' :
                                             '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationCreateNotifGeometry.js';
            const name = notif ? 'CreateNewGeometry' : 'CreateGeometry';

            const properties = {
                'Properties': {
                    'ObjectType': 'NO1',
                    'ObjectKey': objectKey,
                    'OutputFormat': 'json',
                    'GeometryValue': '/SAPAssetManager/Rules/Geometries/GeometryValueFromPage.js',
                },
                'CreateLinks': [{
                    'Property': 'NotifHeader_Nav',
                    'Target': {
                        'EntitySet' : 'MyNotificationHeaders', 
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
                    var objectGroupPromise = GetObjectGroup(context, 'NO1');
                    var geometryTypePromise = GetGeometryType(context, GeometryType(context));
                    return Promise.all([objectGroupPromise, geometryTypePromise]).then(function(promiseResults) {
                        properties.Properties.ObjectGroup = promiseResults[0];
                        properties.Properties.GeometryType = promiseResults[1];
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                            if (context.currentPage.notifBinding) {
                                context.currentPage.notifBinding = null;
                            }
                        });
                    });
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Geometries/GeometryCreate.action', 'Properties': properties}).then(() => {
                    if (context.currentPage.notifBinding) {
                        context.currentPage.notifBinding = null;
                    }
                });
            });
        }
    });
}
