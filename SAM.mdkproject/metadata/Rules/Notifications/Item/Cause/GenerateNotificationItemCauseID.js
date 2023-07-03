import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function GenerateNotificationItemCauseID(context) {
    if (context.binding && context.binding.CauseSequenceNumber) {
        return context.binding.CauseSequenceNumber;
    }
    return GenerateLocalID(context, context.binding['@odata.readLink'] + '/ItemCauses', 'CauseSequenceNumber', '0000', '', '');
}
