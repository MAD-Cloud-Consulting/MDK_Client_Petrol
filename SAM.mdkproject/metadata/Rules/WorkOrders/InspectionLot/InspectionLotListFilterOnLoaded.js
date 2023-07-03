import libCom from '../../Common/Library/CommonLibrary';
import filterOnLoaded from '../../Filter/FilterOnLoaded';
import InspectionLotConstants from './InspectionLotLibrary';

export default function InspectionLotListFilterOnLoaded(context) {
    filterOnLoaded(context); //Run the default filter on loaded
 
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');

    if (clientData && clientData.dueDateSwitch !== undefined) {
        let dueDateSwitch = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueDateSwitch');
        let dueStartDateControl = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueStartDateFilter');
        let dueEndDateControl = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:DueEndDateFilter');

        dueDateSwitch.setValue(clientData.dueDateSwitch);
        dueStartDateControl.setValue(clientData.dueStartDate);
        dueEndDateControl.setValue(clientData.dueEndDate);

        dueStartDateControl.setVisible(clientData.dueDateSwitch);
        dueEndDateControl.setVisible(clientData.dueDateSwitch);
    }

    let operationFilter = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:OperationFilter');

    if (clientData && clientData.workOrderFilter !== undefined) {
        let workOrderSelection = clientData.workOrderFilter;
        let workOrderFilter = context.evaluateTargetPath('#Page:InspectionLotFilterPage/#Control:WorkOrderFilter');
        workOrderFilter.setValue(workOrderSelection);

        libCom.setFormcellEditable(operationFilter);
        let entity = "MyWorkOrderHeaders('" + workOrderSelection + "')/Operations";
        let filter = '$orderby=OperationNo&$filter=sap.entityexists(EAMChecklist_Nav)';
        let pageProxy = context.getPageProxy();
        let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
        return InspectionLotConstants.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            if (clientData.operationFilter !== undefined) {
                operationFilter.setValue(clientData.operationFilter);
            }
            return Promise.resolve(true);
        });
    } else {
        if (context.binding && context.binding.OrderId) {
            let entity = "MyWorkOrderHeaders('" + context.binding.OrderId + "')/Operations";
            let filter = '$orderby=OperationNo&$filter=sap.entityexists(EAMChecklist_Nav)';
            let pageProxy = context.getPageProxy();
            let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
            return InspectionLotConstants.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
                if (clientData.operationFilter !== undefined) {
                    operationFilter.setValue(clientData.operationFilter);
                }
                return Promise.resolve(true);
            });
        } else {
            libCom.setFormcellNonEditable(operationFilter);
        }
    }
}
