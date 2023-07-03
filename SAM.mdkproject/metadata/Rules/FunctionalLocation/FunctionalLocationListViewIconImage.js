import libCommon from '../Common/Library/CommonLibrary';
import isAndroid from '../Common/IsAndroid';

export default function FunctionalLocationListViewIconImages(context) {
    let docs = context.binding.FuncLocDocuments;
    var iconImage = [];

    if (libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    if (docs && docs.length > 0) {
        //check to see if at least one of the documents has an associated document.
        let documentExists = docs.some(doc => doc.Document !== null);
        if (documentExists) {
            iconImage.push(isAndroid(context)? '/SAPAssetManager/Images/attachmentStepIcon.android.png' : '/SAPAssetManager/Images/attachmentStepIcon.png');
        }

        let localDocExists = docs.some(doc => doc.Document !== null && doc['@sap.isLocal']);
        if (localDocExists && !libCommon.getTargetPathValue(context, '#Property:@sap.isLocal')) {
            iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        }
        return iconImage;
    } else {
        return iconImage;
    }
}
