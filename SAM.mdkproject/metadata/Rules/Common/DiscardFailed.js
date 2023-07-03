import FailureMessage from './FailureMessage';

export default function DiscardFailed(context) {
    return FailureMessage(context, 'discard_failed', 'discard_failed_due_to_autosync');
}
