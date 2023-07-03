

export default function IsGefEnabled(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'GISMapParameters', [], '').then(function(results) {
        for (let i = 0; i < results.length; i++) {
            if (results.getItem(i).ParameterName === 'EnableGef') {
                return results.getItem(i).ParameterValue === 'True';
            }
        }
        return false;
    });
}
