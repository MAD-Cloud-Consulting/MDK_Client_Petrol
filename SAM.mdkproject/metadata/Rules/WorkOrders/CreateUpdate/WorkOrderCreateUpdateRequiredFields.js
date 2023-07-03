import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'PlanningPlantLstPkr',
        'TypeLstPkr',
        'PrioritySeg',
        'MainWorkCenterLstPkr',
    ];
    return libWo.isSoldPartyRequired(context).then((required) => {
        if (required) {
            requiredFields.push('SoldToPartyLstPkr');
        }
        return requiredFields;
    });
}
