/**
* Check if Crew Component is enabled and execute the appropriate rule accordingly
* @param {IClientAPI} context
*/
import timeSheetUpdateCrew from '../Crew/TimeSheets/TimeSheetUpdateCrew';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import GetDuration from '../Confirmations/CreateUpdate/OnCommit/GetDuration';
import ConvertDoubleToHourString from '../Confirmations/ConvertDoubleToHourString';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function TimeSheetEntrySuccessMessage(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        timeSheetUpdateCrew(context);
    } else {
        if (IsCompleteAction(context)) {
            WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                data: JSON.stringify(context.binding),
                value: ConvertDoubleToHourString(GetDuration(context)),
            });
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }

        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
    }
}
