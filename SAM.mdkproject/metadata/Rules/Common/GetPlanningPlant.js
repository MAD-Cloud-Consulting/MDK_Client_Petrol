
import assnType from './Library/AssignmentType';

export default function GetPlanningPlant() {
    let planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
    return planningPlant;
}
