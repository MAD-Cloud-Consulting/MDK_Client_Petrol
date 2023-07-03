import libVal from '../../Common/Library/ValidationLibrary';
import isPartnerPickerVisible from './PartnerPickerVisible';
export default function PartnerValue(context) {
	return isPartnerPickerVisible(context).then((isVisible) => {
		if (isVisible) {
			if (context.getPageProxy().binding['@odata.readLink']) {
				return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/Partners`, [], '$orderby=PartnerFunction&$expand=PartnerFunction_Nav').then(result => {
					if (result.length > 0) {
						if (context.getName() === 'PartnerPicker1' && !libVal.evalIsEmpty(result.getItem(0))) {
							context.getPageProxy().getClientData().OldPartner1 = result.getItem(0).PartnerNum;
							return result.getItem(0).PartnerNum;
						} else if (context.getName() === 'PartnerPicker2' && !libVal.evalIsEmpty(result.getItem(1))) {
							context.getPageProxy().getClientData().OldPartner2 = result.getItem(1).PartnerNum;
							return result.getItem(1).PartnerNum;
						} else {
							return '';
						}
					} else {
						return '';
					}
				});
			} else {
				return '';
			}
		}
		return '';
	});
}
