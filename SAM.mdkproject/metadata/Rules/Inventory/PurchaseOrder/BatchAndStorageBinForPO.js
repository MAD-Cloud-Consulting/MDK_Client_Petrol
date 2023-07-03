import commonLib from '../../Common/Library/CommonLibrary';

export default function BatchAndStorageBinForPO(context) {
    let batchAndBinStr = '';
    const binding = context.binding;
    if (binding) {
        if (commonLib.isDefined(binding.Batch)) {
            batchAndBinStr = binding.Batch + ', ';
        }
        if (commonLib.isDefined(binding.StorageBin)) {
            batchAndBinStr += '$(L,bin) ' + binding.StorageBin;
        }    
    }
    return batchAndBinStr;
}
