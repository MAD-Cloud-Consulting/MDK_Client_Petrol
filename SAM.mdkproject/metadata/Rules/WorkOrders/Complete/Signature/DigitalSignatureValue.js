import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function DigitalSignatureValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'digit_signature');
}
