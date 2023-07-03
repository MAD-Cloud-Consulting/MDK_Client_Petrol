import enableDismantleButtonForFlocation from '../../UserAuthorizations/FunctionalLocations/EnableFunctionalLocationEdit';
import enableDismantleButtonForEquipment from '../../UserAuthorizations/Equipments/EnableEquipmentEdit';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function UninstallVisible(context) {
    let query = context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation' ?
        `$filter=FunctionalLocation/FuncLocId eq '${context.binding.FuncLocId}'` :
        `$filter=SuperiorEquip eq '${context.binding.EquipId}'`;
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Dismantle.global').getValue())) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', query).then(function(count) {
            if (count > 0) {
                return (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') ? enableDismantleButtonForFlocation(context) : enableDismantleButtonForEquipment(context);
            } else {
                return false;
            }
        });
    } else {
        return false;
    }

}
