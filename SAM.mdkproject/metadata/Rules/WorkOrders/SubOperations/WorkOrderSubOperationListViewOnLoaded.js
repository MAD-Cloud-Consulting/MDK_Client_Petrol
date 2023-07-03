import HideActionItems from '../../Common/HideActionItems';
import SubOperationListViewOnLoad from './SubOperationListViewOnLoad';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderSubOperationListViewOnLoaded(context) {

    libCommon.setStateVariable(context, 'SUBOPERATIONS_FILTER', '');
 
    return SubOperationListViewOnLoad(context).then(function() {
        let completed = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        if (context.binding.SubOpMobileStatus_Nav.MobileStatus === completed) {
            HideActionItems(context, 1);
        }
    });
}
