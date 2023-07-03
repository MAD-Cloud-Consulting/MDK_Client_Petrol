import { WorkOrderEventLibrary as LibWoEvent } from '../WorkOrderLibrary';
import { WorkOrderControlsLibrary as controls } from '../WorkOrderLibrary';
import assignmentType from '../../Common/Library/AssignmentType';

export default function WorkOrderCreateUpdateOnCommit(pageProxy) {
    return LibWoEvent.createUpdateValidationRule(pageProxy).then((result) => {
        if (result) {
            //validation pass
            assignmentType.setWorkOrderFieldDefault('PlanningPlant', controls.getPlanningPlant(pageProxy));
            assignmentType.setWorkOrderFieldDefault('WorkCenterPlant', controls.getWorkCenterPlant(pageProxy));
            assignmentType.setWorkOrderFieldDefault('MainWorkCenter', controls.getMainWorkCenter(pageProxy));
            return LibWoEvent.CreateUpdateOnCommit(pageProxy);
        }

        return Promise.resolve(false);
    });
}
