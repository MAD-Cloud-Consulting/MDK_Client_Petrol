export default function OperationsEntitySet(context) {
	if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
		return context.binding['@odata.readLink'] + '/Operations';
	} else {
		return 'MyWorkOrderOperations';
	}
}
