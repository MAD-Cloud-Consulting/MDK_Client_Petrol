/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function NotificationCreationDateFilter(context) {
    let creationDateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');
    let startDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:StartDateFilter');
    let endDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:EndDateFilter');

    startDateControl.setVisible(creationDateSwitch.getValue());
    endDateControl.setVisible(creationDateSwitch.getValue());

    startDateControl.redraw();
    endDateControl.redraw();

    // persist the date filter values
    let clientData = context.evaluateTargetPath('#Page:NotificationsListViewPage/#ClientData');
    clientData.creationDateSwitch = creationDateSwitch.getValue();
}

