export default function FormatCategory(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `FuncLocCategories('${context.binding.FuncLocType}')`, [], '').then(function(result) {
        if (result && result.getItem(0)) {
            return context.binding.FuncLocType + ' - ' + result.getItem(0).FuncLocCategoryDesc;
        } else {
            return '-';
        }
    }, function() {
        return context.binding.FuncLocType;
    });
}
