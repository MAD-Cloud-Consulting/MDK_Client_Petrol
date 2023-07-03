import saveCreatedDocuments from './SaveCreatedDocuments';
import RemoveCreatedMaterialDocuments from './RemoveCreatedMaterialDocuments';
/**
* Call delete function for the document, then call final function
* @param {IClientAPI} context
*/
export default function RemoveMaterialDocuments(context) {
    return RemoveCreatedMaterialDocuments(context, false).then(()=>{
        return saveCreatedDocuments(context, true);
    });
}
