import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';
import InspectionLotLibrary from './InspectionLotLibrary';

export default function InspectionLotWorkOrderFilterOnValueChange(context) {
    let pageProxy = context.getPageProxy();
    let selection = context.getValue()[0] ? "MyWorkOrderHeaders('" + context.getValue()[0].ReturnValue + "')" : '';
    let woListPickerProxy = libCom.getControlProxy(pageProxy, 'WorkOrderFilter');
    let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
    let clientData = context.evaluateTargetPath('#Page:InspectionLotListViewPage/#ClientData');

    // No order, so disable and empty op pickers
    if (libEval.evalIsEmpty(selection)) {
        clientData.workOrderFilter = undefined;
        woListPickerProxy.setValue('');
        opListPickerProxy.setValue('');
        libCom.setFormcellNonEditable(opListPickerProxy);
        let entity = 'MyWorkOrderOperations';
        let filter = "$filter=OperationNo eq ''";
        return InspectionLotLibrary.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            libCom.setFormcellNonEditable(opListPickerProxy);
            return Promise.resolve(true);                      
        });
    } else { // Populate op picker from chosen order
        clientData.workOrderFilter = context.getValue()[0].ReturnValue;
        libCom.setFormcellEditable(opListPickerProxy);
        let entity = selection + '/Operations';
        let filter = '$orderby=OperationNo&$filter=sap.entityexists(EAMChecklist_Nav)';

        return InspectionLotLibrary.setOperationSpecifier(opListPickerProxy, entity, filter).then(() => {
            return Promise.resolve(true);
        });
    }
}
