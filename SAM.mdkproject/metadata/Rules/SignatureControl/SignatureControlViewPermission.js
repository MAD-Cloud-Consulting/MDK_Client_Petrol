import libCommon from '../Common/Library/CommonLibrary';
import Logger  from '../Log/Logger';
import libVal from '../Common/Library/ValidationLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
/**
* Check if the Signature Control is enabled and set the client data to keep track
* @param {IClientAPI} context
*/
export default function SignatureControlViewPermission(context, mobileStatus) {
    let isSignatureEnabled = false;
    libCommon.setStateVariable(context, 'ContextMenuBindingObject', null);
    let reviewStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let rejectedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());

    if (libMobile.isHeaderStatusChangeable(context)) {
        isSignatureEnabled = !libVal.evalIsEmpty(libCommon.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete')) && (libCommon.getAppParam(context, 'SIGN_CAPTURE', 'WO.Complete') !== 'N');
        if (isSignatureEnabled) { //Check if this work order is in review status and supervisor has signature flag
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                isSignatureEnabled = libSuper.isSupervisorSignatureEnabled(context);
            }
        }
    } else if (libMobile.isOperationStatusChangeable(context)) {
        isSignatureEnabled = !libVal.evalIsEmpty(libCommon.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete')) && (libCommon.getAppParam(context, 'SIGN_CAPTURE', 'OP.Complete') !== 'N');
        if (isSignatureEnabled) { //Check if this work order is in review status and supervisor has signature flag
            if (mobileStatus && (mobileStatus === reviewStatus || mobileStatus === rejectedStatus)) {
                isSignatureEnabled = libSuper.isSupervisorSignatureEnabled(context);
            }
        }
    } else if (libMobile.isSubOperationStatusChangeable(context)) {
        isSignatureEnabled = !libVal.evalIsEmpty(libCommon.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete')) && (libCommon.getAppParam(context, 'SIGN_CAPTURE', 'SubOp.Complete') !== 'N');
    }
    if (isSignatureEnabled) { 
        if (!context.getPageProxy().getClientData().didShowSignControl) { // set the flag to avoid showing it again when adding time
            libCommon.setStateVariable(context, 'LAMSignature', true);
            ///check if signature creation was called from context menu
            if (context.getPageProxy().getExecutedContextMenuItem()) {
                libCommon.setStateVariable(context, 'ContextMenuBindingObject', context.getPageProxy().getExecutedContextMenuItem().getBinding());
            }
            return context.executeAction('/SAPAssetManager/Actions/SignatureControl/View/SignatureControlView.action').then(() => {
               return context.getPageProxy().getClientData().didShowSignControl = true; // set the flag to avoid showing it again when adding time
            }).catch(err => {
                context.dismissActivityIndicator();
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySignature.global').getValue(), err);
                return Promise.reject(false);
            });
        }
    }
    // If the Signature Control parameters is not present, by default it is not required so we will proceed
    return Promise.resolve(true);
}
