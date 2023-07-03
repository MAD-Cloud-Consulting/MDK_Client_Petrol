import ODataDate from '../../Common/Date/ODataDate';

export default function SetPredefinedOperationsListFilters(context, status, defaultDate) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    clientData.scheduledEarliestStartDateSwitch = true;
    clientData.scheduledEarliestStartDateStart = new ODataDate(defaultDate).toLocalDateString();
    clientData.scheduledEarliestStartDateEnd = new ODataDate(defaultDate).toLocalDateString();
    clientData.predefinedStatus = status;
}
