/**
* Describe this function...
* @param {IClientAPI} context
*/

import libCom from '../Common/Library/CommonLibrary';
import libDigSig from '../DigitalSignature/DigitalSignatureLibrary';

export default function AddPassphraseCheckRequiredFields(context) {
    var passphraseControl = context.evaluateTargetPath('#Control:passphrase');
    var remarkControl = context.evaluateTargetPath('#Control:remark');
    var commentControl = context.evaluateTargetPath('#Control:comment');

    libCom.setInlineControlErrorVisibility(passphraseControl, false);
    libCom.setInlineControlErrorVisibility(remarkControl, false);
    libCom.setInlineControlErrorVisibility(commentControl, false);

    let validations = [];
    validations.push(libDigSig.validatePassphrase(context, passphraseControl));
    validations.push(libDigSig.validateRemark(context, remarkControl));
    validations.push(libDigSig.validateComment(context, commentControl));

    return Promise.all(validations).then(function() {
        // clear all validations
        libCom.setInlineControlErrorVisibility(passphraseControl, false);
        libCom.setInlineControlErrorVisibility(remarkControl, false);
        libCom.setInlineControlErrorVisibility(commentControl, false);

        context.getControl('FormCellContainer0').redraw();
        
        return context.executeAction('/SAPAssetManager/Actions/DigitalSignature/AddPasscode.action');
    }).catch(function() {
        // Errors exist
        context.getControl('FormCellContainer0').redraw();
        return Promise.resolve(false);
    });
}
