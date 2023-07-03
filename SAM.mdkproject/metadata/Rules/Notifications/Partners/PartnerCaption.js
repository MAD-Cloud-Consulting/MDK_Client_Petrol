import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import NotificationTypeLstPkrDefault from '../NotificationTypePkrDefault';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerCaption(context) {
	let reads = [context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${NotificationTypeLstPkrDefault(context)}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`)];

	if (context.getPageProxy().binding['@odata.readLink']) {
		reads.push(context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/Partners`, [], '$orderby=PartnerFunction&$expand=PartnerFunction_Nav'));
	} else {
		reads.push([]);
	}

	return Promise.all(reads).then(results => {
		if (results[1].length > 0) { // Edit
			if (context.getName() === 'PartnerPicker1' && !ValidationLibrary.evalIsEmpty(results[1].getItem(0)))
				return results[1].getItem(0).PartnerFunction_Nav.Description;
			else if (context.getName() === 'PartnerPicker2' && !ValidationLibrary.evalIsEmpty(results[1].getItem(1)))
				return results[1].getItem(1).PartnerFunction_Nav.Description;
			else
				return '';
		} else if (results[0].length > 0) {	// Create
			if (context.getName() === 'PartnerPicker1' && !ValidationLibrary.evalIsEmpty(results[0].getItem(0)))
				return results[0].getItem(0).PartnerFunction_Nav.Description;
			else if (context.getName() === 'PartnerPicker2' && !ValidationLibrary.evalIsEmpty(results[0].getItem(1111)))
				return results[0].getItem(1).PartnerFunction_Nav.Description;
			else
				return '';
		} else {
			return '';
		}
	});
}
