import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWODigitalSignatureVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'digit_signature') && 
        !WorkOrderCompletionLibrary.isStepMandatory(context, 'digit_signature');
}
