export default function DocumentTypeFilterListPickerItems(context) {

    let json = [];
    
        json.push(
            {
                'DisplayValue': context.localizeText('inbound_delivery'),
                'ReturnValue': 'IB',
            });

        json.push(
            {
                'DisplayValue': context.localizeText('outbound_delivery'),
                'ReturnValue': 'OB',
            });    

        json.push(
            {
                'DisplayValue': context.localizeText('purchase_order'),
                'ReturnValue': 'PO',
            });

        json.push(
            {
                'DisplayValue': context.localizeText('reservation'),
                'ReturnValue': 'RS',
            });

        json.push(
            {
                'DisplayValue': context.localizeText('stock_transport_order'),
                'ReturnValue': 'ST',
            });            

        return json;
}

