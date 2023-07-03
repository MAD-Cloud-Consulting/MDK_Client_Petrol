import common from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import mobilestatus from '../../MobileStatus/MobileStatusLibrary';
import woMobileStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import generateGUID from '../../Common/guid';
import ChangeMobileStatus from './ChangeMobileStatus';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import mobileStatusHistoryEntryCreate from '../../MobileStatus/MobileStatusHistoryEntryCreate';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

/**
* Holds a Work Order and clocks it out
* @param {IClientAPI} context
*/
export default function WorkOrderHold(context) {
	//Save the name of the page where user swipped the context menu from. It will be used later in common code that can be called from all kinds of different pages.
    common.setStateVariable(context, 'contextMenuSwipePage', common.getPageName(context));
    
    //Save the work order binding object first since we are coming from a context menu swipe which does not allow us to get binding object from context.binding.
    let binding = common.setBindingObject(context);
	
	//Set ChangeStatus to 'hold'.
	//ChangeStatus is used by WorkOrderMobileStatusFailureMessage.action & WorkOrderMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
	
	const cicoEnabled = libClock.isCICOEnabled(context);
	const START_STATUS = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
	const HOLD_STATUS = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

	return context.executeAction({
		'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
		'Properties': {
			'Title': context.localizeText('confirm_status_change'),
			'CancelCaption': context.localizeText('cancel'),
		},
	}).then(function(actionResult) {
		if (actionResult.data === true) {
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
		
				// If mobile status is already held (by someone else) put a start in first
				let startStatus = Promise.resolve();
		
				if (binding.OrderMobileStatus_Nav.MobileStatus === HOLD_STATUS) {
					startStatus = ChangeMobileStatus(context, ObjectKey, ObjectType, START_STATUS, EffectiveTimestamp, UserGUID, ReadLink, UserId);
				}
				// Run mobile status update
				return startStatus.then(() => {
					return ChangeMobileStatus(context, ObjectKey, ObjectType, HOLD_STATUS, EffectiveTimestamp, UserGUID, ReadLink, UserId);
				}).then(() => {
					let properites = {
						'MobileStatus': HOLD_STATUS,
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
							'PreferenceGroup': cicoEnabled ? 'CLOCK_OUT' : 'END_TIME',
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
					// Hold Work Order succeeded. Show a message.
					return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusSuccessMessage.action').then(() => {
						// Only run the time capture handler if the mobile status update worked (do not continue promise chain after the following .catch() below)
						return woMobileStatus.showTimeCaptureMessage(context, undefined, HOLD_STATUS).then(() => {
							return libAutoSync.autoSyncOnStatusChange(context);
						});
					});
				}).catch(() => {
					// Something failed. Show a message.
					return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
				}).finally(() => {
					cleanUp(context);    
				});
			} else {
				return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action').finally(() => {
					cleanUp(context); 
				});
			}
		} else {
			return Promise.resolve();
		}
	});
}

function cleanUp(context) {
	common.removeBindingObject(context);
	common.removeStateVariable(context, 'contextMenuSwipePage');  
	delete context.getPageProxy().getClientData().ChangeStatus;
}
