import libComm from '../../Common/Library/CommonLibrary';
export default function SubOperationsEntitySet(context) {
	let entitySet = 'MyWorkOrderSubOperations';
	if (libComm.isDefined(context.binding)) { 
		if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
			entitySet = context.binding['@odata.readLink'] + '/SubOperations';
		}
	} 
	return entitySet;
}
