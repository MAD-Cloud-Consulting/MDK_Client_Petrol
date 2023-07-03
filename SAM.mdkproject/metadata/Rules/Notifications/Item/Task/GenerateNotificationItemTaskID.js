import GenerateLocalID from '../../../Common/GenerateLocalID';
import libCom from '../../../Common/Library/CommonLibrary';

export default function GenerateNotificationItemTaskID(context) {
    if (context.binding && context.binding.TaskSequenceNumber) {
        return context.binding.TaskSequenceNumber;
    }
    return GenerateLocalID(context, context.binding['@odata.readLink'] + '/ItemTasks', 'TaskSequenceNumber', '0000', '', '').then(function(result) {
        libCom.setStateVariable(context, 'Task', result);
        libCom.setStateVariable(context, 'Item', context.binding.ItemNumber);
        libCom.setStateVariable(context, 'Notification', context.binding.NotificationNumber);
        return result;
    });
}
