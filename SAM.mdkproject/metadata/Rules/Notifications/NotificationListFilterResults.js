
import libCommon from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import phaseFilterResult from '../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';

export default function NotificationListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:PriorityFilter/#Value');
    let result4 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:TypeFilter/#FilterValue');

    let filterResults = [result1, result2, result3, result4];

    let creationDateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');

    if (IsPhaseModelEnabled(context)) {
        let phase = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) {
            filterResults.push(result);
        }
    }

    if (creationDateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'StartDateFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'EndDateFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["CreationDate ge datetime'" + odataStartDate + "' and CreationDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        let clientData = context.evaluateTargetPath('#Page:NotificationsListViewPage/#ClientData');
        clientData.creationDateSwitch = creationDateSwitch.getValue();
        clientData.startDate = odataStartDate;
        clientData.endDate = odataEndDate;
    }

    return filterResults;   
}

