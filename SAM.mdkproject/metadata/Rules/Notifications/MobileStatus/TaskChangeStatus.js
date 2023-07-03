import libTaskMobile from '../Task/TaskMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';

export default function TaskChangeStatus(context) {
    context.showActivityIndicator('');
    var started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    var received = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    var completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let notifTaskMobileStatus = libMobile.getMobileStatus(context.binding, context);
    let notifMobileStatus = libMobile.getMobileStatus(context.binding.Notification, context);

    if (notifMobileStatus === started) {
        if (notifTaskMobileStatus === received) {
            return libTaskMobile.startTask(context);
        } else if (notifTaskMobileStatus === started) {
            if (libComm.isAppParameterEnabled(context, 'NOTIFICATION', 'TaskSuccess')) {
                return libTaskMobile.completeTask(context);
            } else {
                return libTaskMobile.completeTaskWithoutSuccessFlag(context);
            }
        } else if (notifTaskMobileStatus === completed) {
            return libTaskMobile.successTask(context);
        }
    }
    context.dismissActivityIndicator();
    return '';
}
