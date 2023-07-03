import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

/**
* Show/hide Documents section depending on CA_ATTACHMENT feature
*/
export default function DocumentsIsVisible(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Attachment.global').getValue());
}
