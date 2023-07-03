import Validate from '../Common/Library/ValidationLibrary';
import setMobileStatus from '../SignatureControl/SignatureControlMobileStatus';
import libCommon from '../Common/Library/CommonLibrary';

/**
 * This is a simple rule to get around a race condition
 * @param {PageProxy} context 
 */
export default function MobileStatusSetCompleteReadLink(context) {
    let readlink = context.getClientData().MobileStatusReadLink;
    if (!Validate.evalIsEmpty(readlink)) {
        return readlink;
    } else if (libCommon.getStateVariable(context, 'contextMenuSwipePage')) {
        let binding = libCommon.getBindingObject(context);
        return binding.OrderMobileStatus_Nav['@odata.readLink'];
    } else if (!Validate.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').MobileStatusReadLink)) {
        // Retrieve the readlink from the previous page
        // This is because Client data is not read from the same context the action was executed on
        return context.evaluateTargetPath('#Page:-Previous/#ClientData/#Property:MobileStatusReadLink');
    } else if (!Validate.evalIsEmpty(context.getClientData().currentObject)) {
        // Set the client data for Signature Control
        setMobileStatus(context);
        readlink = context.getClientData().MobileStatusReadLink;
    } else if (!Validate.evalIsEmpty(context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject)) {
        let tempObject = context.evaluateTargetPath('#Page:-Previous/#ClientData').currentObject;
        if (tempObject.MobileStatusReadLink) {
            readlink = tempObject.MobileStatusReadLink;
        }
    }
    return readlink;
}
