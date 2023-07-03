import libCom from '../../Common/Library/CommonLibrary';
/**
* Rule which is used to clear state variable before closing the page
* @param {IClientAPI} context
*/
export default function ClearStateAndExit(context) {
    libCom.setStateVariable(context, 'SearchStringOnline', '');
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
