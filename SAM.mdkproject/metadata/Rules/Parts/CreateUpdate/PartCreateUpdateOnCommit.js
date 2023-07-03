import CommonLib from '../../Common/Library/CommonLibrary';
import ValidationLib from '../../Common/Library/ValidationLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';
import partLib from '../PartLibrary';
import materialNumberCrt from './PartCreateUpdateSetOdataMaterialNum';
import plantCrt from './PartCreateUpdateSetOdataPlant';
import storageLocationCrt from './PartStorageLocation';

export default function PartCreateUpdateOnCommit(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    let isMultipleTechnician = EnableMultipleTechnician(context);
    let createAction;

    if (isMultipleTechnician && context.currentPage.id === 'VehiclePartCreate') {
        createAction = '/SAPAssetManager/Actions/Parts/VehiclePartCreate.action';
    } else {
        createAction = '/SAPAssetManager/Actions/Parts/PartCreate.action';
    }
    
    let operationNumber = partLib.partCreateUpdateSetODataValue(context, 'OperationNo');
    let promises = [];
    let materialNumber = materialNumberCrt(context);
    let plant = plantCrt(context);
    let storageLocation = storageLocationCrt(context);
    promises.push(plant);
    promises.push(storageLocation);
    
    
    return Promise.all(promises).then((values) => {
        context.getClientData().MaterialNum = materialNumber;
        context.getClientData().Plant = values[0];
        context.getClientData().StorageLocation = values[1];
        context.getClientData().OperationNo = operationNumber;

        if (CommonLib.IsOnCreate(context) || (isMultipleTechnician && context.currentPage.id === 'VehiclePartCreate')) {
            return context.executeAction(createAction).then(() => {
                if (materialNumber && context.getClientData().Plant && context.getClientData().StorageLocation) {
                    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', "$filter=MaterialNum eq '" + materialNumber + "' and Plant eq '" + values[0] + "' and StorageLocation eq '" + values[1] + "'").then(count => {
                        if (count === 0 || count === '0') { 
                            return context.executeAction('/SAPAssetManager/Actions/Material/MaterialCreate.action');
                        }
                        return Promise.resolve(true);
                    });
                }
                return Promise.resolve(true);
            });
        } else {
            if (!ValidationLib.evalIsEmpty(operationNumber) && !ValidationLib.evalIsEmpty(context.binding.OperationNo) && operationNumber !== context.binding.OperationNo) {
                return context.executeAction(createAction).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Parts/PartDeleteOnChangedOperation.action').then(() => {
                        if (materialNumber && context.getClientData().Plant && context.getClientData().StorageLocation) {
                            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', "$filter=MaterialNum eq '" + materialNumber + "' and Plant eq '" + values[0] + "' and StorageLocation eq '" + values[1] + "'").then(count => {
                                if (count === 0 || count === '0') { 
                                    return context.executeAction('/SAPAssetManager/Actions/Material/MaterialCreate.action');
                                }
                                return Promise.resolve(true);
                            });
                        }
                        return Promise.resolve(true);
                    });
                });
            } else {
                return context.executeAction('/SAPAssetManager/Actions/Parts/PartUpdate.action').then(() => {
                    if (materialNumber && context.getClientData().Plant && context.getClientData().StorageLocation) {
                        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs', "$filter=MaterialNum eq '" + materialNumber + "' and Plant eq '" + values[0] + "' and StorageLocation eq '" + values[1] + "'").then(count => {
                            if (count === 0 || count === '0') { 
                                return context.executeAction('/SAPAssetManager/Actions/Material/MaterialCreate.action');
                            }
                            return Promise.resolve(true);
                        });
                    }
                    return Promise.resolve(true);
                });
            }
        }
    });
}
