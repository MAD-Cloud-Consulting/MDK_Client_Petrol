import libCommon from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsBusinessObjectLocal(context) {
    return  libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']) && userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue()) ;
}
