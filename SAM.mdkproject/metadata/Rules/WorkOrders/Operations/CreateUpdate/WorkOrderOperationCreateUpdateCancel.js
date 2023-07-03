import libCom from '../../../Common/Library/CommonLibrary';
import CheckForChangesBeforeCancel from '../../../Common/CheckForChangesBeforeCancel';

export default function WorkOrderOperationCreateUpdateCancel(clientAPI) {

    if (libCom.isOnWOChangeset(clientAPI)) {
        var messageText = clientAPI.localizeText('workorder_operation_update_cancel');
        var captionText = clientAPI.localizeText('confirm_cancel');
        return libCom.showWarningDialog(clientAPI, messageText, captionText).then( result => {
            if (result === true) {
                libCom.setOnChangesetFlag(clientAPI, false);
                clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
            }
        });
    } else {
        libCom.setOnChangesetFlag(clientAPI, false);
        // clientAPI.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
        CheckForChangesBeforeCancel(clientAPI);
    }
}
