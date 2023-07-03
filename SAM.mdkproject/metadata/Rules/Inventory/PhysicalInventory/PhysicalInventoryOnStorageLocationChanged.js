import getBin from './Count/GetStorageBinAndBatchEnabled';
import refreshControls from '../PhysicalInventory/Count/ZeroCountOnChange';
import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryOnStorageLocationChanged(context) {
    if (context.getValue().length > 0) {
        let material;
        let plant;
        let storageLocation;

        material = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker').getValue());
        plant = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('PlantLstPkr').getValue());
        storageLocation = libCom.getListPickerValue(context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker').getValue());
    
        let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let matrialListPickerSpecifier = matrialListPicker.getTargetSpecifier();
        if (material && plant && storageLocation) {
            matrialListPickerSpecifier.setQueryOptions(`$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'&$expand=Material&$orderby=MaterialNum,Plant,StorageLocation`);
            matrialListPickerSpecifier.setEntitySet('MaterialSLocs');
            matrialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            matrialListPicker.setEditable(true);
            matrialListPicker.setValue(material);
            matrialListPicker.setTargetSpecifier(matrialListPickerSpecifier);
            matrialListPicker.redraw();      
        } else if (plant && storageLocation) {
            matrialListPickerSpecifier.setQueryOptions(`$filter=Plant eq '${plant}' and StorageLocation eq '${storageLocation}'&$expand=Material&$orderby=MaterialNum,Plant,StorageLocation`);
            matrialListPickerSpecifier.setEntitySet('MaterialSLocs');
            matrialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            matrialListPicker.setEditable(true);
            matrialListPicker.setValue('');
            matrialListPicker.setTargetSpecifier(matrialListPickerSpecifier);
            matrialListPicker.redraw();    
        }
    } else { //No sloc, show material list should be blank
        let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
        let matrialListPickerSpecifier = matrialListPicker.getTargetSpecifier();
        matrialListPickerSpecifier.setQueryOptions("$filter=Plant eq '-1'");
        matrialListPickerSpecifier.setEntitySet('MaterialSLocs');
        matrialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        matrialListPicker.setEditable(true);
        matrialListPicker.setValue('');
        matrialListPicker.setTargetSpecifier(matrialListPickerSpecifier);
        matrialListPicker.redraw();    
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
                batchControl.setValue('');
                batchControl.setEditable(false);
            }
            return true;
        });
    });
}
