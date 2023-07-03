import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function InspectionLotListFilterResults(context) {
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');
    let result1 = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:ValuationStatusFilter/#Value');
    let filterResults = [result1, result2];
    let pageProxy = context.getPageProxy();

    let woListPickerProxy = libCom.getControlProxy(pageProxy, 'WorkOrderFilter');
    let woSelection = woListPickerProxy.getValue()[0] ? woListPickerProxy.getValue()[0].ReturnValue : '';
    if (!libEval.evalIsEmpty(woSelection)) {
        let woFilter = ["OrderId eq '" + woSelection + "'"];
        let woFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, woFilter, true);
        filterResults.push(woFilterResult);
    }

    let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
    let opSelection = opListPickerProxy.getValue()[0] ? opListPickerProxy.getValue()[0].ReturnValue : '';
    if (!libEval.evalIsEmpty(opSelection)) {
        let opFilter = ["OperationNo eq '" + opSelection + "'"];
        let opFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, opFilter, true);
        filterResults.push(opFilterResult);
    }

    let dueDateSwitch = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueDateSwitch');
    if (dueDateSwitch.getValue() === true) {
        let startDate = libCom.getFieldValue(context, 'DueStartDateFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCom.getFieldValue(context, 'DueEndDateFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["InspectionLot_Nav/EndDate ge datetime'" + odataStartDate + "' and InspectionLot_Nav/EndDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        clientData.dueDateSwitch = dueDateSwitch.getValue();
        clientData.dueStartDate = odataStartDate;
        clientData.dueEndDate = odataEndDate;
    }

    return filterResults;
}
