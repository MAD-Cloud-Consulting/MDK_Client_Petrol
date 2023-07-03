import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function GetStorageBin(context, item) {
    return new Promise((resolve) => {
        const binding = item || context.binding;

        if (!libVal.evalIsEmpty(binding)) {
            if (binding.hasOwnProperty('StorageBin') && !libVal.evalIsEmpty(binding.StorageBin)) {
                return resolve(binding.StorageBin);
            }
        }
    
        let objectType = libCom.getStateVariable(context, 'IMObjectType');
        if (!(objectType === 'ADHOC')) {
            let material;
            let plant;
            let storageLocation;
            if (!libVal.evalIsEmpty(binding)) {
                if (!libVal.evalIsEmpty(binding.Material)) {
                    material = binding.Material;
                } else if (!libVal.evalIsEmpty(binding.MaterialNum)) {
                    material = binding.MaterialNum;
                }
    
                if (!libVal.evalIsEmpty(binding.Plant)) {
                    plant = binding.Plant;
                } else if (!libVal.evalIsEmpty(binding.SupplyPlant)) {
                    plant = binding.SupplyPlant;
                }
    
                if (!libVal.evalIsEmpty(binding.StorageLoc)) {
                    storageLocation = binding.StorageLoc;
                } else if (!libVal.evalIsEmpty(binding.SupplyStorageLocation)) {
                    storageLocation = binding.SupplyStorageLocation;
                } else if (!libVal.evalIsEmpty(binding.StorageLocation)) {
                    storageLocation = binding.StorageLocation;
                }
            }
            if (material && plant && storageLocation) {
                return context.read(
                    '/SAPAssetManager/Services/AssetManager.service',
                    'MaterialSLocs',
                    [],
                    "$select=StorageBin&$filter=MaterialNum eq '" + material + "' and Plant eq '" + plant + "' and StorageLocation eq '" + storageLocation + "'").then(result => {
                        if (result && result.length > 0) {
                            // Grab the first row (should only ever be one row)
                            let row = result.getItem(0);
                            return resolve(row.StorageBin);
                        }
                        return resolve('');
                });
            }
        }
        return resolve('');
    });
}
