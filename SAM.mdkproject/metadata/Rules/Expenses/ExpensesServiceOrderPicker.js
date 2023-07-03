export default function ExpensesServiceOrderPicker(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], "$filter=ServiceType eq 'X'")
        .then(result => {
            const orderTypes = [];
            let query = '';

            for (let i = 0; i < result.length; i++) {
                orderTypes.push(`OrderType eq '${result.getItem(i).OrderType}'`);
            }

            query = orderTypes.join(' or ');

            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=${query}`)
                .then(wos => {
                    const serviceOrders = [];

                    for (let i = 0; i < wos.length; i++) {
                        serviceOrders.push({
                            DisplayValue: wos.getItem(i).OrderDescription,
                            ReturnValue: wos.getItem(i).OrderId,
                        });
                    }

                    return serviceOrders;
                });
        });
}
