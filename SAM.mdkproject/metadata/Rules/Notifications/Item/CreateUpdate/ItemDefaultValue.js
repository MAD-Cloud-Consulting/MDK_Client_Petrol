/**
* Gets notification item default value for edit page
* @param {IClientAPI} context
*/
export default function ItemDefaultValue(context) {
	if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
		return context.binding.ItemText;
	}
}
