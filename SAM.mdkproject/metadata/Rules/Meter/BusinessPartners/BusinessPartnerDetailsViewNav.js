import businessPartnerQueryOptions from '../../BusinessPartners/BusinessPartnerQueryOptions';
import contextConverter from './BusinessPartnerContextConverter';

export default function BusinessPartnerDetailsViewNav(context) {
    let binding = context.getPageProxy().getActionBinding();
    let queryOptions = businessPartnerQueryOptions(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], queryOptions).then(function(result) {
        let businessPartner = result.getItem(0);
        let fakeContext = {binding: businessPartner};
        contextConverter(fakeContext);
        context.getPageProxy().setActionBinding(businessPartner);
        return context.executeAction('/SAPAssetManager/Actions/BusinessPartners/BusinessPartnerDetailsViewNav.action');
    });
}
