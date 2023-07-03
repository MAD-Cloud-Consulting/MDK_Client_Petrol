import filterOnLoaded from '../Filter/FilterOnLoaded';
import libCom from '../Common/Library/CommonLibrary';

export default function NotificationFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');

    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    let clientData = context.evaluateTargetPath('#Page:NotificationsListViewPage/#ClientData');
    let creationDateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');

    if (clientData && clientData.creationDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:StartDateFilter');
        let endDateControl = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:EndDateFilter');

        creationDateSwitch.setValue(clientData.creationDateSwitch);
        startDateControl.setValue(clientData.startDate);
        endDateControl.setValue(clientData.endDate);

        startDateControl.setVisible(clientData.creationDateSwitch);
        endDateControl.setVisible(clientData.creationDateSwitch);
    }
}

