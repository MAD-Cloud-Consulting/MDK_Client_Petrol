import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function TimeSheetsIsEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Timesheet.global').getValue());
}
