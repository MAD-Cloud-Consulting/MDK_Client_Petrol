import libCommon from '../../Common/Library/CommonLibrary';
/**
* Formatting output value for MovementTypes component
* @param {IClientAPI} context
*/
export default function MovementTypeItemsInfo(context) {
    let movement = libCommon.getStateVariable(context, 'CurrentDocsItemsMovementType');
    if (movement) {
        let query = `$filter=MovementType eq '${movement}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MovementTypes', [], query).then(data => {
            if (data && data.length) {
                let item = data.getItem(0);
                return `${item.MovementType} - ${item.MovementTypeDesc}`;
            }
            return '-';
        });
    }
    return '-';
}
