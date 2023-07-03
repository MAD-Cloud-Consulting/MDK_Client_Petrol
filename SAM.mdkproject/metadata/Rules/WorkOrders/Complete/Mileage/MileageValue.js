import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function MileageValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'mileage');
}
