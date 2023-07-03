import FailureMessage from './FailureMessage';

export default function UpdateFailed(context) {
    return FailureMessage(context, 'update_failed', 'update_failed_due_to_autosync');
}
