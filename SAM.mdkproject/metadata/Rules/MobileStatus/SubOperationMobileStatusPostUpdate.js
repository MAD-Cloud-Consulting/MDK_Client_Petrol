
import generateGUID from '../Common/guid';
import ODataDate from '../Common/Date/ODataDate';
import common from '../Common/Library/CommonLibrary';
import SubOperationMobileStatusLibrary from '../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import supervisor from '../Supervisor/SupervisorLibrary';
import noteWrapper from '../Supervisor/MobileStatus/NoteWrapper';
import {ChecklistLibrary} from '../Checklists/ChecklistLibrary';
import toolbarCaption from '../SubOperations/MobileStatus/SubOperationMobileStatusToolBarCaption';
import LocationUpdate from './LocationUpdate';
import mobileStatusHistoryEntryCreate from './MobileStatusHistoryEntryCreate';
import autoSyncLib from '../ApplicationEvents/AutoSync/AutoSyncLibrary';

/**
* Mobile Status post-update rule
* @param {IClientAPI} context
*/
export default function SubOperationMobileStatusPostUpdate(context) {
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const userGUID = common.getUserGuid(context);
    const userId = common.getSapUserName(context);
    const updateResult = JSON.parse(context.getActionResult('MobileStatusUpdate').data);

    let UpdateCICO = function() {
        // Save timestamp for confirmation/CATS
        let odataDate = new ODataDate();
        common.setStateVariable(context, 'StatusStartDate', odataDate.date());

        // Create relevant CICO entry
        let cicoValue = '';
        switch (updateResult.MobileStatus) {
            case STARTED:
                cicoValue = 'START_TIME';
                break;
            case HOLD:
            case COMPLETE:
                cicoValue = 'END_TIME';
                break;
            default:
                break;
        }
        return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
            'Properties': {
                'RecordId': generateGUID(),
                'UserGUID': userGUID,
                'OperationNo': updateResult.OperationNo,
                'SubOperationNo': updateResult.SubOperationNo,
                'OrderId': updateResult.OrderId,
                'PreferenceGroup': cicoValue,
                'PreferenceName': updateResult.OrderId,
                'PreferenceValue': odataDate.toDBDateTimeString(context),
                'UserId': userId,
            },
            'CreateLinks': [{
                'Property': 'WOSubOperation_Nav',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderSubOperations',
                    'ReadLink': `MyWorkOrderSubOperations(OrderId='${updateResult.OrderId}',OperationNo='${updateResult.OperationNo}',SubOperationNo='${updateResult.SubOperationNo}')`,
                },
            }],
        }}).then(() => {
            if (updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') {
                SubOperationMobileStatusLibrary.showTimeCaptureMessage(context);
            }
        });
    };

    if (updateResult.MobileStatus === COMPLETE) {
        return ChecklistLibrary.allowWorkOrderComplete(context, context.binding.HeaderEquipment, context.binding.HeaderFunctionLocation).then(results => { //Check for non-complete checklists and ask for confirmation
            if (results === true) {
                return SubOperationMobileStatusLibrary.completeSubOperationWithoutTime(context, updateResult); // May throw rejected Promise if signature required and declined
            } else {
                return Promise.resolve();
            }
        }).then(() => {
            LocationUpdate(context);
            return supervisor.checkReviewRequired(context, context.binding).then(review => {
                context.binding.SupervisorDisallowFinal = '';
                if (review) {
                    context.binding.SupervisorDisallowFinal = true; //Tech cannot set final confirmation on review
                }
                return noteWrapper(context, review).then(() => { //Allow tech to leave note for supervisor
                    return SubOperationMobileStatusLibrary.showTimeCaptureMessage(context, !review, updateResult.MobileStatus);
                });
            });
        }).then(() => {
            let properties = {
                'MobileStatus': updateResult.MobileStatus,
                'EffectiveTimestamp': updateResult.EffectiveTimestamp,
                'CreateUserGUID': updateResult.CreateUserGUID,
                'CreateUserId': updateResult.CreateUserId,
            };
            return mobileStatusHistoryEntryCreate(context, properties, updateResult['@odata.readLink']);
        }).then(UpdateCICO).then(() => {
            return toolbarCaption(context, updateResult).then(caption => {
                context.setToolbarItemCaption('IssuePartTbI', caption);
                return autoSyncLib.autoSyncOnStatusChange(context);
            });
        }).catch(() => {
            // Roll back mobile status update
            return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action', 'Properties': {
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'EditLink': updateResult['@odata.editLink'],
                },
            }});
        });
    } else {
        LocationUpdate(context);
        let properties = {
            'MobileStatus': updateResult.MobileStatus,
            'EffectiveTimestamp': updateResult.EffectiveTimestamp,
            'CreateUserGUID': updateResult.CreateUserGUID,
            'CreateUserId': updateResult.CreateUserId,
        };
        return mobileStatusHistoryEntryCreate(context, properties, updateResult['@odata.readLink']).then(() => {
            return UpdateCICO().then(() => {
                return toolbarCaption(context, updateResult).then(caption => {
                    context.setToolbarItemCaption('IssuePartTbI', caption);
                    return autoSyncLib.autoSyncOnStatusChange(context);
                });
            });
        });
    }
}
