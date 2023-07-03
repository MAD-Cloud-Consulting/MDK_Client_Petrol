import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';

export default function TaskMobileStatusToolBarCaption(context) {
    var received = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    var started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    var complete = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    var success = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
    let notifTaskMobileStatus = libMobile.getMobileStatus(context.binding, context);
    let notifMobileStatus = libMobile.getMobileStatus(context.binding.Notification || context.binding.Item.Notification, context);

    if (notifMobileStatus === started) {
        if (notifTaskMobileStatus === received) {
            return context.localizeText('start_task');
        } else if (notifTaskMobileStatus === started) {
            return context.localizeText('end_task');
        } else if (notifTaskMobileStatus === complete) {
            if (libComm.isAppParameterEnabled(context, 'NOTIFICATION', 'TaskSuccess')) {
                return context.localizeText('task_success');
            } else {
                return context.localizeText('end_task');
            }
        } else if (notifTaskMobileStatus === success) {
            return context.localizeText('success');
        }
    }
    return context.localizeText(notifTaskMobileStatus);
}
