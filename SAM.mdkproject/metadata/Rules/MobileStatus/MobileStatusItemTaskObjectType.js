/**
* Describe this function...
* @param {IClientAPI} context
*/
import {GlobalVar} from '../Common/Library/GlobalCommon';

export default function MobileStatusSetReceivedObjectType() {
    let mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.NotificationItemTask;
    return mobileStatusObjectType;
}
