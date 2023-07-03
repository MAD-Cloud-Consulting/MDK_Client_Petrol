import CommonLibrary from '../Common/Library/CommonLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
/**
* Getting time period of SO from binding and making it in correct format
* @param {IClientAPI} context
*/
export default function ContractDatePeriod(context) {
    let binding = context.binding;
    let contractDateString = '';

    if (CommonLibrary.isDefined(binding)) {
        let operationDataType = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue();
        let startDate, startTime, endDate, endTime;
        
        if (binding['@odata.type'] === operationDataType) {
            startDate = binding.SchedEarliestStartDate;
            startTime = binding.SchedEarliestStartTime;
            endDate = binding.SchedLatestEndDate;
            endTime = binding.SchedLatestEndTime;
        } else {
            startDate = binding.ScheduledStartDate;
            startTime = binding.ScheduledStartTime;
            endDate = binding.ScheduledEndDate;
            endTime = binding.ScheduledEndTIme;
        }

        if (CommonLibrary.isDefined(startTime) && CommonLibrary.isDefined(startDate)) {
            let startOdataDate = new OffsetODataDate(context, startDate, startTime);
            contractDateString = context.formatTime(startOdataDate.date());
        }
        
        if (CommonLibrary.isDefined(endTime) && CommonLibrary.isDefined(endDate)) {
            let endOdataDate = new OffsetODataDate(context, endDate, endTime);
            contractDateString += ' - ' + context.formatTime(endOdataDate.date());
        }
    }
    return contractDateString;
}
