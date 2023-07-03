/**
* Show/Hide Equipment edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';

export default function EnableEquipmentEdit(context) {
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Edit') === 'Y');
}
