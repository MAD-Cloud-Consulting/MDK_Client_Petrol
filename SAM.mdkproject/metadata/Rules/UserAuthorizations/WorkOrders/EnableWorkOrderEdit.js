/**
* Show/Hide Work Order edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import libMobileStatus from '../../MobileStatus/MobileStatusLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import Logger from '../../Log/Logger';

export default function EnableWorkOrderEdit(context) {
    let binding = context.binding;
    let completeStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let reviewStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let rejectedStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    let completed = false;
    let enableOrLocal =  libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y' || libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    let mstatus;

    if (IsPhaseModelEnabled(context) && binding['@odata.type']=== '#sap_mobile.MyWorkOrderHeader') {
        return Promise.resolve(false);
    }

    if (!binding['@odata.type'] && context.getActionBinding) {
        binding = context.getActionBinding();
    }
    if (libVal.evalIsEmpty(binding)) {
        return Promise.resolve(enableOrLocal);
    }
    return libSuper.isBusinessObjectEditable(context).then(editable => {
        if (!editable) {
            return false; //Supervisor is enabled, user is a tech, work center assignments and this work order is not assigned to this user
        }
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                try {
                    mstatus = libMobileStatus.getMobileStatus(binding, context);
                } catch (err) {
                    Logger.error(`Failed to get mobile status: ${err}`);
                }
                if (mstatus) {
                    completed = (mstatus === completeStatus || mstatus === reviewStatus || mstatus === rejectedStatus);
                }
                break;
            case '#sap_mobile.MyWorkOrderOperation':
                if (libMobileStatus.isOperationStatusChangeable(context)) {
                    mstatus = libMobileStatus.getMobileStatus(binding, context);
                    completed = (mstatus === completeStatus || mstatus === reviewStatus || mstatus === rejectedStatus);
                    return libMobileStatus.isMobileStatusComplete(context, 'MyWorkOrderHeaders', context.binding.OrderId, '', true).then(status => {
                        if (status) { //already complete so exit
                            return false;
                        } else {
                            return (enableOrLocal && !completed);
                        }
                    }); 
                } else {
                    return libMobileStatus.isMobileStatusComplete(context, 'MyWorkOrderHeaders', context.binding.OrderId, '', true).then(status => {
                        if (status) { //already complete so exit
                            return false;
                        } else {
                            return libMobileStatus.isMobileStatusConfirmed(context).then(result => {
                                if (result) {
                                    return false;
                                } 
                                return (enableOrLocal && !completed);
                            });
                        }
                    });
                }
            case '#sap_mobile.MyWorkOrderSubOperation':
                if (libMobileStatus.isSubOperationStatusChangeable()) {
                    mstatus = libMobileStatus.getMobileStatus(binding, context);
                    completed = (mstatus === completeStatus || mstatus === reviewStatus || mstatus === rejectedStatus);
                } else {
                    let subOp = binding.SubOperationNo;
                    return libMobileStatus.isMobileStatusConfirmed(context, subOp).then(result => {
                        if (result) {
                            return false;
                        } 
                        return (enableOrLocal && !completed);
                        
                    });
                }
                break;
            default:
                break;
        }
        return (enableOrLocal && !completed);
    });
}
