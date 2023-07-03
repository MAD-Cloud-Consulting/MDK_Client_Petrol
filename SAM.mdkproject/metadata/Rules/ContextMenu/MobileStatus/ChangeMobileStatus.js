import common from '../../Common/Library/CommonLibrary';

/**
 * Changes the Mobile Status of a given Object
 * @param {IClientAPI} context an MDK Context
 * @param {String|Promise<String>} ObjectKey
 * @param {String|Promise<String>} ObjectType
 * @param {String|Promise<String>} MobileStatus
 * @param {String|Promise<String>} EffectiveTimestamp
 * @param {String|Promise<String>} UserGUID
 * @param {String|Promise<String>} ReadLink object to be updated
 * @returns {Promise<Object>} Promise containing updated entity
 */
export default function ChangeMobileStatus(context, ObjectKey, ObjectType, MobileStatus, EffectiveTimestamp, UserGUID, ReadLink, UserId) {
	const WO_TYPE = common.getAppParam(context,'OBJECTTYPE','WorkOrder');
	const NOTIF_TYPE = common.getAppParam(context,'OBJECTTYPE','Notification');
	const NOTIFITEMTASK_TYPE = common.getAppParam(context, 'NotificationItemTask');
	const NOTIFTASK_TYPE = common.getAppParam(context, 'NotificationTask');
	const OPR_TYPE = common.getAppParam(context, 'Operation');
	const QMNOTIF_TYPE = common.getAppParam(context, 'QMNotification');

	let EAMObjectType = '';

	switch (ObjectType) {
		case WO_TYPE:
			EAMObjectType = 'WORKORDER';
			break;
		case OPR_TYPE:
			EAMObjectType = 'WO_OPERATION';
			break;
		case QMNOTIF_TYPE:
		case NOTIF_TYPE:
			EAMObjectType = 'NOTIFICATION';
			break;
		case NOTIFTASK_TYPE:
		case NOTIFITEMTASK_TYPE:
			EAMObjectType = 'TASK';
			break;
		default:
			break;
	}
	return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/MobileStatusUpdate.action', 'Properties': {
		'Properties': {
			'ObjectKey': ObjectKey,
			'ObjectType': ObjectType,
			'MobileStatus': MobileStatus,
			'EffectiveTimestamp': EffectiveTimestamp,
			'CreateUserGUID': UserGUID,
            'CreateUserId': UserId,
		},
		'Target': {
			'EntitySet': 'PMMobileStatuses',
			'Service': '/SAPAssetManager/Services/AssetManager.service',
			'ReadLink' : ReadLink,
		},
		'UpdateLinks': [{
			'Property': 'OverallStatusCfg_Nav',
			'Target': {
				'EntitySet': 'EAMOverallStatusConfigs',
				'QueryOptions': `$filter=MobileStatus eq '${MobileStatus}' and ObjectType eq '${EAMObjectType}'`,
			},
		}],
	}}).then(actionResults => {
		return JSON.stringify(actionResults.data);
	});
}
