import libCom from '../../Common/Library/CommonLibrary';
import cleanClientData from './CharacteristicCleanUp';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeCancel(context) {
    if (libCom.unsavedChangesPresent(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/ConfirmCancel.action');
    } else {
        libCom.setOnCreateUpdateFlag(context, '');
        cleanClientData(context);
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
}
