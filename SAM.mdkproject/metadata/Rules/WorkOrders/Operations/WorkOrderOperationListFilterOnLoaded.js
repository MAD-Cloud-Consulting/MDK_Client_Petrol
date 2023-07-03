import filterOnLoaded from '../../Filter/FilterOnLoaded';
import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationListFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded

    let phaseFilter = libCom.getStateVariable(context, 'PhaseFilter');
    if (phaseFilter) {
        let phaseControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:PhaseFilter');
        phaseControl.setValue(phaseFilter);
    }

    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');
    let scheduledEarliestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateSwitch');
    let scheduledEarliestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateSwitch');
    let scheduledLatestStartDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateSwitch');
    let scheduledLatestEndDateSwitch = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateSwitch');
    
    if (clientData && clientData.scheduledEarliestStartDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestStartDateEndFilter');

        scheduledEarliestStartDateSwitch.setValue(clientData.scheduledEarliestStartDateSwitch);
        startDateControl.setValue(clientData.scheduledEarliestStartDateStart);
        endDateControl.setValue(clientData.scheduledEarliestStartDateEnd);

        startDateControl.setVisible(clientData.scheduledEarliestStartDateSwitch);
        endDateControl.setVisible(clientData.scheduledEarliestStartDateSwitch);
    }

    if (clientData && clientData.scheduledEarliestEndDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledEarliestEndDateEndFilter');

        scheduledEarliestEndDateSwitch.setValue(clientData.scheduledEarliestEndDateSwitch);
        startDateControl.setValue(clientData.scheduledEarliestEndDateStart);
        endDateControl.setValue(clientData.scheduledEarliestEndDateEnd);

        startDateControl.setVisible(clientData.scheduledEarliestEndDateSwitch);
        endDateControl.setVisible(clientData.scheduledEarliestEndDateSwitch);
    }

    if (clientData && clientData.scheduledLatestStartDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestStartDateEndFilter');

        scheduledLatestStartDateSwitch.setValue(clientData.scheduledLatestStartDateSwitch);
        startDateControl.setValue(clientData.scheduledLatestStartDateStart);
        endDateControl.setValue(clientData.scheduledLatestStartDateEnd);

        startDateControl.setVisible(clientData.scheduledLatestStartDateSwitch);
        endDateControl.setVisible(clientData.scheduledLatestStartDateSwitch);
    }

    if (clientData && clientData.scheduledLatestEndDateSwitch !== undefined) {
        let startDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateStartFilter');
        let endDateControl = context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:ScheduledLatestEndDateEndFilter');

        scheduledLatestEndDateSwitch.setValue(clientData.scheduledLatestEndDateSwitch);
        startDateControl.setValue(clientData.scheduledLatestEndDateStart);
        endDateControl.setValue(clientData.scheduledLatestEndDateEnd);

        startDateControl.setVisible(clientData.scheduledLatestEndDateSwitch);
        endDateControl.setVisible(clientData.scheduledLatestEndDateSwitch);
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:WorkOrderOperationsFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }
}

