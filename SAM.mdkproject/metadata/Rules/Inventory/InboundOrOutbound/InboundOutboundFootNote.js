export default function InboundOutboundFootNote(context) {
    const batch = context.binding.Batch;
    const storageBin = context.binding.StorageBin;
    const binText = context.localizeText('storage_bin') + ' ' + storageBin;
    const serialized = context.binding.MaterialPlant_Nav && context.binding.MaterialPlant_Nav.SerialNumberProfile ? context.localizeText('pi_serialized') : '';
    let binBatch = '';

    if (batch && storageBin) {
        binBatch = batch + ', ' + binText;
    } else if (batch) {
        binBatch =  batch;
    } else if (storageBin) {
        binBatch =  binText;
    }

    if (binBatch && serialized) {
        return binBatch + ', ' + serialized; 
    } else if (binBatch) {
        return binBatch;
    } else if (serialized) {
        return serialized;
    } else {
        return '';
    }
}
