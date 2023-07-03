/**
 * Function that queries the BOMItems that are attached to a Material
 * Due to the odd context.binding object being passed to the hierarchy page, we must do a read
 */
import libVal from '../../Common/Library/ValidationLibrary';

export default function AssemblyHierarchyQueryOption(context) {
    if (!libVal.evalIsEmpty(context.binding) && context.binding.binding['@odata.type'] === '#sap_mobile.Material') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.binding['@odata.readLink'] + '/MaterialBOM_Nav', [], '').then(function(results) {
            if (results.length > 0) {
                return `$filter=(BOMId eq '${results.getItem(0).BOMId}' and BOMCategory eq '${results.getItem(0).BOMCategory}')`;
            } else {
                return '-';
            }
        }).catch(function() {
            return '-';
        });
    }
    return '-';
}
