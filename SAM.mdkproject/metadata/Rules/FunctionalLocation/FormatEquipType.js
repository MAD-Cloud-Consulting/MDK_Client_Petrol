export default function FormatEquipType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `EquipObjectTypes('${context.binding.EquipType}')`, [], '').then(function(result) {
        if (result && result.getItem(0)) {
            return result.getItem(0).ObjectTypeDesc;
        } else {
            return '-';
        }
    }, function() {
        return '-';
    });
}
