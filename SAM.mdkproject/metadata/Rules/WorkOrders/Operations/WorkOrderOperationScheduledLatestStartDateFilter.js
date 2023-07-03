/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderOperationScheduledLatestStartDateFilter(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateStartFilter');
    let endControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateEndFilter');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    clientData.scheduledLatestStartDateSwitch = dateSwitch.getValue();
}
