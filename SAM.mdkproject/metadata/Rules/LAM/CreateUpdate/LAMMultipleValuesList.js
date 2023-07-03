 import Logger from '../../Log/Logger';
 import CharacteristicDisplayValue from '../../Classification/Characteristics/CharacteristicDisplayValue';

 export default function LAMMultipleValuesList(context) {
    return CharacteristicDisplayValue(context, true, true).then((result) => {
        return result.split(', ').map(item => ({
            'DisplayValue': item,
            'ReturnValue': item,
        }));
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
    });
 }
