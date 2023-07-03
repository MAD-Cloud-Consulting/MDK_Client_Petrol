import libForm from '../Common/Library/FormatLibrary';

export default function OperationHeaderFunctionalLocationDescription(context) {
    let binding = context.binding;
    if (binding.OperationFunctionLocation) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['FuncLocDesc'], "$filter=FuncLocId eq '" + binding.OperationFunctionLocation + "'").then(function(result) {
            let floc = result.getItem(0);
            return libForm.getFormattedKeyDescriptionPair(context, floc.FuncLocId, floc.FuncLocDesc);
        });
    } else {
        return '';
    }
}
