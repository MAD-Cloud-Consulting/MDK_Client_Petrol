/**
* Describe this function...
* @param {IClientAPI} context
*/
import GenerateLocalID from '../Common/GenerateLocalID';

export default function MobileStatusSetReceivedObjectKey(context) {   
    return GenerateLocalID(context, 'PMMobileStatuses', 'ObjectKey', '000000', "$filter=startswith(ObjectKey, 'LOCAL') eq true", 'LOCAL_MS', 'ObjectKey').then(myLocalMobileStatusID => {
        return myLocalMobileStatusID;
    });
}
