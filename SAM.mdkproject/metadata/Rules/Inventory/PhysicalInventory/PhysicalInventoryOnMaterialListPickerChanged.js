import refreshControls from '../PhysicalInventory/Count/ZeroCountOnChange';
import getBin from './Count/GetStorageBinAndBatchEnabled';

export default function PhysicalInventoryOnMaterialListPickerChanged(context) {
    context.clearValidation();
    if (context.getValue().length > 0) {
        let material = context.getValue()[0].ReturnValue;
        let uomListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('UOMListPicker');
        let uomListPickerSpecifier = uomListPicker.getTargetSpecifier();
        if (material) {
            uomListPickerSpecifier.setQueryOptions(`$filter=MaterialNum eq '${material}'&$orderby=UOM`);
            uomListPickerSpecifier.setEntitySet('MaterialUOMs');
            uomListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            uomListPicker.setEditable(true);
            uomListPicker.setTargetSpecifier(uomListPickerSpecifier);
            uomListPicker.redraw();      
        }
        return refreshControls(context).then(() => {
            let binControl = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
            let batchControl = context.getPageProxy().getControl('FormCellContainer').getControl('BatchSimple');
            return getBin(context).then(function(result) {
                if (result[0]) {
                    binControl.setValue(result[0]);
                } else {
                    binControl.setValue('');
                }
                if (result[1] || result[2]) { //Batch needs to be editable for both batch and valuation enabled materials
                    batchControl.setEditable(true);
                } else {
                    batchControl.setEditable(false);
                }
                return true;
            });
        });
    }
}

