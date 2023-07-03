import libCom from '../../Common/Library/CommonLibrary';
import FilterReset from '../../Filter/FilterReset';

export default function InspectionLotListFilterReset(context) {
    let operationFilter = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:OperationFilter');
    if (context.binding && context.binding.OrderId) {
        operationFilter.setValue('');
    } else {
        libCom.setFormcellNonEditable(operationFilter);
    }

    let workOrderFilter = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:WorkOrderFilter');
    workOrderFilter.setValue('');

    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');

    if (clientData && clientData.valuationStatus !== undefined) {
        clientData.valuationStatus = undefined;
    }

    if (clientData && clientData.workOrderFilter !== undefined) {
        clientData.workOrderFilter = undefined;
    }

    if (clientData && clientData.operationFilter !== undefined) {
        clientData.operationFilter = undefined;
    }

    if (clientData && clientData.dueDateSwitch !== undefined) {
        clientData.dueDateSwitch = undefined;
        clientData.dueStartDate = '';
        clientData.dueEndDate = '';
    }

    FilterReset(context);
}
