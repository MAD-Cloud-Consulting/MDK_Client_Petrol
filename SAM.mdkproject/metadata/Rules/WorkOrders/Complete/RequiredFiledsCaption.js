import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function RequiredFiledsCaption(context) {
    let caption = context.localizeText('required_fields');
    let steps = WorkOrderCompletionLibrary.getSteps(context);

    let hasMandatoryField = Object.keys(steps).some(key => {
        return steps[key].isMandatory && steps[key].visible;
    });

    return hasMandatoryField ? caption : '';
}
