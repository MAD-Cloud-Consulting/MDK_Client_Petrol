import HideActionItems from '../Common/HideActionItems';
import libCommon from '../Common/Library/CommonLibrary';

export default function SubOperationDidHideActionItems(context) {

    let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    if (context.binding.SubOpMobileStatus_Nav.MobileStatus === completed) {
        HideActionItems(context, 2);
        return true;
    }

    return false;
} 
