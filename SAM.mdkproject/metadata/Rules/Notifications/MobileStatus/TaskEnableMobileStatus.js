import libCommon from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

export default function TaskEnableMobileStatus(context) {

    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
        if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
            return false;
        }
    }

    var received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    var started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    var complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    let notifTaskMobileStatus = libMobile.getMobileStatus(context.binding, context);
    let notifMobileStatus  = libMobile.getMobileStatus(context.binding.Notification || context.binding.Item.Notification, context);

    if (notifMobileStatus === started) {
        if (notifTaskMobileStatus === received || notifTaskMobileStatus === started) {
            return true;
        } else if (notifTaskMobileStatus === complete) {
            if (libCommon.isAppParameterEnabled(context, 'NOTIFICATION', 'TaskSuccess')) {
                return true;
            }
        }
    }
    return false;
}
