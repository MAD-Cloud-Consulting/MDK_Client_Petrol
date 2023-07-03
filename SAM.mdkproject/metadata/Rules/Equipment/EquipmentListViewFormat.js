import { EquipmentLibrary as EquipmentLib } from './EquipmentLibrary';
import {ValueIfExists} from '../Common/Library/Formatter';

/**
 * Rule used to display the various properties on the equipment list view row.
 * @see EquipmentLibrary
 */
export default function EquipmentListViewFormat(context) {
    var section = context.getName();
    var property = context.getProperty();
    var value = '';

    switch (section) {
        case 'ObjectListEquipmentViewSection':
        case 'EquipmentListViewSection':
            switch (property) {
                case 'Subhead':
                    value = context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.PlanningPlant}')`, [], '').then(function(result) {
                        let plant = '-';
                        if (result.length > 0 && (plant = result.getItem(0))) {
                            return ValueIfExists(context.binding.WorkCenter_Main_Nav, `${plant.PlantDescription} (${context.binding.PlanningPlant})`, function(workcenter) {
                                return `${plant.PlantDescription} (${context.binding.PlanningPlant}), ${workcenter.ExternalWorkCenterId}`;
                            });
                        } else {
                            return plant;
                        }
                    });
                    break;
                case 'SubstatusText':
                        //Display equipment status text.
                    value = EquipmentLib.getStatusDescription(context, false);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return value;
}
