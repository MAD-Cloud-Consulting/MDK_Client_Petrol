import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function OnStorageLocationChanged(context) {
    let movementTypePicker = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
    let plantToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
    let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
    let plantPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
    let materialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
    let slocToQuery = "$filter=Plant eq '-1'";
    let materialEditable = false;
    let slocToEditable = false;
    let emptySlocToValue = false;
    let influenceOnMaterial = true;
    let type, plant, sloc;
    if (movementTypePicker.getValue().length > 0) {
        type = movementTypePicker.getValue()[0].ReturnValue;
    }
    if (context.getValue().length > 0 && plantPicker.getValue().length > 0) {
        sloc = context.getValue()[0].ReturnValue;
        plant = plantPicker.getValue()[0].ReturnValue;
        if (plant && sloc) {
            materialEditable = true;
            if (type === '311') {
                slocToQuery = `$filter=Plant eq '${plant}' and StorageLocation ne '${sloc}'&$orderby=Plant,StorageLocation`;
                slocToEditable = true;
                emptySlocToValue = true;
            }
            if (type === '301') {
                if (plantToListPicker.getValue().length > 0) {
                    let plantTo = plantToListPicker.getValue()[0].ReturnValue;
                    slocToQuery = `$filter=Plant eq '${plantTo}'&$orderby=Plant,StorageLocation`;
                    slocToEditable = true;
                }
            }
        }
    }
    if (type === '501') {
        influenceOnMaterial = false;
    } else {
        if (sloc) {
            libCom.setStateVariable(context, 'MaterialSLocValue', sloc);
        } else {
            libCom.setStateVariable(context, 'MaterialSLocValue', '-1');
        }
    }
    if (influenceOnMaterial) {
        let materialListPickerSpecifier = materialListPicker.getTargetSpecifier();
        materialListPickerSpecifier.setEntitySet('MaterialSLocs');
        materialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        materialListPicker.setTargetSpecifier(materialListPickerSpecifier);
        materialListPicker.setValue('');
        materialListPicker.setEditable(materialEditable);
        materialListPicker.redraw();
    }

    let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
    storageLocationToSpecifier.setQueryOptions(slocToQuery);
    storageLocationToSpecifier.setEntitySet('StorageLocations');
    storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    storageLocationToListPicker.setEditable(slocToEditable);
    if (emptySlocToValue) {
        storageLocationToListPicker.setValue('');
    }
    storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
    storageLocationToListPicker.redraw();

    if (context.getValue().length > 0) {
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        if (!(objectType === 'ADHOC')) {
            let material;
            let plantVal;
            let storageLocation;
            if (!libVal.evalIsEmpty(context.binding)) {
                if (!libVal.evalIsEmpty(context.binding.Material)) {
                    material = context.binding.Material;
                } else if (!libVal.evalIsEmpty(context.binding.MaterialNum)) {
                    material = context.binding.MaterialNum;
                }

                if (!libVal.evalIsEmpty(context.binding.Plant)) {
                    plantVal = context.binding.Plant;
                } else if (!libVal.evalIsEmpty(context.binding.SupplyPlant)) {
                    plantVal = context.binding.SupplyPlant;
                }

                if (!libVal.evalIsEmpty(context.getValue()[0].ReturnValue)) {
                    storageLocation = context.getValue()[0].ReturnValue;
                }
            }
            let storageBinSimple = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
            if (material && plantVal && storageLocation) {
                return context.read(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MaterialSLocs',
                    [],
                    "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantVal + "' and StorageLocation eq '" + storageLocation + "'").then(result => {
                        if (result && result.length > 0) {
                            // Grab the first row (should only ever be one row)
                            let row = result.getItem(0);
                            storageBinSimple.setValue(row.StorageBin);
                        } else {
                            storageBinSimple.setValue('');
                        }
                        storageBinSimple.redraw();
                        return true;
                });
            } else {
                storageBinSimple.setValue('');
                storageBinSimple.redraw();
            }
        }
        return true;
    }
}
