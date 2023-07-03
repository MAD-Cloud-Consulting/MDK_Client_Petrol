export default function PartCreateMaterialNumberDefaultValue(context) {
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        return context.binding.Component;
    }
    return '';
}
