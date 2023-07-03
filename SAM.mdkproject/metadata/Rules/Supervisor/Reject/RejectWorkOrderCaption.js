export default function RejectWorkOrderCaption(context) {
    
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return businessObject.OrderId + ' - ' + businessObject.OrderDescription;
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', "MyWorkOrderHeaders('" + businessObject.OrderId + "')", ['OrderDescription'], '').then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                return businessObject.OrderId + ' - ' + row.OrderDescription;
            }
            return '';
        });
    }
    return '';
}
