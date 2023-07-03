/**
 * Check Meter Disconnect status, if applicable. Determine whether or not to allow completing work order
 *
 * @param {IClientAPI} context MDK context
 * @returns {Promise<Boolean>} whether or not to allow completion given Disconnect status
 */
 export default function DisconnectAllowComplete(context) {
	let disconnectActivity;
	switch (context.binding['@odata.type']) {
		case '#sap_mobile.MyWorkOrderHeader':
			disconnectActivity = `${context.binding['@odata.readLink']}/DisconnectActivity_Nav`;
			break;
		case '#sap_mobile.MyWorkOrderOperation':
			disconnectActivity = `${context.binding['@odata.readLink']}/WOHeader/DisconnectActivity_Nav`;
			break;
		case '#sap_mobile.MyWorkOrderSubOperation':
			disconnectActivity = `${context.binding['@odata.readLink']}/WorkOrderOperation/WOHeader/DisconnectActivity_Nav`;
			break;
		default:
			return Promise.resolve(true); // In case something broke, allow completion
	}

	// Read Disconnect Activity. Find any Disconnection Objects with:
	// 1. Devices that are blocked and NOT disconnected
	// 2. Devices that are NOT blocked and disconnected
	// In other words, disconnect/reconnect has not been completed
	return context.count('/SAPAssetManager/Services/AssetManager.service', disconnectActivity, "$filter=(ActivityStatus eq '10' or ActivityStatus eq '20') and DisconnectObject_Nav/any(do : do/Device_Nav/DeviceBlocked eq true) and DisconnectFlag eq '' or DisconnectObject_Nav/any(do : do/Device_Nav/DeviceBlocked eq false) and DisconnectFlag eq 'X'").then(count => {
		if (count > 0) {
			return false; // If incomplete disconnections/reconnections, disallow completion
		} else {
			return true; // Otherwise, allow completion
		}
	}).catch(() => {
		return true; // If read fails, allow completion
	});
}
