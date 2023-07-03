import libCom from '../Common/Library/CommonLibrary';

export default function checklistUpdateAllowChecklistEdit(context) {

    if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.CL.Edit') === 'Y' || context.binding['@sap.isLocal']) {
        //Make the checklist edit screen read-only for viewing purposes if the chosen checklist has already been completed in the backend
        return libCom.getStateVariable(context, 'AllowChecklistEdit');
    } else {
        return false;
    }

}
