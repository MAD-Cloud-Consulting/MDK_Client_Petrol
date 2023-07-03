import libWOStatus from '../../MobileStatus/WorkOrderMobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';
import {isISUInstall} from '../../../Meter/ISUProcess';
import UserFeaturesLibrary from '../../../UserFeatures/UserFeaturesLibrary';

export default function AllowMeterCreate(context) {
    if (UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
        let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
        let isStartedPromise = null;
        switch (libCommon.getWorkOrderAssnTypeLevel(context)) {
            case 'Header':
                // Header level: Check the OrderMobileStatus, and return the resolved Promise.
                isStartedPromise = Promise.resolve(context.binding.OrderMobileStatus_Nav.MobileStatus === 'STARTED' || context.binding.MobileStatus === 'STARTED');
                break;
            case 'Operation':
                // Operation Level: Get a count of all of the Operations whose OperationMobileStatus is 'STARTED'. If count > 0, return true.
                isStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Operations', "$filter=OperationMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
                    return (count > 0);
                });
                break;
            case 'SubOperation':
                    // Suboperation Level: Get a count of all of the Operations who have a Sub-Operation whose SuboperationMobileStatus is 'STARTED'. If count > 0, return true.
                isStartedPromise = context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Operations', "$filter=SubOperations/any(subop : subop/SubOpMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
                    return (count > 0);
                });
                break;
            default:
                isStartedPromise = Promise.resolve(false);

        }
        return isStartedPromise.then(function(isStarted) {
            if (!isLocal && isStarted) {
                return libWOStatus.isOrderComplete(context).then(status => {
                    if (!status) {
                        if (isISUInstall(context.binding.OrderISULinks)) {
                            return true;
                        }
                        return false;
                    }
                    return false;
                });
            }
            return false;
        });
    } else {
        return Promise.resolve(false);
    }
}
