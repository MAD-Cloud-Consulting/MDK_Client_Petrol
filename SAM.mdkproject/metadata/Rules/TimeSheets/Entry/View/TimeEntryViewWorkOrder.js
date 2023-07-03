import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function TimeEntryViewWorkOrder(context) {
    let binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MyWOHeader&$select=MyWOHeader/OrderId,MyWOHeader/OrderDescription').then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).MyWOHeader) {
                return `${result.getItem(0).MyWOHeader.OrderId} - ${result.getItem(0).MyWOHeader.OrderDescription}`;
            } 
        }
        return ValueIfExists(binding.RecOrder);
    });
}
