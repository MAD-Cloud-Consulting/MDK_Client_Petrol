import GenerateLocalID from '../Common/GenerateLocalID';

/**
* Generates a unique ObjectListCounter ID that starts with LOCAL_. This is used by the backend to tell that the 
* object is new and needs to be added to the work order object list. Used by ObjectListCreateNotificationForOperation.action.
*
* @param {IClientAPI} context - Binding object is Operation.
*/
export default function ObjectListCounter(context) {
    return GenerateLocalID(context, 'MyWorkOrderObjectLists', 'ObjectListCounter', '', "$filter=startswith(ObjectListCounter, 'LOCAL') eq true", 'LOCAL_', 'ObjectListCounter').then(localObjectListCounter => {
        return localObjectListCounter;
    });
}
