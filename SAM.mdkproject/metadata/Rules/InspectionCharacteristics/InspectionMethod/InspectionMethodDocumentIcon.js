/**
* Returns the attachment icon if the Inspection Method contains a document
* @param {IClientAPI} context
*/

import isAndroid from '../../../../SAPAssetManager/Rules/Common/IsAndroid';

export default function InspectionMethodDocumentIcon(context) {
    
    let docs = context.binding.MethodDoc_Nav;
    if (docs && docs.length > 0) {
        //check to see if at least one of the documents has an associated document.
        let documentExists = docs.some(doc => doc.Document_Nav !== null);
        if (documentExists) {
            if (isAndroid(context)) {
                return ['/SAPAssetManager/Images/attachmentStepIcon.android.png'];
            } else {
                return ['/SAPAssetManager/Images/attachmentStepIcon.png'];
            }
        }
    }
}
