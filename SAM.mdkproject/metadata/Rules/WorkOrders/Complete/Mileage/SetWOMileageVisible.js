import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOMileageVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'mileage');
}
