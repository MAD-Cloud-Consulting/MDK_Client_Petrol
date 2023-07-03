import ODataDate from '../../Common/Date/ODataDate';

export default function SetPredefinedOrdersListFilters(context, status, defaultDate) {
    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    clientData.reqDateSwitch = true;
    clientData.reqStartDate = new ODataDate(defaultDate).toLocalDateString();
    clientData.reqEndDate = new ODataDate(defaultDate).toLocalDateString();
    clientData.predefinedStatus = status;
}
