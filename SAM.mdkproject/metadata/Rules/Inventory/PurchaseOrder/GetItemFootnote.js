import GetStorageBin from '../Validation/GetStorageBin';

export default function GetItemFootnote(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const binding = context.binding;
    const purchaseType = 'PurchaseOrderItem';
    const stockType = 'StockTransportOrderItem';
    const storageBin = binding.StorageBin;
    const serialized = binding.MaterialPlant_Nav && binding.MaterialPlant_Nav.SerialNumberProfile ? context.localizeText('pi_serialized') : '';
    let batch = binding.Batch;
   
    if (type === purchaseType || type === stockType) {
        return GetStorageBin(context).then(bin => {
            if (type === purchaseType) {
                batch = binding.ScheduleLine_Nav[0] && binding.ScheduleLine_Nav[0].Batch;
            } else if (type === stockType) {
                batch = binding.STOScheduleLine_Nav[0] && binding.STOScheduleLine_Nav[0].Batch;
            }

            return DrawResult(context, batch, bin, serialized);
        });
    } 

    return DrawResult(context, batch, storageBin, serialized);
}


function DrawResult(context, batch, storageBin, serialized) {
    const binText = context.localizeText('storage_bin') + ' ' + storageBin;
    let binBatch = '';
    if (batch && storageBin) {
        binBatch = batch + ', ' + binText;
    } else if (batch) {
        binBatch = batch;
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
