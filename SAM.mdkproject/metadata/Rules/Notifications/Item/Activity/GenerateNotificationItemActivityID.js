import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function GenerateNotificationItemActivityID(context) {
    if (context.binding && context.binding.ActivitySequenceNumber) {
        return context.binding.ActivitySequenceNumber;
    }
    return GenerateLocalID(context, context.binding['@odata.readLink'] + '/ItemActivities', 'ActivitySequenceNumber', '0000', '', '');
}
