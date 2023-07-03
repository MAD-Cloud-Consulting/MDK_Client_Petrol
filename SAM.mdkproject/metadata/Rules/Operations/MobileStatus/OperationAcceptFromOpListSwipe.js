import libOprMobile from './OperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function OperationAcceptFromOpListSwipe(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));
    
    //Save the operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCommon.setBindingObject(context);
	
	//Set ChangeStatus property to 'Accepted'.
	//ChangeStatus is used by OperationMobileStatusFailureMessage.action & OperationMobileStatusSuccessMessage.action
	let mobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
	context.getPageProxy().getClientData().ChangeStatus = mobileStatus;

    return libOprMobile.changeOperationStatusFSM(context, mobileStatus).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
        delete context.getPageProxy().getClientData().ChangeStatus;
    });
}
