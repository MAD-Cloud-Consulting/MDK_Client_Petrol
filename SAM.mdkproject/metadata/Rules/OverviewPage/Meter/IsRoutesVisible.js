import MeterLib from '../../Meter/Common/MeterLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function IsRoutesVisible(context) {
    return  (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) && MeterLib.getMeterReaderFlag());
}
