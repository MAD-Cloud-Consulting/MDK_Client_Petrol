import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import showSerialNumberField from '../Validation/ShowSerialNumberField';

export default function OnMovementTypeValueChanged(context) {
    let movementType = context.getValue();
    let glAccountSimple = context.getPageProxy().getControl('FormCellContainer').getControl('GLAccountSimple');
    let costCenterSimple = context.getPageProxy().getControl('FormCellContainer').getControl('CostCenterSimple');
    let wbSElementSimple = context.getPageProxy().getControl('FormCellContainer').getControl('WBSElementSimple');
    let orderSimple = context.getPageProxy().getControl('FormCellContainer').getControl('OrderSimple');
    let networkSimple = context.getPageProxy().getControl('FormCellContainer').getControl('NetworkSimple');
    let activitySimple = context.getPageProxy().getControl('FormCellContainer').getControl('ActivitySimple');
    let businessAreaSimple = context.getPageProxy().getControl('FormCellContainer').getControl('BusinessAreaSimple');
    let movementReason = context.getPageProxy().getControl('FormCellContainer').getControl('MovementReasonPicker');
    let goodsRecepient = context.getPageProxy().getControl('FormCellContainer').getControl('GoodsRecipientSimple');
    let unloadingPoint = context.getPageProxy().getControl('FormCellContainer').getControl('UnloadingPointSimple');
    let openQuantity = context.getPageProxy().getControl('FormCellContainer').getControl('QuantitySimple');
    let addSerialNumber = context.getPageProxy().getControl('FormCellContainer').getControl('SerialPageNav');
    let objectType = common.getStateVariable(context, 'IMObjectType');
    let move = common.getStateVariable(context, 'IMMovementType');

    glAccountSimple.setVisible(false);

    if (movementType && movementType.length > 0 && movementType[0].ReturnValue) {
        if (movementType[0].ReturnValue === '201') {
            costCenterSimple.setVisible(true);            
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
            movementReason.setVisible(false);
            movementReason.setValue('');
            if (objectType === 'RES' || objectType === 'PRD') {
                glAccountSimple.setEditable(false);
                costCenterSimple.setEditable(false);
            } else {
                glAccountSimple.setEditable(true);
                costCenterSimple.setEditable(true);
            }
        } else if (movementType[0].ReturnValue === '221') {
            wbSElementSimple.setVisible(true);            
            costCenterSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
            movementReason.setVisible(false);
            movementReason.setValue('');
            if (objectType === 'RES' || objectType === 'PRD') {
                glAccountSimple.setEditable(false);
                wbSElementSimple.setEditable(false);
            } else {
                glAccountSimple.setEditable(true);
                wbSElementSimple.setEditable(true);
            }
        } else if (movementType[0].ReturnValue === '261') {
            orderSimple.setVisible(true);
            costCenterSimple.setVisible(true);
            wbSElementSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
            movementReason.setVisible(false);
            movementReason.setValue('');
            if (objectType === 'RES' || objectType === 'PRD') {
                glAccountSimple.setEditable(false);
                costCenterSimple.setEditable(false);
                orderSimple.setEditable(false);
            } else {
                glAccountSimple.setEditable(true);
                costCenterSimple.setEditable(true);
                orderSimple.setEditable(true);
            }
        } else if (movementType[0].ReturnValue === '281') {
            networkSimple.setVisible(true);
            activitySimple.setVisible(true);
            businessAreaSimple.setVisible(false);
            costCenterSimple.setVisible(false);
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            glAccountSimple.setVisible(true);
            movementReason.setVisible(false);
            movementReason.setValue('');
            if (objectType === 'RES' || (objectType === 'PRD' && move === 'I')) {
                glAccountSimple.setEditable(false);
                networkSimple.setEditable(false);
                activitySimple.setEditable(false);
            } else {
                glAccountSimple.setEditable(true);
                networkSimple.setEditable(true);
                activitySimple.setEditable(true);
            }
        } else if (movementType[0].ReturnValue === '301' || movementType[0].ReturnValue === '311') {
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);

            costCenterSimple.setVisible(false);
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            movementReason.setVisible(false);
            movementReason.setValue('');

            let matrialListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('MatrialListPicker');
            let storageLocationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationPicker');
            let plant = context.getPageProxy().getControl('FormCellContainer').getControl('PlantSimple');
            let planToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('PlantToListPicker');
            let storageLocationToListPicker = context.getPageProxy().getControl('FormCellContainer').getControl('StorageLocationToListPicker');
                
            // let materialValue = '';
            let plantValue = '';
            let storageLocationValue = '';
            let binding = context.binding;
            if (!(common.getPreviousPageName(context) === 'StockDetailsPage')) {
                if (matrialListPicker.getValue() && matrialListPicker.getValue().length > 0) {
                    // materialValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).MaterialNum;
                    plantValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).Plant;
                    storageLocationValue = SplitReadLink(matrialListPicker.getValue()[0].ReturnValue).StorageLocation;
                } else if (plant.getValue().length > 0) {
                    plantValue = plant.getValue()[0].ReturnValue;
                    if (storageLocationPicker.getValue().length > 0) {
                        storageLocationValue = storageLocationPicker.getValue()[0].ReturnValue;
                    }
                }
            } else {
                // materialValue = binding.MaterialNum;
                plantValue = binding.Plant;
                storageLocationValue = binding.StorageLocation;
            }

            let movementTypeValue = movementType[0].ReturnValue;
            let plantToFilter = '';
            let storageLocationToFilter = '';
            let plantToEditable = true;
            let storgeLocationToEditable = false;
            let storgeLocationToResetValue = true;
            
            if (plantValue) {
                if (movementTypeValue === '301') { //plant to plant transfer
                    plantToFilter = `$filter=Plant ne '${plantValue}'&$orderby=Plant`;
                    plantToEditable = true;
                } else if (movementTypeValue === '311') { //within plant transfer
                    plantToFilter = `$filter=Plant eq '${plantValue}'&$orderby=Plant`;
                    plantToEditable = false;
                    if (storageLocationValue) {
                        storageLocationToFilter = `$filter=Plant eq '${plantValue}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                        storgeLocationToEditable = true;
                    }
                } 
            }

            let plantToSpecifier = planToListPicker.getTargetSpecifier();
            plantToSpecifier.setQueryOptions(plantToFilter);
            plantToSpecifier.setEntitySet('Plants');
            plantToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            planToListPicker.setEditable(plantToEditable);
            planToListPicker.setTargetSpecifier(plantToSpecifier);
            planToListPicker.redraw();

            let setSloc = () => {
                let storageLocationToSpecifier = storageLocationToListPicker.getTargetSpecifier();
                storageLocationToSpecifier.setQueryOptions(storageLocationToFilter);
                storageLocationToSpecifier.setEntitySet('StorageLocations');
                storageLocationToSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                storageLocationToListPicker.setEditable(storgeLocationToEditable);
                if (storgeLocationToResetValue) {
                    storageLocationToListPicker.setValue('');
                }
                storageLocationToListPicker.setTargetSpecifier(storageLocationToSpecifier);
                storageLocationToListPicker.redraw();
            };
            
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'Plants', [], plantToFilter).then(data => {
                if (data.length === 1) {
                    let plantInfo = data.getItem(0);
                    storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}'&$orderby=StorageLocation`;
                    if (movementTypeValue === '311' && storageLocationValue) {
                        storageLocationToFilter = `$filter=Plant eq '${plantInfo.Plant}' and StorageLocation ne '${storageLocationValue}'&$orderby=Plant,StorageLocation`;
                    }
                    storgeLocationToEditable = true;
                    if (binding && binding.MoveStorageLocation) {
                        if (plantInfo.Plant === binding.MovePlant) {
                            storgeLocationToResetValue = false;
                        }
                    }
                }
                setSloc();
            });
        } else if (movementType[0].ReturnValue === '551') {
            costCenterSimple.setVisible(true);            
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(true);
            movementReason.setVisible(true);
            if (context.binding && !context.binding.MovementReason) {
                movementReason.setValue('');
            }
            if (objectType === 'RES' || objectType === 'PRD') {
                glAccountSimple.setEditable(false);
                costCenterSimple.setEditable(false);
            } else {
                glAccountSimple.setEditable(true);
                costCenterSimple.setEditable(true);
            }

            let movementReasonSpecifier = movementReason.getTargetSpecifier();
            movementReasonSpecifier.setQueryOptions("$filter=MovementType eq '551'&$orderby=MovementReason");
            movementReasonSpecifier.setEntitySet('MovementReasons');
            movementReasonSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            movementReason.setTargetSpecifier(movementReasonSpecifier);
            movementReason.redraw();
        } else if (movementType[0].ReturnValue === '122') {
            costCenterSimple.setVisible(false);            
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(false);
            movementReason.setVisible(true);
            goodsRecepient.setEditable(true);
            unloadingPoint.setEditable(true);
            if (context.binding && !context.binding.MovementReason) {
                movementReason.setValue('');
            }

            let movementReasonSpecifier = movementReason.getTargetSpecifier();
            movementReasonSpecifier.setQueryOptions("$filter=MovementType eq '122'&$orderby=MovementReason");
            movementReasonSpecifier.setEntitySet('MovementReasons');
            movementReasonSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            movementReason.setTargetSpecifier(movementReasonSpecifier);
            movementReason.redraw();
            return showSerialNumberField(context).then((result) => {
                openQuantity.setEditable(!result);
                addSerialNumber.setVisible(result);
            });
        } else if (movementType[0].ReturnValue === '102') {
            costCenterSimple.setVisible(false);            
            wbSElementSimple.setVisible(false);
            orderSimple.setVisible(false);
            networkSimple.setVisible(false);
            activitySimple.setVisible(false);
            businessAreaSimple.setVisible(false);
            glAccountSimple.setVisible(false);
            movementReason.setVisible(false);
            goodsRecepient.setEditable(false);
            unloadingPoint.setEditable(false);
            openQuantity.setEditable(false);
            addSerialNumber.setVisible(false);
            if (context.binding && !context.binding.MovementReason) {
                movementReason.setValue('');
            }
            if (context.binding && context.binding.SerialNum && context.binding.SerialNum.length) {
                setDefaultSerials(context, context.binding.SerialNum);
            }
        } 
    }
}

function setDefaultSerials(context, serials) {
    let arr = serials.map(item => {
        return {
            SerialNumber: item.SerialNumber || item.SerialNum,
            selected: !!context.binding.SerialNum || !!context.binding.PickedQuantity,
            downloaded: !context.binding.SerialNum,
        };
    });
    common.setStateVariable(context, 'SerialNumbers', {actual: arr, initial: JSON.parse(JSON.stringify(arr))});
}
