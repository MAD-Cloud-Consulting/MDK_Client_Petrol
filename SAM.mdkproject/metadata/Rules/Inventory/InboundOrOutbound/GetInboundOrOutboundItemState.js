export default function GetInboundOrOutboundItemState(clientAPI) {
    let binding = clientAPI.getBindingObject();    
    let received = binding.PickedQuantity;
    let all = binding.Quantity;

    if (all === 0 || received === 0) {
        return clientAPI.localizeText('open');
    }

    if (all - received > 0) {
        return clientAPI.localizeText('item_partial');
    }

    return clientAPI.localizeText('completed');
}
