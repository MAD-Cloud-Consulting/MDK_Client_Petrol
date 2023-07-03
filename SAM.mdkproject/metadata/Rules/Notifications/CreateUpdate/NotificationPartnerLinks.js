/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function NotificationPartnerLinks(context) {
	let links = [];

	if (context.binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
		links.push({
			'Property' : 'Notification',
			'Target':
			{
				'EntitySet': 'MyNotificationHeaders',
				'ReadLink': 'pending_1',
			},
		});
	} else {
		links.push({
			'Property' : 'Notification',
			'Target':
			{
				'EntitySet': 'MyNotificationHeaders',
				'ReadLink': context.binding['@odata.readLink'],
			},
		});
	}

	let entitySet = '';
	let queryNav = '';
	let addressEntitySet = '';

	let value = context.getClientData().PartnerNum;
	switch (context.getClientData().PartnerFunction) {
		case 'SP':
			entitySet = `Customers('${value}')`;
			queryNav = 'Address_Nav';
			addressEntitySet = 'Addresses';
			break;
		case 'VN':
			entitySet = `Vendors('${value}')`;
			queryNav = 'Address_Nav';
			addressEntitySet = 'Addresses';
			break;
		case 'AO':
		case 'KU':
		case 'VU':
			entitySet = `SAPUsers('${value}')`;
			queryNav = 'AddressAtWork_Nav';
			addressEntitySet = 'AddressesAtWork';
			break;
		case 'VW':
			entitySet = `Employees('${value}')`;
			queryNav = 'EmployeeAddress_Nav';
			addressEntitySet = 'EmployeeAddresses';
			break;
		default:
			break;
	}

	links.push({
		'Property' : 'PartnerFunction_Nav',
		'Target':
		{
			'EntitySet': 'PartnerFunctions',
			'ReadLink': `PartnerFunctions('${context.getClientData().PartnerFunction}')`,
		},
	});
	if (entitySet) {
		return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], `$expand=${queryNav}`).then((result) => {
			if (result.length > 0) {
				let entity = result.getItem(0);
				if (entity[queryNav]) {
					links.push({
						'Property' : queryNav,
						'Target':
						{
							'EntitySet': addressEntitySet,
							'ReadLink': entity[queryNav]['@odata.readLink'],
						},
					});
				}
			}
			return links;
		});
	} else {
		return links;
	}
}
