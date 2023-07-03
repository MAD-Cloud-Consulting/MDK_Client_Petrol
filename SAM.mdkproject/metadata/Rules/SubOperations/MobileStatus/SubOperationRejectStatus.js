import libSubOprMobile from './SubOperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function SubOperationRejectStatus(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));
    
    //Save the sub-operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCommon.setBindingObject(context);
	
	//Set ChangeStatus property to 'Rejected'.
	//ChangeStatus is used by SubOperationMobileStatusFailureMessage.action & SubOperationMobileStatusSuccessMessage.action
    const status = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
    context.getPageProxy().getClientData().ChangeStatus = status;

    return libSubOprMobile.changeSubOperationStatusFSM(context, status).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
    
}
