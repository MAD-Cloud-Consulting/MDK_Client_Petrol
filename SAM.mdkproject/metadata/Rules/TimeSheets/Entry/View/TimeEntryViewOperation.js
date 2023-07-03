import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function TimeEntryViewOperation(context) {
    let binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MyWOOperation&$select=MyWOOperation/OperationNo,MyWOOperation/OperationShortText').then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).MyWOOperation) {
                return `${result.getItem(0).MyWOOperation.OperationNo} - ${result.getItem(0).MyWOOperation.OperationShortText}`;
            } 
        }
        return ValueIfExists(binding.Operation);
    });
}
