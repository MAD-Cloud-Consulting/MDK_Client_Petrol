import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

/**
* Checks 'CA_CLASSIFICATION' User Feature to show/hide classifications facet
*/
export default function ClassificationIsVisible(context) {
    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Classification.global').getValue());
}
