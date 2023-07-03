import libTaskMobile from '../Item/Task/ItemTaskMobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';

export default function ItemTaskChangeStatus(context) {
    context.showActivityIndicator('');
    var started = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    var received = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    var completed = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    return libTaskMobile.readHeaderMobileStatus(context).then(headerStatus => {
        if (headerStatus) {
            if (headerStatus === started) {
                return libTaskMobile.readTaskMobileStatus(context).then(status => {
                    if (status) {
                        if (status === received) {
                            return libTaskMobile.startTask(context);
                        } else if (status === started) {
                            if (libComm.getTaskSucessFlag(context) === 'Yes') {
                                return libTaskMobile.completeTask(context);
                            } else {
                                return libTaskMobile.completeTaskWithoutSuccessFlag(context);
                            }
                        } else if (status === completed) {
                            return libTaskMobile.successTask(context);
                        } else {
                            context.dismissActivityIndicator();
                            return '';
                        }
                    }
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusFailureMessage.action');
                });
            } else {
                context.dismissActivityIndicator();
                return '';
            }
        }
        context.dismissActivityIndicator();
        return '';
    });
}
