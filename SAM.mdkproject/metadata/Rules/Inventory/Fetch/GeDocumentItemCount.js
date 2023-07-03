
/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GeDocumentItemCount(clientAPI) {
    let binding = clientAPI.getBindingObject();
    let descLabel = 'number_of_items';
    if (binding && binding.IMObject === 'PRD') {
        descLabel = 'number_of_components';
        if (Number(binding.ItemCount) === 1) {
            return clientAPI.localizeText('single_component');
        }
    }
    return clientAPI.localizeText(descLabel, [binding.ItemCount]);
}
