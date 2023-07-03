import libCom from './Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) {
    libCom.clearFromClientData(context, 'BOMPartAdd', false);
    libCom.getStateVariable(context, 'LAMDefaultRow');
    if (libCom.unsavedChangesPresent(context) && !libCom.isDefined(libCom.getStateVariable(context, 'LAMDefaultRow'))) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        libCom.setOnCreateUpdateFlag(context, '');
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
