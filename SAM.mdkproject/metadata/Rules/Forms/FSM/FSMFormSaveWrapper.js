import libCom from '../../Common/Library/CommonLibrary';
import FSMFormSave from './FSMFormSave';

export default function FSMFormSaveWrapper(context) {
    libCom.setStateVariable(context, 'FSMClosedFlag', false); //Set the closed flag for updating instance to backend
    libCom.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_draft_toast'));
    return FSMFormSave(context);
}
