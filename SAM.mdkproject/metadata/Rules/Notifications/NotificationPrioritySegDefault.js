import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';

export default function NotificationPrioritySegDefault(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding.Priority))	{
        binding.Priority = libCommon.getAppParam(context, 'NOTIFICATION', 'Priority');
    }
    return binding.Priority;
}
