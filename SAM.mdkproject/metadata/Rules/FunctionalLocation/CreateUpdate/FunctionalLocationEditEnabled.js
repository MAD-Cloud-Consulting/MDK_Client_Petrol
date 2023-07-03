import enableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Disable floc edit if it is not local and attachments are disabled
* Disable edit if Enable.FL.Edit parameter is set to N
*/
export default function FunctionalLocationEditEnabled(context) {
    if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Edit') === 'N') {
        return false;
    }
    if (context.binding['@sap.isLocal']) {
        return true;
    }
    if (enableAttachmentCreate(context) && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Attachment.global').getValue())) {
        return true;
    }
    return false;
}
