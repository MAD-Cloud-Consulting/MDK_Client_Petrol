import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function SubOperationEnableMobileStatus(context) {

    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
        if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
            return false;
        }
    }

    var started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    var transfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    var complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    var rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    let mobileStatus = libMobile.getMobileStatus(context.getBindingObject(), context);

    if (libMobile.isSubOperationStatusChangeable(context)) {
        if (mobileStatus === transfer || mobileStatus === complete || mobileStatus === rejected) {
            return false;
        } else if (mobileStatus === started) {
            return true;
        } else {
            let isAnyOtherWorkOrderStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${started}'`);
            return isAnyOtherWorkOrderStartedPromise.then(isAnyOperationStarted => {
                if (isAnyOperationStarted > 0 && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    } else if (libMobile.isOperationStatusChangeable(context)) {
        //Enable sub-operation status changes only if operation is started.
        let operationObj = context.getBindingObject().WorkOrderOperation;
        if (operationObj) {
            mobileStatus = libMobile.getMobileStatus(operationObj, context);
            return mobileStatus === started;
        }
    } else {
        let headerMobileStatus = libMobile.getMobileStatus(context.binding.WorkOrderOperation.WOHeader, context);
        return headerMobileStatus === started;
    }
}
