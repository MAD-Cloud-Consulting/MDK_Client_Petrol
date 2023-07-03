import MeterLib from '../../Meter/Common/MeterLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function IsHighOrdersVisible(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) ? (MeterLib.getMeterReaderFlag()) : true;
}
