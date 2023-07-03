
import EnableCharEdit from '../../UserAuthorizations/Characteristics/EnableCharEdit';

export default function EnableAddCharLAMValue(context) {

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'ClassCharacteristics', `$filter=InternCharNum eq '${context.binding.CharId}' and InternClassNum eq '${context.binding.InternClassNum}' and LAMEnabled eq 'X'`).then(function(count) {
        let local = context.binding['@sap.isLocal'];

        return !local && EnableCharEdit(context) && (count > 0);
    });
}
