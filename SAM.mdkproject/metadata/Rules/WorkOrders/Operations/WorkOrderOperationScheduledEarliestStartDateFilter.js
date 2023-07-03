/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderOperationScheduledEarliestStartDateFilter(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateStartFilter');
    let endControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateEndFilter');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    clientData.scheduledEarliestStartDateSwitch = dateSwitch.getValue();
}
