import lamIsEnabled from '../../LAM/LAMIsEnabled';
import Logger from '../../Log/Logger';

export default function CharacteristicsLAMIsVisible(context) {
    let enabled = lamIsEnabled(context);
    let entity = context.getPageProxy().getBindingObject()['@odata.readLink'];

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity + '/LAMCharacteristicValue_Nav', [], '').then(function(results) {
        if (results && results.length > 0) {
            return enabled;
        } else {
            return false;
        }
    }, err => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryLAM.global').getValue(),`LAMCharacteristicValue_Nav OData read error: ${err}`);
        return '';
    });

}
