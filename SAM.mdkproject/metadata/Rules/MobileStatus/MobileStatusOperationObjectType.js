/**
* Describe this function...
* @param {IClientAPI} context
*/
import {GlobalVar} from '../Common/Library/GlobalCommon';

export default function MobileStatusOperationObjectType() {
    let mobileStatusObjectType = GlobalVar.getAppParam().OBJECTTYPE.Operation;
    return mobileStatusObjectType;
}
