/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CharacteristicSectionIsVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/InspectionChar_Nav`, '').then(count => {
        return count > 0;
    });
}
