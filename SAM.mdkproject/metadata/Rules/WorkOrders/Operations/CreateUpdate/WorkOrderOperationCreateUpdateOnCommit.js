import {OperationEventLibrary as libOperationEvent} from '../WorkOrderOperationLibrary';
import {OperationControlLibrary as controls} from '../WorkOrderOperationLibrary';
import assignmentType from '../../../Common/Library/AssignmentType';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function WorkOrderOperationCreateUpdateOnCommit(pageProxy) {
    if (libVal.evalIsEmpty(pageProxy.getPageProxy().binding)) {
        pageProxy.getPageProxy()._context.binding = pageProxy.getPageProxy().getControls()[0].binding;
    }
    return libOperationEvent.createUpdateValidationRule(pageProxy).then((result) => {
        if (result) {
            assignmentType.setWorkOrderFieldDefault('WorkCenterPlant', controls.getWorkCenterPlant(pageProxy));
            assignmentType.setWorkOrderFieldDefault('MainWorkCenter', controls.getMainWorkCenter(pageProxy));
            return libOperationEvent.createUpdateOnCommit(pageProxy);
        }

        return Promise.resolve(false);
    });
}
