/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ContextMenuDelete(context) {
	let binding = context.getPageProxy().getExecutedContextMenuItem().getBinding();

	return context.getPageProxy().executeAction({'Name' : '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': {
		'Title': context.localizeText('confirm'),
		'Message': context.localizeText('confirm_delete'),
		'OKCaption': context.localizeText('ok'),
		'CancelCaption': context.localizeText('cancel'),
	}}).then(result => {
		let entitySet = '';
		if (binding['@sap.isLocal']) {
			switch (binding['@odata.type']) {
				case '#sap_mobile.MyWorkOrderHeader':
					entitySet = 'MyWorkOrderHeaders';
					break;
				case '#sap_mobile.MyWorkOrderOperation':
					entitySet = 'MyWorkOrderOperations';
					break;
				case '#sap_mobile.MyWorkOrderSubOperation':
					entitySet = 'MyWorkOrderSubOperations';
					break;
				case '#sap_mobile.MyNotificationHeader':
					entitySet = 'MyNotificationHeaders';
					break;
				case '#sap_mobile.MyFuncLocDocument':
					entitySet = 'MyFuncLocDocuments';
					break;
				case '#sap_mobile.MyNotifDocument':
					entitySet = 'MyNotifDocuments';
					break;
				case '#sap_mobile.MyEquipDocument':
					entitySet = 'MyEquipDocuments';
					break;
				case '#sap_mobile.MyWorkOrderDocument':
					entitySet = 'MyWorkOrderDocuments';
					break;
				case '#sap_mobile.UserPreference':
					entitySet = 'UserPreferences';
					break;
				case '#OfflineOData.ErrorArchiveEntity':
					entitySet = 'ErrorArchive';
					break;
				default:
					// Do not proceed with deletion if not a valid entity set
					return Promise.resolve();
			}
		} else {
			switch (binding['@odata.type']) {
				case '#sap_mobile.UserPreference':
					entitySet = 'UserPreferences';
					break;
				case '#OfflineOData.ErrorArchiveEntity':
					entitySet = 'ErrorArchive';
					break;
				default:
					// Do not proceed with deletion if not a valid entity set
					return Promise.resolve();
			}
		}
		return result.data === true ? context.getPageProxy().executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
			'Target': {
				'EntitySet' : entitySet,
				'Service' : '/SAPAssetManager/Services/AssetManager.service',
				'ReadLink' : binding['@odata.readLink'],
			},
		}}) : Promise.resolve();
	});
}
