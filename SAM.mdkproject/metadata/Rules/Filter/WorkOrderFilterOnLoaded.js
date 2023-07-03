import filterOnLoaded from '../Filter/FilterOnLoaded';
import libCom from '../Common/Library/CommonLibrary';

export default function WorkOrderFilterOnLoaded(context) {
    
    filterOnLoaded(context); //Run the default filter on loaded
    let filter = libCom.getStateVariable(context, 'SupervisorAssignmentFilter');
    if (filter) { //Default the assigbnment filter values
        let formCellContainer = context.getControl('FormCellContainer');
        let assignControl = formCellContainer.getControl('AssignmentFilter');
        assignControl.setValue(filter);
        libCom.removeStateVariable(context, 'SupervisorAssignmentFilter');
    }

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');
    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    let reqDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');

    if (clientData && clientData.reqDateSwitch !== undefined) {
        let reqStartDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqStartDateFilter');
        let reqEndDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqEndDateFilter');

        reqDateSwitch.setValue(clientData.reqDateSwitch);
        reqStartDateControl.setValue(clientData.reqStartDate);
        reqEndDateControl.setValue(clientData.reqEndDate);

        reqStartDateControl.setVisible(clientData.reqDateSwitch);
        reqEndDateControl.setVisible(clientData.reqDateSwitch);
    }

    if (clientData && clientData.dueDateSwitch !== undefined) {
        let dueStartDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueStartDateFilter');
        let dueEndDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueEndDateFilter');

        dueDateSwitch.setValue(clientData.dueDateSwitch);
        dueStartDateControl.setValue(clientData.dueStartDate);
        dueEndDateControl.setValue(clientData.dueEndDate);

        dueStartDateControl.setVisible(clientData.dueDateSwitch);
        dueEndDateControl.setVisible(clientData.dueDateSwitch);
    }

    let sortFilter = context.getControl('FormCellContainer').getControl('SortFilter');
    let sortFilterActiveItems = sortFilter.getValue().filterItems;
    if (sortFilterActiveItems.length === 0) { 
        sortFilter.setValue('Priority'); //Set default Sort By filter value
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }
}
