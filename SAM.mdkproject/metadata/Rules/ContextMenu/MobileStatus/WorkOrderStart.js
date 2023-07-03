import common from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import mobilestatus from '../../MobileStatus/MobileStatusLibrary';
import generateGUID from '../../Common/guid';
import ChangeMobileStatus from './ChangeMobileStatus';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import mobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

/**
* Starts a Work Order and clocks it in
* @param {IClientAPI} context
*/
export default function WorkOrderStart(context) {
    let binding = context.binding;
    if (context.constructor.name === 'SectionedTableProxy') {
        binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();
    }

    //Set ChangeStatus to 'start'.
    //ChangeStatus is used by WorkOrderMobileStatusFailureMessage.action & WorkOrderMobileStatusSuccessMessage.action
    context.getPageProxy().getClientData().ChangeStatus = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    const cicoEnabled = libClock.isCICOEnabled(context);
    const START_STATUS = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD_STATUS = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

    if (mobilestatus.isHeaderStatusChangeable(context)) {
        // Generate start time; save in app data
        let odataDate = new ODataDate();
        common.setStateVariable(context, 'StatusStartDate', odataDate.date());
        // Get Object Key
        let ObjectKey = (function() {
            if (binding.ObjectKey) {
                return binding.ObjectKey;
            } else if (binding.OrderMobileStatus_Nav.ObjectKey) {
                return binding.OrderMobileStatus_Nav.ObjectKey;
            } else {
                return '';
            }
        })();
        // Get Object Type
        let ObjectType = common.getAppParam(context,'OBJECTTYPE','WorkOrder');
        // Get Effective Timestamp
        let EffectiveTimestamp = odataDate.toDBDateTimeString(context);
        // Get user GUID
        let UserGUID = common.getUserGuid(context);
        //Get user name
        let UserId = common.getSapUserName(context);
        // Get ReadLink
        let ReadLink = (function() {
            if (binding.OrderMobileStatus_Nav) {
                return binding.OrderMobileStatus_Nav['@odata.readLink'];
            }
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/OrderMobileStatus_Nav', [], '').then(function(result) {
                return result.getItem(0)['@odata.readLink'];
            });
        })();

        // If mobile status is already started (by someone else) put a hold in first
        let holdStatus = Promise.resolve();

        if (binding.OrderMobileStatus_Nav.MobileStatus === START_STATUS) {
            holdStatus = ChangeMobileStatus(context, ObjectKey, ObjectType, HOLD_STATUS, EffectiveTimestamp, UserGUID, ReadLink, UserId);
        }
        // Run mobile status update
        return holdStatus.then(() => {
            return ChangeMobileStatus(context, ObjectKey, ObjectType, START_STATUS, EffectiveTimestamp, UserGUID, ReadLink, UserId);
        }).then(() => {
            let properites = {
                'MobileStatus': START_STATUS,
                'EffectiveTimestamp': EffectiveTimestamp,
                'CreateUserGUID': UserGUID,
                'CreateUserId': UserId,
            };
            return mobileStatusHistoryEntryCreate(context, properites, ReadLink);
        }).then(() => {
            // Run CICO update
            return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': UserGUID,
                    'OperationNo': '',
                    'SubOperationNo': '',
                    'OrderId': binding.OrderId,
                    'PreferenceGroup': cicoEnabled ? 'CLOCK_IN' : 'START_TIME',
                    'PreferenceName': binding.OrderId,
                    'PreferenceValue': EffectiveTimestamp,
                    'UserId': UserId,
                },
                'Headers': {
                    'OfflineOData.RemoveAfterUpload': 'false',
                },
                'CreateLinks': [{
                    'Property': 'WOHeader_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderHeaders',
                        'ReadLink': "MyWorkOrderHeaders('" + binding.OrderId + "')",
                    },
                }],
            }});
        }).then(() => {
            // If ISU disconnect/reconnect, show activity update dialog
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/OrderISULinks`, [], '').then(result => {
                if (result.length > 0) {
                    let isuProcess = result.getItem(0).ISUProcess;
                    if (isuProcess === 'DISCONNECT' || isuProcess === 'RECONNECT') {
                        let queryOption = '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks';
                        return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/DisconnectActivity_Nav`, [], queryOption).then(disconnectActivity => {
                            context.getPageProxy().setActionBinding(disconnectActivity.getItem(0));
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action');
                        });
                    } else {
                        return Promise.resolve();
                    }
                } else {
                    return Promise.resolve();
                }
            }).catch(() => {
                return Promise.resolve();
            });
        }).then(() => {
            // Start Work Order succeeded. Show a message.
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action').then(() => {
                return libAutoSync.autoSyncOnStatusChange(context);
            });
        }).catch(() => {
            // Something failed. Show a message.
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
        }).finally(() => {
            delete context.getPageProxy().getClientData().ChangeStatus;
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').finally(() => {
            delete context.getPageProxy().getClientData().ChangeStatus;
        });
    }
}
