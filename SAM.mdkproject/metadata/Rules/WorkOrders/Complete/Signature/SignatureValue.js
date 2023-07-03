import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SignatureValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'signature');
}
