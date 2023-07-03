import libCom from '../../Common/Library/CommonLibrary';
import FSMFormClosePage from './FSMFormClosePage';

export default function FSMFormClosePageWrapper(context) {
    libCom.setStateVariable(context, 'FSMClosedFlag', false); //Set the closed flag for updating instance to backend
    if (context.getPageProxy().binding.Closed) { //We are in read-only mode
        libCom.removeStateVariable(context, 'FSMToastMessage'); // Dont show update Toast Message for Closed form
    } else {
        libCom.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_saved_toast'));
    }
    return FSMFormClosePage(context);
}
