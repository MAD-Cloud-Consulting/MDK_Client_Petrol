import libWOMobile from './WorkOrderMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function WorkOrderStartStatus(context) {
    context.showActivityIndicator('');
    var isStatusChangeable = libMobile.isHeaderStatusChangeable(context);
    if (isStatusChangeable) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) && context.binding.OrderISULinks && context.binding.OrderISULinks.length > 0) {
            let isuProcess = context.binding.OrderISULinks[0].ISUProcess;
            if (isuProcess === 'DISCONNECT' || isuProcess === 'RECONNECT') {
                let queryOption = '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks';
                return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action', context.binding.DisconnectActivity_Nav[0]['@odata.readLink'], queryOption);
            }
        }
        return libWOMobile.startWorkOrder(context);
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
}
