import { SubOperationEventLibrary as libSubOpEvent } from '../SubOperationLibrary';

export default function WorkOrderOperationCreateUpdateValidation(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return libSubOpEvent.createUpdateValidationRule(context);
}
