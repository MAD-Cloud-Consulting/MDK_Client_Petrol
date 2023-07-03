import libNotif from '../Notifications/NotificationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import notifCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function WorkOrderNotificationCreateNav(context) {

    let binding = context.binding;
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }
    //set the follow up flag
    libNotif.setAddFromJobFlag(context, true);

    let bindingObject = {
        '@odata.readLink': binding['@odata.readLink'],
        OrderId: binding.OrderId,
        HeaderEquipment: binding.HeaderEquipment,
        HeaderFunctionLocation: binding.HeaderFunctionLocation,
        WOPartners: binding.WOPartners,
    };

    // Return the result of the change set nav
    libCommon.setStateVariable(context, 'LocalId', ''); //Reset the localid before creating a new notification
    return notifCreateChangeSetNav(context, bindingObject).then(() => {
        //Check if a new notification was added.  if so, update the work order header with NotificationNumber
        let localId = libCommon.getStateVariable(context, 'LocalId');
        if (localId) {
            //Read the new notification to make sure it exists
            return context.read('/SAPAssetManager/Services/AssetManager.service', "MyNotificationHeaders('" + localId + "')", ['NotificationNumber'], '').then(function(notif) {
                if (notif && notif.length > 0) {
                    binding.LocalNotificationId = localId;
                    binding.OrderHeaderReadLink = "MyWorkOrderHeaders('" + binding.OrderId + "')";
                    binding.LocalNotificationReadLink = "MyNotificationHeaders('" + localId + "')";
                    if (!binding.NotificationNumber) { //Link this new notification the the WO header since there isn't one already linked
                        binding.NotificationNumber = localId;
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderUpdateNotificationNumber.action', 'Properties': {
                            'Target': {
                                'EntitySet': 'MyWorkOrderHeaders',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': binding.OrderHeaderReadLink,
                            },
                            'Properties': {
                                'NotificationNumber': binding.NotificationNumber,
                            },
                            'UpdateLinks':
                            [{
                                'Property': 'Notification',
                                'Target': {
                                    'EntitySet': 'MyNotificationHeaders',
                                    'ReadLink': binding.LocalNotificationReadLink,
                                },
                            }],
                        }});
                    } else { //Header notif already exists, so add to object list instead
                        binding.NotificationNumber = localId;
                        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ObjectList.global').getValue())) {
                            return context.executeAction({'Name': '/SAPAssetManager/Actions/ObjectList/CreateUpdate/ObjectListCreateNotificationForWorkOrder.action', 'Properties': {
                                'Headers': {
                                    'OfflineOData.RemoveAfterUpload': 'true',
                                    'OfflineOData.TransactionID': binding.NotificationNumber,
                                },
                                'Properties': {
                                    'NotifNum': binding.NotificationNumber,
                                    'OrderId': binding.OrderId,
                                    'ObjectListNum': '/SAPAssetManager/Rules/ObjectList/ObjectListNum.js',
                                    'ObjectListCounter': '/SAPAssetManager/Rules/ObjectList/ObjectListCounter.js',
                                },
                                'CreateLinks': (function() {
                                    var links = [{
                                        'Property': 'NotifHeader_Nav',
                                        'Target': {
                                            'EntitySet': 'MyNotificationHeaders',
                                            'ReadLink': binding.LocalNotificationReadLink,
                                        },
                                    }];
                                    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                                        links.push({
                                            'Property': 'WOHeader_Nav',
                                            'Target': {
                                                'EntitySet': 'MyWorkOrderHeaders',
                                                'ReadLink': binding.OrderHeaderReadLink,
                                            },
                                        });
                                    }
                                    return links;
                                })(),
                            }});
                        } else {
                            return Promise.resolve();
                        }
                    }
                }
                return Promise.resolve(false); //Problem reading the notification
            });
        }
        return Promise.resolve(true);
    });
}
