import libCom from '../../../Common/Library/CommonLibrary';

export default function CheckForChangesBeforeCancel(context) {

    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Page/ConfirmCancelPage.action');
    } else {
        libCom.setOnCreateUpdateFlag(context, '');
        libCom.removeStateVariable(context, 'PIDocumentItemsMap');
        return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
    }
}
