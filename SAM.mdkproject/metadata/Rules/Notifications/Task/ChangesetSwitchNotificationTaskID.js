import GenerateLocalID from '../../Common/GenerateLocalID';
import libCom from '../../Common/Library/CommonLibrary';

export default function ChangesetSwitchNotificationTaskID(context) {
    
    if (context.binding && context.binding.TaskSequenceNumber) {
        return context.binding.TaskSequenceNumber;
    }

    return GenerateLocalID(context, context.binding['@odata.readLink'] + '/Tasks', 'TaskSequenceNumber', '0000', '', '').then(notificationTaskSequenceNumber => {
        libCom.setStateVariable(context, 'NotificationTaskSequenceNumber', notificationTaskSequenceNumber);
        libCom.setStateVariable(context, 'NotificationNumber', context.binding.NotificationNumber);
        return notificationTaskSequenceNumber;
    });
}
