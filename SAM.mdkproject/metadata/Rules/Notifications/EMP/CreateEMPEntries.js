import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import MobileStatusSetReceivedObjectKey from '../../MobileStatus/MobileStatusSetReceivedObjectKey';
import CurrentDateTime from '../../DateTime/CurrentDateTime';
import MobileStatusNotificationOverallStatusConfig from '../../MobileStatus/MobileStatusNotificationOverallStatusConfig';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CreateEMPEntries(context, EMPObject, actionResults = []) {
	// If invoked by MDK, EMPObject will be undefined the first time
	// Get EMPObject from state variable. If still undefined, logic will proceed normally
	if (EMPObject === undefined) {
		EMPObject = common.getStateVariable(context, 'EMP');
	}

	let isMinorWork = common.getStateVariable(context, 'isMinorWork');
	let promises=[];

	promises.push(MobileStatusSetReceivedObjectKey(context));
	if (IsPhaseModelEnabled(context) && !isMinorWork) {
		promises.push(MobileStatusNotificationOverallStatusConfig(context));
	}

	return Promise.all(promises).then(results => {
		let mobileStatusParameter;
		let mobileStatusValue = '';
		let headerObject = {
			'OfflineOData.NonMergeable': true,
			'OfflineOData.TransactionID': results[0],
		};

		let mobileStatusLinks = [
			{
				'Property': 'NotifHeader_Nav',
				'Target': {
					'EntitySet' : 'MyNotificationHeaders',
					'ReadLink': `MyNotificationHeaders('${common.getStateVariable(context, 'LocalId')}')`,
				},
			},
		];

		if (IsPhaseModelEnabled(context)) {
			if (isMinorWork) {
				mobileStatusParameter = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue();
				mobileStatusValue = common.getAppParam(context, 'MOBILESTATUS', mobileStatusParameter);
			} else {
				headerObject['Transaction.Ignore'] = 'true';
				mobileStatusLinks.push(
					{
						'Property': 'OverallStatusCfg_Nav',
						'Target': {
							'EntitySet' : 'EAMOverallStatusConfigs',
							'ReadLink': results[1],
						},
					}
				);
			}
		} else {
			mobileStatusParameter = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue();
			mobileStatusValue = common.getAppParam(context, 'MOBILESTATUS', mobileStatusParameter);
			mobileStatusLinks.push(
				{
					'Property': 'OverallStatusCfg_Nav',
					'Target': {
						'EntitySet' : 'EAMOverallStatusConfigs',
						'ReadLink': `EAMOverallStatusConfigs(Status='NOTIFICATION: ${mobileStatusValue}', EAMOverallStatusProfile='')`,
					},
				}
			);
		}

		let mobileStatusActionProperties = {
			'NotifNum': common.getStateVariable(context, 'LocalId'),
			'MobileStatus': mobileStatusValue,
			'ObjectType': GlobalVar.getAppParam().OBJECTTYPE.Notification,
			'ObjectKey': results[0],
			'EffectiveTimestamp': CurrentDateTime(context),
		};
	
		let currKey = Object.keys(EMPObject || {})[0];
		if (currKey) {
			// Get one of the EMPObject Keys and create a Key-Value pair out of all of its data
			let currObject = SplitReadLink(currKey);
			currObject.ConsequenceId = EMPObject[currKey].Consequence || '';
			currObject.LikelihoodId = EMPObject[currKey].Likelihood || '';
			currObject.LeadingConsequence = EMPObject[currKey].LeadingConsequence || false;
	
			// Remove the key from EMPObject so it is not operated on again
			delete EMPObject[currKey];
	
			// Run a Create action to make the new WorkRequestConsequence
			return context.executeAction({
				'Name': '/SAPAssetManager/Actions/EMP/ConsequenceCreate.action',
				'Properties': {
					'Properties': {
						'CategoryId': currObject.CategoryId,
						'ConsequenceId': currObject.ConsequenceId,
						'GroupId': currObject.GroupId,
						'LikelihoodId': currObject.LikelihoodId,
						'PrioritizationProfileId': currObject.PrioritizationProfileId,
						'LeadingConsequence': currObject.LeadingConsequence ? 'X' : '',
					},
					'CreateLinks':
					[{
						'Property': 'MyNotificationHeader_Nav',
						'Target':
						{
							'EntitySet': 'MyNotificationHeaders',
							'ReadLink': `MyNotificationHeaders('${common.getStateVariable(context, 'LocalId')}')`,
						},
					}],
				},
			}).then((actionResult) => {
				if (Object.keys(EMPObject).length > 0) {
					// Save created entity
					actionResults.push(actionResult);
					// Recursive loop case
					return CreateEMPEntries(context, EMPObject, actionResults);
				} else {
					// Recursive loop finished
					common.clearStateVariable(context, 'EMP');
	
					return context.executeAction({
						'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusNotificationSetInitialStatus.action',
						'Properties': {
							'Properties': mobileStatusActionProperties,
							'CreateLinks': mobileStatusLinks,
							'Headers': headerObject,
						},
					});
				}
			});
		} else {
			common.clearStateVariable(context, 'EMP');
			// EMPObject is undefined or null
			return context.executeAction({
				'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusNotificationSetInitialStatus.action',
				'Properties': {
					'Properties': mobileStatusActionProperties,
					'CreateLinks': mobileStatusLinks,
					'Headers': headerObject,
				},
			});
		}
	});
	
}
