import location from './FormatLocation';
import {ValueIfExists} from '../Common/Library/Formatter';
export default function FunctionalLocationListFormat(context) {
    var property = context.getProperty();
    var value = '-';
    switch (property) {
        case 'Title':
            return ValueIfExists(context.binding.FuncLocDesc, '-');
        case 'Subhead':
            return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.PlanningPlant}')`, [], '').then(function(result) {
                let plant = '-';
                if (result.length > 0 && (plant = result.getItem(0))) {
                    return ValueIfExists(context.binding.WorkCenter_Main_Nav, `${plant.PlantDescription} (${context.binding.PlanningPlant})`, function(workcenter) {
                        return `${plant.PlantDescription} (${context.binding.PlanningPlant}), ${workcenter.ExternalWorkCenterId}`;
                    });
                } else {
                    return plant;
                }
            });
        case 'Footnote':
            return location(context).then(loc => {
                if (loc === '-') {
                    return  context.binding.FuncLocId;
                } else {
                    return  context.binding.FuncLocId + ', ' + loc;
                }
            });
        default:
            return value;
    }
}

