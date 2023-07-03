export default function GetBatchAndBin(context) {

    let bin = '';
    
    if (context.binding.MaterialSLoc_Nav) {
        bin = context.binding.MaterialSLoc_Nav.StorageBin;
    }
    let batch = context.binding.Batch;

    if (batch && bin) {
        return batch + '/' + context.localizeText('pi_bin',[bin]);
    } else if (batch) {
        return batch;
    } else if (bin) {
        return context.localizeText('pi_bin',[bin]);
    }
    return '';
}
