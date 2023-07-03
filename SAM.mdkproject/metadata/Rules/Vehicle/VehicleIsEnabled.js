import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function VehicleIsEnabled(context) {
    ///Checks if MM_VEHICLE_STOCK (Vehicle) is enabled
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/VehicleStock.global').getValue());
}
