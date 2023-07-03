import libCom from '../../Common/Library/CommonLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOPStatus from '../../Operations/MobileStatus/OperationMobileStatusLibrary';

//Reject an operation as a supervisor
export default function RejectReasonNav(context) {
    
    libCom.setStateVariable(context, 'SupervisorRejectSuccess', false);
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Reject/RejectReasonNav.action').then(() => {
        if (libCom.getStateVariable(context, 'SupervisorRejectSuccess')) {
            return UpdateStatus(context);
        }
        return false;
    });
}

function UpdateStatus(context) {
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        libWOStatus.didSetWorkOrderRejected(context);
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        libOPStatus.didSetOperationRejected(context);
    }
    return Promise.resolve(true);
}
