import libCommon from '../../Common/Library/CommonLibrary';

/**
 * Check to see if the confirmation LAM screen was deferred and run if necessary
 * @param {*} context 
 */

export default function SignatureRunConfirmationLAM(context) {
    let lam = libCommon.getStateVariable(context, 'LAMConfirmCreate');
    libCommon.removeStateVariable(context, 'LAMSignature');
    libCommon.removeStateVariable(context, 'LAMConfirmCreate');
    libCommon.removeStateVariable(context, 'ContextMenuBindingObject');
    if (lam) {  //LAM confirmation entry was deferred earlier
        return context.executeAction('/SAPAssetManager/Actions/LAM/LAMCreateNav.action');
    }
    return Promise.resolve(true);
}
