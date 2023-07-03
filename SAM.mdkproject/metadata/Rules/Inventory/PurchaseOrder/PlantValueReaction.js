import libCom from '../../Common/Library/CommonLibrary';

export default function PlantValueReaction(context) {
    let movementTypePicker = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
    let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
    let materialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
    let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
    let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
    let query = "$filter=Plant eq '-1'";
    let plantQuery = "$filter=Plant eq '-1'";
    let plantValue = '';
    let plantEditable = false;
    let slocEditable = false;
    let materialEditable = false;
    let materialEntity = 'MaterialSLocs';
    let type;
    let plant;
    if (movementTypePicker.getValue().length > 0) {
        type = movementTypePicker.getValue()[0].ReturnValue;
    }
    if (context.getValue().length > 0) {
        plant = context.getValue()[0].ReturnValue;
        if (plant) {
            query = "$filter=Plant eq '" + plant + "'&$orderby=StorageLocation";
            slocEditable = true;
            if (type === '301') {
                plantQuery = `$filter=Plant ne '${plant}'&$orderby=Plant`;
                plantEditable = true;
            } else if (type === '311') {
                plantQuery = `$filter=Plant eq '${plant}'&$orderby=Plant`;
                plantValue = plant;
            }
        }
    }
    if (type === '501') {
        if (plant) {
            libCom.setStateVariable(context, 'MaterialPlantValue', plant);
            libCom.setStateVariable(context, 'MaterialSLocValue', '-1');
            materialEditable = true;
        } else {
            libCom.setStateVariable(context, 'MaterialPlantValue', '-1');
            libCom.setStateVariable(context, 'MaterialSLocValue', '-1');
        }
        materialEntity = 'MaterialPlants';
    }
    let storageLocationPickerSpecifier = storageLocationPicker.getTargetSpecifier();
    storageLocationPickerSpecifier.setQueryOptions(query);
    storageLocationPickerSpecifier.setEntitySet('StorageLocations');
    storageLocationPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    storageLocationPicker.setTargetSpecifier(storageLocationPickerSpecifier);
    storageLocationPicker.setValue('');
    storageLocationPicker.setEditable(slocEditable);
    storageLocationPicker.redraw();

    let materialListPickerSpecifier = materialListPicker.getTargetSpecifier();
    materialListPickerSpecifier.setEntitySet(materialEntity);
    materialListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    materialListPicker.setTargetSpecifier(materialListPickerSpecifier);
    materialListPicker.setValue('');
    materialListPicker.setEditable(materialEditable);
    materialListPicker.redraw();

    let plantToSpecifier = planToListPicker.getTargetSpecifier();
    plantToSpecifier.setQueryOptions(plantQuery);
    plantToSpecifier.setEntitySet('Plants');
    plantToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
    planToListPicker.setTargetSpecifier(plantToSpecifier);
    planToListPicker.setEditable(plantEditable);
    planToListPicker.setValue(plantValue);
    planToListPicker.redraw();

    let storgeLocationToEditable = false;
    let storageLocationToFilter = "$filter=Plant eq '-1'";

    function setSloc() {
        let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
        storageLocationToSpecifier.setQueryOptions(storageLocationToFilter);
        storageLocationToSpecifier.setEntitySet('StorageLocations');
        storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
        storageLocationToListPicker.setEditable(storgeLocationToEditable);
        storageLocationToListPicker.setValue('');
        storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
        storageLocationToListPicker.redraw();
    }

    if (type === '301') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], plantQuery).then(data => {
            if (data.length === 1) {
                let plantInfo = data.getItem(0);
                storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}'&$orderby=StorageLocation`;
                storgeLocationToEditable = true;
            }
            setSloc();
        });
    } else {
        setSloc();
    }
}
