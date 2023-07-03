/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentTypes(context) {
    return [
        {DisplayValue: context.localizeText('purchase_order'), ReturnValue: 'PO'},
        {DisplayValue: context.localizeText('inbound_delivery'), ReturnValue: 'IB'},
        {DisplayValue: context.localizeText('stock_transport_order'), ReturnValue: 'ST'},
        {DisplayValue: context.localizeText('outbound_delivery'), ReturnValue: 'OB'},
        {DisplayValue: context.localizeText('reservation'), ReturnValue: 'RS'},
        {DisplayValue: context.localizeText('physical_inventory_label'), ReturnValue: 'PI'},
        {DisplayValue: context.localizeText('production_order_label'), ReturnValue: 'PRD'},
        {DisplayValue: context.localizeText('workorder'), ReturnValue: 'WO'},
        {DisplayValue: context.localizeText('material_document_title'), ReturnValue: 'MDOC'},
    ];
}
