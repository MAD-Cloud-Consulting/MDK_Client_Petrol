import libCommon from '../../Common/Library/CommonLibrary';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
export default function WorkOrderMobileStatusSuccessMessage(context) {
    LocationUpdate(context);
    context.dismissActivityIndicator();
    var clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        //if (clientData["ChangeStatus"]) {
        var status = clientData.ChangeStatus;
        var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        var woHold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        var woTransfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        var woComplete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        var woReview = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        var woRejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        switch (status) {
            case woStarted:
                return context.localizeText('work_order_started');
            case woHold:
                return context.localizeText('work_order_on_hold');
            case woTransfer:
                return context.localizeText('work_order_transferred');
            case woComplete:
                return context.localizeText('work_order_completed');
            case woReview:
                return context.localizeText('workorder_review');
            case 'APPROVED':
                return context.localizeText('workorder_approved');
            case woRejected:
                return context.localizeText('workorder_rejected');
            default:
                return context.localizeText('status_updated');
        }
        // }
    }
    return context.localizeText('status_updated');
}
