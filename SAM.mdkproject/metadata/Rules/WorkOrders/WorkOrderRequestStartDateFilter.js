/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderRequestStartDateFilter(context) {
    let reqDateSwitch = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:RequestStartDateSwitch');
    let startDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqStartDateFilter');
    let endDateControl = context.evaluateTargetPath('#Page:WorkOrderFilterPage/#Control:ReqEndDateFilter');

    startDateControl.setVisible(reqDateSwitch.getValue());
    endDateControl.setVisible(reqDateSwitch.getValue());

    startDateControl.redraw();
    endDateControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');
    clientData.reqDateSwitch = reqDateSwitch.getValue();
}

