export default function GetBatchAndBin(context) {

    let material = context.binding.Material;
    let batch = context.binding.Batch;
    let bin;

    if (context.binding.MaterialSLoc_Nav) {
        bin = context.binding.MaterialSLoc_Nav.StorageBin;
    }

    if (material && bin && batch) {
        return material + '/' + bin + '/' + batch;
        } else if (material && batch) {
        return material + '/' + batch;
        } else if (material && bin) {
        return material + '/' + bin;
        } else if (material) {
        return material;
        }
}
