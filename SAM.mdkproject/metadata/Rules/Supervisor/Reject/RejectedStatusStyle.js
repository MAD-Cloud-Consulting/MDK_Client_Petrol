import libCom from '../../Common/Library/CommonLibrary';

export default function RejectedStatusStyle(context) {

    //var rejected = 'REJECTED';
    let rejected = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    let status;
    let binding = context.binding;

    if (binding) {
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            if (binding.OrderMobileStatus_Nav) {
                status = context.binding.OrderMobileStatus_Nav.MobileStatus;
            }    
        }
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            if (binding.OperationMobileStatus_Nav) {
                status = context.binding.OperationMobileStatus_Nav.MobileStatus;
            }    
        }
        if (status === rejected) {
            return 'ResetRed';
        } 
    }
    return '';
}   
