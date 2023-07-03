import libOprMobile from './OperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

export default function OperationStartStatus(context) {
	//Set ChangeStatus property to 'Started'.
	//ChangeStatus is used by OperationMobileStatusFailureMessage.action & OperationMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) && context.binding.WOHeader.OrderISULinks && context.binding.WOHeader.OrderISULinks.length > 0) {
        let isuProcess = context.binding.WOHeader.OrderISULinks[0].ISUProcess;
        if (isuProcess === 'DISCONNECT' || isuProcess === 'RECONNECT') {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.WOHeader.DisconnectActivity_Nav[0]['@odata.readLink'], [], '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav').then ((result) => {
                let actionBinding;
                if (result && result.getItem(0)) {
                    actionBinding = result.getItem(0);
                    actionBinding.MyWorkOrderOperation = context.binding;
                    context.setActionBinding(actionBinding);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action');
                }

                return libOprMobile.startOperation(context).finally(() => {
                    delete context.getPageProxy().getClientData().ChangeStatus;
                });
            });
        }
    }
    return libOprMobile.startOperation(context).finally(() => {
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
}
