import val from '../../Common/Library/ValidationLibrary';
export default function PartCreateMaterialDescDefaultValue(context) {
    if (context.binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/BOM.global').getValue()) {
        if (!val.evalIsEmpty(context.binding.Material_Nav)) {
            return context.binding.Material_Nav.Description;
        }
    }
    return '';
}
