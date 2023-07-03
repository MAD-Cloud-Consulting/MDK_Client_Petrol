import { WorkOrderEventLibrary as libWoEvent } from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateValidation(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libWoEvent.createUpdateValidationRule(context);
}
