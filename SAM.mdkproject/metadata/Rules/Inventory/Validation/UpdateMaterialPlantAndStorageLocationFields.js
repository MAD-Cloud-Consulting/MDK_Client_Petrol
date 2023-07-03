import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import { setToSBin } from '../Stock/Transfer/OnSLocToToSelected';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function UpdateMaterialPlantAndStorageLocationFields(context) {
    let objectType = common.getStateVariable(context, 'IMObjectType');
    let move = common.getStateVariable(context, 'IMMovementType');
    
    if (context.getValue().length > 0) {
        let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
        // let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
        let uom = context.getPageProxy().getControl('FormCellContainer').getControl('UOMSimple');
        let quantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
        let batch = context.getPageProxy().getControl('FormCellContainer').getControl('BatchSimple');
        let batchTo = context.getPageProxy().getControl('FormCellContainer').getControl('BatchNumTo');
        let autoSerialNumberSwitch = context.getPageProxy().getControl('FormCellContainer').getControl('AutoSerialNumberSwitch');
        //let serialNumAdd = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumAdd');
        //let serialNumRemove = context.getPageProxy().getControl('FormCellContainer').getControl('SerialNumRemove');
        let serialNumButton = context.getPageProxy().getControl('FormCellContainer').getControl('SerialPageNav');
        let storageBin = context.getPageProxy().getControl('FormCellContainer').getControl('StorageBinSimple');
        let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
        let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
        let movementTypePicker = context.getPageProxy().getControl('FormCellContainer').getControl('MovementTypePicker');
        let valuation = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationTypePicker');
        let valuationTo = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationToPicker');
        // let materialVaue = SplitReadLink(context.getValue()[0].ReturnValue).MaterialNum;
        let plantVaue = SplitReadLink(context.getValue()[0].ReturnValue).Plant;
        let uomValue = '';
        let serial = false;
        let storageBinValue = '';
        let batchIndicatorFlag = false;
        let quantityFlag = true;
        let quantityClear = true;
        let valuationItems = [];
        let valuationFlag = false;
        let movementTypeValue = '';
        let batchToIndicatorFlag = false;
        let valuationToFlag = false;
        if (movementTypePicker.getValue().length > 0) {
            movementTypeValue = movementTypePicker.getValue()[0].ReturnValue;
        }
        let query;
        if (movementTypeValue === '501') {
            query = '$expand=Material,MaterialValuation_Nav,Material/SerialNumbers';
        } else {
            query = '$expand=Material,MaterialPlant,MaterialPlant/MaterialValuation_Nav,Material/SerialNumbers';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getValue()[0].ReturnValue, [], query).then(result => {
            let material;
            if (result && result.length > 0) {
                let materialPlant, materialSLoc;
                if (movementTypeValue === '501') {
                    materialPlant = result.getItem(0);
                } else {
                    materialSLoc = result.getItem(0);
                    materialPlant = materialSLoc.MaterialPlant;
                }
                material = materialPlant.MaterialNum;
                if (materialPlant.BatchIndicator === 'X') {
                    batchIndicatorFlag = true;
                }
                if (!(materialPlant.SerialNumberProfile === '')) {
                    serial = true;
                    quantityFlag = false;
                    if (materialSLoc) {
                        common.setStateVariable(context, 'MaterialReadLink', materialSLoc['@odata.readLink']);
                    } else {
                        common.setStateVariable(context, 'MaterialReadLink', materialPlant['@odata.readLink']);
                    }
                }
                if (materialPlant.ValuationCategory) {
                    valuationItems = materialPlant.MaterialValuation_Nav;
                    valuationFlag = true;
                }
                if (batchIndicatorFlag && (objectType !== 'ADHOC' || (objectType === 'ADHOC' && move === 'T'))) {
                    batchToIndicatorFlag = true;
                }
                if (valuationFlag && (objectType !== 'ADHOC' || (objectType === 'ADHOC' && move === 'T'))) {
                    valuationToFlag = true;
                }
                common.setStateVariable(context, 'SerialNumbers', {actual: null, initial: null});
                
                if (objectType === 'ADHOC') {
                    common.setStateVariable(context, 'BatchRequiredForFilterADHOC', batchIndicatorFlag);
                }
                if (materialSLoc) {
                    uomValue = materialSLoc.Material.BaseUOM;
                    storageBinValue = materialSLoc.StorageBin;
                } else {
                    storageBinValue = '';
                    uomValue = materialPlant.Material.BaseUOM;
                }

            }
            // return common.getPlantName(context, plantVaue).then(function() {
            plant.setValue(plantVaue);
            batch.setVisible(batchIndicatorFlag);
            valuation.setVisible(valuationFlag);
            batchTo.setVisible(batchToIndicatorFlag);
            valuationTo.setVisible(valuationToFlag);
            uom.setValue(uomValue);
            storageBin.setValue(storageBinValue);
            autoSerialNumberSwitch.setVisible(serial && move === 'R');
            serialNumButton.setVisible(serial);
            quantity.setEditable(quantityFlag);
            //serialNumAdd.setVisible(serial);
            //serialNumRemove.setVisible(serial);
            if (quantityClear) {
                quantity.setValue(0);
            }

            // if we have valuation items in the current material plant, then
            // we adding these items to the valuation type list picker
            // only for new case, old functionality stays same
            if (valuationItems.length && objectType === 'ADHOC') {
                let pickerItems = valuationItems.map(item => {
                    return {
                        'ReturnValue': item.ValuationType,
                        'DisplayValue': item.ValuationType,
                    };
                });
                valuation.setPickerItems(pickerItems);
                valuation.setEditable(true);
                if (batchToIndicatorFlag) {
                    valuationTo.setPickerItems(pickerItems);
                    valuationTo.setEditable(true);
                }
            } else {
                valuation.setPickerItems([]);
                valuation.setEditable(false);
                valuation.setValue('');
                valuationTo.setPickerItems([]);
                valuationTo.setEditable(false);
                valuationTo.setValue('');
            }

            if (storageLocationToListPicker.getValue().length && planToListPicker.getValue().length) {
                let moveStorageBin = context.getPageProxy().getControl('FormCellContainer').getControl('ToStorageBinSimple');
                let slocToVal = storageLocationToListPicker.getValue()[0].ReturnValue;
                let plantToVal = planToListPicker.getValue()[0].ReturnValue;
                if (plantToVal && slocToVal && material) {
                    return context.read(
                        '/SAPAssetManager/Services/AssetManager.service',
                        'MaterialSLocs',
                        [],
                        "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantToVal + "' and StorageLocation eq '" + slocToVal + "'"
                    ).then((val) => {
                        if (val && val.length === 0) {
                            return context.read(
                                '/SAPAssetManager/Services/OnlineAssetManager.service',
                                'MaterialSLocs',
                                [],
                                "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plantToVal + "' and StorageLocation eq '" + slocToVal + "'"
                            ).then((value) => {
                                return setToSBin(value, moveStorageBin);
                            }).catch(() => {
                                return setToSBin([], moveStorageBin);
                            });
                        } else {
                            return setToSBin(val, moveStorageBin);
                        }
                    });
                } else {
                    moveStorageBin.setValue('');
                    moveStorageBin.setEditable(false);
                    moveStorageBin.redraw();
                    return true;
                }
            }
            return true;
        });
    }
}
