import libEval from '../Common/Library/ValidationLibrary';

export default function ErrorArchiveQueryOptions(context) {
    if (!libEval.evalIsEmpty(context.binding)  && !libEval.evalIsEmpty(context.binding.ErrorObject)) {
        return '$filter=RequestID eq ' + context.binding.ErrorObject.RequestID;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [] ,'').then(function(results) {
        if (results && results.length > 0) {
            return '$filter=RequestID eq ' + results.getItem(0).RequestID;
        }
        return '';
    });
}
