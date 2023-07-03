
import libCommon from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import phaseFilterResult from '../../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function WorkOrderOperationListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MyOperationsFilter/#Value');
    let result4 = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:AssignmentFilter/#FilterValue');

    let filterResults = [result1, result2, result3, result4];

    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let scheduledEarliestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateSwitch');
    let scheduledEarliestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateSwitch');
    let scheduledLatestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateSwitch');
    let scheduledLatestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateSwitch');

    if (IsPhaseModelEnabled(context)) {
        let execuationStage = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ExecuationStageFilter/#Value');
        filterResults.push(execuationStage);
        let phase = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) filterResults.push(result);
    }

    if (scheduledEarliestStartDateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'ScheduledEarliestStartDateStartFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'ScheduledEarliestStartDateEndFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["SchedEarliestStartDate ge datetime'" + odataStartDate + "' and SchedEarliestStartDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        clientData.creationDateSwitch = scheduledEarliestStartDateSwitch.getValue();
        clientData.scheduledEarliestStartDateStart = odataStartDate;
        clientData.scheduledEarliestStartDateEnd = odataEndDate;
    }

    if (scheduledEarliestEndDateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'ScheduledEarliestEndDateStartFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'ScheduledEarliestEndDateEndFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["SchedEarliestEndDate ge datetime'" + odataStartDate + "' and SchedEarliestEndDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        clientData.creationDateSwitch = scheduledEarliestEndDateSwitch.getValue();
        clientData.scheduledEarliestEndDateStart = odataStartDate;
        clientData.scheduledEarliestEndDateEnd = odataEndDate;
    }

    if (scheduledLatestStartDateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'ScheduledLatestStartDateStartFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'ScheduledLatestStartDateEndFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["SchedLatestStartDate ge datetime'" + odataStartDate + "' and SchedLatestStartDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        clientData.creationDateSwitch = scheduledLatestStartDateSwitch.getValue();
        clientData.scheduledLatestStartDateStart = odataStartDate;
        clientData.scheduledLatestStartDateEnd = odataEndDate;
    }

    if (scheduledLatestEndDateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'ScheduledLatestEndDateStartFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'ScheduledLatestEndDateEndFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["SchedLatestEndDate ge datetime'" + odataStartDate + "' and SchedLatestEndDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        clientData.creationDateSwitch = scheduledLatestEndDateSwitch.getValue();
        clientData.scheduledLatestEndDateStart = odataStartDate;
        clientData.scheduledLatestEndDateEnd = odataEndDate;
    }

    return filterResults;
}
