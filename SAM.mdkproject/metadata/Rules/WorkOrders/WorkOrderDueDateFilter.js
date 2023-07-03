/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderDueDateFilter(context) {
    let dueDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueDateSwitch');
    let startDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueStartDateFilter');
    let endDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:DueEndDateFilter');

    startDateControl.setVisible(dueDateSwitch.getValue());
    endDateControl.setVisible(dueDateSwitch.getValue());

    startDateControl.redraw();
    endDateControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    clientData.dueDateSwitch = dueDateSwitch.getValue();
}

