
import libVal from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

export default function GetObjectGroup(context, type) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'GISMapParameters', [], '').then(function(results) {
        for (let i = 0; i < results.length; i++) {
            if (results.getItem(i).ParameterName === 'ObjectGroup') {
                try {
                    let value = JSON.parse(results.getItem(i).ParameterValue);
                    if (!libVal.evalIsEmpty(value[type])) {
                        return value[type];
                    }
                } catch (error) {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryMaps.global').getValue(), error);
                    return '';
                }
            }
        }
        return '';
    });
}
