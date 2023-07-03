/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ServiceOrderCreateSoldToPartyPickerItems(context) {
    let binding = context.getPageProxy().binding;
    let target = context.getTargetSpecifier();
    target.setService('/SAPAssetManager/Services/AssetManager.service');

    target.setEntitySet('Customers');
    target.setDisplayValue('{{#Property:Customer}} - {{#Property:Name1}}');
    target.setReturnValue('{Customer}');
    target.setQueryOptions('$orderby=Name1');

    if (binding && binding.WOSales_Nav) {
        let salesOrg = binding.WOSales_Nav.SalesOrg;
        let distributionChannel = binding.WOSales_Nav.DistributionChannel;
        let division = binding.WOSales_Nav.Division;
        let queryOptions = `$filter=SalesOrg eq '${salesOrg}' and DistributionChannel eq '${distributionChannel}' and Division eq '${division}'&$expand=Customer_Nav&$orderby=Customer_Nav/Name1`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'CustomerSalesData', [], queryOptions)
            .then(results => {
                if (results._array.length > 0) {
                    if (salesOrg && distributionChannel && division) {
                        target.setEntitySet('CustomerSalesData');
                        target.setDisplayValue('#Property:Customer_Nav/#Property:Name1');
                        target.setReturnValue('{Customer}');
                        target.setQueryOptions(queryOptions);
                    }
                }
            })
            .catch(() => {
                return context.setTargetSpecifier(target);
            });
    }
    return context.setTargetSpecifier(target);
}
