import refreshControls from '../PhysicalInventory/Count/ZeroCountOnChange';
import getBin from './Count/GetStorageBinAndBatchEnabled';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnPlantValueChanged(context) {
       
    let value = libCom.getListPickerValue(context.getValue());

    if (!value) {
        value = '-1';
    }
    let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
    let storageLocationToSpecifier = storageLocationPicker.getTargetSpecifier();
    storageLocationToSpecifier.setQueryOptions(`$filter=Plant eq '${value}'&$orderby=StorageLocation`);
    storageLocationToSpecifier.setEntitySet('StorageLocations');
    storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    storageLocationPicker.setEditable(true);
    storageLocationPicker.setValue('');
    storageLocationPicker.setTargetSpecifier(storageLocationToSpecifier);
    storageLocationPicker.redraw();

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
