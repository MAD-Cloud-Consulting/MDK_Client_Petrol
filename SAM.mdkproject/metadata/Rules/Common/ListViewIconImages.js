import isAndroid from './IsAndroid';

export default function ListViewIconImages(controlProxy) {
    var iconImage = [];
    if (controlProxy.binding['@sap.isLocal']) {
        iconImage.push(isAndroid(controlProxy) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }
    if (controlProxy.binding['@odata.type'] === '#sap_mobile.MyEquipment') {
         // check if this Equipment has any docs
        let docs = controlProxy.binding.EquipDocuments;
        if (docs && docs.length > 0) {
            //check to see if at least one of the documents has an associated document.
            let documentExists = docs.some(doc => doc.Document !== null);
            if (documentExists) {
                iconImage.push(isAndroid(controlProxy)? '/SAPAssetManager/Images/attachmentStepIcon.android.png' : '/SAPAssetManager/Images/attachmentStepIcon.png');
            }
        } else {
            return iconImage;
        }
    }
    return iconImage;
}
