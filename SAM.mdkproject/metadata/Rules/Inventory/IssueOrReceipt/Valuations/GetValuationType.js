import common from '../../../Common/Library/CommonLibrary';
import enableMaintenanceTechnician from '../../../SideDrawer/EnableMaintenanceTechnician';
import getBatch from '../GetBatch';

export default function GetValuationType(context) {
    let binding = context.binding;
    if (binding) {
        let material = binding.Material || binding.MaterialNum;
        let plant = binding.Plant || binding.SupplyPlant || binding.PlanningPlant;
        let batch = getBatch(context);
        if (enableMaintenanceTechnician()) {
            material = binding.MaterialNum;
            batch = binding.Batch;
        }
        let isLocal = common.isCurrentReadLinkLocal(binding['@odata.readLink']);
        if (isLocal) {
            if (binding.ValuationType) {
                return binding.ValuationType;
            } else if (binding.RelatedItem && binding.RelatedItem[0].ValuationType) {
                return binding.RelatedItem[0].ValuationType;
            }
        }
        let plantNav = binding.MaterialPlant_Nav;
        if (plantNav) {
            return setValuationType(context, plantNav, material, batch);
        } else if (plant && material) {
            let query = `$filter=Plant eq '${plant}' and MaterialNum eq '${material}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query).then((data) => {
                if (data.length === 1) {
                    let item = data.getItem(0);
                    return setValuationType(context, item, material, batch);
                }
                return '';
            });
        }
    }
    return '';
}

function setValuationType(context, plantNav, material, batch) {
    let binding = context.binding;
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

    if (plantNav.ValuationCategory && !plantNav.BatchIndicator && (type === 'ReservationItem' || type === 'ProductionOrderComponent' || type === 'MyWorkOrderComponent')) {
        return batch;
    } else if (plantNav.ValuationCategory && plantNav.BatchIndicator) {
        if (batch && material) {
            let query = `$filter=Batch eq '${batch}' and MaterialNum eq '${material}' and Plant eq '${plantNav.Plant}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialBatches', [], query).then((data) => {
                if (data.length === 1) {
                    let item = data.getItem(0);
                    return item.ValuationType;
                }
                return '';
            });
        }
    }
    if (plantNav.ValuationCategory || binding.ValuationCategory) {
        if (binding.ValuationType) {
            return binding.ValuationType;
        } else if (binding.RelatedItem && binding.RelatedItem[0].ValuationType) {
            return binding.RelatedItem[0].ValuationType;
        }
    }
    return '';
}
