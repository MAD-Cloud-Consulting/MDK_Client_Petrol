import GenerateLocalID from '../../Common/GenerateLocalID';

export default function GenerateNotificationActivityID(context) {
    if (context.binding && context.binding.ActivitySequenceNumber) {
        return context.binding.ActivitySequenceNumber;
    }

    return GenerateLocalID(context, context.binding['@odata.readLink'] + '/Activities', 'ActivitySequenceNumber', '0000', '', '');
}
