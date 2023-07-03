/**
 * Whether to show switch persona picker or not
 * @param {*} context 
 * @returns 
 */
export default function ShowUserPersonas(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], '').then(function(count) {
        if (count > 0) {
            return true;
        }
        return false;
    });
}
