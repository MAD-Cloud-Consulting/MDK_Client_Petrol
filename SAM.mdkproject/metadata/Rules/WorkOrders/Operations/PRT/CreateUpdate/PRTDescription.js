
export default function PRTDescription(context) {


    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${context.evaluateTargetPath('#Control:EquipmentLstPkr/#SelectedValue')}'`).then(result => {
        if (result && result.getItem(0)) {
            return result.getItem(0).EquipDesc;
        }
        return '';
    });
}
