
import FilterReset from '../../Filter/FilterReset';
import phaseFilterReset from '../../PhaseModel/PhaseModelFilterPickerReset';

export default function WorkOrderOperationListFilterReset(context) {
    phaseFilterReset(context, 'PhaseFilter');

    let clientData = context.evaluateTargetPath('#Page:WorkOrderOperationsListViewPage/#ClientData');

    if (clientData && clientData.scheduledEarliestStartDateSwitch !== undefined) {
        clientData.scheduledEarliestStartDateSwitch = undefined;
        clientData.scheduledEarliestStartDateStart = '';
        clientData.scheduledEarliestStartDateEnd = '';
    }

    if (clientData && clientData.scheduledEarliestEndDateSwitch !== undefined) {
        clientData.scheduledEarliestEndDateSwitch = undefined;
        clientData.scheduledEarliestEndDateStart = '';
        clientData.scheduledEarliestEndDateEnd = '';
    }

    if (clientData && clientData.scheduledLatestStartDateSwitch !== undefined) {
        clientData.scheduledLatestStartDateSwitch = undefined;
        clientData.scheduledLatestStartDateStart = '';
        clientData.scheduledLatestStartDateEnd = '';
    }

    if (clientData && clientData.scheduledLatestEndDateSwitch !== undefined) {
        clientData.scheduledLatestEndDateSwitch = undefined;
        clientData.scheduledLatestEndDateStart = '';
        clientData.scheduledLatestEndDateEnd = '';
    }

    FilterReset(context);
}

