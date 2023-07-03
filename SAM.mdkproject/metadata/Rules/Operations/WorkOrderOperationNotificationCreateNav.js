import libNotif from '../Notifications/NotificationLibrary';
import notifCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';
import libCommon from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function WorkOrderOperationNotificationCreateNav(context) {

    let binding = context.binding;
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    //set the follow up flag
    libNotif.setAddFromOperationFlag(context, true);

    let bindingObject = {
        HeaderEquipment: binding.OperationEquipment,
        HeaderFunctionLocation: binding.OperationFunctionLocation,
        ExternalWorkCenterId: binding.MainWorkCenter,
        MainWorkCenterPlant: binding.MainWorkCenterPlant,
        OperationOrderId: binding.OrderId,
    };

    // Return the result of the change set nav
    libCommon.setStateVariable(context, 'LocalId', ''); //Reset the localid before creating a new notification
    return notifCreateChangeSetNav(context, bindingObject).then(() => {
        //Start the process of checking if we need to add this notification as an object list to the work order.
        let localId = libCommon.getStateVariable(context, 'LocalId');
        if (localId) {
            if (binding.WOHeader && binding.WOHeader.OrderType && binding.WOHeader.PlanningPlant) {
                let orderType = binding.WOHeader.OrderType;
                let planningPlant = binding.WOHeader.PlanningPlant;
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['ObjectListAssignment'], "$filter=OrderType eq '" + orderType + "' and PlanningPlant eq '" + planningPlant + "'").then(function(data) {
                    if (data && data.length > 0) {
                        let row = data.getItem(0);
                        if (row.ObjectListAssignment === '2' || row.ObjectListAssignment === '3') { //Add this notification to the object list
                            //Read the new notification to make sure it exists
                            return context.read('/SAPAssetManager/Services/AssetManager.service', "MyNotificationHeaders('" + localId + "')", ['NotificationNumber'], '').then(function(notif) {
                                if (notif && notif.length > 0) {
                                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderObjectLists', ['ObjectListNum'], "$filter=OrderId eq '" + binding.OrderId + "' and OperationNo eq '" + binding.OperationNo + "'").then(function(object) {
                                        let objectListEnabled = userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ObjectList.global').getValue());
                                        if (object && objectListEnabled) {
                                            binding.ObjectListNotificationID = localId;
                                            return context.executeAction({'Name': '/SAPAssetManager/Actions/ObjectList/CreateUpdate/ObjectListCreateNotificationForOperation.action', 'Properties': {
                                                'Headers': {
                                                    'OfflineOData.RemoveAfterUpload': 'true',
                                                    'OfflineOData.TransactionID': binding.ObjectListNotificationID,
                                                },
                                                'Properties': {
                                                    'NotifNum': binding.ObjectListNotificationID,
                                                    'OrderId': binding.OrderId,
                                                    'OperationNo': binding.OperationNo,
                                                    'SubOperationNo': (function() {
                                                        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                                                            return binding.SubOperationNo;
                                                        }
                                                        return '';
                                                    })(),
                                                    'ObjectListNum': '/SAPAssetManager/Rules/ObjectList/ObjectListNum.js',
                                                    'ObjectListCounter': '/SAPAssetManager/Rules/ObjectList/ObjectListCounter.js',
                                                },
                                                'CreateLinks': (function() {
                                                    var links = [{
                                                        'Property': 'NotifHeader_Nav',
                                                        'Target': {
                                                            'EntitySet': 'MyNotificationHeaders',
                                                            'ReadLink': `MyNotificationHeaders('${localId}')`,
                                                        },
                                                    }];

                                                    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                                                        links.push({
                                                            'Property': 'WOOperation_Nav',
                                                            'Target': {
                                                                'EntitySet': 'MyWorkOrderOperations',
                                                                'ReadLink': binding['@odata.readLink'],
                                                            },
                                                        });
                                                    } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                                                        links.push({
                                                            'Property': 'WOOperation_Nav',
                                                            'Target': {
                                                                'EntitySet': 'MyWorkOrderOperations',
                                                                'ReadLink': `MyWorkOrderOperations(OrderId='${binding.OrderId}',OperationNo='${binding.OperationNo}')`,
                                                            },
                                                        },
                                                        {
                                                            'Property': 'WOSubOperation_Nav',
                                                            'Target': {
                                                                'EntitySet': 'MyWorkOrderSubOperations',
                                                                'ReadLink': binding['@odata.readLink'],
                                                            },
                                                        });
                                                    }
                                                    links.push({
                                                        'Property': 'WOHeader_Nav',
                                                        'Target': {
                                                            'EntitySet': 'MyWorkOrderHeaders',
                                                            'ReadLink': `MyWorkOrderHeaders('${binding.OrderId}')`,
                                                        },
                                                    });
                                                    return links;
                                                })(),
                                            }});
                                        }
                                        return Promise.resolve(true);
                                    });
                                }
                                return Promise.resolve(true);
                            });
                        }
                    }
                    return Promise.resolve(true);
                });
            }
        }
        return Promise.resolve(true);
    });
}
