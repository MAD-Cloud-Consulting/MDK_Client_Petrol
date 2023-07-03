/**
* Show/Hide Work Order create button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import isPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function EnableWorkOrderCreate(context) {
    return !isPhaseModelEnabled(context) && libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Create') === 'Y';
}
