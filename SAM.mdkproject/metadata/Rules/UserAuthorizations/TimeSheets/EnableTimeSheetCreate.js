/**
* Show/hide create Time Sheet button based on user authorizations
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function EnableTimeSheetCreate(context) {
        return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Cats.Create') === 'Y';
}
