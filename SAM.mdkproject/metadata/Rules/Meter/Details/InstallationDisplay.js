export default function InstallationDisplay(context) {
    if (context.binding.Installation && context.binding.Installation_Nav) {
        return `${context.binding.Installation} - ${context.binding.Installation_Nav.InstallationType}`;
    } else if (context.binding.Device && context.binding.Installation) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Installations('${context.binding.Installation}')`, [], '').then(function(result) {
            if (result && result.length > 0) {
                return `${result.getItem(0).Installation} - ${result.getItem(0).InstallationType}`;
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
