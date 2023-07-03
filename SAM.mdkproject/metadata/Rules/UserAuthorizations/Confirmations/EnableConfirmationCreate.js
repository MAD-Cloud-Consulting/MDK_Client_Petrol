/**
* Show/hide create Confirmation button based on user authorizations
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableConfirmationCreate(context) {
    return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Conf.Create') === 'Y';
}
