import libCommon from '../../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeLAM(context) {
    var timeData = WorkOrderCompletionLibrary.getStep(context, 'time');

    if (timeData && timeData.lam) {
        libCommon.setStateVariable(context, 'LAMDefaultRow', timeData.lam);
        libCommon.setStateVariable(context, 'LAMCreateType', 'Confirmation');
        libCommon.setStateVariable(context, 'LAMConfirmationReadLink', timeData.link);
        libCommon.setStateVariable(context, 'TransactionType', 'CREATE');
    
        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
    }
}
