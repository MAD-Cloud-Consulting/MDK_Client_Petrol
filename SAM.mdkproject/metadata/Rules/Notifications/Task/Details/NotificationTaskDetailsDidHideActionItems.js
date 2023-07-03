import HideActionItems from '../../../Common/HideActionItems';
import TaskStatusLib from '../TaskMobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationTaskDetailsDidHideActionItems(context) {

    return TaskStatusLib.getMobileStatus(context).then(status => {
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        let success = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
        if (status === completed || status === success) {
            HideActionItems(context, 2);
            return true;            
        }
        return false;
    }, () => {
        return false;
    });
}
