import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function TimeEntryViewSubOperation(context) {
    let binding = context.binding;
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MyWOSubOperation&$select=MyWOSubOperation/SubOperationNo,MyWOSubOperation/OperationShortText').then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).MyWOSubOperation) {
                return `${result.getItem(0).MyWOSubOperation.SubOperationNo} - ${result.getItem(0).MyWOSubOperation.OperationShortText}`;
            } 
        }
        return ValueIfExists(binding.SubOperationNo);
    });
}
