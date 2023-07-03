import libCommon from '../../Common/Library/CommonLibrary';
export default function NotificationMobileStatusFailureMessage(context) {
    context.dismissActivityIndicator();
    var clientData = context.getClientData();
    if (clientData && clientData.ChangeStatus) {
        var status = clientData.ChangeStatus;
        var started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        var completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        switch (status) {
            case started:
                return context.localizeText('notification_cannot_be_started');
            case completed:
                return context.localizeText('notification_not_complete');
            default:
                return context.localizeText('status_cannot_be_updated');
        }
    }
    return context.localizeText('status_cannot_be_updated');
}
