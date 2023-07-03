import libCom from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import phaseFilterResult from '../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';


export default function WorkOrderListFilterResults(context) {
    
    let result1 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PriorityFilter/#Value');
    let result4 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:FavoriteFilter/#Value');
    let result5 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MyWorkordersFilter/#Value');
    let result6 = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:TypeFilter/#FilterValue');
    let assignments = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:AssignmentFilter/#Value');

    let reqDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');

    let filterResults = [result1, result2, result3, result5, result6];
    
    if (assignments.length > 0) { //Assignee rows for supervisor selected
        libCom.setStateVariable(context, 'SupervisorAssignmentFilter', assignments); //Save for defaulting on filter page when opened
        let lines = [];
        let selected = [];
        let unassigned = '';
        let filter;

        for (let i = 0; i < assignments.length; i++) {
            let row = assignments[i];
            let target = row.ReturnValue;
            if (target === '00000000') { //Unassigned
                unassigned = "not sap.entityexists(WOPartners) or WOPartners/all(w: w/PartnerFunction ne 'VW')";
            } else {
                //lines.push("WOPartners/Employee_Nav/any(t: t/PersonnelNumber eq '" + target + "')");
                lines.push("wp/PersonnelNum eq '" + target + "'");
            }
            selected.push(target);
        }
        libCom.setStateVariable(context, 'SupervisorAssignmentFilter', selected); //Save for defaulting on filter page when opened
        let line2 = "WOPartners/any(wp : wp/PartnerFunction eq 'VW' and (";
        //Build the array of people into a single filter statement
        if (lines.length > 0) { //At least 1 person
            filter = [line2 + lines.join(' or ') + '))'];
            if (unassigned) {
                filter = ['(' + unassigned + ') or (' + filter[0] + ')']; //Handle unassigned and assigned at same time
            }
        } else { //Only unassigned
            filter = [unassigned];
        }
        let filterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, filter, true);
        filterResults.push(filterResult);
    }

    if (IsPhaseModelEnabled(context)) {
        let phase = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) {
            filterResults.push(result);
        }
    }

    if (reqDateSwitch.getValue() === true) {
        let startDate = libCom.getFieldValue(context, 'ReqStartDateFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);
    
        let endDate = libCom.getFieldValue(context, 'ReqEndDateFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);
    
        let dateFilter = ["RequestStartDate ge datetime'" + odataStartDate + "' and RequestStartDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
        clientData.reqDateSwitch = reqDateSwitch.getValue();
        clientData.reqStartDate = odataStartDate;
        clientData.reqEndDate = odataEndDate;
    }

    if (dueDateSwitch.getValue() === true) {
        let startDate = libCom.getFieldValue(context, 'DueStartDateFilter');
        let sdate = (startDate === '') ? new Date() : new Date(startDate);
        let odataDate = new ODataDate(sdate);
        let odataStartDate =  odataDate.toDBDateString(context);

        let endDate = libCom.getFieldValue(context, 'DueEndDateFilter');
        let edate = (endDate === '') ? new Date() : new Date(endDate);
        odataDate = new ODataDate(edate);
        let odataEndDate =  odataDate.toDBDateString(context);

        let dateFilter = ["DueDate ge datetime'" + odataStartDate + "' and DueDate le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
        clientData.dueDateSwitch = dueDateSwitch.getValue();
        clientData.dueStartDate = odataStartDate;
        clientData.dueEndDate = odataEndDate;
    }

    if (result4 && result4.filterItems.length) {
        let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, 'MarkedJob/PreferenceValue', undefined, ['true'], false, '', [context.localizeText('Favorite')]);
        filterResults.push(filter);
    }

    return filterResults;
}

