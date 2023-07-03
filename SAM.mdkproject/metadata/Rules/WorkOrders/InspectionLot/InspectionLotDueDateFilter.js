export default function InspectionLotDueDateFilter(context) {
    let dueDateSwitch = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueDateSwitch');
    let startDateControl = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueStartDateFilter');
    let endDateControl = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueEndDateFilter');

    startDateControl.setVisible(dueDateSwitch.getValue());
    endDateControl.setVisible(dueDateSwitch.getValue());

    startDateControl.redraw();
    endDateControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');
    clientData.dueDateSwitch = dueDateSwitch.getValue();
}
