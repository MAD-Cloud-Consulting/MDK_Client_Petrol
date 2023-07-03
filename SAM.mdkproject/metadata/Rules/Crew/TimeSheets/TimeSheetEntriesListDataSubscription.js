/**
* Data Subscripton array for Time Sheet Entried List Page if Crew component is enabled
* @param {IClientAPI} context
*/
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function TimeSheetEntriesListDataSubscription(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return ['CrewLists','CrewListItems'];
    }
    return [];
}
