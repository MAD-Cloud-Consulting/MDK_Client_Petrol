import PriorityQueryOptions from '../PriorityQueryOptions';
/**
* Set visibility of priority segmented control/list picker based on OS and priority count
* A special thanks to Global Design for this mandate.
* @param {IFormCellProxy} context control context
*/
export default function NotificationCreateUpdatePriorityVisibility(context) {
	return context.count('/SAPAssetManager/Services/AssetManager.service', 'Priorities', PriorityQueryOptions(context)).then(priorityCount => {
		if (priorityCount > 5) { // iOS limits segmented control buttons to 5
			if (context.getName() === 'PrioritySeg') {
				return false; // Hide Priority Segmented Control if priority count > 5
			} else {
				return true; // Show Priority List Picker Control if priority count > 5
			}
		} else {
			if (context.getName() === 'PrioritySeg') {
				return true; // Show Priority Segmented Control if priority count > 5
			} else {
				return false; // Hide Priority List Picker Control if priority count > 5
			}
		}
	});
}
