import libCom from '../Common/Library/CommonLibrary';

export default function checklistViewNav(context) {

    //Make the checklist edit screen read-only for viewing purposes if the chosen checklist has already been completed in the backend
    const action = '/SAPAssetManager/Actions/Checklists/ChecklistViewNav.action';
    const actionContext = context.getPageProxy().getActionBinding();
    const target = libCom.getAppParam(context, 'CHECKLISTS', 'CompletedStatusText');
    let result;

    if (actionContext) {
        const statusText = actionContext.StatusText;
        if (statusText && statusText.trim() === target) {
            result = false;
        } else {
            result = true;
        }
    } else {
        result = false;
    }

    libCom.setStateVariable(context, 'AllowChecklistEdit', result);

    return context.executeAction(action);
}
