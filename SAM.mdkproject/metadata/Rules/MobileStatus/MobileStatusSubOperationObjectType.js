/**
* Describe this function...
* @param {IClientAPI} context
*/
import {GlobalVar} from '../Common/Library/GlobalCommon';

export default function MobileStatusSubOperationObjectType() {
    return GlobalVar.getAppParam().OBJECTTYPE.SubOperation;
}
