import Validate from '../Common/Library/ValidationLibrary';
import setMobileStatus from '../SignatureControl/SignatureControlMobileStatus';

/**
 * This is a simple rule to get around a race condition
 * @param {PageProxy} context 
 */
export default function MobileStatusSetCompleteObjectKey(context) {
    let mobileStatusObjectKey = context.getClientData().MobileStatusObjectKey;
    if (!Validate.evalIsEmpty(mobileStatusObjectKey)) {
        return mobileStatusObjectKey;
    } else if (!Validate.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').MobileStatusObjectKey)) {
        // Retrieve the readlink from the previous page
        // This is because Client data is not read from the same context the action was executed on
        return context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:MobileStatusObjectKey');
    } else if (!Validate.evalIsEmpty(context.getClientData().currentObject)) {
        // Set the client data for Signature Control
        setMobileStatus(context);
        mobileStatusObjectKey = context.getClientData().MobileStatusObjectKey;
    } else if (!Validate.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject)) {
        let tempObject = context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject;
        if (tempObject.MobileStatusObjectKey) {
            mobileStatusObjectKey = tempObject.MobileStatusObjectKey;
        }
    }
    return mobileStatusObjectKey;
}
