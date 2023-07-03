import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOLAMVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'lam') && 
        WorkOrderCompletionLibrary.getStep(context, 'time').lam;
}
