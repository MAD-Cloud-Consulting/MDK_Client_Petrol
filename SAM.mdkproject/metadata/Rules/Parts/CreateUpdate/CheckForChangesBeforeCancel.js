import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) {
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Parts/ConfirmCancel.action');
    } else {
        libCom.clearFromClientData(context, 'PartAdd', false);
        libCom.setOnCreateUpdateFlag(context, '');
        if (libCom.isOnChangeset(context)) {
            libCom.setOnChangesetFlag(context, false);
        }
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
