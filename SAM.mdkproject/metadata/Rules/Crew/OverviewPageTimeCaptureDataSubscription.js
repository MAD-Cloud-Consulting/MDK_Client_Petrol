import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function OverviewPageTimeCaptureDataSubscription(context) {
    var subscriptionArray = ['Confirmations', 'CatsTimesheets', 'ConfirmationOverviewRows', 'CatsTimesheetOverviewRows'];
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        subscriptionArray.push('CrewLists');
        subscriptionArray.push('CrewListItems');
    }
    return subscriptionArray;
}
