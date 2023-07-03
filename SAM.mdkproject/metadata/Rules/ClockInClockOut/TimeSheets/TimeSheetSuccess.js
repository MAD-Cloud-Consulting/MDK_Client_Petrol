import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import GetDuration from '../../Confirmations/CreateUpdate/OnCommit/GetDuration';
import ConvertDoubleToHourString from '../../Confirmations/ConvertDoubleToHourString';

export default function TimeSheetSuccess(context) {
    let result = context.getActionResult('actionResult').data; //Timesheet row that was just created
    //Handle removing clock in/out records after time entry
    libCommon.setStateVariable(context, 'ClockTimeSaved', true);
    return libClock.removeUserTimeEntries(context).then(() => {
        if (IsCompleteAction(context)) {
            WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                data: result,
                link: JSON.parse(result)['@odata.editLink'],
                value: ConvertDoubleToHourString(GetDuration(context)),
            });
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }
        //Regular time entry, not part of consolidated completion flow
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
    });
}
