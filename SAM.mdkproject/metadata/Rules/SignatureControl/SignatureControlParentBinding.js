import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import IsCompleteAction from '../WorkOrders/Complete/IsCompleteAction';

export default function SignatureControlParentBinding(context) {

    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let previousPageClientData = previousPage.getClientData();
    let parent = libVal.evalIsEmpty(previousPageClientData.currentObject) ? previousPage.binding : previousPageClientData.currentObject;

    ///Get context menu binding 
    if (libCommon.getStateVariable(context, 'ContextMenuBindingObject')) {
        parent = libCommon.getStateVariable(context, 'ContextMenuBindingObject');
    }

    if (libVal.evalIsEmpty(parent) && !libVal.evalIsEmpty(previousPageClientData.confirmationArgs)) {
        parent = previousPageClientData.confirmationArgs;
    }

    if (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation') {
        if (!libVal.evalIsEmpty(parent) && !libVal.evalIsEmpty(parent.OperationObject)) {
            parent = parent.OperationObject;
        } else if (!libVal.evalIsEmpty(parent) && parent['@odata.type'] === '#sap_mobile.ConfirmationOverviewRow') {
            parent = libCommon.getStateVariable(context, 'ServiceReportData');
        } else if (!libVal.evalIsEmpty(parent) && parent.isOperationsList) {
            parent = libCommon.getStateVariable(context, 'ServiceReportData');
        }
    }

    if (libCommon.getWorkOrderAssnTypeLevel(context) === 'Header') {
        if (!libVal.evalIsEmpty(parent) && parent['@odata.type'] === '#sap_mobile.ConfirmationOverviewRow') {
            parent = libCommon.getStateVariable(context, 'ServiceReportData');
        } else if (!libVal.evalIsEmpty(parent) && parent.data) {
            parent = libCommon.getStateVariable(context, 'ServiceReportData');
        }
    }

    if (parent && libVal.evalIsEmpty(parent['@odata.type']) && !libVal.evalIsEmpty(parent.WorkOrderHeader)) {
        parent = parent.WorkOrderHeader;
    }

    if (IsCompleteAction(context)) {
        parent = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    }

    if (libVal.evalIsEmpty(parent)) {
        parent = libCommon.getStateVariable(context, 'ServiceReportData');
    }

    return parent;
}
