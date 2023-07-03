import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import libCom from '../../Common/Library/CommonLibrary';
import FSMFormSave from './FSMFormSave';

/**
* Reset the state varibales
* @param {IClientAPI} clientAPI
*/
export default function FSMFormClosePage(clientAPI) {
    return FSMFormSave(clientAPI).then(() => {
        if (libCom.getStateVariable(clientAPI, 'FSMToastMessage') === 'CANCELCLOSE') { //User canceled page close becuase data would be lost
            libCom.removeStateVariable(clientAPI, 'FSMToastMessage');
            return Promise.resolve();
        }
        libCom.removeStateVariable(clientAPI, ['FSMFormInstanceCurrentChapterIndex', 'OnLoaded', 'FSMFormInstanceChapters', 'FSMFormInstanceControls', 'FSMFormInstanceVisibilityRules', 'FSMFormInstanceControlsInVisibilityRules', 'ChapterValuesFilePath']);
        ApplicationSettings.remove(clientAPI,'XMLTemplateParsed');
        if (libCom.getStateVariable(clientAPI, 'FSMClosedFlag')) { //Done with this smartform, so remove the last chapter from permanent storage
            let id = libCom.getStateVariable(clientAPI, 'CurrentInstanceID');
            ApplicationSettings.remove(clientAPI, id + '_lastChapter');
        }
        libCom.removeStateVariable(clientAPI, 'FSMClosedFlag');
        return clientAPI.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            if (libCom.getStateVariable(clientAPI, 'FSMToastMessage')) { //Either display save or closed toast message
                return clientAPI.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action');
            }
            return Promise.resolve();
        });
    });
}
