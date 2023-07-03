import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import WorkOrderMobileStatusLibrary from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddCheckIfObjectIsCompleted(context) {
    let binding = context.binding;
    let completeStatus = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    if (binding) {
        //Don't allow Mileage to be added to Completed WorkOrders and Completed/Confirmed Operations
        switch (binding['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader':
                return WorkOrderMobileStatusLibrary.headerMobileStatus(context).then(status => {
                    return status !== completeStatus;
                });
            case '#sap_mobile.MyWorkOrderOperation':
                if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
                    let status = MobileStatusLibrary.getMobileStatus(binding, context);
                    return Promise.resolve(status !== completeStatus);
                } else {
                    return MobileStatusLibrary.isMobileStatusComplete(context, 'MyWorkOrderHeaders', context.binding.OrderId, '', true).then(status => {
                        if (status) { //already complete so exit
                            return false;
                        } else {
                            return MobileStatusLibrary.isMobileStatusConfirmed(context).then(result => {
                                return !result;
                            });
                        }
                    });
                }
            default:
                break;
        }
    } else { //if binding object doesn't exist then doing this from side menu so allow 
        return Promise.resolve(true);
    }
}
