import libCom from './Library/CommonLibrary';
import ClearFlagsAndClose from '../Crew/ClearFlagsAndClose';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import GetCloseOrCancelAction from './GetCloseOrCancelAction';
/**
* Check for unsaved changes before closing or canceling a page
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeClose(context) { 
    const confirmCrewCancelAction = '/SAPAssetManager/Actions/Crew/ConfirmCancel.action';
    const unsavedChanges = libCom.unsavedChangesPresent(context);
    const finalAction = GetCloseOrCancelAction(context, unsavedChanges);

    if (unsavedChanges) {
        let action = userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue()) ? confirmCrewCancelAction : finalAction;
        return context.executeAction(action);
    } else if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return ClearFlagsAndClose(context);
    } else {
        // proceed with cancel without asking
        return context.executeAction(finalAction);
    }
}
