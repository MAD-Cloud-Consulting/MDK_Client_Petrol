import Validate from '../Common/Library/ValidationLibrary';
import setMobileStatus from '../SignatureControl/SignatureControlMobileStatus';
/**
 * This is a simple rule to get around a race condition
 * @param {PageProxy} context 
 */
export default function MobileStatusSetCompleteObjectType(context) {

    let mobileStatusObjectType = context.getClientData().MobileStatusObjectType;
    if (!Validate.evalIsEmpty(mobileStatusObjectType)) {
        return mobileStatusObjectType;
    } else if (!Validate.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').MobileStatusObjectType)) {
        // Retrieve the readlink from the previous page
        // This is because Client data is not read from the same context the action was executed on
        return context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:MobileStatusObjectType');
    } else if (!Validate.evalIsEmpty(context.getClientData().currentObject)) {
        // Set the client data for Signature Control
        setMobileStatus(context);
        mobileStatusObjectType = context.getClientData().MobileStatusObjectType;
    } else if (!Validate.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject)) {
        let tempObject = context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject;
        if (tempObject.MobileStatusObjectType) {
            mobileStatusObjectType = tempObject.MobileStatusObjectType;
        }
    }
    return mobileStatusObjectType;
}
