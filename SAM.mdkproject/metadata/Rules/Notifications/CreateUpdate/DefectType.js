/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DefectType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue')}')`, [], '').then(result => {
        if (result && result.length === 1) {
            return result.getItem(0).CatTypeDefects;
        } else {
            return '';
        }
    });
}
