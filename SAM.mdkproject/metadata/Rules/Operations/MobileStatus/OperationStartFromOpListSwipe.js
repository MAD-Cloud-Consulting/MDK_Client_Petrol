import libOprMobile from './OperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function OperationStartFromOpListSwipe(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));
    
    //Save the operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCommon.setBindingObject(context);
	
	//Set ChangeStatus property to 'Started'.
	//ChangeStatus is used by OperationMobileStatusFailureMessage.action & OperationMobileStatusSuccessMessage.action
	context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    return libOprMobile.startOperation(context).then(() => {
        return libAutoSync.autoSyncOnStatusChange(context);
    }).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
}
