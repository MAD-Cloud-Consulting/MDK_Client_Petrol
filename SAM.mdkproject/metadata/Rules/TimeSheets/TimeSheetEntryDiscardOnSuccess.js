/**
* Execute rule based on the component
* @param {IClientAPI} context
*/
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import updateCrewAfterDiscard from './TimeSheetUpdateCrewAfterDiscard';
import deleteEntityOnSuccess from '../Common/DeleteEntityOnSuccess';

export default function TimeSheetEntryDiscardOnSuccess(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return updateCrewAfterDiscard(context);
    } else {
        return deleteEntityOnSuccess(context);
    }
}
