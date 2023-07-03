/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderOperationScheduledEarliestEndDateFilter(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateStartFilter');
    let endControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateEndFilter');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    clientData.scheduledEarliestEndDateSwitch = dateSwitch.getValue();
}

