import libCom from './Library/CommonLibrary';

/**
* Determine whether to cancel or complete pending actions on canceling modal 
*/
export default function GetCloseOrCancelAction(context, unsavedChanges = false) {
    const closePageAction = '/SAPAssetManager/Actions/Page/ClosePage.action';
    const cancelPageAction = '/SAPAssetManager/Actions/Page/CancelPage.action';
    const confirmClosePageAction = '/SAPAssetManager/Actions/Page/ConfirmClosePage.action';
    const confirmCancelPageAction = '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action';
    const doCancel = !!libCom.getStateVariable(context, 'IsOnRejectOperation');

    if (unsavedChanges) {
        return doCancel ? confirmCancelPageAction : confirmClosePageAction;
    } else {
        return doCancel ? cancelPageAction : closePageAction;
    }
}
