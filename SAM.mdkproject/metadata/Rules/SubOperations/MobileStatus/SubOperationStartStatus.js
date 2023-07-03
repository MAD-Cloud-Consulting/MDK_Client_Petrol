import libSubOprMobile from './SubOperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function SubOperationStartStatus(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));
    
    //Save the sub-operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCommon.setBindingObject(context);
	
	//Set ChangeStatus property to 'Started'.
	//ChangeStatus is used by SubOperationMobileStatusFailureMessage.action & SubOperationMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) && context.binding.WorkOrderOperation.WOHeader.OrderISULinks && context.binding.WorkOrderOperation.WOHeader.OrderISULinks.length > 0) {
        let isuProcess = context.binding.WorkOrderOperation.WOHeader.OrderISULinks[0].ISUProcess;
        if (isuProcess === 'DISCONNECT' || isuProcess === 'RECONNECT') {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.WorkOrderOperation.WOHeader.DisconnectActivity_Nav[0]['@odata.readLink'], [], '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav').then ((result) => {
                let actionBinding;
                if (result && result.getItem(0)) {
                    actionBinding = result.getItem(0);
                    actionBinding.MyWorkOrderSubOperation = context.binding;
                    context.setActionBinding(actionBinding);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action');
                } else {
                    return false;
                }

            });
        }
    }
    return libSubOprMobile.startSubOperation(context).then(() => {
        return libAutoSync.autoSyncOnStatusChange(context);
    }).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
    
}
