import lamIsEnabled from './LAMIsEnabled';

export default function LAMIsVisible(context, entity, options = [], filter = '') {
    let enabled = lamIsEnabled(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity + '/LAMObjectDatum_Nav', options, filter).then(function(results) {
        if (results && results.length > 0) {
            return enabled;
        } else {
            return false;
        }
    });

}
