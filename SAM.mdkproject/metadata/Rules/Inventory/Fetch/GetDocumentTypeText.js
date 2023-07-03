/**
 * Calculates the text for the footnote property at the Inbound List screen
 */
 
export default function GetDocumentTypeText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    
    switch (binding.IMObject.toString()) {
        case 'ST':
            return clientAPI.localizeText('stock_transport_order');   
        case 'PO':
            return clientAPI.localizeText('purchase_order');
        case 'IB':
            return clientAPI.localizeText('inbound_delivery');
        case 'OB':
            return clientAPI.localizeText('outbound_delivery');
        case 'RS':
            return clientAPI.localizeText('reservation');
        case 'PRD':
            return clientAPI.localizeText('production_order_label');
        case 'MDOC':
            return clientAPI.localizeText('material_document_title');
        case 'PI':
            return clientAPI.localizeText('physical_inventory_label');
    }

    return '';
	
}
