/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function NotificationPartnerLinksDelete(context) {
	let links = [];

	let entitySet = '';
	let oldEntitySet = '';
	let queryNav = '';
	let addressEntitySet = '';

	let value = context.getClientData().PartnerNum;
	let oldValue = context.getClientData().OldPartnerNum;
	switch (context.getClientData().PartnerFunction) {
		case 'SP':
			queryNav = 'Address_Nav';
			entitySet = `Customers('${value}')/${queryNav}`;
			oldEntitySet = `Customers('${oldValue}')/${queryNav}`;
			addressEntitySet = 'Addresses';
			break;
		case 'VN':
			queryNav = 'Address_Nav';
			entitySet = `Vendors('${value}')/${queryNav}`;
			oldEntitySet = `Vendors('${oldValue}')/${queryNav}`;
			addressEntitySet = 'Addresses';
			break;
		case 'AO':
		case 'KU':
		case 'VU':
			queryNav = 'AddressAtWork_Nav';
			entitySet = `SAPUsers('${value}')/${queryNav}`;
			oldEntitySet = `SAPUsers('${oldValue}')/${queryNav}`;
			addressEntitySet = 'AddressesAtWork';
			break;
		case 'VW':
			queryNav = 'EmployeeAddress_Nav';
			entitySet = `Employees('${value}')`;
			oldEntitySet = `Employees('${oldValue}')/${queryNav}`;
			addressEntitySet = 'EmployeeAddresses';
			break;
		default:
			break;
	}

	if (entitySet) {
		return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '').then((addrs) => {
			let addrCount = addrs.length;
			if (addrCount === 0) {
				return context.read('/SAPAssetManager/Services/AssetManager.service', oldEntitySet, [], '').then(result => {
					if (result.length > 0) {
						let deleteLink = result.getItem(0)['@odata.readLink'];
						links.push({
							'Property' : queryNav,
							'Target': {
								'EntitySet': addressEntitySet,
								'ReadLink': deleteLink,
							},
						});
					}
					return links;
				});
			}
			return links;
		});
	}
	return links;
}
