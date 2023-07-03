import libCom from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function PartCreateDefaultPlant(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/VehicleStock.global').getValue())) {
        return libCom.getUserDefaultPlant();
    } 
    return context.binding.Plant;
}
