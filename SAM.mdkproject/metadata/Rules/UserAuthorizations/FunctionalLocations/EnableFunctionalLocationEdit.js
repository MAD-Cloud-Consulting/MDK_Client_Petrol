/**
* Show/Hide Functional Location edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableFunctionalLocationEdit(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Edit') === 'Y');
}
