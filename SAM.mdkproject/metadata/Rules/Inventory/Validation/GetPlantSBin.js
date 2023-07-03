export default function GetPlantSBin(context) {
    let binding = context.binding;
    if (binding) {
        let sbin = binding.StorageBin;
        if (sbin) {
            return sbin;
        }
    }
    return '';
}
