import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOMandatorySignatureVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'signature') && 
        WorkOrderCompletionLibrary.isStepMandatory(context, 'signature');
}

