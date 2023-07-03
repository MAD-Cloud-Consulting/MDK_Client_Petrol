import GenerateLocalID from '../Common/GenerateLocalID';

/**
* Generates a unique object list number value that starts with LOCAL_. This is used by the backend to tell that the 
* object is new and needs to be added to the work order object list. Used by ObjectListCreateNotificationForOperation.action.
*
* @param {IClientAPI} context - Binding object is Operation.
*/
export default function ObjectListNum(context) {
    return GenerateLocalID(context, 'MyWorkOrderObjectLists', 'ObjectListNum', '', "$filter=startswith(ObjectListNum, 'LOCAL') eq true", 'LOCAL_', 'ObjectListNum').then(localObjectListNum => {
        return localObjectListNum;
    });
}
