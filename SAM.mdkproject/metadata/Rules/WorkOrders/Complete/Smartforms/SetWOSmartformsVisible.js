import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOSmartformsVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'smartforms') && 
        WorkOrderCompletionLibrary.isStepMandatory(context, 'smartforms');
}
