/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderOperationScheduledLatestEndDateFilter(context) {
    let dateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateSwitch');
    let startControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateStartFilter');
    let endControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateEndFilter');

    startControl.setVisible(dateSwitch.getValue());
    endControl.setVisible(dateSwitch.getValue());

    startControl.redraw();
    endControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    clientData.scheduledLatestEndDateSwitch = dateSwitch.getValue();
}

