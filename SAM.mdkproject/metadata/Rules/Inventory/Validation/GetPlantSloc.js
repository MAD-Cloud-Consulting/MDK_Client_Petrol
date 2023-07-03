export default function GetPlantSloc(context) {
    let binding = context.binding;
    if (binding) {
        if (binding.StorageLocation) {
            return `${binding.Plant}/${binding.StorageLocation}`;
        }
        return binding.Plant;
    }
    return '';
}
