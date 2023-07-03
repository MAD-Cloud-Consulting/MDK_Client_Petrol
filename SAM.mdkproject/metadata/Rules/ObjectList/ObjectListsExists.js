import ObjectListsCount from './ObjectListsCount';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

/**
 * Checks to see if there are any object lists for a work order or for an operation. It's called from operation detail page and work order detail page.
 * @param {*} pageProxy Its binding object should either be a Work Order or Operation object.
 */
export default function ObjectListsExists(pageProxy) { 
    if (userFeaturesLib.isFeatureEnabled(pageProxy, pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Features/ObjectList.global').getValue())) {
        return ObjectListsCount(pageProxy).then(count => {
            if (count > 0) {
                return true;
            } else {
                return false;
            }
        });
    } else {
        return false;
    }  
}
