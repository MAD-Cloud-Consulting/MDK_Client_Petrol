import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function InventorySearchFilterResults(context) {

    let clientData = context.evaluateTargetPath('#Page:' + libCom.getStateVariable(context, 'INVENTORY_LIST_PAGE') + '/#ClientData');
    clientData.DueDateSwitch = undefined;
    clientData.DueStartDateFilter = undefined;
    clientData.DueEndDateFilter = undefined;
    clientData.DateCustomPicker = undefined;
    
    let result1 = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DocTypeFilter/#FilterValue');
    let result2 = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:SortFilter/#Value');
    let datePicker = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DateCustomPicker/#Value');
    let dueDateSwitch = context.evaluateTargetPath('#Page:InventorySearchFilterPage/#Control:DueDateSwitch');
 
    clientData.DueDateSwitch = dueDateSwitch.getValue();

    let filterResults = [result1, result2];

    if (datePicker.length > 0) {
        let target = datePicker[0].ReturnValue;
        clientData.DateCustomPicker = target;
        let query;
        if (target === 'T') { //today
            let odataDate = new ODataDate(new Date()).toDBDateString(context);
            query = "ObjectDate eq datetime'" + odataDate + "'";
        } else if (target === 'L') { //Last week
            let odataDateToday = new ODataDate(new Date()).toDBDateString(context);
            let workDate = new Date();
            workDate.setDate(workDate.getDate() - 7);
            let odataDateLastWeek = new ODataDate(workDate).toDBDateString(context);
            query = "ObjectDate ge datetime'" + odataDateLastWeek + "' and ObjectDate lt datetime'" + odataDateToday + "'";
        } else if (target === 'N') { //Next week
            let odataDateToday = new ODataDate(new Date()).toDBDateString(context);
            let workDate = new Date();
            workDate.setDate(workDate.getDate() + 7);
            let odataDateNextWeek = new ODataDate(workDate).toDBDateString(context);
            query = "ObjectDate gt datetime'" + odataDateToday + "' and ObjectDate le datetime'" + odataDateNextWeek + "'";
        }
        let dateFilter = [query]; //["RequestStartDate ge datetime'" + odataStartDate + "' and RequestStartDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);
    }

    if (dueDateSwitch.getValue()) {
        let startDate = libCom.getFieldValue(context, 'DueStartDateFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCom.getFieldValue(context, 'DueEndDateFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["ObjectDate ge datetime'" + odataStartDate + "' and ObjectDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        clientData.DueStartDateFilter = odataStartDate;
        clientData.DueEndDateFilter = odataEndDate;
    }

    return filterResults;
}
